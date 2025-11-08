"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import React from "react";
import { BarLoader } from "react-spinners";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const DashboardPage = () => {

    const { data: balances, isLoading: balancesLoading } = useConvexQuery
        (api.dashboard.getUserBalances);

    const { data: groups, isLoading: groupsLoading } = useConvexQuery
        (api.dashboard.getUserGroups);

    const { data: spendingStats, isLoading: spendingStatsLoading } = useConvexQuery(
        api.dashboard.getSpendingStats);

    const isLoading =
        balancesLoading ||
        groupsLoading ||
        spendingStatsLoading;

    return (
        <div>
            {isLoading ? (
                <div className="w-full py-12 flex justify-center">
                    <BarLoader width={"100%"} color="#0a2d63" />
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <h1 className="text-5xl gradient-title">Dashboard</h1>

                        <Button asChild>
                            <Link href="/expenses/new">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Expense
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Balance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {balances?.totalBalance > 0 ? (
                                        <span className="text-blue-300 font-medium">
                                            +${balances.totalBalance.toFixed(2)}
                                        </span>
                                    ) : balances?.totalBalance < 0 ? (
                                        <span className="text-rose-400 font-medium">
                                            -${Math.abs(balances.totalBalance).toFixed(2)}
                                        </span>
                                    ) : (
                                        <span className="text-gray-300 font-medium">$0.00</span>
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

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    You are owed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-800">
                                    ${balances?.youAreOwed.toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    From {balances?.oweDetails?.youAreOwedBy?.length || 0} people
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    You owe
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {balances?.oweDetails?.youOwe?.length > 0 ? (
                                    <>
                                        <div className="text-2xl font-bold text-rose-400">
                                            ${balances?.youOwe.toFixed(2)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            To {balances?.oweDetails?.youOwe?.length || 0} people
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">
                                            $0.00
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            You don’t owe anyone
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* left column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Expense Summary */}
                        </div>

                        {/* right column */}
                        <div className="space-y-6">
                            {/* Balance Details */}

                            {/* Groups */}
                        </div>
                    </div>

                </>
            )}
        </div>
    );
};
export default DashboardPage;