
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Fish, Waves, Droplets, Building, Calculator, Locate, Star, Film, Newspaper, MessageSquare, LineChart, Target, TrendingUp, ExternalLink } from "lucide-react";
import Link from 'next/link';

const fishTypes = [
    { name: "Rohu, Catla, Mrigal (Carps)", description: "Most common combination for pond polyculture in India." },
    { name: "Pangasius (Sutchi Catfish)", description: "Fast-growing, suitable for high-density farming." },
    { name: "Tilapia", description: "Hardy fish, easy to breed, and grows quickly." },
    { name: "Vannamei Shrimp", description: "High-value crustacean, requires brackish water and careful management." },
];

const pondManagement = [
    { name: "Pond Preparation", description: "Includes drying the pond bed, liming, and initial fertilization to prepare for stocking." },
    { name: "Stocking Density", description: "Crucial for growth and health; overstocking can lead to oxygen depletion and disease." },
    { name: "Feeding", description: "Using appropriate pellet feed with the right protein content based on the fish species and growth stage." },
];

const waterQuality = [
    { name: "pH", range: "6.5 - 8.5", importance: "Affects fish metabolism and toxicity of other substances." },
    { name: "Dissolved Oxygen (DO)", range: "> 4 mg/L", importance: "Essential for fish respiration. Aerators may be needed." },
    { name: "Ammonia", range: "< 0.02 mg/L", importance: "Highly toxic to fish, indicates overfeeding or poor waste management." },
];

const newsItems = [
    { title: "PMMSY scheme boosts shrimp production by 20%", source: "Department of Fisheries", href: "#" },
    { title: "Biofloc technology gaining popularity among fish farmers", source: "Aqua Post", href: "#" },
    { title: "Scientists develop new disease-resistant fish breed", source: "CIFA", href: "#" },
];

export default function AquaculturePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Fish className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aquaculture</h1>
          <p className="text-muted-foreground">The farming of fish, crustaceans, mollusks, and aquatic plants.</p>
        </div>
        <Button variant="outline" className="ml-auto"><Star className="mr-2" />Save this Topic</Button>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target />Beginner's Guide to Fish Farming</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">How to Start</h4>
            <p className="text-muted-foreground">Start with a small pond (e.g., 0.1 acre). Choose a hardy fish species like Tilapia or Catla that is suitable for your local climate. Learn about water quality management (pH, oxygen) as this is the most critical factor for success. Begin with a lower stocking density to avoid complications.</p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center gap-2"><TrendingUp />Market Scope</h4>
            <p className="text-muted-foreground">With increasing demand for protein, fish farming is a highly profitable business. The market is strong year-round. Government schemes like Pradhan Mantri Matsya Sampada Yojana (PMMSY) provide significant financial support and subsidies for new ponds, inputs, and infrastructure.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Fish />Types of Fish/Prawn Farming</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {fishTypes.map(f => (
                <AccordionItem value={f.name} key={f.name}>
                  <AccordionTrigger>{f.name}</AccordionTrigger>
                  <AccordionContent>{f.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Waves />Pond Setup & Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible>
              {pondManagement.map(p => (
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
            <CardTitle className="flex items-center gap-2"><Droplets />Water Quality Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
                {waterQuality.map(wq => (
                    <li key={wq.name} className="flex items-center justify-between text-sm">
                        <span className="font-semibold">{wq.name}</span>
                        <span className="text-muted-foreground">{wq.range}</span>
                    </li>
                ))}
             </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building />Govt. Schemes for Fisheries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Explore the Pradhan Mantri Matsya Sampada Yojana (PMMSY) for subsidies and support.</p>
            <a href="https://dof.gov.in/pmmsy" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="w-full">Learn about PMMSY</Button>
            </a>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">Tools & Resources</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-4">
               <Button><Calculator className="mr-2" />Profit Calculator for Fish Farm</Button>
               <Button><Locate className="mr-2" />Locate Hatcheries / Feed Suppliers</Button>
            </div>
        </CardContent>
      </Card>

       <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><LineChart />Earnings Potential</CardTitle></CardHeader>
             <CardContent>
              <p className="text-muted-foreground">A one-acre pond can yield a net profit of ₹1 lakh to ₹3 lakh per year depending on the species and management practices. High-density and high-value farming can yield more.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Film />Explainer Videos</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/z4E4-V9Rz_w"
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
              <p className="text-muted-foreground mb-4">Discuss water quality and feed management.</p>
              <Button disabled>Join the Discussion</Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
