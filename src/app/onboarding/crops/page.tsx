
"use client";

import { useState, useEffect } from "react";
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
import { Loader2, PlusCircle, Trash2, Wheat, Leaf } from "lucide-react";
import { useTranslation } from "@/hooks/use-language";
import { useAppState } from "@/hooks/use-app-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCropSuggestions, GetCropSuggestionsOutput } from "@/ai/flows/get-crop-suggestions";
import { validateCropName, ValidateCropNameOutput } from "@/ai/flows/validate-crop-name";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SOWING_SEASONS = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];

type CropEntry = {
  id: string;
  name: string;
  season: string;
  yield: string;
};

export default function CropsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { onboardingData, setOnboardingData } = useAppState();
  
  const [primaryCrops, setPrimaryCrops] = useState<CropEntry[]>([]);
  const [secondaryCrops, setSecondaryCrops] = useState<CropEntry[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [currentCrop, setCurrentCrop] = useState("");
  const [sowingSeason, setSowingSeason] = useState("");
  const [averageYield, setAverageYield] = useState("");

  const [activeTab, setActiveTab] = useState("primary");
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  useEffect(() => {
    // Generate IDs on the client-side to prevent hydration mismatch
    setPrimaryCrops(onboardingData.primaryCrops.map(c => ({...c, id: Math.random().toString() })))
    setSecondaryCrops(onboardingData.secondaryCrops.map(c => ({...c, id: Math.random().toString() })))
  }, [onboardingData.primaryCrops, onboardingData.secondaryCrops]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (onboardingData.state) {
        try {
          setSuggestionsLoading(true);
          const result = await getCropSuggestions({ location: `${onboardingData.district}, ${onboardingData.state}` });
          setSuggestions(result.suggestions);
        } catch (error) {
          console.error("Failed to fetch crop suggestions:", error);
          setSuggestions([]);
        } finally {
          setSuggestionsLoading(false);
        }
      } else {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, [onboardingData.state, onboardingData.district]);


  const handleAddCrop = async () => {
    if (currentCrop && sowingSeason) {
      setIsAdding(true);
      const validationResult = await validateCropName({ cropName: currentCrop });

      if (!validationResult.isValid) {
        toast({
          variant: "destructive",
          title: "Invalid Crop Name",
          description: `"${currentCrop}" is not recognized as a valid crop. Please enter a real crop name.`,
        });
        setIsAdding(false);
        return;
      }

      const newCrop: CropEntry = {
        id: Date.now().toString(),
        name: currentCrop,
        season: sowingSeason,
        yield: averageYield,
      };
      
      const targetList = activeTab === 'primary' ? primaryCrops : secondaryCrops;
      const otherList = activeTab === 'primary' ? secondaryCrops : primaryCrops;


      if (!targetList.some(c => c.name.toLowerCase() === newCrop.name.toLowerCase()) && !otherList.some(c => c.name.toLowerCase() === newCrop.name.toLowerCase())) {
        if (activeTab === 'primary') {
            setPrimaryCrops([...primaryCrops, newCrop]);
        } else {
            setSecondaryCrops([...secondaryCrops, newCrop]);
        }
        setCurrentCrop("");
        setSowingSeason("");
        setAverageYield("");
      } else {
        toast({
          variant: "destructive",
          title: "Crop Already Added",
          description: `You have already added ${currentCrop} to your crop lists.`,
        });
      }
      setIsAdding(false);
    }
  };
  
  const handleRemoveCrop = (cropId: string) => {
    if (activeTab === 'primary') {
        setPrimaryCrops(primaryCrops.filter(c => c.id !== cropId));
    } else {
        setSecondaryCrops(secondaryCrops.filter(c => c.id !== cropId));
    }
  }

  const handleYieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d{0,3}(\.\d{0,2})?$/;
    if (regex.test(value)) {
      setAverageYield(value);
    }
  };

  const CropList = ({ crops }: { crops: CropEntry[] }) => (
    <ScrollArea className="h-32 rounded-md border">
        {crops.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4 text-center">
            Your added crops will appear here.
            </div>
        ) : (
        <div className="p-2 space-y-2">
            {crops.map(crop => (
            <div key={crop.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className="flex items-center gap-2">
                    {activeTab === 'primary' ? <Wheat className="h-5 w-5 text-primary" /> : <Leaf className="h-5 w-5 text-green-600" />}
                    <div>
                    <p className="font-semibold">{crop.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {crop.season}
                        {crop.yield && ` / ~${crop.yield} per acre`}
                    </p>
                    </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCrop(crop.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
            ))}
        </div>
        )}
    </ScrollArea>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (primaryCrops.length === 0) {
      toast({
        variant: "destructive",
        title: "No Primary Crops Added",
        description: "Please add at least one primary crop to continue.",
      });
      return;
    }
    setIsLoading(true);
    const primaryCropsToSave = primaryCrops.map(({id, ...rest}) => rest);
    const secondaryCropsToSave = secondaryCrops.map(({id, ...rest}) => rest);
    
    setOnboardingData({ 
        primaryCrops: primaryCropsToSave,
        secondaryCrops: secondaryCropsToSave 
    });
    
    setTimeout(() => {
      router.push("/onboarding/livestock");
    }, 1000);
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-2xl font-headline font-bold">
          Crop Information
        </CardTitle>
        <CardDescription>
          Tell us about the crops you cultivate.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          
          <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <Label htmlFor="crop-name">Crop Name</Label>
                    <Input
                        id="crop-name"
                        value={currentCrop}
                        onChange={(e) => setCurrentCrop(e.target.value)}
                        placeholder="E.g., Wheat"
                    />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="sowing-season">Season of Cultivation</Label>
                        <Select value={sowingSeason} onValueChange={setSowingSeason}>
                            <SelectTrigger id="sowing-season">
                                <SelectValue placeholder="Select Season" />
                            </SelectTrigger>
                            <SelectContent>
                                {SOWING_SEASONS.map(season => (
                                    <SelectItem key={season} value={season}>{season}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="average-yield">Average Yield (optional)</Label>
                        <Input
                            id="average-yield"
                            value={averageYield}
                            onChange={handleYieldChange}
                            placeholder="e.g., 20 quintal/acre"
                            type="text"
                            inputMode="decimal"
                        />
                    </div>
                </div>
            </div>
            <Button type="button" onClick={handleAddCrop} className="w-full" disabled={!currentCrop || !sowingSeason || isAdding}>
              {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {isAdding ? 'Validating...' : `Add to ${activeTab} list`}
            </Button>
          </div>

          <div>
            <Label>Suggestions for your area</Label>
             <div className="rounded-md border min-h-[6rem] p-2 mt-1">
                {suggestionsLoading ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Loading suggestions...</span>
                    </div>
                ) : suggestions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map(suggestion => (
                            <Button 
                                key={suggestion}
                                type="button"
                                variant="outline" 
                                size="sm" 
                                className="bg-background"
                                onClick={() => setCurrentCrop(suggestion)}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                ) : (
                     <div className="flex items-center justify-center h-full text-sm text-muted-foreground text-center p-4">
                        Could not load suggestions. Please enter your crop manually.
                    </div>
                )}
             </div>
          </div>
          
           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="primary">Primary Crops</TabsTrigger>
                <TabsTrigger value="secondary">Secondary / Rotational Crops</TabsTrigger>
              </TabsList>
              <TabsContent value="primary" className="mt-4">
                  <CropList crops={primaryCrops} />
              </TabsContent>
              <TabsContent value="secondary" className="mt-4">
                  <CropList crops={secondaryCrops} />
              </TabsContent>
            </Tabs>


          <Button type="submit" className="w-full" disabled={isLoading || primaryCrops.length === 0}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('continue')}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <p className="text-sm text-muted-foreground">{t('onboarding.step', { current: 5, total: 7 })}</p>
        <div className="w-full bg-muted rounded-full h-1.5 dark:bg-muted/30">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${5 * 100 / 7}%` }}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
