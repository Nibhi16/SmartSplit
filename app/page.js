import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 

export default function Home() {
  return (
    <div className="flex flex-col pt-16">
      <section className="mt-20 pb-12 space-y-10 md:space-y-20 px-5">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <Badge varient="outline" className="bg-blue-100 text-blue-900">
            No math, no mess — just SmartSplit.
            </Badge>
           <h1 className="bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent text-5xl font-bold tracking-tight">
  The smartest way to split expenses with friends.
</h1>
<p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
  Keep track of every expense, split fairly, and settle instantly—no stress, no confusion.
</p>
<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Button asChild
      size="lg"
      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-6 rounded-xl shadow-lg">
        <Link href="/dashboard">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>

      <Button asChild
      variant="outline"
      size="lg"
      className="bg-transparent border-2 border-blue-700 text-blue-700 hover:bg-blue-50">
        <Link href="#how-it-works">
          See How It Works
        </Link>
      </Button>
    </div>
  </div>
          
  <div>
  <div className="container mx-auto max-w-5xl overflow-hidden rounded-xl border-2 border-gray-200 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
  <Image
    src="/hero.png"
    width={1280}
    height={720}
    alt="Banner"
    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
    priority
  />
</div>

  </div>
</section>
      
</div>
  );
}
