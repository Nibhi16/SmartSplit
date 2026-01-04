"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChatContainer from "./chat-container";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

const QUICK_SUGGESTIONS = [
  "Who owes me money?",
  "Show my balance with",
  "How much did I spend last month?",
];

const ChatbotDialog = ({ open, onOpenChange }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get user data for context
  const { data: balances } = useConvexQuery(api.dashboard.getUserBalances);
  const { data: totalSpent } = useConvexQuery(api.dashboard.getTotalSpent);
  const { data: monthlySpending } = useConvexQuery(api.dashboard.getMonthlySpending);

  const buildContext = () => {
    const context = {};
    if (balances) {
      context.balances = {
        totalBalance: balances.totalBalance,
        youOwe: balances.youOwe,
        youAreOwed: balances.youAreOwed,
        oweDetails: balances.oweDetails,
      };
    }
    if (totalSpent !== undefined) {
      context.totalSpent = totalSpent;
    }
    if (monthlySpending) {
      context.monthlySpending = monthlySpending;
    }
    return context;
  };

  const handleSend = async (message) => {
    const userMessage = { text: message, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const context = buildContext();
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const assistantMessage = { text: data.response || "I couldn't find enough data to answer that yet. Try asking about balances or recent expenses.", isUser: false };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        text: "I couldn't find enough data to answer that yet. Try asking about balances or recent expenses.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && messages.length === 0) {
      // Optionally add a welcome message
      setMessages([
        {
          text: "Hi! I'm your SmartSplit assistant. I can help you understand your expenses, balances, and spending patterns. What would you like to know?",
          isUser: false,
        },
      ]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle>AI Assistant</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <ChatContainer
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
            suggestions={QUICK_SUGGESTIONS}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotDialog;

