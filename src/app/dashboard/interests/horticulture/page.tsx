
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Apple, Sprout, Calendar, Film, School, ShoppingCart, ScanLine, Star, Newspaper, MessageSquare, LineChart, Target, TrendingUp, ExternalLink } from "lucide-react";
import Link from 'next/link';

const cropGuides = [
    { 
        name: "Mango (Dasheri)", 
        details: "Requires well-drained soil and a distinct dry season for flowering. Planting is usually done in the monsoon.",
        sowing: "July - August",
        harvesting: "May - July",
        practices: "Regular pruning after harvesting to maintain shape and size. Irrigation is critical during fruit development."
    },
    { 
        name: "Tomato (Hybrid)", 
        details: "Can be grown year-round with proper irrigation. Staking is important to keep fruit off the ground.",
        sowing: "Kharif: Jun-Jul, Rabi: Oct-Nov, Summer: Jan-Feb",
        harvesting: "Starts 60-70 days after transplanting.",
        practices: "Use of mulch to conserve moisture. Regular application of NPK fertilizers is necessary for high yield."
    },
    { 
        name: "Rose (Hybrid Tea)", 
        details: "Requires at least 6 hours of direct sunlight. Pruning in October is key for good flowering.",
        sowing: "October - November (cuttings)",
        harvesting: "Flowers can be harvested year-round.",
        practices: "Watch out for black spot disease and powdery mildew. Regular deadheading encourages more blooms."
    },
];

const soilRecs = [
    { name: "For Fruits", details: "Generally prefer deep, loamy, and well-drained soils. NPK ratio varies by crop and growth stage." },
    { name: "For Vegetables", details: "Rich in organic matter. Many are heavy feeders and require consistent nutrient supply." },
];

const trainingCenters = [
    { name: "Indian Agricultural Research Institute (IARI), Delhi" },
    { name: "University of Horticultural Sciences, Bagalkot" },
    { name: "Local Krishi Vigyan Kendra (KVK)" },
];

const newsItems = [
    { title: "Export demand for Indian mangoes up by 15%", source: "APEDA", href: "#" },
    { title: "New polyhouse subsidy encourages vegetable farming", source: "NHB", href: "#" },
    { title: "Floriculture market sees boom during festival season", source: "Floriculture Today", href: "#" },
];

export default function HorticulturePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Apple className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Horticulture</h1>
          <p className="text-muted-foreground">Cultivation of fruits, vegetables, flowers, and ornamental plants.</p>
        </div>
        <Button variant="outline" className="ml-auto"><Star className="mr-2" />Save this Topic</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target />Getting Started for Beginners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">How to Start</h4>
            <p className="text-muted-foreground">Start small with a kitchen garden or a small plot. Choose easy-to-grow vegetables like tomatoes, spinach, or okra. This will help you understand plant life cycles, pest management, and watering needs on a manageable scale before investing in a larger area.</p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center gap-2"><TrendingUp />Market Scope</h4>
            <p className="text-muted-foreground">The demand for fresh fruits, vegetables, and flowers is consistently high, especially in urban areas. High-value crops like exotic vegetables or ornamental flowers can offer excellent returns. There is also a growing export market for quality horticultural produce from India.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Apple />Crop Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {cropGuides.map(guide => (
                <AccordionItem value={guide.name} key={guide.name}>
                  <AccordionTrigger>{guide.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                        <p className="font-semibold">Details: <span className="font-normal text-muted-foreground">{guide.details}</span></p>
                        <p className="font-semibold">Sowing Time: <span className="font-normal text-muted-foreground">{guide.sowing}</span></p>
                        <p className="font-semibold">Harvesting Time: <span className="font-normal text-muted-foreground">{guide.harvesting}</span></p>
                        <p className="font-semibold">Key Practices: <span className="font-normal text-muted-foreground">{guide.practices}</span></p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sprout />Soil & Fertilizer Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {soilRecs.map(rec => (
                <AccordionItem value={rec.name} key={rec.name}>
                  <AccordionTrigger>{rec.name}</AccordionTrigger>
                  <AccordionContent>{rec.details}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar />Seasonal Crop Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground p-4">Calendar feature coming soon!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><School />Local Horticulture Training Centers</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                {trainingCenters.map(center => <li key={center.name}>{center.name}</li>)}
             </ul>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">Take Action</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-4">
                <Button asChild><Link href="/dashboard/sell"><ShoppingCart className="mr-2" />Sell Your Produce</Link></Button>
                <Button variant="secondary" asChild>
                <Link href="/dashboard/disease-scan">
                    <ScanLine className="mr-2" />AI Pest/Disease Detector
                </Link>
                </Button>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><LineChart />Earnings Potential</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Highly variable. High-value crops like exotic vegetables or cut flowers can generate profits of over ₹2-5 lakh per acre, while traditional vegetables yield ₹50,000 to ₹1.5 lakh.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Film />Explainer Videos</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/5b2sTS2b2pY"
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
              <p className="text-muted-foreground mb-4">Discuss vegetable prices and pest control.</p>
              <Button disabled>Join the Discussion</Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
