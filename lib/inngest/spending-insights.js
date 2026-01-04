import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "./client";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

/* Gemini model - Use stable model name */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const spendingInsights = inngest.createFunction(
    { name: "Generate Spending Insights", id: "generate-spending-insights" },
    { cron: "0 8 1 * *" },
    async ({ step }) => {
        /* ─── 1. Pull users with expenses this month ────────────────────── */
        const users = await step.run("Fetch users with expenses", async () => {
            return await convex.query(api.inngest.getUsersWithExpenses);
        });

        /* ─── 2. Iterate users & send insight email ─────────────────────── */
        const results = [];

        for (const user of users) {
            /* a. Pull last-month expenses (skip if none) */
            const allExpenses = await step.run(`Expenses · ${user._id}`, () =>
                convex.query(api.inngest.getUserMonthlyExpenses, { userId: user._id })
            );

            // Limit to 5 expenses for testing
            const expenses = allExpenses.slice(0, 5);

            if (!expenses?.length) continue;

            /* b. Build JSON blob for the prompt */
            const expenseData = JSON.stringify({
                expenses,
                totalSpent: expenses.reduce((sum, e) => sum + e.amount, 0),
                categories: expenses.reduce((cats, e) => {
                    cats[e.category ?? "uncategorised"] =
                        (cats[e.category] ?? 0) + e.amount;
                    return cats;
                }, {}),
            });

            /* c. Prompt + AI call using step.ai.wrap */
            const prompt = `
Act as a professional financial analyst and generate a concise, polished monthly spending summary in clean HTML (no code blocks, no backticks). 
Keep the tone friendly, professional, and easy to read.

Your analysis should be brief but insightful and include:
1. A short Monthly Snapshot
2. Key Spending Categories (top 3–4 only)
3. Any notable patterns worth mentioning
4. 2–3 practical suggestions for next month

Make the HTML formatted like an email with headings, short paragraphs, and bullet points.

User spending data:
${expenseData}
`.trim();



            try {
                const aiResponse = await step.ai.wrap(
                    "gemini",
                    async (p) => model.generateContent(p),
                    prompt
                );

                const htmlBody =
                    aiResponse.response.candidates[0]?.content.parts[0]?.text ?? "";

                /* d. Send the email */
                await step.run(`Email · ${user._id}`, () =>
                    convex.action(api.email.sendEmail, {
                        to: user.email,
                        subject: "Your Monthly Spending Insights",
                        html: `
              <h1>Your Monthly Financial Insights</h1>
              <p>Hi ${user.name},</p>
              <p>Here's your personalized spending analysis for the past month:</p>
              ${htmlBody}
            `,
                        apiKey: process.env.RESEND_API_KEY,
                    })
                );

                results.push({ userId: user._id, success: true });
            } catch (err) {
                results.push({
                    userId: user._id,
                    success: false,
                    error: err.message,
                });
            }
        }
        return {
            processed: results.length,
            success: results.filter((r) => r.success).length,
            failed: results.filter((r) => !r.success).length,
        };
    }
);