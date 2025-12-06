
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PawPrint, HeartPulse, Building, PhoneCall, MapPin, Star, Film, Newspaper, MessageSquare, LineChart, Target, TrendingUp, Home, Wheat, ShieldCheck, DollarSign, ExternalLink } from "lucide-react";

const animalVentures = [
  {
    type: "Dairy Farming (Cattle & Buffalo)",
    points: {
      "Breed Selection": "For Cows: Gir, Sahiwal, Red Sindhi (indigenous); Jersey, Holstein Friesian (exotic). For Buffaloes: Murrah, Mehsana, Jaffarabadi.",
      "Housing & Management": "Clean, well-ventilated shed with proper drainage. Provide comfortable flooring and enough space (40 sq. ft. per adult animal).",
      "Feeding": "A balanced diet of green fodder, dry fodder (hay), and concentrate feed. Ensure constant access to clean drinking water.",
      "Health & Vaccination": "Regular vaccination against FMD, HS, BQ is crucial. Deworming every 3-4 months. Watch for signs of Mastitis.",
      "Economics": "Initial investment in animals and shed is high. Daily income from milk sales provides steady cash flow. Milk prices vary from ₹30-50 per litre."
    }
  },
  {
    type: "Poultry Farming (Broilers & Layers)",
    points: {
      "Breed Selection": "Broilers (for meat): Cobb, Ross. Layers (for eggs): White Leghorn, Rhode Island Red.",
      "Housing & Management": "Deep litter system or cage system. Ensure proper ventilation and temperature control (chicks need warmth). 1-1.5 sq. ft. per broiler, 2 sq. ft. per layer.",
      "Feeding": "Use pre-starter, starter, and finisher feed for broilers. Layers require specific layer mash for optimal egg production.",
      "Health & Vaccination": "Strict vaccination schedule is key (Ranikhet, Gumboro). Biosecurity is paramount to prevent disease outbreaks.",
      "Economics": "Broilers offer quick returns (40-45 days). Layers provide steady income after 5-6 months. Market prices for eggs and meat fluctuate."
    }
  },
  {
    type: "Goat Farming",
    points: {
      "Breed Selection": "Boer (for meat), Jamunapari, Beetal (dual-purpose), Barbari (stall-fed).",
      "Housing & Management": "Simple, elevated housing with good ventilation to keep them dry. Goats are browsers, so allow for grazing or provide cut-and-carry fodder.",
      "Feeding": "They thrive on tree leaves, bushes, and legumes. Supplement with concentrate feed during pregnancy and lactation.",
      "Health & Vaccination": "Vaccinate against PPR, ET, and FMD. Regular deworming is essential. Hoof trimming prevents foot rot.",
      "Economics": "Low initial investment compared to dairy. High demand for meat (mutton). Twins and triplets are common, leading to rapid flock growth."
    }
  }
];

const diseases = [
    { name: "Foot-and-Mouth Disease (FMD)", prevention: "Regular vaccination, biosecurity measures." },
    { name: "Blackleg (BQ)", prevention: "Vaccinate calves between 6-8 months of age." },
    { name: "Mastitis", prevention: "Maintain hygiene during milking, use teat dips." },
];

const vetCenters = [
    { name: "District Veterinary Hospital", contact: "1962 (Toll-Free Helpline)" },
    { name: "Local Veterinary Dispensary", contact: "Check with your village panchayat for local numbers." },
];

const newsItems = [
    { title: "New insurance scheme for livestock announced", source: "DAHD", href: "#" },
    { title: "Fodder prices expected to rise due to weak monsoon", source: "Reuters", href: "#" },
    { title: "Successful goat farming model in Rajasthan inspires others", source: "Gaon Connection", href: "#" },
];


export default function AnimalHusbandryPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <PawPrint className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Animal Husbandry</h1>
          <p className="text-muted-foreground">Care and breeding of domestic animals for food, fiber, and labor.</p>
        </div>
        <Button variant="outline" className="ml-auto"><Star className="mr-2" />Save this Topic</Button>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target />Starting Your Animal Farm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">How to Start as a Beginner</h4>
            <p className="text-muted-foreground">Start with a small number of animals (e.g., 2-3 cows for dairy, or 50 birds for poultry). Focus on providing proper housing, clean water, and quality feed. Learn about the vaccination schedule for your chosen animal and strictly adhere to it.</p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center gap-2"><TrendingUp />Market Scope</h4>
            <p className="text-muted-foreground">There is a consistent and growing demand for milk, eggs, and meat in India. The market is largely local, providing opportunities for steady income. Government subsidies for dairy, poultry, and goat farming make it an attractive venture for beginners.</p>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PawPrint />Animal Rearing Options</CardTitle>
          <CardDescription>Detailed guides for starting different livestock ventures.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {animalVentures.map((venture) => (
              <AccordionItem value={venture.type} key={venture.type}>
                <AccordionTrigger className="text-lg">{venture.type}</AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-4">
                    {Object.entries(venture.points).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-3">
                         <div className="pt-1">
                          {key === "Breed Selection" && <PawPrint className="h-4 w-4 text-muted-foreground" />}
                          {key === "Housing & Management" && <Home className="h-4 w-4 text-muted-foreground" />}
                          {key === "Feeding" && <Wheat className="h-4 w-4 text-muted-foreground" />}
                          {key === "Health & Vaccination" && <ShieldCheck className="h-4 w-4 text-muted-foreground" />}
                          {key === "Economics" && <DollarSign className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div>
                          <h5 className="font-semibold">{key}</h5>
                          <p className="text-sm text-muted-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HeartPulse />Common Diseases & Prevention</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {diseases.map(d => (
                <AccordionItem value={d.name} key={d.name}>
                  <AccordionTrigger>{d.name}</AccordionTrigger>
                  <AccordionContent>Prevention: {d.prevention}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building />Govt. Veterinary Support</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-2">
                {vetCenters.map(vc => (
                    <li key={vc.name} className="flex items-center justify-between">
                        <span>{vc.name}</span>
                        <span className="font-mono text-sm">{vc.contact}</span>
                    </li>
                ))}
             </ul>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">Connect with Support</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-4">
               <Button><PhoneCall className="mr-2" />Call Vet</Button>
               <Button><MapPin className="mr-2" />Locate Dairy Collection Centers</Button>
            </div>
        </CardContent>
      </Card>

       <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><LineChart />Earnings Potential</CardTitle></CardHeader>
             <CardContent>
              <p className="text-muted-foreground">A small dairy unit of 5 cows can provide a net monthly income of ₹15,000-₹25,000. Goat and poultry farming also offer high returns with lower initial investment.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Film />Explainer Videos</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/9g2m415p4xU"
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
              <p className="text-muted-foreground mb-4">Ask questions about animal health and breeds.</p>
              <Button disabled>Join the Discussion</Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
