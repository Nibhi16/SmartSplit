"use client";
import { useStoreUser } from "@/hooks/use-store-users";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";
import { LayoutDashboard, MessageCircle } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { motion } from "framer-motion";
import ChatbotDialog from "./chatbot/chatbot-dialog";

const Header = () => {
  const { isLoading } = useStoreUser();
  const path = usePathname();
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl z-50 supports-[backdrop-filter]:bg-background/60 shadow-sm"
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link href='/' className="items-center gap-2 flex">
            <Image 
              src={"/logos/logo.png"}
              alt="SmartSplit logo"
              width={150}
              height={40}
              className="object-contain"
            />
          </Link>
        </motion.div>
        
        {path === '/' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-6"
          >
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="#How-It-Works"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </motion.div>
        )}
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Authenticated>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatbotOpen(true)}
              className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
              title="AI Assistant"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
            <UserButton />
            <ChatbotDialog open={chatbotOpen} onOpenChange={setChatbotOpen} />
          </Authenticated>
          <Unauthenticated>
            <SignInButton>
              <Button
                variant="ghost"
                className="hover:bg-accent transition-all duration-200"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Get Started
              </Button>
            </SignUpButton>
          </Unauthenticated>
        </div>
      </nav>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <BarLoader width={"100%"} color="hsl(var(--primary))" />
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;


