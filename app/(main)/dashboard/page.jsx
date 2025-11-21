"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import Link from "next/link";
import { ChevronRight, PlusCircle, Users } from "lucide-react";
import React from "react";
import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ExpenseSummary from "./components/expense-summary";
import BalanceSummary from "./components/balance-summary";
import GroupList from "./components/group-list";

const DashboardPage = () => {
  const { data: balances, isLoading: balancesLoading } = useConvexQuery(
    api.dashboard.getUserBalances
  );
  const { data: groups, isLoading: groupsLoading } = useConvexQuery(
    api.dashboard.getUserGroups
  );
  const { data: totalSpent, isLoading: totalSpentLoading } = useConvexQuery(
    api.dashboard.getTotalSpent
  );
  const { data: monthlySpending, isLoading: monthlySpendingLoading } =
    useConvexQuery(api.dashboard.getMonthlySpending);

  const isLoading =
    balancesLoading ||
    groupsLoading ||
    totalSpentLoading ||
    monthlySpendingLoading;

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fadeIn">
      {isLoading ? (
        <div className="fixed top-[64px] left-0 right-0 z-50">
          <BarLoader width={"100%"} color="#0a2d63" />
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Track your balances, groups, and expenses all in one place 💡
              </p>
            </div>

            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all shadow-md">
              <Link href="/expenses/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Link>
            </Button>
          </div>

          {/* BALANCE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Balance */}
            <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/30 backdrop-blur-sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold">
                  {balances?.totalBalance > 0 ? (
                    <span className="text-blue-700">
                      +${balances.totalBalance.toFixed(2)}
                    </span>
                  ) : balances?.totalBalance < 0 ? (
                    <span className="text-rose-500">
                      -${Math.abs(balances.totalBalance).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-gray-400">₹0.00</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {balances?.totalBalance > 0
                    ? "You are owed money"
                    : balances?.totalBalance < 0
                      ? "You owe money"
                      : "All settled up!"}
                </p>
              </CardContent>
            </Card>

            {/* You are owed */}
            <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl border border-green-100 bg-gradient-to-b from-white to-green-50/30">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  You are owed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-green-700">
                  ${balances?.youAreOwed.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  From {balances?.oweDetails?.youAreOwedBy?.length || 0} people
                </p>
              </CardContent>
            </Card>

            {/* You owe */}
            <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl border border-rose-100 bg-gradient-to-b from-white to-rose-50/30">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  You owe
                </CardTitle>
              </CardHeader>
              <CardContent>
                {balances?.oweDetails?.youOwe?.length > 0 ? (
                  <>
                    <div className="text-3xl font-extrabold text-rose-500">
                      ${balances?.youOwe.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      To {balances?.oweDetails?.youOwe?.length || 0} people
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-extrabold text-gray-400">
                      ₹0.00
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      You don’t owe anyone
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              <ExpenseSummary
                monthlySpending={monthlySpending}
                totalSpent={totalSpent}
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Balance Details */}
              <Card className="rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3 flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Balance Details
                  </CardTitle>
                  <Button variant="link" asChild className="text-blue-700 p-0">
                    <Link href="/contacts" className="flex items-center">
                      View all
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <BalanceSummary balances={balances} />
                </CardContent>
              </Card>

              {/* Groups Section */}
              <Card className="rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3 flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Your Groups
                  </CardTitle>
                  <Button variant="link" asChild className="text-blue-700 p-0">
                    <Link href="/contacts" className="flex items-center">
                      View all
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <GroupList groups={groups} />
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Link href="/contacts?createGroup=true">
                      <Users className="mr-2 h-4 w-4" />
                      Create new group
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
