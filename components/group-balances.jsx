"use client";
import { api } from '@/convex/_generated/api';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion } from 'framer-motion';

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

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="
                text-center pb-4 border-b border-border/50
                bg-card/50 backdrop-blur-xl
                p-4 rounded-xl shadow-lg
            ">
                <p className="text-sm text-muted-foreground mb-1">Your balance</p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`
                        text-3xl font-extrabold tracking-wide 
                        ${me.totalBalance > 0 ? "text-primary" : ""}
                        ${me.totalBalance < 0 ? "text-destructive" : ""}
                    `}
                >
                    {me.totalBalance > 0
                        ? `+₹${me.totalBalance.toFixed(2)}`
                        : me.totalBalance < 0
                            ? `-₹${Math.abs(me.totalBalance).toFixed(2)}`
                            : "₹0.00"
                    }
                </motion.p>
            </motion.div>

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
                                {owedByMembers.map((member, index) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        className="
                                            flex items-center justify-between 
                                            p-3 rounded-xl 
                                            bg-card/50 backdrop-blur-sm
                                            border border-border/50
                                            hover:border-primary/30 hover:shadow-lg
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

                                        <span className="text-primary font-semibold tracking-wide">
                                            ₹{member.amount.toFixed(2)}
                                        </span>
                                    </motion.div>
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
                                {owingToMembers.map((member, index) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        className="
                                            flex items-center justify-between 
                                            p-3 rounded-xl 
                                            bg-card/50 backdrop-blur-sm
                                            border border-border/50
                                            hover:border-destructive/30 hover:shadow-lg
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

                                        <span className="text-destructive font-semibold tracking-wide">
                                            ₹{member.amount.toFixed(2)}
                                        </span>
                                    </motion.div>
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
