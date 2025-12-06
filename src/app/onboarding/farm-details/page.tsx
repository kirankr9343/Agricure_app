
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-language";
import { useAppState } from "@/hooks/use-app-state";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FARMER_TYPES = ['Small', 'Medium', 'Large', 'Tenant', 'Commercial', 'Hobby'];
const LAND_TYPES = ['Owned', 'Leased', 'Both'];
const IRRIGATION_SOURCES = ['Rainfed', 'Borewell', 'Drip', 'Canal', 'Well', 'Other'];
const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red', 'Laterite', 'Alluvial'];

export default function FarmDetailsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { onboardingData, setOnboardingData } = useAppState();

  const [farmerType, setFarmerType] = useState(onboardingData.farmerType);
  const [landType, setLandType] = useState(onboardingData.landType);
  const [landArea, setLandArea] = useState(onboardingData.landArea);
  const [landAreaUnit, setLandAreaUnit] = useState<'acres' | 'hectares'>(onboardingData.landAreaUnit || 'acres');
  const [irrigationSource, setIrrigationSource] = useState(onboardingData.irrigationSource);
  const [soilType, setSoilType] = useState(onboardingData.soilType);
  const [isLoading, setIsLoading] = useState(false);

  const handleLandAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Regex to allow up to 3 digits, an optional decimal point, and up to 2 decimal digits.
    const regex = /^\d{0,3}(\.\d{0,2})?$/;
    if (regex.test(value)) {
      setLandArea(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOnboardingData({
      farmerType,
      landType,
      landArea,
      landAreaUnit,
      irrigationSource,
      soilType,
    });
    setTimeout(() => {
      router.push("/onboarding/crops");
    }, 500);
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-2xl font-headline font-bold">
          Farming Details
        </CardTitle>
        <CardDescription>
          Tell us about your farm to get better recommendations.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="farmerType">Type of Farmer</Label>
            <Select value={farmerType} onValueChange={(v) => setFarmerType(v as any)} required>
              <SelectTrigger id="farmerType">
                <SelectValue placeholder="Select farmer type" />
              </SelectTrigger>
              <SelectContent>
                {FARMER_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label>Type of Land</Label>
            <RadioGroup value={landType} onValueChange={(v) => setLandType(v as any)} className="flex gap-4 pt-2">
                {LAND_TYPES.map(type => (
                    <div className="flex items-center space-x-2" key={type}>
                        <RadioGroupItem value={type} id={`land-${type}`} />
                        <Label htmlFor={`land-${type}`}>{type}</Label>
                    </div>
                ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="landArea">Total Land Area</Label>
            <div className="flex gap-2">
              <Input
                id="landArea"
                type="text"
                inputMode="decimal"
                placeholder="E.g., 5.5"
                value={landArea}
                onChange={handleLandAreaChange}
                required
              />
              <Select value={landAreaUnit} onValueChange={(v) => setLandAreaUnit(v as 'acres' | 'hectares')}>
                  <SelectTrigger className="w-[120px]">
                      <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="acres">Acres</SelectItem>
                      <SelectItem value="hectares">Hectares</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="irrigationSource">Primary Irrigation Source</Label>
            <Select value={irrigationSource} onValueChange={(v) => setIrrigationSource(v as any)} required>
              <SelectTrigger id="irrigationSource">
                <SelectValue placeholder="Select irrigation source" />
              </SelectTrigger>
              <SelectContent>
                {IRRIGATION_SOURCES.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="soilType">Primary Soil Type</Label>
            <Select value={soilType} onValueChange={(v) => setSoilType(v as any)} required>
              <SelectTrigger id="soilType">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                {SOIL_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !landArea || !farmerType || !irrigationSource || !soilType || !landType}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('continue')}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <p className="text-sm text-muted-foreground">{t('onboarding.step', { current: 4, total: 7 })}</p>
        <div className="w-full bg-muted rounded-full h-1.5 dark:bg-muted/30">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${4 * 100 / 7}%` }}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
