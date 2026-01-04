export const calculateInsights = (insightsData) => {
  if (!insightsData) return [];

  const insights = [];
  const {
    currentMonthTotal,
    lastMonthTotal,
    categorySpending,
    userPaidBy,
    userOwedTo,
    balances,
    userMap,
  } = insightsData;

  // Calculate totals for balance insights
  const totalOwed = balances
    ? balances.filter((b) => b.isOwed).reduce((sum, b) => sum + b.amount, 0)
    : 0;
  const totalOwing = balances
    ? balances.filter((b) => !b.isOwed).reduce((sum, b) => sum + b.amount, 0)
    : 0;

  // Find largest balance (for primary alert)
  let largestBalance = null;
  if (balances && balances.length > 0) {
    largestBalance = balances.reduce(
      (max, b) => (b.amount > max.amount ? b : max),
      balances[0]
    );
  }

  // PRIORITY 1: Primary Alert - Largest Outstanding Balance (only one)
  if (largestBalance && largestBalance.amount > 500) {
    insights.push({
      id: "primary-balance-alert",
      type: largestBalance.isOwed ? "positive" : "warning",
      title: largestBalance.isOwed ? "Outstanding Balance" : "Outstanding Balance",
      message: largestBalance.isOwed
        ? `You are owed ₹${largestBalance.amount.toFixed(2)} by ${largestBalance.name}`
        : `You owe ${largestBalance.name} ₹${largestBalance.amount.toFixed(2)}`,
      value: `Consider settling this balance`,
      userId: largestBalance.userId,
      imageUrl: largestBalance.imageUrl,
      name: largestBalance.name,
      priority: 1, // Primary alert
    });
  }

  // PRIORITY 2: Spending Trend (neutral/positive)
  if (lastMonthTotal > 0) {
    const changePercent = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    const isIncrease = changePercent > 0;
    insights.push({
      id: "spending-trend",
      type: isIncrease ? "neutral" : "positive",
      title: "Spending Trend",
      message: isIncrease
        ? `Your spending increased by ${Math.abs(changePercent).toFixed(1)}% this month`
        : `Your spending decreased by ${Math.abs(changePercent).toFixed(1)}% this month`,
      value: `₹${currentMonthTotal.toFixed(2)} vs ₹${lastMonthTotal.toFixed(2)} this month`,
      priority: 2,
    });
  } else if (currentMonthTotal > 0) {
    insights.push({
      id: "spending-current",
      type: "neutral",
      title: "Spending This Month",
      message: "You've started tracking expenses",
      value: `₹${currentMonthTotal.toFixed(2)} so far`,
      priority: 2,
    });
  }

  // PRIORITY 3: Top Category (neutral/positive insight)
  const currentCategories = categorySpending?.current || {};
  const categoryEntries = Object.entries(currentCategories)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  if (categoryEntries.length > 0 && categoryEntries[0].amount > 0) {
    const topCategory = categoryEntries[0];
    insights.push({
      id: "top-category",
      type: "neutral",
      title: "Top Spending Category",
      message: `${topCategory.category} is your highest expense category this month`,
      value: `₹${topCategory.amount.toFixed(2)}`,
      priority: 3,
    });
  }

  // PRIORITY 4: Category Changes (only significant changes)
  const lastCategories = categorySpending?.last || {};
  categoryEntries.forEach(({ category, amount: current }) => {
    const last = lastCategories[category] || 0;
    if (last > 0 && current > 0) {
      const changePercent = ((current - last) / last) * 100;
      if (Math.abs(changePercent) > 25) {
        insights.push({
          id: `category-change-${category}`,
          type: changePercent > 0 ? "neutral" : "positive",
          title: "Category Change",
          message: `${category} spending ${changePercent > 0 ? "increased" : "decreased"} by ${Math.abs(changePercent).toFixed(0)}%`,
          value: `₹${current.toFixed(2)} vs ₹${last.toFixed(2)} last month`,
          priority: 4,
        });
      }
    }
  });

  // PRIORITY 5: Top Payer (positive insight)
  const currentPaidBy = userPaidBy?.current || {};
  const paidByEntries = Object.entries(currentPaidBy)
    .map(([userId, amount]) => ({
      userId,
      amount,
      name: userMap[userId]?.name || "Unknown",
      imageUrl: userMap[userId]?.imageUrl,
    }))
    .sort((a, b) => b.amount - a.amount);

  if (paidByEntries.length > 0 && paidByEntries[0].amount > 100) {
    insights.push({
      id: "top-payer",
      type: "positive",
      title: "Top Payer",
      message: `${paidByEntries[0].name} paid the most for you this month`,
      value: `₹${paidByEntries[0].amount.toFixed(2)}`,
      userId: paidByEntries[0].userId,
      imageUrl: paidByEntries[0].imageUrl,
      name: paidByEntries[0].name,
      priority: 5,
    });
  }

  // PRIORITY 6: Summary Balance (only if no primary alert and balances exist)
  if (!largestBalance && balances && balances.length > 0) {
    if (totalOwing > 0 || totalOwed > 0) {
      insights.push({
        id: "balance-summary",
        type: "neutral",
        title: "Balance Summary",
        message: totalOwing > totalOwed
          ? `You owe more than you're owed`
          : `You're owed more than you owe`,
        value: `₹${Math.abs(totalOwed - totalOwing).toFixed(2)} difference`,
        priority: 6,
      });
    }
  }

  // Sort by priority, then limit
  insights.sort((a, b) => (a.priority || 99) - (b.priority || 99));

  // Limit to 6 insights max
  return insights.slice(0, 6);
};
