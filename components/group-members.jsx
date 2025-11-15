"use client";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const GroupMembers = ({ members }) => {
    const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

    if (!members || members.length === 0) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                No members in this group
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {members.map((member) => {
                const isCurrentUser = member.id === currentUser?._id;
                const isAdmin = member.role === "admin";

                return (
                    <div
                        key={member.id}
                        className="
                            flex items-center justify-between p-4
                            rounded-xl
                            bg-gradient-to-r from-white/20 to-white/5
                            dark:from-white/10 dark:to-white/5
                            backdrop-blur-lg 
                            border border-white/30 dark:border-white/10
                            shadow-sm
                            hover:shadow-[0_4px_18px_rgba(0,0,0,0.12)]
                            hover:scale-[1.015]
                            transition-all duration-300
                        "
                    >
                        <div className="flex items-center gap-4">
                            <Avatar className="h-11 w-11 ring-2 ring-white/60 dark:ring-white/20 shadow-md">
                                <AvatarImage src={member.imageUrl || ""} />
                                <AvatarFallback className="text-base">
                                    {member.name?.charAt(0)?.toUpperCase() || "?"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="leading-tight">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold tracking-wide">
                                        {member.name}
                                    </span>

                                    {isCurrentUser && (
                                        <Badge
                                            variant="outline"
                                            className="
                                                text-[10px] px-2 py-0.5 h-5 
                                                bg-white/60 dark:bg-white/10 
                                                backdrop-blur 
                                                font-medium border-white/50 dark:border-white/20
                                            "
                                        >
                                            You
                                        </Badge>
                                    )}
                                </div>

                                {isAdmin && (
                                    <span className="text-xs text-blue-600 dark:text-blue-300 font-medium">
                                        Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GroupMembers;
