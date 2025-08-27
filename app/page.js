import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES, STEPS, TESTIMONIALS } from "@/lib/landing";
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
           <h1 className="bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent 
           text-5xl font-bold tracking-tight">
  The smartest way to split expenses with friends.
</h1>
<p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
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
      className="bg-transparent border-2 border-blue-700 text-blue-700 hover:bg-blue-50">
        <Link href="#how-it-works">
          See How It Works
        </Link>
      </Button>
    </div>
  </div>
          
  <div>
  <div className="container mx-auto max-w-5xl overflow-hidden rounded-xl border-2
   border-gray-200 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
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
<section id="features" className="bg-grey-50 py-20">
  <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
    <Badge varient="outline" className="bg-blue-100 text-blue-900">
      Features
    </Badge>
    <h1 className="bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text
    text-transparent text-3xl font-bold tracking-tight">
        Expense splitting made simple.
    </h1>
    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
        Our platform gives you everything you need to manage shared expenses effortlessly.
    </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
        {FEATURES.map(({ title, Icon, bg, color, description }, idx) => (
          <Card
            key={idx}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-lg shadow-lg border border-gray-100
                 hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] hover:scale-105 
                 transition-all duration-300"
          >
          <div className={`rounded-xl p-4 ${bg} shadow-md`}>
            <Icon className={`h-7 w-7 ${color}`} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-gray-800 tracking-wide">{title}</h3>
          <div className="w-16 h-1 mt-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"></div>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">{description}</p>
          </Card>
        ))}
    </div>
</section>


<section id="how-it-works" className="py-20">
  <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
    <Badge varient="outline" className="bg-blue-100 text-blue-900">
        How It Works
    </Badge>
    <h1 className="bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text
    text-transparent text-3xl font-bold tracking-tight">
         Because splitting bills shouldn't be complicated.
    </h1>
    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
        Start managing expenses with friends in just a few easy steps.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {STEPS.map(({description, label,title  }) => (
    <div className="flex flex-col items-center space-y-4" key= {title}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full 
      bg-blue-100 text-xl font-bold text-blue-700">
        {label}</div>
      <h3 className="text-xl font-bold ">{title}</h3>
      <p className="text-grey-500 text-center">{description}</p>
    </div>
  ))}
  </div>
</div>
</section>

<section className=" bg-grey-50 py-20">
  <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
    <Badge varient="outline" className="bg-blue-100 text-blue-900">
        Testimonials
    </Badge>
    <h1 className="bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text
    text-transparent text-3xl font-bold tracking-tight">
         Insights from our users
    </h1>
   
    <div className="grid grid-cols-1 mx-auto max-w-5xl md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {TESTIMONIALS.map(({quote, name, image, role  }) => (
        <Card key={name}>
          <CardContent className="space-y-4 p-6">
            <p className="text-grey-500">{quote}</p>
            <div className="flex items-center space-x-3">
              <Avatar>
              <AvatarImage src={image} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
<section className="py-20 gradient">
  <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
    <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">
      Want to split smarter, not harder?
    </h2>
    <p className="mx-auto max-w-[600px] text-blue-100 md:text-xl/relaxed">
      Trusted by thousands who split smarter every day.
    </p>
    <Button asChild size="lg" className="bg-blue-900 hover:opacity-90">
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
