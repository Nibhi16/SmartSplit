"use client";
import { api } from '@/convex/_generated/api';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const GroupBalances = ({ balances }) => {
    const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

    if (!balances?.length || !currentUser) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                No balance information available
            </div>
        );
    }

    const me = balances.find((b) => b.id === currentUser._id);

    if (!me) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                You're not part of this group
            </div>
        );
    }

    const userMap = Object.fromEntries(balances.map((b) => [b.id, b]));

    const owedByMembers = me.owedBy
        .map(({ from, amount }) => ({ ...userMap[from], amount }))
        .sort((a, b) => b.amount - a.amount);

    const owingToMembers = me.owes
        .map(({ to, amount }) => ({ ...userMap[to], amount }))
        .sort((a, b) => b.amount - a.amount);

    const isAllSettledUp =
        me.totalBalance === 0 &&
        owedByMembers.length === 0 &&
        owingToMembers.length === 0;

    return (
        <div className="space-y-5">

            <div className="
                text-center pb-4 border-b
                bg-gradient-to-r from-white/10 via-white/5 to-white/10
                dark:from-white/5 dark:via-white/10 dark:to-white/5
                p-4 rounded-xl backdrop-blur-md shadow-sm
            ">
                <p className="text-sm text-muted-foreground mb-1">Your balance</p>

                <p
                    className={`
                        text-3xl font-extrabold tracking-wide 
                        ${me.totalBalance > 0 ? "text-blue-700" : ""}
                        ${me.totalBalance < 0 ? "text-rose-500" : ""}
                    `}
                >
                    {me.totalBalance > 0
                        ? `+$${me.totalBalance.toFixed(2)}`
                        : me.totalBalance < 0
                            ? `-$${Math.abs(me.totalBalance).toFixed(2)}`
                            : "₹0.00"
                    }
                </p>
            </div>

            {isAllSettledUp ? (
                <div className="
                    text-center py-5 
                    text-muted-foreground 
                    bg-white/10 dark:bg-white/5 
                    rounded-xl backdrop-blur-md
                ">
                    Everyone is settled up!
                </div>
            ) : (
                <div className="space-y-6">

                    {owedByMembers.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold flex items-center mb-3">
                                <ArrowUpCircle className="h-4 w-4 text-blue-700 mr-2" />
                                Owed to You
                            </h3>

                            <div className="space-y-3">
                                {owedByMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="
                                            flex items-center justify-between 
                                            p-3 rounded-xl 
                                            bg-white/20 dark:bg-white/10
                                            backdrop-blur-md
                                            border border-white/30 dark:border-white/10
                                            hover:shadow-md hover:scale-[1.015]
                                            transition-all duration-300
                                        "
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 ring-2 ring-white/60 dark:ring-white/20 shadow-sm">
                                                <AvatarImage src={member.imageUrl} />
                                                <AvatarFallback>
                                                    {member.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">{member.name}</span>
                                        </div>

                                        <span className="text-blue-700 font-semibold tracking-wide">
                                            ${member.amount.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {owingToMembers.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold flex items-center mb-3">
                                <ArrowDownCircle className="h-4 w-4 text-red-500 mr-2" />
                                You Owe
                            </h3>

                            <div className="space-y-3">
                                {owingToMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="
                                            flex items-center justify-between 
                                            p-3 rounded-xl 
                                            bg-white/20 dark:bg-white/10
                                            backdrop-blur-md
                                            border border-white/30 dark:border-white/10
                                            hover:shadow-md hover:scale-[1.015]
                                            transition-all duration-300
                                        "
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 ring-2 ring-white/60 dark:ring-white/20 shadow-sm">
                                                <AvatarImage src={member.imageUrl} />
                                                <AvatarFallback>
                                                    {member.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">{member.name}</span>
                                        </div>

                                        <span className="text-red-500 font-semibold tracking-wide">
                                            ${member.amount.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default GroupBalances;
