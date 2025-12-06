
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppState } from "@/hooks/use-app-state";
import { Shield, Bug, ScanLine, Sprout, Wheat, Leaf, Flower, ChevronsRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from 'next/link';

// Mock data for diseases. In a real app, this would come from a database or a specialized AI flow.
const diseaseData: Record<string, Record<string, { disease: string; type: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' }[]>> = {
  "Wheat": {
    "Germination": [{ disease: "Seedling Blight", type: "Fungal" }],
    "Tillering": [{ disease: "Powdery Mildew", type: "Fungal" }, { disease: "Aphids", type: "Pest" }],
    "Flowering": [{ disease: "Karnal Bunt", type:"Fungal" }, { disease: "Loose Smut", type: "Fungal" }],
    "Grain Filling": [{ disease: "Rust (Brown & Yellow)", type: "Fungal" }, { disease: "Termites", type: "Pest" }]
  },
  "Rice": {
    "Germination": [{ disease: "Bakanae Disease", type: "Fungal" }],
    "Tillering": [{ disease: "Bacterial Blight", type: "Bacterial" }, { disease: "Stem Borer", type: "Pest" }],
    "Flowering": [{ disease: "Sheath Blight", type: "Fungal" }, { disease: "False Smut", type: "Fungal" }],
    "Grain Filling": [{ disease: "Brown Spot", type: "Fungal" }, { disease: "Rice Hispa", type: "Pest" }]
  },
  "Maize": {
    "Germination": [{ disease: "Seed Rot", type: "Fungal" }],
    "Vegetative": [{ disease: "Fall Armyworm", type: "Pest" }, { disease: "Downy Mildew", type: "Fungal" }],
    "Flowering": [{ disease: "Common Rust", type: "Fungal" }, { disease: "Stalk Rot", type: "Bacterial" }],
    "Maturity": [{ disease: "Ear Rot", type: "Fungal" }]
  },
  "Cotton": {
     "Germination": [{ disease: "Damping-off", type: "Fungal" }],
     "Vegetative": [{ disease: "Jassids", type: "Pest" }, { disease: "Whitefly", type: "Pest" }],
     "Flowering": [{ disease: "Pink Bollworm", type: "Pest" }, { disease: "Boll Rot Complex", type: "Fungal" }],
     "Boll Development": [{ disease: "Spotted Bollworm", type: "Pest" }, { disease: "Leaf Curl Virus", type: "Viral" }]
  },
   "Sugarcane": {
    "Germination": [{ disease: "Pineapple Disease", type: "Fungal" }],
    "Tillering": [{ disease: "Early Shoot Borer", type: "Pest" }, { disease: "Smut", type: "Fungal" }],
    "Grand Growth": [{ disease: "Red Rot", type: "Fungal" }, { disease: "Wilt", type: "Fungal" }],
    "Maturity": [{ disease: "Top Borer", type: "Pest" }]
  }
};

const stageIcons = {
    "Germination": Sprout,
    "Tillering": Leaf,
    "Vegetative": Leaf,
    "Flowering": Flower,
    "Grain Filling": Wheat,
    "Boll Development": Wheat,
    "Grand Growth": ChevronsRight,
    "Maturity": Wheat,
} as const;

export default function DiseaseRiskPage() {
  const router = useRouter();
  const { onboardingData } = useAppState();
  const allCrops = [...onboardingData.primaryCrops, ...onboardingData.secondaryCrops];
  const [selectedCrop, setSelectedCrop] = useState(allCrops[0]?.name || "");

  const cropDiseases = diseaseData[selectedCrop] || null;

  if (allCrops.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Crops Found</AlertTitle>
        <AlertDescription>Please add crops to your profile to view potential disease risks.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Disease & Pest Risk</h1>
          <p className="text-muted-foreground">Common risks for your selected crop by growth stage.</p>
        </div>
         <Button onClick={() => router.push('/dashboard/disease-scan')}>
          <ScanLine className="mr-2 h-4 w-4" />
          Scan My Crop Now
        </Button>
      </div>

      <div className="w-full max-w-xs">
        <Select value={selectedCrop} onValueChange={setSelectedCrop}>
          <SelectTrigger>
            <SelectValue placeholder="Select a crop" />
          </SelectTrigger>
          <SelectContent>
            {allCrops.map(crop => (
              <SelectItem key={crop.name} value={crop.name}>{crop.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Potential Risks for {selectedCrop}</CardTitle>
          <CardDescription>
            This is a general guide. Actual risks depend on weather, soil, and local conditions.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {cropDiseases ? (
                <Accordion type="multiple" className="w-full">
                    {Object.entries(cropDiseases).map(([stage, diseases]) => {
                        const StageIcon = stageIcons[stage as keyof typeof stageIcons] || Shield;
                        return (
                        <AccordionItem value={stage} key={stage}>
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                    <StageIcon className="h-5 w-5 text-primary" />
                                    <span>{stage} Stage</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-4 pt-2 md:grid-cols-2">
                                    {diseases.map(d => (
                                        <div key={d.disease} className="flex items-start gap-4 rounded-md border p-4">
                                            {d.type === 'Pest' ? <Bug className="h-6 w-6 text-red-500 mt-1" /> : <Shield className="h-6 w-6 text-amber-500 mt-1" />}
                                            <div>
                                                <h4 className="font-semibold">{d.disease}</h4>
                                                <p className="text-sm text-muted-foreground">Type: {d.type}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        )
                    })}
                </Accordion>
            ) : (
                <Alert variant="destructive">
                    <AlertTitle>No Data Available</AlertTitle>
                    <AlertDescription>Sorry, we do not have specific disease risk data for '{selectedCrop}' at this time.</AlertDescription>
                </Alert>
            )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Experiencing an issue not listed here? Use the <Link href="/dashboard/disease-scan" className="text-primary underline">Disease Scanner</Link> for an AI-powered diagnosis.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
