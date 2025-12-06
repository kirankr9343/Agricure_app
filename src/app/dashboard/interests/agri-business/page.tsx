
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, Building, DollarSign, Calculator, FileText, Landmark, UserPlus, Star, Film, Newspaper, MessageSquare, LineChart, Target, TrendingUp, ExternalLink } from "lucide-react";
import Link from 'next/link';

const ventures = [
    { name: "Mushroom Cultivation", roi: "High ROI, low space requirement." },
    { name: "Beekeeping (Apiculture)", roi: "Dual income from honey and pollination." },
    { name: "Dairy Farming", roi: "Consistent daily income." },
    { name: "Plant Nursery", roi: "High demand for saplings and ornamental plants." },
];

const businessModels = [
    { name: "Direct-to-Consumer (D2C)", description: "Selling produce directly to customers via farm stands or online portals." },
    { name: "Contract Farming", description: "Growing crops under a contract with a buyer, ensuring a market." },
    { name: "Value-Added Processing", description: "Converting raw produce into processed goods like jams, juices, or chips." },
];

const newsItems = [
    { title: "Govt. launches new fund for Agri Startups", source: "PIB India", href: "#" },
    { title: "FPO movement gains traction in western states", source: "The Economic Times", href: "#" },
    { title: "How a farmer's co-operative doubled its income", source: "YourStory", href: "#" },
]

export default function AgriBusinessPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Briefcase className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agri-Business</h1>
          <p className="text-muted-foreground">Turn your farm into a profitable enterprise.</p>
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
            <p className="text-muted-foreground">Start small with a single, manageable venture. Create a simple business plan: identify your product (e.g., mushrooms), your target customer (local restaurants, weekly market), and your initial costs. Focus on learning one thing well before expanding.</p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center gap-2"><TrendingUp />Market Scope</h4>
            <p className="text-muted-foreground">The demand for locally-sourced, fresh, and processed food is rapidly growing in urban and semi-urban areas. Niche markets like organic products, exotic vegetables, and high-value processed goods offer significant profit margins. Leveraging government schemes can further boost profitability.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign />Small Agri-Venture Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {ventures.map(v => (
                <AccordionItem value={v.name} key={v.name}>
                  <AccordionTrigger>{v.name}</AccordionTrigger>
                  <AccordionContent>{v.roi}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText />Business Model Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {businessModels.map(m => (
                <AccordionItem value={m.name} key={m.name}>
                  <AccordionTrigger>{m.name}</AccordionTrigger>
                  <AccordionContent>{m.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building />Government Schemes & Support</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-4">Explore schemes like Startup India, Agri-Clinics and Agri-Business Centers (AC&ABC) to get financial and technical support.</p>
            <div className="flex flex-wrap gap-4">
               <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener noreferrer">
                    <Button><Landmark className="mr-2" />Apply for Agri Loan / Subsidy</Button>
               </a>
               <a href="https://udyamregistration.gov.in/" target="_blank" rel="noopener noreferrer">
                    <Button><UserPlus className="mr-2" />Register as Entrepreneur</Button>
               </a>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calculator />ROI Calculator</CardTitle>
            <CardDescription>Estimate potential returns on your agri-venture.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground p-4">Feature coming soon!</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><LineChart />Earnings Potential</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Varies by venture. Small-scale mushroom or honey businesses can add ₹50,000 - ₹2,00,000 annually. Dairy and processing units have higher potential but require more investment.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Film />Explainer Videos</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/Un13h2k2n-A"
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
              <p className="text-muted-foreground mb-4">Connect with other agri-entrepreneurs.</p>
              <Button disabled>Join the Discussion</Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
