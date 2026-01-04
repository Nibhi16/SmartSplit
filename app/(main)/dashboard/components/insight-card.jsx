"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const InsightCard = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case "positive":
        return <TrendingDown className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (insight.type) {
      case "positive":
        return "default";
      case "warning":
        return "destructive";
      default:
        return "outline";
    }
  };

  const cardContent = (
    <Card className="border-border/50 hover:border-primary/30 transition-all duration-200">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={getVariant()} className="text-xs">
                {getIcon()}
                {insight.title}
              </Badge>
            </div>
            <p className="text-sm text-foreground font-medium">{insight.message}</p>
            <p className="text-xs text-muted-foreground">{insight.value}</p>
          </div>
          {insight.imageUrl && (
            <Avatar className="h-10 w-10 border-2 border-border">
              <AvatarImage src={insight.imageUrl} />
              <AvatarFallback>{insight.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (insight.userId) {
    return (
      <Link href={`/person/${insight.userId}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {cardContent}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {cardContent}
    </motion.div>
  );
};

export default InsightCard;

