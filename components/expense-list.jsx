"use client";

import React from "react";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Card, CardContent } from "./ui/card";
import { getCategoryById, getCategoryIcon } from "@/lib/expense-categories";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { motion } from "framer-motion";

const ExpenseList = ({
  expenses,
  showOtherPerson = true,
  isGroupExpense = false,
  otherPersonId = null,
  userLookupMap = {},
}) => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const deleteExpense = useConvexMutation(api.expenses.deleteExpense);

  // Handle empty state
  if (!expenses || !expenses.length) {
    return (
      <Card className="border-dashed border-2 border-gray-300 shadow-sm">
        <CardContent className="py-10 text-center text-muted-foreground">
          <p className="text-lg font-medium">No expenses found 😔</p>
          <p className="text-sm text-gray-400 mt-2">
            Add a new expense to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Helper: get user info
  const getUserDetails = (userId) => ({
    name:
      userId === currentUser?._id
        ? "You"
        : userLookupMap[userId]?.name || "Other User",
    id: userId,
  });

  // Helper: permission to delete
  const canDeleteExpense = (expense) => {
    if (!currentUser) return false;
    return (
      expense.createdBy === currentUser._id ||
      expense.paidByUserId === currentUser._id
    );
  };

  // Handle delete with confirmation
  const handleDeleteExpense = async (expense) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteExpense.mutate({ expenseId: expense._id });
      toast.success("Expense deleted successfully 🎉");
    } catch (error) {
      toast.error("Failed to delete expense: " + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {expenses.map((expense, index) => {
        const payer = getUserDetails(expense.paidByUserId);
        const isCurrentUserPayer = expense.paidByUserId === currentUser?._id;
        const category = getCategoryById(expense.category);
        const CategoryIcon = getCategoryIcon(category.id);
        const showDeleteOption = canDeleteExpense(expense);

        return (
          <motion.div
            key={expense._id || expense.id || Math.random()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardContent className="py-5">
              <div className="flex items-center justify-between">
                {/* LEFT SIDE: Icon + Details */}
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-tr from-primary/20 to-purple-500/20 p-3 rounded-full shadow-sm">
                    <CategoryIcon className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {expense.description}
                    </h3>

                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <span>{format(new Date(expense.date), "MMM d, yyyy")}</span>
                      {showOtherPerson && (
                        <>
                          <span>•</span>
                          <span>
                            {isCurrentUserPayer ? "You" : payer.name} paid
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: Amount + Delete */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-primary text-lg">
                      ₹{expense.amount.toFixed(2)}
                    </div>

                    {isGroupExpense ? (
                      <Badge variant="outline" className="mt-1 text-primary border-primary/30">
                        Group expense
                      </Badge>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {isCurrentUserPayer ? (
                          <span className="text-green-500">You paid</span>
                        ) : (
                          <span className="text-destructive">{payer.name} paid</span>
                        )}
                      </div>
                    )}
                  </div>

                  {showDeleteOption && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                      onClick={() => handleDeleteExpense(expense)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete expense</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* SPLITS SECTION */}
              {expense.splits && expense.splits.length > 0 && (
                <div className="mt-4 text-sm flex gap-2 flex-wrap">
                  {expense.splits.map((split) => {
                    const splitUser = getUserDetails(split.userId, expense);
                    const isCurrentUser = split.userId === currentUser?._id;

                    return (
                      <Badge
                        key={`${expense._id}-${split.userId}`}   // ← FIXED KEY
                        variant={split.paid ? "outline" : "secondary"}
                        className={`flex items-center gap-2 ${split.paid
                            ? "border-green-300 text-green-700 bg-green-50"
                            : "border-gray-300 text-gray-700 bg-gray-50"
                          }`}
                      >
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-xs">
                            {splitUser.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>

                        <span>
                          {isCurrentUser ? "You" : splitUser.name}: ₹
                          {Number(split.amount).toFixed(2)}
                        </span>
                      </Badge>
                    );
                  })}

                </div>
              )}
            </CardContent>
          </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
