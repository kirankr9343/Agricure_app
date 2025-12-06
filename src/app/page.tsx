
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgricureLogo } from "@/components/icons/logo";
import { ArrowRight, BarChart, BotMessageSquare, Leaf, ScanLine, ShoppingBag, Tractor } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
    const heroBg = PlaceHolderImages.find(p => p.id === 'auth-background');

  const features = [
    {
      icon: <BotMessageSquare className="h-8 w-8 text-primary" />,
      title: "AI Advisory",
      description: "Get personalized, AI-powered advice on weather, soil health, and market prices.",
    },
    {
      icon: <ScanLine className="h-8 w-8 text-primary" />,
      title: "Disease Scanner",
      description: "Instantly diagnose crop diseases and get solutions by scanning with your phone's camera.",
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
      title: "Marketplace",
      description: "Buy fertilizers, seeds, and pesticides from a comprehensive catalog.",
    },
     {
      icon: <Tractor className="h-8 w-8 text-primary" />,
      title: "Equipment Rental",
      description: "Rent or buy farm equipment, from tractors to drones, to optimize your operations.",
    },
     {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "Market Trends",
      description: "Analyze historical and future price trends for your crops to maximize profits.",
    },
     {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Knowledge Hub",
      description: "Explore detailed guides on horticulture, agronomy, organic farming, and more.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <AgricureLogo className="h-8 w-8" />
          <span className="sr-only">Agricure</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild>
            <Link href="/auth">
              Sign In
            </Link>
          </Button>
          <Button asChild>
            <Link href="/auth">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-24 lg:pb-32">
          {heroBg && <Image
            src={heroBg.imageUrl}
            alt="Farm landscape"
            fill
            className="object-cover opacity-20"
            data-ai-hint={heroBg.imageHint}
            priority
          />}
          <div className="relative container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Smarter Farming, Greater Yields
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Agricure is your personal farming companion, providing AI-driven insights and a comprehensive marketplace to help you grow more, earn more, and farm smarter.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                    <Link href="/auth">
                        Join Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything a Modern Farmer Needs</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From AI-powered diagnostics to a complete marketplace, Agricure brings all the tools you need into one simple platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            {feature.icon}
                            {feature.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Agricure. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
