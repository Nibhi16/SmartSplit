import { Users } from "lucide-react";
import Link from "next/link";
import React from "react";

const GroupList = ({ groups }) => {

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No groups yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create a group to start tracking shared expenses
        </p>
      </div>
    );
  }

  return (
  <div className="space-y-3">
    {groups.map((group) => {
      const balance = group.balance || 0;
      const hasBalance = balance !== 0;

      return (
        <Link
          href={`/groups/${group.id}`}
          key={group.id}
          className="flex items-center justify-between p-4 rounded-xl border border-border
                     bg-card hover:bg-accent transition-all duration-300 ease-in-out
                     hover:shadow-md group"
        >
          {/* Left Side: Group Info */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground group-hover:text-primary transition">
                {group.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {group.members.length} member{group.members.length !== 1 && "s"}
              </p>
            </div>
          </div>

          {/* Right Side: Balance */}
          <div className="text-right">
            {hasBalance ? (
              <span
                className={`text-sm font-semibold ${
                  balance > 0 ? "text-blue-800" : "text-rose-400"
                }`}
              >
                {balance > 0 ? "+" : "-"}₹{Math.abs(balance).toFixed(2)}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Settled up</span>
            )}
          </div>
        </Link>
      );
    })}
  </div>
);

};

export default GroupList;
