
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FlaskConical, Package, Award, ListChecks, GraduationCap, Star, Film, Newspaper, MessageSquare, LineChart, Target, TrendingUp, ExternalLink } from "lucide-react";
import Link from 'next/link';

const preservationTechs = [
    { name: "Drying / Dehydration", description: "Removes moisture to prevent microbial growth. Suitable for fruits, vegetables, and herbs." },
    { name: "Pickling", description: "Preserving food in an acidic medium (vinegar) or through fermentation." },
    { name: "Canning", description: "Heating food in sealed containers to kill microorganisms and inactivate enzymes." },
];

const valueAdditions = [
    { name: "Jams & Jellies", from: "Fruits like mango, pineapple, mixed fruit." },
    { name: "Juices & Squashes", from: "Citrus fruits, mango, litchi." },
    { name: "Chips & Wafers", from: "Potato, banana, jackfruit." },
];

const newsItems = [
    { title: "FSSAI simplifies licensing for small food businesses", source: "FSSAI", href: "#" },
    { title: "Surge in demand for processed and packaged foods post-pandemic", source: "Livemint", href: "#" },
    { title: "Solar dryers gain popularity for food preservation in rural areas", source: "ET EnergyWorld", href: "#" },
];

export default function FoodTechnologyPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <FlaskConical className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Food Technology</h1>
          <p className="text-muted-foreground">Preservation, processing, and packaging of food.</p>
        </div>
        <Button variant="outline" className="ml-auto"><Star className="mr-2" />Save this Topic</Button>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target />Starting Small in Food Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">How to Start</h4>
            <p className="text-muted-foreground">Start with one product you can make from your own farm's surplus produce, like pickles or sun-dried tomatoes. Use your home kitchen initially to test recipes and packaging. Get a basic FSSAI registration, which is mandatory and can be done online. Sell at local markets or directly to consumers to get feedback.</p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center gap-2"><TrendingUp />Market Scope</h4>
            <p className="text-muted-foreground">The market for processed and value-added food products is enormous and growing, driven by urbanization and demand for convenience. There's a high demand for 'farm-to-table' branded products with a story. This sector also has strong support from the Ministry of Food Processing Industries through various schemes.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FlaskConical />Food Preservation Techniques</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {preservationTechs.map(p => (
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
            <CardTitle className="flex items-center gap-2"><Package />Value Addition Ideas</CardTitle>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible>
              {valueAdditions.map(v => (
                <AccordionItem value={v.name} key={v.name}>
                  <AccordionTrigger>{v.name}</AccordionTrigger>
                  <AccordionContent>From: {v.from}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award />FSSAI Certification Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">A basic FSSAI registration is mandatory for any food business. It ensures food safety and quality standards.</p>
            <a href="https://foscos.fssai.gov.in/" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full">Visit FSSAI Portal</Button>
            </a>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Package />Packaging & Branding Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Choose packaging that preserves quality and is cost-effective.</li>
              <li>Your brand name and logo should be simple and memorable.</li>
              <li>Clearly label ingredients, nutritional information, and manufacturing date.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">Start Your Journey</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-4">
               <Button><ListChecks className="mr-2" />Start My Food Brand Checklist</Button>
               <Button><GraduationCap className="mr-2" />Learn Food Processing</Button>
            </div>
        </CardContent>
      </Card>

       <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><LineChart />Earnings Potential</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Value addition can increase the price of raw produce by 2 to 5 times. A small-scale home-based unit can generate an additional income of ₹10,000 to ₹30,000 per month.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Film />Explainer Videos</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/LHHs_bV8o6E"
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
              <p className="text-muted-foreground mb-4">Share recipes and preservation techniques.</p>
              <Button disabled>Join the Discussion</Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
