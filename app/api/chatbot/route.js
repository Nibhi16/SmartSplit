import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { handleChatMessage } from "@/lib/chatbot-service";

// AI service wrapper with safe prompting
const createAIService = (apiKey) => {
  if (!apiKey) return null;

  return async (message, context) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build safe context (no sensitive financial data unless user explicitly asks)
    const safeContext = {
      appPurpose: "SmartSplit is an expense splitting application where users can track shared expenses and balances with friends and groups.",
      userRole: "The user is asking about their expenses and balances.",
    };

    // Only include financial summary if user asks about specific numbers
    const asksForNumbers = /how much|amount|balance|spent|owed|owe/i.test(message);
    if (asksForNumbers && context?.balances) {
      safeContext.balanceSummary = {
        hasBalances: (context.balances.youOwe > 0 || context.balances.youAreOwed > 0),
        totalOwed: context.balances.youAreOwed || 0,
        totalOwing: context.balances.youOwe || 0,
      };
    }

    const contextPrompt = `You are a helpful assistant for SmartSplit, an expense splitting application.

${JSON.stringify(safeContext, null, 2)}

IMPORTANT RULES:
- Be conversational and helpful
- Only mention specific financial amounts if they are provided in the context
- Never make up or guess balances, amounts, or financial numbers
- If asked about financial data that isn't available, say "I don't have that information available. Try asking 'Who owes me money?' or 'How much did I spend last month?' for specific data."
- Stay focused on expense management topics
- Be friendly and concise

User question: ${message}

Provide a helpful, conversational response:`;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    return response.text();
  };
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, context } = body || {};

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Create AI service if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    const aiService = createAIService(apiKey);

    // Handle message (intent-based or AI)
    const response = await handleChatMessage(message, context, aiService);

    return NextResponse.json({ response });

  } catch (error) {
    console.error("Chatbot API error:", error);
    // Never return 500 - always return 200 with fallback message
    return NextResponse.json(
      {
        response: "I can help with expenses, balances, or general questions. What would you like to know?",
      },
      { status: 200 }
    );
  }
}
