"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES, STEPS, TESTIMONIALS } from "@/lib/landing";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col pt-16 relative">
      <section className="mt-20 pb-12 space-y-10 md:space-y-20 px-5">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <Badge varient="outline" className="bg-primary/10 text-primary border-primary/20">
            No math, no mess — just SmartSplit.
            </Badge>
           <h1 className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent 
           text-5xl font-bold tracking-tight">
  The smartest way to split expenses with friends.
</h1>
<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
  Keep track of every expense, split fairly, and settle instantly—no stress, no confusion.
</p>
<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Button asChild
      size="lg"
      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 
      text-white px-8 py-6 rounded-xl shadow-lg">
        <Link href="/dashboard">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>

      <Button asChild
      variant="outline"
      size="lg"
      className="border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary">
        <Link href="#how-it-works">
          See How It Works
        </Link>
      </Button>
    </div>
  </div>
          
  <div>
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className="container mx-auto max-w-5xl overflow-hidden rounded-2xl border-2
   border-border/50 shadow-2xl hover:shadow-3xl transition-shadow duration-500"
  >
  <Image
    src="/hero.png"
    width={1280}
    height={720}
    alt="Banner"
    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
    priority
  />
</motion.div>

  </div>
</section>
<section id="features" className="py-20 relative">
  <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
    <Badge varient="outline" className="bg-primary/10 text-primary border-primary/20">
      Features
    </Badge>
    <h1 className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text
    text-transparent text-3xl font-bold tracking-tight">
        Expense splitting made simple.
    </h1>
    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Our platform gives you everything you need to manage shared expenses effortlessly.
    </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
        {FEATURES.map(({ title, Icon, bg, color, description }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
          >
          <Card
              className="p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-xl border border-border/50
                 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 
                 transition-all duration-300"
          >
          <div className="rounded-xl p-4 bg-primary/10 dark:bg-primary/20 shadow-md border border-primary/20">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground tracking-wide">{title}</h3>
          <div className="w-16 h-1 mt-2 rounded-full bg-gradient-to-r from-primary to-purple-500"></div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
          </Card>
          </motion.div>
        ))}
    </div>
</section>


<section id="how-it-works" className="py-20 relative">
  <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
    <Badge varient="outline" className="bg-primary/10 text-primary border-primary/20">
        How It Works
    </Badge>
    <h1 className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text
    text-transparent text-3xl font-bold tracking-tight">
         Because splitting bills shouldn't be complicated.
    </h1>
    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Start managing expenses with friends in just a few easy steps.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {STEPS.map(({description, label,title  }, idx) => (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.1 }}
      whileHover={{ y: -4 }}
      className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-xl border border-border/50 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full 
      bg-primary/20 text-xl font-bold text-primary border border-primary/30 shadow-lg">
        {label}</div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </motion.div>
  ))}
  </div>
</div>
</section>

<section className="py-20 relative">
  <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
    <Badge varient="outline" className="bg-primary/10 text-primary border-primary/20">
        Testimonials
    </Badge>
    <h1 className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text
    text-transparent text-3xl font-bold tracking-tight">
         Insights from our users
    </h1>
   
    <div className="grid grid-cols-1 mx-auto max-w-5xl md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {TESTIMONIALS.map(({quote, name, image, role  }, idx) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          whileHover={{ y: -4 }}
        >
        <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50 hover:border-primary/30">
          <CardContent className="space-y-4 p-6">
            <p className="text-muted-foreground">{quote}</p>
            <div className="flex items-center space-x-3">
              <Avatar>
              <AvatarImage src={image} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{name}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      ))}
    </div>
  </div>
</section>
<section className="py-20 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-indigo-500/20 dark:from-primary/30 dark:via-purple-500/30 dark:to-indigo-500/30" />
  <div className="container mx-auto px-4 md:px-6 text-center space-y-6 relative z-10">
    <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
      Want to split smarter, not harder?
    </h2>
    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
      Trusted by thousands who split smarter every day.
    </p>
    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl">
      <Link href="/dashboard">
        Get Started
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  </div>
</section>
</div>
  );
}
