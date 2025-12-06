
"use client";

import { useState } from "react";
import { useAppState } from "@/hooks/use-app-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateRange } from "react-day-picker";
import { addDays, format, differenceInDays } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export default function RentCheckoutPage() {
    const { onboardingData, placeBooking } = useAppState();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [name, setName] = useState(onboardingData.name);
    const [address, setAddress] = useState(`${onboardingData.village}, ${onboardingData.district}`);
    const [city, setCity] = useState(onboardingData.district);
    const [pincode, setPincode] = useState(onboardingData.pincode);
    const [state, setState] = useState(onboardingData.state);
    const [deliveryInstructions, setDeliveryInstructions] = useState("Call upon arrival.");
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 4),
    });

    const rentCart = onboardingData.rentCart || [];
    
    const duration = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0;
    const subtotalPerDay = rentCart.reduce((total, item) => total + item.pricePerDay, 0);
    const total = subtotalPerDay * duration;
    
    const handlePlaceBooking = () => {
        if (!name || !address || !city || !pincode || !state) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill out all your details.' });
            return;
        }
         if (!dateRange || !dateRange.from || !dateRange.to) {
            toast({ variant: 'destructive', title: 'Date Range Required', description: 'Please select a rental start and end date.' });
            return;
        }

        setIsLoading(true);
        
        placeBooking({
            items: rentCart,
            total: total,
            rentalStartDate: format(dateRange.from, 'PPP'),
            rentalEndDate: format(dateRange.to, 'PPP'),
            rentalDuration: duration,
            shipping: {
                name,
                address,
                city,
                state,
                pincode,
                deliveryInstructions
            }
        });

        setTimeout(() => {
            toast({
                title: "Booking Confirmed!",
                description: "Your equipment rental has been confirmed.",
            });
            setIsLoading(false);
            router.push("/dashboard/bookings");
        }, 1000);
    };

    if (rentCart.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-2xl font-bold">Your Rental List is Empty</h1>
                <p className="text-muted-foreground">Add equipment to your rent list to see them here.</p>
                <Button onClick={() => router.push('/dashboard/equipment')} className="mt-4">
                    Browse Equipment
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Rental Checkout</h1>
            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address for Delivery/Pickup</Label>
                                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City / District</Label>
                                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instructions">Instructions (Optional)</Label>
                                <Textarea id="instructions" value={deliveryInstructions} onChange={(e) => setDeliveryInstructions(e.target.value)} placeholder="e.g., Call upon arrival." />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4" />
                                    Rental Duration
                                </Label>
                                <DateRangePicker date={dateRange} setDate={setDateRange} />
                            </div>
                            <Separator />
                            {rentCart.map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                                            <Image src={item.image} alt={item.name} fill className="object-contain" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                ₹{item.pricePerDay.toLocaleString()}/day
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-4">
                            <Separator />
                            <div className="w-full space-y-2 text-sm">
                                 <p className="flex justify-between">
                                    <span>Price per day</span>
                                    <span>₹{subtotalPerDay.toLocaleString()}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Number of days</span>
                                    <span>x {duration}</span>
                                </p>
                                <Separator />
                                <p className="flex justify-between font-bold text-lg">
                                    <span>Total Rent</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </p>
                            </div>
                        </CardFooter>
                    </Card>
                     <Button className="w-full h-12 text-lg" onClick={handlePlaceBooking} disabled={isLoading || duration <= 0}>
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {isLoading ? "Confirming..." : `Confirm Booking (₹${total.toLocaleString()})`}
                    </Button>
                </div>
            </div>
        </div>
    );
}

    