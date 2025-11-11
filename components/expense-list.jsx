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
      {expenses.map((expense) => {
        const payer = getUserDetails(expense.paidByUserId);
        const isCurrentUserPayer = expense.paidByUserId === currentUser?._id;
        const category = getCategoryById(expense.category);
        const CategoryIcon = getCategoryIcon(category.id);
        const showDeleteOption = canDeleteExpense(expense);

        return (
          <Card
            key={expense._id}
            className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-blue-100/60 rounded-xl"
          >
            <CardContent className="py-5">
              <div className="flex items-center justify-between">
                {/* LEFT SIDE: Icon + Details */}
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-tr from-blue-500/20 to-purple-500/20 p-3 rounded-full">
                    <CategoryIcon className="h-5 w-5 text-blue-700" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {expense.description}
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 gap-2">
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
                    <div className="font-bold text-blue-900 text-lg">
                      ${expense.amount.toFixed(2)}
                    </div>

                    {isGroupExpense ? (
                      <Badge variant="outline" className="mt-1 text-blue-600 border-blue-300">
                        Group expense
                      </Badge>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {isCurrentUserPayer ? (
                          <span className="text-green-700">You paid</span>
                        ) : (
                          <span className="text-rose-500">{payer.name} paid</span>
                        )}
                      </div>
                    )}
                  </div>

                  {showDeleteOption && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-rose-500 hover:text-rose-700 hover:bg-rose-100 transition"
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
                  {expense.splits.map((split, idx) => {
                    const splitUser = getUserDetails(split.userId, expense);
                    const isCurrentUser = split.userId === currentUser?._id;

                    return (
                      <Badge
                        key={idx}
                        variant={split.paid ? "outline" : "secondary"}
                        className={`flex items-center gap-2 ${
                          split.paid
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
                          {isCurrentUser ? "You" : splitUser.name}: $
                          {Number(split.amount).toFixed(2)}
                        </span>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ExpenseList;
