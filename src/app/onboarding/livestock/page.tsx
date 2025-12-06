
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle, Trash2, ShieldQuestion } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-language";

const LIVESTOCK_TYPES = ["Cattle", "Poultry", "Goat", "Fishery", "Sheep", "Pig", "Other"];

type LivestockEntry = {
  id: string;
  type: string;
  quantity: string;
};

export default function LivestockPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { onboardingData, setOnboardingData } = useAppState();
  
  const [livestock, setLivestock] = useState<LivestockEntry[]>(onboardingData.livestock.map(l => ({ ...l, id: Math.random().toString() })));
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [currentType, setCurrentType] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");

  const handleAddLivestock = () => {
    if (currentType && currentQuantity) {
      setIsAdding(true);
      const newEntry: LivestockEntry = {
        id: Date.now().toString(),
        type: currentType,
        quantity: currentQuantity,
      };
      
      if (!livestock.some(l => l.type.toLowerCase() === newEntry.type.toLowerCase())) {
        setLivestock([...livestock, newEntry]);
        setCurrentType("");
        setCurrentQuantity("");
      } else {
        toast({
          variant: "destructive",
          title: "Livestock Already Added",
          description: `You have already added ${currentType} to your list.`,
        });
      }
      setIsAdding(false);
    }
  };
  
  const handleRemoveLivestock = (id: string) => {
    setLivestock(livestock.filter(l => l.id !== id));
  };

  const handleNext = () => {
      setIsLoading(true);
      const livestockToSave = livestock.map(({id, ...rest}) => rest);
      setOnboardingData({ livestock: livestockToSave });
      setTimeout(() => {
        router.push("/onboarding/preferences");
      }, 500);
  }


  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-2xl font-headline font-bold">
          Livestock & Allied Activities
        </CardTitle>
        <CardDescription>
          (Optional) Add details about your livestock.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="livestock-type">Livestock Type</Label>
              <Select value={currentType} onValueChange={setCurrentType}>
                <SelectTrigger id="livestock-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {LIVESTOCK_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity or Scale</Label>
              <Input
                id="quantity"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                placeholder="e.g., 50 birds, 10 cows"
              />
            </div>
          </div>
          <Button type="button" onClick={handleAddLivestock} className="w-full" disabled={!currentType || !currentQuantity || isAdding}>
            {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            Add Livestock
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label>Your Livestock List</Label>
          <ScrollArea className="h-32 rounded-md border">
            {livestock.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4 text-center">
                Your added livestock will appear here.
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {livestock.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div>
                      <p className="font-semibold">{entry.type}</p>
                      <p className="text-xs text-muted-foreground">
                        Quantity: {entry.quantity}
                      </p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveLivestock(entry.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" className="w-full" onClick={handleNext}>
            Skip this step
          </Button>
          <Button type="button" className="w-full" onClick={handleNext} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('continue')}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <p className="text-sm text-muted-foreground">{t('onboarding.step', { current: 6, total: 7 })}</p>
        <div className="w-full bg-muted rounded-full h-1.5 dark:bg-muted/30">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${6 * 100 / 7}%` }}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
