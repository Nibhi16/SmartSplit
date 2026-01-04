import { internal } from "./_generated/api";
import { query } from "./_generated/server";

export const getInsightsData = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    // Get all expenses for the user (non-group and group expenses)
    const allExpenses = await ctx.db.query("expenses").collect();
    const userExpenses = allExpenses.filter(
      (expense) =>
        expense.paidByUserId === user._id ||
        expense.splits?.some((split) => split.userId === user._id)
    );

    // Get all users for lookup
    const allUsers = await ctx.db.query("users").collect();
    const userMap = new Map(allUsers.map((u) => [u._id, u]));

    // Get settlements
    const allSettlements = await ctx.db.query("settlements").collect();
    const userSettlements = allSettlements.filter(
      (s) =>
        s.paidByUserId === user._id || s.receivedByUserId === user._id
    );

    // Calculate time ranges
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime();

    // Filter expenses by time period
    const currentMonthExpenses = userExpenses.filter(
      (e) => e.date >= currentMonthStart
    );
    const lastMonthExpenses = userExpenses.filter(
      (e) => e.date >= lastMonthStart && e.date < currentMonthStart
    );

    // Calculate category spending
    const categorySpending = { current: {}, last: {} };
    const userPaidBy = { current: {}, last: {} };
    const userOwedTo = { current: {}, last: {} };

    const processExpenses = (expenses, period) => {
      expenses.forEach((expense) => {
        const userSplit = expense.splits.find((s) => s.userId === user._id);
        if (!userSplit) return;

        // Category spending
        const category = expense.category || "other";
        categorySpending[period][category] =
          (categorySpending[period][category] || 0) + userSplit.amount;

        // Track who paid
        const payer = userMap.get(expense.paidByUserId);
        if (payer && expense.paidByUserId !== user._id) {
          userPaidBy[period][expense.paidByUserId] =
            (userPaidBy[period][expense.paidByUserId] || 0) +
            userSplit.amount;
        }

        // Track who owes (if user paid)
        if (expense.paidByUserId === user._id) {
          expense.splits.forEach((split) => {
            if (split.userId !== user._id && !split.paid) {
              userOwedTo[period][split.userId] =
                (userOwedTo[period][split.userId] || 0) + split.amount;
            }
          });
        }
      });
    };

    processExpenses(currentMonthExpenses, "current");
    processExpenses(lastMonthExpenses, "last");

    // Calculate totals
    const currentMonthTotal = currentMonthExpenses.reduce(
      (sum, e) => sum + (e.splits.find((s) => s.userId === user._id)?.amount || 0),
      0
    );
    const lastMonthTotal = lastMonthExpenses.reduce(
      (sum, e) => sum + (e.splits.find((s) => s.userId === user._id)?.amount || 0),
      0
    );

    // Calculate balances (similar to dashboard logic)
    const balanceByUser = {};
    userExpenses.forEach((e) => {
      const isPayer = e.paidByUserId === user._id;
      const mySplit = e.splits.find((s) => s.userId === user._id);

      if (isPayer) {
        e.splits.forEach((s) => {
          if (s.userId === user._id || s.paid) return;
          (balanceByUser[s.userId] ??= { owed: 0, owing: 0 }).owed += s.amount;
        });
      } else if (mySplit && !mySplit.paid) {
        (balanceByUser[e.paidByUserId] ??= { owed: 0, owing: 0 }).owing +=
          mySplit.amount;
      }
    });

    userSettlements.forEach((s) => {
      if (s.paidByUserId === user._id) {
        (balanceByUser[s.receivedByUserId] ??= { owed: 0, owing: 0 }).owing -=
          s.amount;
      } else {
        (balanceByUser[s.paidByUserId] ??= { owed: 0, owing: 0 }).owed -=
          s.amount;
      }
    });

    const balances = [];
    for (const [uid, { owed, owing }] of Object.entries(balanceByUser)) {
      const net = owed - owing;
      if (net === 0) continue;
      const counterpart = userMap.get(uid);
      if (counterpart) {
        balances.push({
          userId: uid,
          name: counterpart.name,
          imageUrl: counterpart.imageUrl,
          amount: Math.abs(net),
          isOwed: net > 0,
        });
      }
    }

    return {
      currentMonthTotal,
      lastMonthTotal,
      categorySpending,
      userPaidBy,
      userOwedTo,
      balances,
      userMap: Object.fromEntries(userMap),
    };
  },
});

