
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sprout, Bug, Award, ShoppingBag, GraduationCap, Star, Film, Newspaper, MessageSquare, LineChart, Target, TrendingUp, ExternalLink } from "lucide-react";
import Link from 'next/link';

const manurePrep = [
    { name: "Vermicompost", description: "Using earthworms to decompose organic waste, creating a nutrient-rich compost." },
    { name: "Green Manure", description: "Growing specific plants and then plowing them into the soil to increase organic matter and nitrogen." },
    { name: "Farm Yard Manure (FYM)", description: "Decomposed mixture of dung, urine, litter, and leftover fodder from livestock." },
];

const pestControl = [
    { name: "Neem Oil Spray", description: "A broad-spectrum natural insecticide and fungicide." },
    { name: "Pheromone Traps", description: "Lures and traps specific insect pests, helping monitor and reduce populations." },
    { name: "Crop Rotation", description: "Breaks the life cycles of pests and diseases associated with a particular crop." },
];

const certifications = [
    { name: "India Organic", description: "A certification mark for organically farmed food products manufactured in India." },
    { name: "Participatory Guarantee System (PGS-India)", description: "A quality assurance initiative that is locally relevant, transparent, and involves producers and consumers." },
];

const newsItems = [
    { title: "Sikkim shares its organic farming success story", source: "The Better India", href: "#" },
    { title: "Demand for PGS-certified local organic produce rises", source: "Organic Farming Association", href: "#" },
    { title: "Jaivik Kheti portal connects over 5 lakh farmers to buyers", source: "Ministry of Agriculture", href: "#" },
];


export default function OrganicFarmingPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Sprout className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organic Farming</h1>
          <p className="text-muted-foreground">Farming in harmony with nature, without synthetic chemicals.</p>
        </div>
        <Button variant="outline" className="ml-auto"><Star className="mr-2" />Save this Topic</Button>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target />First Steps in Organic Farming</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">How to Start</h4>
            <p className="text-muted-foreground">Begin by preparing your own compost or vermicompost. Stop using chemical fertilizers and pesticides on a small patch of your land and use these organic inputs instead. Observe the results. You don't need to convert your entire farm at once; a phased approach is more manageable.</p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center gap-2"><TrendingUp />Market Demand</h4>
            <p className="text-muted-foreground">The market for organic produce is one of the fastest-growing sectors in agriculture. Consumers are willing to pay a premium for certified organic food due to health and environmental concerns. While yields might be slightly lower initially, the higher price realization often leads to better profitability.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sprout />Organic Manure Preparation</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {manurePrep.map(m => (
                <AccordionItem value={m.name} key={m.name}>
                  <AccordionTrigger>{m.name}</AccordionTrigger>
                  <AccordionContent>{m.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bug />Natural Pest Control Methods</CardTitle>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible>
              {pestControl.map(p => (
                <AccordionItem value={p.name} key={p.name}>
                  <AccordionTrigger>{p.name}</AccordionTrigger>
                  <AccordionContent>{p.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award />Certification Process</CardTitle>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible>
              {certifications.map(c => (
                <AccordionItem value={c.name} key={c.name}>
                  <AccordionTrigger>{c.name}</AccordionTrigger>
                  <AccordionContent>{c.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShoppingBag />Organic Product Marketing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Platforms like Jaivik Kheti and various private e-commerce sites help connect organic farmers to markets.</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">Connect & Learn</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-4">
               <Button><ShoppingBag className="mr-2" />Find Organic Buyers / Shops</Button>
               <Button><GraduationCap className="mr-2" />Courses on Organic Practices</Button>
            </div>
        </CardContent>
      </Card>

       <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><LineChart />Earnings Potential</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Organic products typically fetch a 20-50% premium over conventional produce. While initial yields might be lower, reduced input costs and premium pricing can lead to higher net profits in the long run.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Film />Explainer Videos</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/vyv6p3b3G5E"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Newspaper />Latest News</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                {newsItems.map(item => (
                    <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-md hover:bg-muted/50">
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">{item.source} <ExternalLink className="h-3 w-3" /></p>
                    </a>
                ))}
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare />Discussion Forum</CardTitle></CardHeader>
            <CardContent className="text-center flex flex-col items-center justify-center p-4">
              <p className="text-muted-foreground mb-4">Share your experience with organic certification.</p>
              <Button disabled>Join the Discussion</Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
