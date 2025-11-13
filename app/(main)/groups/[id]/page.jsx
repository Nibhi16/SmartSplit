"use client";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { BarLoader } from "react-spinners";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowLeftRight,
    PlusCircle,
    Users,
} from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseList from "@/components/expense-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettlementsList from "@/components/settlements-list";

const GroupPage = () => {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("expenses");

    const { data, isLoading } = useConvexQuery(api.groups.getGroupExpenses, {
        groupId: params.id,
    });

    if (isLoading) {
        return (
            <div className="fixed top-[64px] left-0 right-0 w-full z-50">
                <div className="w-full">
                    <BarLoader width={"100vw"} color="#2563eb" />
                </div>
            </div>
        );
    }

    const group = data?.group;
    const members = data?.members || [];
    const expenses = data?.expenses || [];
    const settlements = data?.settlements || [];
    const balances = data?.balances || [];
    const userLookupMap = data?.userLookupMap || {};

    return (
        <div className="container mx-auto py-8 max-w-5xl">
            {/* Header Section */}
            <div className="mb-8 bg-gradient-to-r from-blue-600/90 to-purple-700/90 rounded-2xl p-6 shadow-lg text-white transition-all hover:shadow-xl hover:from-blue-700 hover:to-purple-800">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    {/* Left Section */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="text-blue-900 bg-white/90 hover:bg-white"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>


                        {/* Stylized Group Logo */}
                        <div className="relative">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-white/80 to-blue-100 flex items-center justify-center shadow-lg ring-4 ring-white/30">
                                <Users className="h-10 w-10 text-blue-700" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse" />
                        </div>

                        {/* Group Info */}
                        <div>
                            {/* Member Avatars Row */}
                            <div className="flex -space-x-3 mb-2">
                                {members.slice(0, 5).map((member) => (
                                    <Avatar
                                        key={member._id}
                                        className="h-8 w-8 border-2 border-white hover:scale-105 transition-transform"
                                        title={member.name}
                                    >
                                        <AvatarImage src={member.imageUrl || ""} />
                                        <AvatarFallback>
                                            {member.name?.charAt(0).toUpperCase() || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}


                                {/* Extra member counter */}
                                {members.length > 5 && (
                                    <div className="h-8 w-8 flex items-center justify-center bg-white/30 rounded-full text-sm font-medium border-2 border-white">
                                        +{members.length - 5}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight">{group?.name}</h1>
                            <p className="text-white/80 text-sm italic">
                                {group?.description || "No description available"}
                            </p>
                            <p className="text-sm text-white/70 mt-1">
                                👥 {members.length} members
                            </p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex gap-3">
                        <Button
                            asChild
                            variant="secondary"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                            <Link href={`/settlements/user/${params.id}`}>
                                <ArrowLeftRight className="mr-2 h-4 w-4" />
                                Settle Up
                            </Link>
                        </Button>

                        <Button
                            asChild
                            className="bg-white text-blue-700 hover:bg-blue-100 shadow-sm"
                        >
                            <Link href={`/expenses/new`}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Expense
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Group Balances</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Group Balances</p>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Mmebers</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
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
                        showOtherPerson={true}
                        isGroupExpense={true}
                        userLookupMap={userLookupMap}
                    />
                </TabsContent>

                <TabsContent value="settlements" className="space-y-4">
                    <SettlementsList
                        settlements={settlements}
                        isGroupSettlement={true}
                        userLookupMap={userLookupMap}
                    />
                </TabsContent>
            </Tabs>

        </div>
    );
};

export default GroupPage;
