"use client";

import { useRouter } from "next/navigation";
import { ExpenseForm } from "./components/expense-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function NewExpensePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10 max-w-4xl">

      {/* --- Header Section (Gradient, Clean, Like GroupPage) --- */}
      <div className="mb-10 bg-gradient-to-r from-blue-600/90 to-purple-700/90 
                      p-8 rounded-3xl shadow-xl text-white hover:shadow-2xl 
                      transition-all duration-300">

        <div className="flex items-center justify-between flex-wrap gap-4">

          {/* Left */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Add a New Expense
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Quickly record and split an expense with your friends or group.
            </p>
          </div>

          {/* Right Actions */}
          <Button
            variant="secondary"
            className="bg-white text-blue-700 hover:bg-blue-100 shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* --- Expense Form --- */}
      <Card className="shadow-lg border border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700">
            Choose Expense Type
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="individual" className="w-full">

            <TabsList className="grid grid-cols-2 w-full bg-blue-50 
                                border border-blue-200 rounded-lg">
              <TabsTrigger
                value="individual"
                className="data-[state=active]:bg-blue-600 
                           data-[state=active]:text-white rounded-md 
                           transition"
              >
                Individual Expense
              </TabsTrigger>

              <TabsTrigger
                value="group"
                className="data-[state=active]:bg-purple-600 
                           data-[state=active]:text-white rounded-md 
                           transition"
              >
                Group Expense
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="mt-4">
              <ExpenseForm
                type="individual"
                onSuccess={(id) => router.push(`/person/${id}`)}
              />
            </TabsContent>

            <TabsContent value="group" className="mt-4">
              <ExpenseForm
                type="group"
                onSuccess={(id) => router.push(`/groups/${id}`)}
              />
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>

    </div>
  );
}
