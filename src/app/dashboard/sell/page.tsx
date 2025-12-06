
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/hooks/use-app-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function SellPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { onboardingData, setOnboardingData } = useAppState();
  
  const hasSellerProfile = onboardingData.sellerProfile && onboardingData.sellerProfile.agreedToTerms;
  const [step, setStep] = useState(hasSellerProfile ? 'dashboard' : 'terms');

  // State for profile creation
  const [businessName, setBusinessName] = useState(onboardingData.sellerProfile?.businessName || `${onboardingData.name}'s Farm`);
  const [gstin, setGstin] = useState(onboardingData.sellerProfile?.gstin || "");
  const [pickupAddress, setPickupAddress] = useState(onboardingData.sellerProfile?.pickupAddress || `${onboardingData.village}, ${onboardingData.district}, ${onboardingData.state}`);
  
  // State for terms
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTermsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
        toast({ variant: 'destructive', title: 'Agreement Required', description: 'You must agree to the terms to proceed.' });
        return;
    }
    setStep('profile');
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newSellerProfile = {
      businessName,
      gstin,
      pickupAddress,
      agreedToTerms: true,
    };
    
    setOnboardingData({ sellerProfile: newSellerProfile });

    setTimeout(() => {
      setIsLoading(false);
      toast({ title: 'Seller Profile Created!', description: "You're all set to start listing your produce." });
      setStep('dashboard');
    }, 1000);
  };
  
  if (step === 'terms') {
      return (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl font-bold">Become a Seller</CardTitle>
            <CardDescription>Please review and accept the seller terms to continue.</CardDescription>
          </CardHeader>
          <form onSubmit={handleTermsSubmit}>
            <CardContent className="space-y-4">
              <ScrollArea className="h-64 rounded-md border p-4 text-sm text-muted-foreground">
                <h3 className="font-bold text-foreground mb-2">Seller Terms and Conditions</h3>
                <p className="mb-4">By creating a seller profile on Agricure, you agree to the following terms:</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>**Product Quality:** You are solely responsible for the quality, freshness, and safety of the produce you list. All items must meet local food safety standards.</li>
                    <li>**Accurate Listings:** You must provide accurate information for all listings, including product name, variety, quantity, and price. Misleading information is strictly prohibited.</li>
                    <li>**Order Fulfillment:** You are responsible for fulfilling all orders received through the platform in a timely manner. This includes packaging the produce appropriately for pickup.</li>
                    <li>**Pricing:** You have the freedom to set your own prices. Agricure may charge a small transaction fee on successful sales, which will be clearly communicated.</li>
                    <li>**Payments:** Payments from buyers will be processed through Agricure's payment gateway and remitted to your linked bank account after deducting applicable fees.</li>
                    <li>**Disputes:** You agree to handle any buyer disputes professionally. Agricure may mediate disputes but is not liable for losses.</li>
                    <li>**Compliance:** You must comply with all local, state, and national laws regarding the sale of agricultural produce.</li>
                </ol>
              </ScrollArea>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(!!checked)} />
                <Label htmlFor="terms" className="cursor-pointer text-sm leading-snug">
                  I have read, understood, and agree to the Seller Terms and Conditions.
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={!agreed}>
                Agree & Continue
              </Button>
            </CardContent>
          </form>
        </Card>
      );
  }
  
  if (step === 'profile') {
      return (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl font-bold">Create Your Seller Profile</CardTitle>
            <CardDescription>This information will be shown to potential buyers.</CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileSubmit}>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="businessName">Business/Farm Name</Label>
                  <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g., Ramesh Kumar Farms" required />
               </div>
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN (Optional)</Label>
                  <Input id="gstin" value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="Your 15-digit GST Identification Number" />
               </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupAddress">Default Pickup Address</Label>
                  <Input id="pickupAddress" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="Your full address for order pickups" required />
               </div>
              <Button type="submit" className="w-full" disabled={isLoading || !businessName || !pickupAddress}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Profile & Start Selling'}
              </Button>
            </CardContent>
          </form>
        </Card>
      )
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
                <p className="text-muted-foreground">Manage your listings, orders, and earnings.</p>
            </div>
            <Button>+ List New Produce</Button>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Welcome, {onboardingData.sellerProfile?.businessName || onboardingData.name}!</CardTitle>
                <CardDescription>This is your space to manage everything you sell on Agricure.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="text-center p-8 text-muted-foreground">
                    <p>Seller dashboard features like active listings and order management are coming soon.</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
