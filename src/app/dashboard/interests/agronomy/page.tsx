
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Wheat, Layers, Droplets, CalendarDays, CloudSun, Sprout, Star, Film, Newspaper, MessageSquare, LineChart, Target, TrendingUp, ExternalLink } from "lucide-react";

const cropRotations = [
    { name: "Rice-Wheat", description: "Common in Indo-Gangetic plains. Improves soil structure." },
    { name: "Maize-Mustard-Sugarcane", description: "A long-duration, high-value rotation plan." },
    { name: "Cotton-Sorghum", description: "Good for arid and semi-arid regions." },
];

const soilManagement = [
    { name: "Minimum Tillage", description: "Reduces soil erosion and conserves moisture." },
    { name: "Green Manuring", description: "Incorporating green crops into the soil to improve fertility." },
    { name: "Cover Cropping", description: "Planting crops to cover the soil rather than for harvesting, preventing erosion." },
];

const irrigationTechniques = [
    { name: "Drip Irrigation", description: "Saves water by delivering it directly to the plant roots." },
    { name: "Sprinkler Irrigation", description: "Simulates rainfall, suitable for sandy soils and uneven terrain." },
    { name: "Furrow Irrigation", description: "Water is applied to furrows between crop rows." },
];

const newsItems = [
    { title: "New high-yield wheat variety shows promise in trials", source: "ICAR", href: "#" },
    { title: "Experts advise on water management for upcoming Rabi season", source: "Krishi Jagran", href: "#" },
    { title: "Soil health mapping project completed in 5 states", source: "The Hindu", href: "#" },
];

export default function AgronomyPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Wheat className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agronomy</h1>
          <p className="text-muted-foreground">The science of soil management and crop production.</p>
        </div>
        <Button variant="outline" className="ml-auto"><Star className="mr-2" />Save this Topic</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target />Getting Started as a Beginner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">How to Start</h4>
            <p className="text-muted-foreground">Start by understanding your own farm's soil and climate. Get a soil test done. Based on the report, choose one major crop that is well-suited to your conditions. Focus on mastering the entire cycle for that one crop, from seed selection to post-harvest management.</p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center gap-2"><TrendingUp />Market Scope</h4>
            <p className="text-muted-foreground">Agronomy is the backbone of food security. There is a constant demand for skilled agronomists in government agricultural departments, private seed and fertilizer companies, and as independent farm consultants. Efficient crop management directly leads to higher profitability for farms of all sizes.</p>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><CloudSun />Weather-based Crop Planning</CardTitle>
            <CardDescription>Get AI-powered crop suggestions for your specific field conditions.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-4">This tool uses your location and soil type to recommend the most suitable crops for the upcoming season.</p>
            <Button><Sprout className="mr-2" />Get Crop Suggestion for My Field</Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers />Best Crop Rotation Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {cropRotations.map(cr => (
                <AccordionItem value={cr.name} key={cr.name}>
                  <AccordionTrigger>{cr.name}</AccordionTrigger>
                  <AccordionContent>{cr.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Droplets />Water & Irrigation Techniques</CardTitle>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible>
              {irrigationTechniques.map(it => (
                <AccordionItem value={it.name} key={it.name}>
                  <AccordionTrigger>{it.name}</AccordionTrigger>
                  <AccordionContent>{it.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wheat />Soil Management Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {soilManagement.map(sm => (
                <AccordionItem value={sm.name} key={sm.name}>
                  <AccordionTrigger>{sm.name}</AccordionTrigger>
                  <AccordionContent>{sm.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays />Fertilizer Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground p-4">Schedules by soil type coming soon!</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><LineChart />Earnings Potential</CardTitle></CardHeader>
             <CardContent>
               <p className="text-muted-foreground">Improved agronomy practices can increase net profit by 15-40% through higher yields and optimized input costs.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Film />Explainer Videos</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/s3y_5sCg8bM"
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
              <p className="text-muted-foreground mb-4">Share crop management tips with others.</p>
              <Button disabled>Join the Discussion</Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

