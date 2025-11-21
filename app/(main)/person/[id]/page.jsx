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
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600/90 to-purple-700/90 rounded-2xl p-6 shadow-lg text-white">
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
      </div>

      {/* Balance Card */}
      <Card className="mb-8 border-2 border-blue-100 shadow-md hover:shadow-lg transition-all duration-300">
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
              ${Math.abs(balance).toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs
        defaultValue="expenses"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-blue-50 border border-blue-200 rounded-lg">
          <TabsTrigger
            value="expenses"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition"
          >
            Expenses ({expenses.length})
          </TabsTrigger>
          <TabsTrigger
            value="settlements"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md transition"
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
    </div>
  );
};

export default PersonPage;
