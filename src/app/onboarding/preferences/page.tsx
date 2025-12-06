
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Bell, MessageSquare, Mail } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

type CommunicationMode = "app" | "whatsapp" | "sms" | "email";

const notificationOptions = [
    { id: 'app', label: 'In-App Notifications', icon: Bell },
    { id: 'whatsapp', label: 'WhatsApp Messages', icon: MessageSquare },
    { id: 'sms', label: 'SMS/Text Messages', icon: MessageSquare },
    { id: 'email', label: 'Email Updates', icon: Mail },
] as const;

const updateFrequencies = ['Daily', 'Weekly', 'Monthly', 'Critical Alerts Only'];

export default function PreferencesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { onboardingData, setOnboardingData } = useAppState();
  
  const [communicationModes, setCommunicationModes] = useState<CommunicationMode[]>(onboardingData.communicationModes);
  const [updateFrequency, setUpdateFrequency] = useState(onboardingData.updateFrequency);
  const [agreedToTerms, setAgreedToTerms] = useState(onboardingData.agreedToTerms);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleMode = (mode: CommunicationMode) => {
    setCommunicationModes((prev) =>
      prev.includes(mode) ? prev.filter((p) => p !== mode) : [...prev, mode]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!agreedToTerms) {
      toast({
        variant: "destructive",
        title: "Agreement Required",
        description: "You must agree to the terms and conditions to finish the setup.",
      });
      return;
    }
    setIsLoading(true);
    setOnboardingData({ 
        communicationModes,
        updateFrequency,
        agreedToTerms: true,
        onboardingComplete: true, // Mark onboarding as complete
     });
    setTimeout(() => {
      router.push("/dashboard"); 
    }, 1000);
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-2xl font-headline font-bold">
          Final Preferences & Terms
        </CardTitle>
        <CardDescription>
          Choose how we communicate with you and agree to our terms.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label className="font-semibold">Communication Mode</Label>
                <p className="text-sm text-muted-foreground">How would you like to receive updates?</p>
                <div className="space-y-2 pt-2">
                    {notificationOptions.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2 rounded-md border p-3">
                            <Checkbox 
                                id={opt.id} 
                                checked={communicationModes.includes(opt.id)}
                                onCheckedChange={() => handleToggleMode(opt.id)}
                            />
                            <Label htmlFor={opt.id} className="flex-1 flex items-center gap-2 cursor-pointer font-normal">
                            <opt.icon className="h-4 w-4 text-muted-foreground" />
                            {opt.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="font-semibold">Frequency of Updates</Label>
                <p className="text-sm text-muted-foreground">How often should we send non-critical updates?</p>
                <RadioGroup value={updateFrequency} onValueChange={(v) => setUpdateFrequency(v as any)} className="pt-2 space-y-1">
                    {updateFrequencies.map(freq => (
                        <div className="flex items-center space-x-2" key={freq}>
                            <RadioGroupItem value={freq} id={freq} />
                            <Label htmlFor={freq} className="font-normal">{freq}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
            
            <div className="space-y-2 pt-4">
               <Label className="font-semibold">Terms and Conditions</Label>
                <div className="flex items-start space-x-2 rounded-md border p-3">
                    <Checkbox 
                        id="terms" 
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                       <Label htmlFor="terms" className="cursor-pointer font-normal">
                          I agree to the <Link href="/onboarding/terms" target="_blank" className="text-primary underline">Terms and Conditions</Link>.
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            By agreeing, you consent to data usage for AI diagnosis and other services as described.
                        </p>
                    </div>
                </div>
            </div>

          <Button type="submit" className="w-full !mt-8" disabled={isLoading || !agreedToTerms}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('finishSetup')}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <p className="text-sm text-muted-foreground">{t('onboarding.step', { current: 7, total: 7 })}</p>
        <div className="w-full bg-muted rounded-full h-1.5 dark:bg-muted/30">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `100%` }}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
