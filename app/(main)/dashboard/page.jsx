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
import InsightsSection from "./components/insights-section";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 pt-24 space-y-8 max-w-7xl"
    >
      {isLoading ? (
        <div className="fixed top-[64px] left-0 right-0 z-50">
          <BarLoader width={"100%"} color="hsl(var(--primary))" />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* HEADER */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Track your balances, groups, and expenses all in one place 💡
              </p>
            </div>

            <Button
              asChild
              className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:shadow-xl transition-all duration-200 shadow-lg"
            >
              <Link href="/expenses/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Link>
            </Button>
          </motion.div>

          {/* BALANCE CARDS */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Total Balance */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold">
                    {balances?.totalBalance > 0 ? (
                      <span className="text-primary">
                        +₹{balances.totalBalance.toFixed(2)}
                      </span>
                    ) : balances?.totalBalance < 0 ? (
                      <span className="text-destructive">
                        -₹{Math.abs(balances.totalBalance).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">₹0.00</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {balances?.totalBalance > 0
                      ? "You are owed money"
                      : balances?.totalBalance < 0
                        ? "You owe money"
                        : "All settled up!"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* You are owed */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-green-500/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    You are owed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-green-500">
                    ₹{balances?.youAreOwed.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {balances?.oweDetails?.youAreOwedBy?.length || 0} people
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* You owe */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-destructive/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    You owe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {balances?.oweDetails?.youOwe?.length > 0 ? (
                    <>
                      <div className="text-3xl font-extrabold text-destructive">
                        ₹{balances?.youOwe.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        To {balances?.oweDetails?.youOwe?.length || 0} people
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-extrabold text-muted-foreground">
                        ₹0.00
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        You don't owe anyone
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* MAIN GRID */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              <ExpenseSummary
                monthlySpending={monthlySpending}
                totalSpent={totalSpent}
              />
              <InsightsSection />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Balance Details */}
              <Card className="border-border/50">
                <CardHeader className="pb-3 flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Balance Details
                  </CardTitle>
                  <Button variant="link" asChild className="text-primary p-0 hover:text-primary/80">
                    <Link href="/contacts" className="flex items-center group">
                      View all
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <BalanceSummary balances={balances} />
                </CardContent>
              </Card>

              {/* Groups Section */}
              <Card className="border-border/50">
                <CardHeader className="pb-3 flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Your Groups
                  </CardTitle>
                  <Button variant="link" asChild className="text-primary p-0 hover:text-primary/80">
                    <Link href="/contacts" className="flex items-center group">
                      View all
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                    className="w-full border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40"
                  >
                    <Link href="/contacts?createGroup=true">
                      <Users className="mr-2 h-4 w-4" />
                      Create new group
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardPage;
