
"use client";

import { useAppState } from "@/hooks/use-app-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Tag } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CheckoutPage() {
    const { onboardingData, clearCart, placeOrder } = useAppState();
    const router = useRouter();
    const { toast } = useToast();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Form state
    const [name, setName] = useState(onboardingData.name);
    const [address, setAddress] = useState(`${onboardingData.village}, ${onboardingData.district}`);
    const [city, setCity] = useState(onboardingData.district);
    const [pincode, setPincode] = useState(onboardingData.pincode);
    const [state, setState] = useState(onboardingData.state);
    const [deliveryInstructions, setDeliveryInstructions] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");

    // Coupon state
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);


    const cart = onboardingData.cart || [];
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal - discount + tax;
    
    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === "AGRI10") {
            const newDiscount = subtotal * 0.10;
            setDiscount(newDiscount);
            toast({
                title: "Coupon Applied!",
                description: `You saved ₹${newDiscount.toLocaleString()} (10% off).`,
            });
        } else {
            setDiscount(0);
            toast({
                variant: "destructive",
                title: "Invalid Coupon",
                description: "The coupon code you entered is not valid.",
            });
        }
    };


    const handlePlaceOrder = () => {
        if (!name || !address || !city || !pincode || !state) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill out all shipping details.' });
            return;
        }

        setIsPlacingOrder(true);
        
        placeOrder({
            items: cart,
            total: total,
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
                title: "Order Placed!",
                description: "Thank you for your purchase. Your order is being processed.",
            });
            setIsPlacingOrder(false);
            router.push("/dashboard/orders");
        }, 1000);
    };

    if (cart.length === 0 && !isPlacingOrder) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
                <p className="text-muted-foreground">Add items to your cart to see them here.</p>
                <Button onClick={() => router.push('/dashboard/marketplace')} className="mt-4">
                    Go to Marketplace
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
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
                                <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                                <Textarea id="instructions" value={deliveryInstructions} onChange={(e) => setDeliveryInstructions(e.target.value)} placeholder="e.g., Leave package at the front door." />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 rounded-md border p-4">
                                        <RadioGroupItem value="cod" id="cod" />
                                        <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery (COD)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-md border p-4">
                                        <RadioGroupItem value="upi" id="upi" />
                                        <Label htmlFor="upi" className="flex-1 cursor-pointer">UPI / QR Code</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-md border p-4">
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex-1 cursor-pointer">Credit / Debit Card</Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                                            <Image src={item.image} alt={item.name} fill className="object-contain" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.quantity} x ₹{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-4">
                           <Separator />
                            <div className="w-full space-y-2">
                                <Label htmlFor="coupon">Apply Coupon</Label>
                                <div className="flex gap-2">
                                    <Input id="coupon" placeholder="AGRI10" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                                    <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Use code <strong className="text-primary">AGRI10</strong> for 10% off.</p>
                            </div>
                            <Separator />
                            <div className="w-full space-y-2 text-sm">
                                <p className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </p>
                                {discount > 0 && (
                                     <p className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>- ₹{discount.toLocaleString()}</span>
                                    </p>
                                )}
                                <p className="flex justify-between text-muted-foreground">
                                    <span>Taxes (5%)</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </p>
                                <Separator />
                                <p className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </p>
                            </div>
                        </CardFooter>
                    </Card>
                     <Button className="w-full h-12 text-lg" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                        {isPlacingOrder && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {isPlacingOrder ? "Placing Order..." : `Place Order (₹${total.toLocaleString()})`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
