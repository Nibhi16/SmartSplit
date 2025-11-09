import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ExpenseSummary = ({ monthlySpending, totalSpent }) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "oct",
    "Nov",
    "Dec",
  ];

  const chartData = monthlySpending?.map((item) => {
    const date = new Date(item.month);
    return {
      name: monthNames[date.getMonth()],
      amount: item.total,
    };
  }) || [];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();


  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>
      <CardContent>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total this month</p>
            <h3 className="text-2xl font-bold mt-1">
              ${monthlySpending?.[currentMonth]?.total?.toFixed(2) || "0.00"}
            </h3>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total this year</p>
            <h3 className="text-2xl font-bold mt-1">
              ${totalSpent?.toFixed(2) || "0.00"}
            </h3>
          </div>
        </div>

        <div className="h-72 mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 transition-all duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E3A8A" stopOpacity={0.9} /> {/* Dark Blue */}
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.7} /> {/* Lighter Blue */}
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  borderRadius: "10px",
                  border: "none",
                  color: "#fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
                formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
                labelStyle={{ color: "#60A5FA" }}
              />
              <Bar
                dataKey="amount"
                fill="url(#blueGradient)"
                radius={[6, 6, 0, 0]}
                animationDuration={1200}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Monthly spending for {currentYear}
        </p>
      </CardContent>
    </Card>
  );
};

export default ExpenseSummary;
