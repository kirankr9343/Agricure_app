
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dna, Atom, Microscope, TestTube, GraduationCap, Link as LinkIcon, Star, Film, Newspaper, MessageSquare, LineChart, Target, TrendingUp, ExternalLink } from "lucide-react";
import Link from 'next/link';

const biotechUses = [
    { name: "Crop Improvement", description: "Developing new crop varieties with higher yields, better nutritional value, and resistance to pests and diseases." },
    { name: "Biofertilizers", description: "Using living microorganisms to increase soil fertility, reducing the need for chemical fertilizers." },
    { name: "Biopesticides", description: "Using natural sources like bacteria, fungi, and plant extracts to control pests, offering an eco-friendly alternative." },
    { name: "Diagnostic Tools", description: "Developing kits for rapid detection of plant diseases and soil nutrient deficiencies." },
];

const gmCrops = [
    { name: "Bt Cotton", description: "A genetically modified variety of cotton that produces an insecticide to combat the bollworm. It's the only GM crop approved for commercial cultivation in India." },
    { name: "Regulations", description: "The Genetic Engineering Appraisal Committee (GEAC) is the apex body in India for regulating GM organisms." },
];

const tissueCulture = [
    { name: "What is it?", description: "A technique of growing plant cells, tissues, or organs in an artificial nutrient medium, under sterile conditions." },
    { name: "Applications", description: "Used for mass production of disease-free planting material (e.g., banana, sugarcane) and conservation of rare species." },
];

const newsItems = [
    { title: "GEAC approves field trials for new GM Mustard variant", source: "The Indian Express", href: "#" },
    { title: "Bio-fertilizer usage grows by 15% as farmers shift from chemicals", source: "Down To Earth", href: "#" },
    { title: "New tissue culture lab for bananas established in Andhra Pradesh", source: "Times of India", href: "#" },
];

export default function BiotechnologyPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Dna className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biotechnology</h1>
          <p className="text-muted-foreground">Using technology to improve crops and yields.</p>
        </div>
        <Button variant="outline" className="ml-auto"><Star className="mr-2" />Save this Topic</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target />Introduction for Beginners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">How to Start</h4>
            <p className="text-muted-foreground">As a farmer, you can start by using products of biotechnology. Begin by using biofertilizers (like Rhizobium, Azotobacter) and biopesticides (like neem oil, Trichoderma). These are easily available and can reduce your chemical usage. For tissue culture, start by purchasing certified, disease-free saplings from a reputed lab.</p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center gap-2"><TrendingUp />Future Scope & Careers</h4>
            <p className="text-muted-foreground">Agricultural biotechnology is a rapidly growing field with immense scope. Careers range from research scientists in labs to production managers in biofertilizer units, and quality control experts in tissue culture labs. The development of climate-resilient and nutrient-rich crops is a major focus area globally.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Atom />Use of Biotech in Farming</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {biotechUses.map(b => (
                <AccordionItem value={b.name} key={b.name}>
                  <AccordionTrigger>{b.name}</AccordionTrigger>
                  <AccordionContent>{b.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Dna />GM Crops - Advantages & Regulations</CardTitle>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible>
              {gmCrops.map(g => (
                <AccordionItem value={g.name} key={g.name}>
                  <AccordionTrigger>{g.name}</AccordionTrigger>
                  <AccordionContent>{g.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TestTube />Plant Tissue Culture Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {tissueCulture.map(t => (
                <AccordionItem value={t.name} key={t.name}>
                  <AccordionTrigger>{t.name}</AccordionTrigger>
                  <AccordionContent>{t.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Microscope />Biofertilizers & Biopesticides</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">These are crucial components of organic and sustainable farming, reducing chemical load on the environment.</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">Learn & Grow</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-4">
               <Button><Microscope className="mr-2" />Learn Biotechnology Basics</Button>
               <Button><GraduationCap className="mr-2" />Apply for Training / Internship</Button>
            </div>
        </CardContent>
      </Card>

       <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><LineChart />Earnings Potential</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Using bio-inputs can reduce cost of cultivation by 10-20%. For entrepreneurs, setting up a tissue culture or biofertilizer unit can be a highly profitable business.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Film />Explainer Videos</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/g_i4v2x4x1s"
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
              <p className="text-muted-foreground mb-4">Debate the pros and cons of GM crops.</p>
              <Button disabled>Join the Discussion</Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
