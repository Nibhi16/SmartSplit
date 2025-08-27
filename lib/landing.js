import { 
  Bell, 
  CreditCard, 
  PieChart, 
  Receipt, 
  Users, 
  ShieldCheck, 
  Globe2, 
  Sparkles 
} from "lucide-react";

export const FEATURES = [
  {
    title: "Group Expenses",
    Icon: Users,
    bg: "bg-blue-900/10",
    color: "text-blue-800",
    description:
      "Organize expenses seamlessly for trips, events, or roommates in one place.",
  },
  {
    title: "Smart Settlements",
    Icon: CreditCard,
    bg: "bg-indigo-900/10",
    color: "text-indigo-700",
    description:
      "Minimize payments with our AI-powered settlement algorithm that keeps things fair.",
  },
  {
    title: "Expense Analytics",
    Icon: PieChart,
    bg: "bg-blue-900/10",
    color: "text-blue-700",
    description:
      "Visualize spending trends, track categories, and understand your group’s finances at a glance.",
  },
  {
    title: "Payment Reminders",
    Icon: Bell,
    bg: "bg-yellow-900/10",
    color: "text-yellow-700",
    description:
      "Never miss a due payment—get smart, timely reminders for pending balances.",
  },
  {
    title: "Multiple Split Types",
    Icon: Receipt,
    bg: "bg-indigo-900/10",
    color: "text-indigo-700",
    description:
      "Split by exact amounts, percentages, or equally—flexible for every scenario.",
  },
  {
    title: "Real-time Updates",
    Icon: Sparkles,
    bg: "bg-cyan-900/10",
    color: "text-cyan-600",
    description:
      "Experience instant updates as new expenses and repayments are logged.",
  },
];

export const STEPS = [
  {
    label: "1",
    title: "Create or Join a Group",
    description:
      "Start a group for your roommates, trip, or event and invite friends effortlessly.",
  },
  {
    label: "2",
    title: "Add Expenses",
    description:
      "Log expenses quickly and let SmartSplit handle the fair distribution.",
  },
  {
    label: "3",
    title: "Settle Up",
    description: 
      "View who owes what and log secure payments when debts are cleared.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "SmartSplit made our Goa trip stress-free! No more confusion about who owes what.",
    name: "Kavya Beriwal",
    image: "/testimonials/Kavya.png",
    role: "College Student & Traveler",
  },
  {
    quote:
      "As a working professional sharing an apartment, SmartSplit keeps our monthly bills sorted with zero drama.",
    name: "Aayushmaan wadhwa",
    image: "/testimonials/Aayushmaan.png",
    role: "Software Engineer",
  },
  {
    quote:
      "We used SmartSplit for a wedding event—everything was crystal clear. Settling expenses was a breeze!",
    name: "Smriti Rai",
    image: "/testimonials/Smriti.png",
    role: "Event Planner",
  },
];
