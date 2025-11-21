"use client";

import React from "react";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const SettlementsList = ({
  settlements,
  isGroupSettlement = false,
  userLookupMap = {},
}) => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  // Empty state
  if (!settlements || !settlements.length) {
    return (
      <Card className="border-dashed border-2 border-gray-300 shadow-sm">
        <CardContent className="py-10 text-center text-muted-foreground">
          <p className="text-lg font-medium">No settlements found 💸</p>
          <p className="text-sm text-gray-400 mt-2">
            Once people settle up, details will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Helper: get user info
  const getUserDetails = (userId) => ({
    name:
      userId === currentUser?._id
        ? "You"
        : userLookupMap[userId]?.name || "Other User",
    id: userId,
  });

  return (
    <div className="flex flex-col gap-4">
      {settlements.map((settlement, index) => {
        const payer = getUserDetails(settlement.paidByUserId);
        const receiver = getUserDetails(settlement.receivedByUserId);
        const isCurrentUserPayer = settlement.paidByUserId === currentUser?._id;
        const isCurrentUserReceiver =
          settlement.receivedByUserId === currentUser?._id;

        return (
          <motion.div
            key={settlement._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardContent className="py-5">
              <div className="flex items-center justify-between">
                {/* LEFT SECTION */}
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-tr from-primary/20 to-purple-500/20 p-3 rounded-full shadow-sm">
                    <ArrowLeftRight className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {isCurrentUserPayer
                        ? `You paid ${receiver.name}`
                        : isCurrentUserReceiver
                        ? `${payer.name} paid you`
                        : `${payer.name} paid ${receiver.name}`}
                    </h3>

                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <span>{format(new Date(settlement.date), "MMM d, yyyy")}</span>
                      {settlement.note && (
                        <>
                          <span>•</span>
                          <span>{settlement.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="text-right">
                  <div className="font-bold text-primary text-lg">
                    ₹{settlement.amount.toFixed(2)}
                  </div>

                  {isGroupSettlement ? (
                    <Badge variant="outline" className="mt-1 text-primary border-primary/30">
                      Group settlement
                    </Badge>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {isCurrentUserPayer ? (
                        <span className="text-destructive font-medium">You paid</span>
                      ) : isCurrentUserReceiver ? (
                        <span className="text-green-500 font-medium">You received</span>
                      ) : (
                        <span>Payment</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SettlementsList;
