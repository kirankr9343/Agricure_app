
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const membershipTiers = [
    {
        name: "Free Farmer",
        price: "₹0",
        period: "per month",
        description: "Essential tools to get you started.",
        features: [
            "Basic AI Chatbot Support",
            "Daily Weather Advisory",
            "Access to Marketplace",
            "Community Forum Access"
        ],
        isCurrent: true,
        buttonText: "Your Current Plan"
    },
    {
        name: "Agri-Plus",
        price: "₹299",
        period: "per month",
        description: "Advanced tools for the growing farm.",
        features: [
            "All Free Farmer features",
            "Priority AI Chatbot Support",
            "Personalized Advisory Dashboard",
            "AI Disease Scanner (10 scans/month)",
            "Market Price Trend Analysis"
        ],
        isPopular: true,
        buttonText: "Upgrade to Agri-Plus"
    },
    {
        name: "Agri-Pro",
        price: "₹999",
        period: "per month",
        description: "Comprehensive solutions for the modern agri-business.",
        features: [
            "All Agri-Plus features",
            "Unlimited AI Disease Scans",
            "Connect with Human Experts",
            "Export/Import Assistance",
            "Early access to new features"
        ],
        buttonText: "Upgrade to Agri-Pro"
    }
];

export default function MembershipPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Membership Plans</h1>
                <p className="mt-2 text-lg text-muted-foreground">Choose the plan that's right for your farm.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
                {membershipTiers.map((tier) => (
                    <Card 
                        key={tier.name}
                        className={cn(
                            "flex flex-col",
                            tier.isPopular ? "border-primary ring-2 ring-primary shadow-lg" : ""
                        )}
                    >
                        <CardHeader className="h-full">
                            {tier.isPopular && <div className="text-center"><span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">Most Popular</span></div>}
                            <CardTitle className="text-3xl font-bold text-center mt-4">{tier.name}</CardTitle>
                            <CardDescription className="text-center">{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-6">
                            <div className="text-center">
                                <span className="text-5xl font-bold">{tier.price}</span>
                                <span className="text-muted-foreground">{tier.period}</span>
                            </div>
                            <ul className="space-y-3">
                                {tier.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full"
                                variant={tier.isCurrent ? "outline" : "default"}
                                disabled={tier.isCurrent}
                            >
                                {tier.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
