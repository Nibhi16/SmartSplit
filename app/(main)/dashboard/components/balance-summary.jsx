import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const BalanceSummary = ({ balances }) => {
  if (!balances) return null;

  const { oweDetails } = balances;
  const hasOwed = oweDetails.youAreOwedBy.length > 0;
  const hasOwing = oweDetails.youOwe.length > 0;

  return (
    <div className="space-y-4">
      {!hasOwed && !hasOwing && (
        <div className="text-center py-6">
          <p className="text-muted-foreground">You're all settled up!</p>
        </div>
      )}

      {hasOwed && (
        <div>
          <h3 className="text-sm font-medium flex items-center mb-3">
            <ArrowUpCircle className="h-4 w-4 text-blue-800 mr-2" />
            Owed to You
          </h3>

          <div className="space-y-3">
            {oweDetails.youAreOwedBy.map((item) => (
              <Link key={item.userId} href={`/person/${item.userId}`}>
                <div className="flex items-center justify-between hover:bg-muted p-2 rounded-md transition-colors gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.imageUrl} />
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{item.name}</span>
                  </div>

                  <span className="font-medium text-blue-800">
                    ₹{item.amount.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

       {hasOwing && (
        <div>
          <h3 className="text-sm font-medium flex items-center mb-3">
            <ArrowDownCircle className="h-4 w-4 text-red-500 mr-2" />
            You owe
          </h3>

          <div className="space-y-3">
            {oweDetails.youOwe.map((item) => (
              <Link key={item.userId} href={`/person/${item.userId}`}>
                <div className="flex items-center justify-between hover:bg-muted p-2 rounded-md transition-colors gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.imageUrl} />
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{item.name}</span>
                  </div>

                  <span className="font-medium text-blue-800">
                    ₹{item.amount.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceSummary;
