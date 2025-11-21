"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ParticipantSelector } from "./participant-selector";
import { GroupSelector } from "./group-selector";
import { CategorySelector } from "./category-selector";
import { SplitSelector } from "./split-selector";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { getAllCategories } from "@/lib/expense-categories";
import { motion } from "framer-motion";

// Form schema validation
const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  category: z.string().optional(),
  date: z.date(),
  paidByUserId: z.string().min(1, "Payer is required"),
  splitType: z.enum(["equal", "percentage", "exact"]),
  groupId: z.string().optional(),
});

export function ExpenseForm({ type = "individual", onSuccess }) {
  const [participants, setParticipants] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [splits, setSplits] = useState([]);

  // Mutations and queries
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  const createExpense = useConvexMutation(api.expenses.createExpense);
  const categories = getAllCategories();

  // Set up form with validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      date: new Date(),
      paidByUserId: currentUser?._id || "",
      splitType: "equal",
      groupId: undefined,
    },
  });

  // Watch for changes
  const amountValue = watch("amount");
  const paidByUserId = watch("paidByUserId");

  // When a user is added or removed, update the participant list
  useEffect(() => {
    if (participants.length === 0 && currentUser) {
      // Always add the current user as a participant
      setParticipants([
        {
          id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          imageUrl: currentUser.imageUrl,
        },
      ]);
    }
  }, [currentUser, participants]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const amount = parseFloat(data.amount);

      // Prepare splits in the format expected by the API
      const formattedSplits = splits.map((split) => ({
        userId: split.userId,
        amount: split.amount,
        paid: split.userId === data.paidByUserId,
      }));

      // Validate that splits add up to the total (with small tolerance)
      const totalSplitAmount = formattedSplits.reduce(
        (sum, split) => sum + split.amount,
        0
      );
      const tolerance = 0.01;

      if (Math.abs(totalSplitAmount - amount) > tolerance) {
        toast.error(
          `Split amounts don't add up to the total. Please adjust your splits.`
        );
        return;
      }

      // For 1:1 expenses, set groupId to undefined instead of empty string
      const groupId = type === "individual" ? undefined : data.groupId;

      // Create the expense
      await createExpense.mutate({
        description: data.description,
        amount: amount,
        category: data.category || "Other",
        date: data.date.getTime(), // Convert to timestamp
        paidByUserId: data.paidByUserId,
        splitType: data.splitType,
        splits: formattedSplits,
        groupId,
      });

      toast.success("Expense created successfully!");
      reset(); // Reset form

      const otherParticipant = participants.find(
        (p) => p.id !== currentUser._id
      );
      const otherUserId = otherParticipant?.id;

      if (onSuccess) onSuccess(type === "individual" ? otherUserId : groupId);
    } catch (error) {
      toast.error("Failed to create expense: " + error.message);
    }
  };

  if (!currentUser) return null;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* --- Simple clean section --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-6 bg-card/50 backdrop-blur-xl p-6 rounded-2xl border border-border/50 shadow-xl"
      >

      {/* Description + Amount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-foreground font-medium">Description</Label>
          <Input
            placeholder="Lunch, groceries, tickets..."
            {...register("description")}
            className="h-11"
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-foreground font-medium">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <Input
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0.01"
              {...register("amount")}
              className="h-11 pl-8"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500">{errors.amount.message}</p>
          )}
        </div>
      </div>

      {/* Category + Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-foreground font-medium">Category</Label>
          <CategorySelector
            categories={categories}
            onChange={(id) => id && setValue("category", id)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-foreground font-medium">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-11"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setValue("date", date);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Group / Participants */}
      {type === "group" && (
        <div className="space-y-1.5">
          <Label className="text-foreground font-medium">Group</Label>
          <GroupSelector
            onChange={(group) => {
              if (!selectedGroup || selectedGroup.id !== group.id) {
                setSelectedGroup(group);
                setValue("groupId", group.id);
                if (group.members) setParticipants(group.members);
              }
            }}
          />
          {!selectedGroup && (
            <p className="text-xs text-amber-600">Select a group to continue</p>
          )}
        </div>
      )}

      {type === "individual" && (
        <div className="space-y-1.5">
          <Label className="text-foreground font-medium">Participants</Label>
          <ParticipantSelector
            participants={participants}
            onParticipantsChange={setParticipants}
          />
        </div>
      )}

      {/* Who paid */}
      <div className="space-y-1.5">
        <Label className="text-foreground font-medium">Paid By</Label>
        <select
          {...register("paidByUserId")}
          className="w-full border border-border/50 rounded-xl p-2 h-11 bg-background/50 backdrop-blur-sm text-foreground focus:border-primary focus:ring-primary/20 focus:ring-2 transition-all duration-200"
        >
          <option value="">Select</option>
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id === currentUser._id ? "You" : p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Split Type */}
      <div className="space-y-2">
        <Label className="text-foreground font-medium">Split Type</Label>
        <Tabs
          defaultValue="equal"
          onValueChange={(value) => setValue("splitType", value)}
        >
          <TabsList className="grid grid-cols-3 w-full bg-muted/80 dark:bg-muted/60 border border-border/60 dark:border-border/40 rounded-xl p-1">
            <TabsTrigger value="equal">Equal</TabsTrigger>
            <TabsTrigger value="percentage">Percentage</TabsTrigger>
            <TabsTrigger value="exact">Exact</TabsTrigger>
          </TabsList>

          <TabsContent value="equal" className="pt-4">
            <SplitSelector
              type="equal"
              amount={parseFloat(amountValue) || 0}
              participants={participants}
              paidByUserId={paidByUserId}
              onSplitsChange={setSplits}
            />
          </TabsContent>

          <TabsContent value="percentage" className="pt-4">
            <SplitSelector
              type="percentage"
              amount={parseFloat(amountValue) || 0}
              participants={participants}
              paidByUserId={paidByUserId}
              onSplitsChange={setSplits}
            />
          </TabsContent>

          <TabsContent value="exact" className="pt-4">
            <SplitSelector
              type="exact"
              amount={parseFloat(amountValue) || 0}
              participants={participants}
              paidByUserId={paidByUserId}
              onSplitsChange={setSplits}
            />
          </TabsContent>
        </Tabs>
      </div>
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end"
      >
        <Button
          type="submit"
          disabled={isSubmitting || participants.length <= 1}
          className="px-6 py-3 font-semibold shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? "Creating..." : "Create Expense"}
        </Button>
      </motion.div>
    </motion.form>
  );

}