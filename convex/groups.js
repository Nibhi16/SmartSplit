import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const getGroupExpenses = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, { groupId }) => {
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

        const group = await ctx.db.get(groupId);
        if (!group) throw new Error("Group not found");

        if (!group.members.some((m) => m.userId === currentUser._id))
            throw new Error("You are not a member of this group");

        const expenses = await ctx.db
            .query("expenses")
            .withIndex("by_group", (q) => q.eq("groupId", groupId))
            .collect();

        const settlements = await ctx.db
            .query("settlements")
            .filter((q) => q.eq(q.field("groupId"), groupId))
            .collect();

        const memberDetails = await Promise.all(
            group.members.map(async (m) => {
                const u = await ctx.db.get(m.userId);
                return {
                    id: u._id,
                    name: u.name,
                    imageUrl: u.imageUrl,
                    role: m.role,
                };
            })
        );

        const ids = memberDetails.map((m) => m.id);

        // Balance Calculation Setup

        // Initialize totals object to track overall balance for each user
        // Format: { userId1: balance1, userId2: balance2, ... }
        const totals = Object.fromEntries(ids.map((id) => [id, 0]));

        // Create a two-dimensional ledger to track who owes whom
        // ledger[A][B] = how much A owes B
        const ledger = {};

        ids.forEach((a) => {
            ledger[a] = {};
            ids.forEach((b) => {
                if (a != b) ledger[a][b] = 0;
            });
        });

        // Apply Expenses to Balances

        // Example:
        // - Expense 1: user1 paid $60, split equally among all 3 users ($20 each)
        // - After applying this expense:
        //totals = { "user1": +40, "user2": -20, "user3": -20 }
        //ledger = {
        //"user1": { "user2": 0, "user3": 0 },
        //"user2": { "user1": 20, "user3": 0 },
        //"user3": { "user1": 20, "user2": 0 }

        //This means user2 owes user1 $20, and user3 owes user1 $20
        for (const exp of expenses) {
            const payer = exp.paidByUserId;

            for (const split of exp.splits) {
                // Skip if this is the payer's own split or already paid
                if (split.userId === payer || split.paid) continue;

                const debtor = split.userId;
                const amt = split.amount;

                // Update totals: payer gains, debtor owes
                totals[payer] += amt;
                totals[debtor] -= amt;

                // Update ledger: debtor owes payer
                ledger[debtor][payer] += amt;
            }
        }
        // Apply Settlements to Balances

        // Example:
        // - Settlement: user2 paid[$10 to user1
        // - After applying this settlement:
        // - totals = { "user1": +30, "user2": -10, "user3": -20 }
        //- ledger = {
        //"user1": { "user2": 0, "user3": 0 },
        //"user2": { "user1": 10, "user3": 0 },
        //"user3": { "user1": 20, "user2": 0 }

        //- This means user2 now owes user1 only $10, and user3 still owes user1 $20
        for (const s of settlements) {
            totals[s.paidByUserId] += s.amount;
            totals[s.receivedByUserId] -= s.amount;

            // Update ledger: reduce what payer owes receiver
            ledger[s.paidByUserId][s.receivedByUserId] -= s.amount;
        }

        ids.forEach(a => {
            ids.forEach(b => {
                if (a >= b) return;

                const diff = ledger[a][b] - ledger[b][a];
                if (diff > 0) {
                    // User A owes User B (net)
                    ledger[a][b] = diff;
                    ledger[b][a] = 0;
                } else if (diff < 0) {
                    // User B owes User A (net)
                    ledger[b][a] = -diff;
                    ledger[a][b] = 0;
                } else {
                    // They're even
                    ledger[a][b] = 0;
                    ledger[b][a] = 0;
                }

            })
        })

        // Format Response Data

        // Create a comprehensive balance object for each member
        const balances = memberDetails.map((m) => ({
            ...m,
            totalBalance: totals[m.id],

            // Who this member owes money to
            owes: Object.entries(ledger[m.id])
                .filter(([, v]) => v > 0)
                .map(([to, amount]) => ({ to, amount })),

            // Who owes this member
            owedBy: ids
                .filter((other) => ledger[other][m.id] > 0)
                .map((other) => ({
                    from: other,
                    amount: ledger[other][m.id]
                })),
        }));
        const userLookupMap = {};
        memberDetails.forEach((member) => {
            userLookupMap[member.id] = member;
        });
        return {
            group: {
                id: group._id,
                name: group.name,
                description: group.description,
            },
            members: memberDetails,
            expenses,
            settlements,
            balances,
            userLookupMap,
        };

    },
});

export const deleteExpense = mutation({
    args: {
        expenseId: v.id("expenses"),
    },

    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);

        const expense = await ctx.db.get(args.expenseId);
        if (!expense) {
            throw new Error("Expense not found");
        }

        // Check if user is authorized to delete this expense
        // Only the creator of the expense or the payer can delete it
        if (expense.createdBy !== user._id && expense.paidByUserId !== user._id) {
            throw new Error("You don't have permission to delete this expense");
        }
        await ctx.db.delete(args.expenseId)

        return { success: true };
    },
});
