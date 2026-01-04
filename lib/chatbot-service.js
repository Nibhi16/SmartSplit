// Intent-based routing for common chatbot queries
export const detectIntent = (message) => {
  const lowerMessage = message.toLowerCase().trim();

  // Check for acknowledgements/closing messages first
  const acknowledgementPatterns = [
    /^(thanks|thank you|ty|thx|appreciate it)$/i,
    /^(ok|okay|sure|alright|got it|understood)$/i,
    /^(no need|don't need|that's all|all set|that's it)$/i,
    /^(cool|nice|great|awesome|perfect)$/i,
    /^(bye|goodbye|see you|later|cya)$/i,
    /^(thanks|thank you).*$/i, // "thanks!" or "thank you so much"
  ];

  for (const pattern of acknowledgementPatterns) {
    if (pattern.test(lowerMessage)) {
      return "acknowledgement";
    }
  }

  if (lowerMessage.includes("who owes") || lowerMessage.includes("owed to me")) {
    return "who_owes";
  }

  if (
    lowerMessage.includes("spend") &&
    (lowerMessage.includes("last month") ||
      lowerMessage.includes("previous month") ||
      lowerMessage.includes("past month"))
  ) {
    return "last_month_spending";
  }

  if (lowerMessage.includes("balance with") || lowerMessage.match(/balance.*?(\w+)/i)) {
    return "balance_with";
  }

  return null;
};

// Handle known intents with real data
export const handleKnownIntent = (intent, message, context) => {
  const lowerMessage = message.toLowerCase().trim();

  if (intent === "acknowledgement") {
    // Brief, natural responses to closing messages
    const responses = [
      "You're welcome!",
      "Happy to help!",
      "Anytime!",
      "Glad I could help!",
      "Have a great day!",
    ];
    // Return a random brief response
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
    };
  }

  if (intent === "who_owes") {
    const balances = context?.balances;
    if (!balances || !balances.oweDetails) {
      return {
        response: "I couldn't find enough data to answer that yet. Try asking about balances or recent expenses.",
      };
    }

    const owedBy = balances.oweDetails.youAreOwedBy || [];
    if (owedBy.length === 0) {
      return {
        response: "No one owes you money right now. You're all settled up!",
      };
    }

    const totalOwed = balances.youAreOwed || 0;
    const peopleList = owedBy
      .slice(0, 5)
      .map((person) => `${person.name} (₹${person.amount.toFixed(2)})`)
      .join(", ");
    const moreCount = owedBy.length > 5 ? ` and ${owedBy.length - 5} more` : "";

    return {
      response: `You are owed ₹${totalOwed.toFixed(2)} total. ${peopleList}${moreCount} ${owedBy.length > 5 ? "owe you" : "owe you money"}.`,
    };
  }

  if (intent === "last_month_spending") {
    const monthlySpending = context?.monthlySpending;
    if (!monthlySpending || !Array.isArray(monthlySpending)) {
      return {
        response: "I couldn't find enough data to answer that yet. Try asking about balances or recent expenses.",
      };
    }

    // monthlySpending is an array of {month: timestamp, total: number}
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const lastMonthData = monthlySpending.find((item) => item.month === lastMonthStart);

    if (!lastMonthData || lastMonthData.total === 0) {
      return {
        response: "You didn't have any expenses last month.",
      };
    }

    return {
      response: `You spent ₹${lastMonthData.total.toFixed(2)} last month.`,
    };
  }

  if (intent === "balance_with") {
    const balances = context?.balances;
    if (!balances || !balances.oweDetails) {
      return {
        response: "I couldn't find enough data to answer that yet. Try asking about balances or recent expenses.",
      };
    }

    // Try to extract name from message
    const nameParts = lowerMessage.split(/\s+/);
    const nameIndex = nameParts.findIndex((word) =>
      ["with", "and"].includes(word.toLowerCase())
    );
    const balanceWithMatch = lowerMessage.match(/balance with (\w+)/i) ||
      lowerMessage.match(/balance.*?(\w+)/i);
    const name = nameIndex >= 0 && nameIndex < nameParts.length - 1
      ? nameParts[nameIndex + 1]
      : balanceWithMatch?.[1];

    if (name) {
      const allBalances = [
        ...(balances.oweDetails.youOwe || []),
        ...(balances.oweDetails.youAreOwedBy || []),
      ];
      const personBalance = allBalances.find(
        (p) => p.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(p.name.toLowerCase())
      );

      if (personBalance) {
        const youOwe = balances.oweDetails.youOwe?.some(
          (p) => p.userId === personBalance.userId
        );
        if (youOwe) {
          return {
            response: `You owe ${personBalance.name} ₹${personBalance.amount.toFixed(2)}.`,
          };
        } else {
          return {
            response: `${personBalance.name} owes you ₹${personBalance.amount.toFixed(2)}.`,
          };
        }
      }
    }

    // If name not found, show summary
    const totalOwed = balances.youAreOwed || 0;
    const totalOwing = balances.youOwe || 0;
    if (totalOwed === 0 && totalOwing === 0) {
      return {
        response: "You're all settled up with everyone!",
      };
    }
    return {
      response: `Your total balance: You are owed ₹${totalOwed.toFixed(2)} and you owe ₹${totalOwing.toFixed(2)}.`,
    };
  }

  return null;
};

// Main handler that routes to intent or AI
export const handleChatMessage = async (message, context, aiService) => {
  // Step 1: Detect intent
  const intent = detectIntent(message);

  // Step 2: Handle known intent with real data
  if (intent) {
    const result = handleKnownIntent(intent, message, context);
    if (result) {
      return result.response;
    }
  }

  // Step 3: Forward to AI for unknown queries
  if (aiService) {
    try {
      return await aiService(message, context);
    } catch (error) {
      console.error("AI service error:", error);
      return "I can help with expenses, balances, or general questions. What would you like to know?";
    }
  }

  // Fallback if no AI service available
  return "I can help with expenses, balances, or general questions. What would you like to know?";
};
