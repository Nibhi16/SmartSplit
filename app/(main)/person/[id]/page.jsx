"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import {
  ArrowLeft,
  ArrowLeftRight,
  PlusCircle,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { BarLoader } from "react-spinners";
import ExpenseList from "@/components/expense-list";
import SettlementsList from "@/components/settlements-list";
import { motion } from "framer-motion";

const PersonPage = () => {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expenses");

  const { data, isLoading } = useConvexQuery(
    api.expenses.getExpensesBetweenUsers,
    { userId: params.id }
  );

  if (isLoading) {
    return (
      <div className="fixed top-[64px] left-0 w-full flex justify-center z-50">
        <BarLoader width={"100%"} color="#0a2d63" />
        <p className="text-muted-foreground mt-4 animate-pulse">
          Loading your data...
        </p>
      </div>
    );
  }

  const otherUser = data?.otherUser;
  const expenses = data?.expenses || [];
  const settlements = data?.settlements || [];
  const balance = data?.balance || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 pt-24 max-w-5xl"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 bg-gradient-to-r from-primary/90 to-purple-600/90 rounded-2xl p-6 shadow-2xl text-primary-foreground"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              className="text-blue-900 bg-white/90 hover:bg-white"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Avatar className="h-16 w-16 ring-4 ring-white/40">
              <AvatarImage src={otherUser?.imageUrl} />
              <AvatarFallback>
                {otherUser?.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-3xl font-bold">
                {otherUser?.name}
              </h1>
              <p className="text-blue-100 text-sm">
                {otherUser?.email}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Link href={`/settlements/user/${params.id}`}>
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Settle Up
              </Link>
            </Button>

            <Button asChild className="bg-white text-blue-700 hover:bg-blue-100">
              <Link href={`/expenses/new`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
      <Card className="mb-8 border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-2 flex items-center gap-2">
          <Wallet className="text-blue-700" />
          <CardTitle className="text-xl font-semibold text-blue-900">
            Balance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              {balance === 0 ? (
                <p className="text-gray-600">You are all settled up 🎉</p>
              ) : balance > 0 ? (
                <p className="text-green-700">
                  <span className="font-medium">{otherUser?.name}</span> owes you
                </p>
              ) : (
                <p className="text-rose-600">
                  You owe <span className="font-medium">{otherUser?.name}</span>
                </p>
              )}
            </div>
            <div
              className={`text-3xl font-bold ${
                balance > 0
                  ? "text-green-700"
                  : balance < 0
                  ? "text-rose-600"
                  : "text-gray-600"
              }`}
            >
              ₹{Math.abs(balance).toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
      <Tabs
        defaultValue="expenses"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-muted/80 dark:bg-muted/60 backdrop-blur-sm border border-border/60 dark:border-border/40 rounded-xl shadow-sm">
          <TabsTrigger
            value="expenses"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
          >
            Expenses ({expenses.length})
          </TabsTrigger>
          <TabsTrigger
            value="settlements"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
          >
            Settlements ({settlements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <ExpenseList
            expenses={expenses}
            showOtherPerson={false}
            otherPersonId={params.id}
            userLookupMap={{ [otherUser.id]: otherUser }}
          />
        </TabsContent>

        <TabsContent value="settlements" className="space-y-4">
          <SettlementsList
            settlements={settlements}
            userLookupMap={{ [otherUser.id]: otherUser }}
          />
        </TabsContent>
      </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default PersonPage;
