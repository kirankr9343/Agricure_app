
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppState } from "@/hooks/use-app-state";
import { ShoppingCart, Trash2, Plus, Minus, CalendarPlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CartSheet() {
  const { 
    onboardingData,
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    removeFromRentCart,
    clearRentCart
  } = useAppState();
  const router = useRouter();

  const cart = onboardingData.cart || [];
  const rentCart = onboardingData.rentCart || [];
  
  const buyItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const rentItemCount = rentCart.length;
  const totalItemCount = buyItemCount + rentItemCount;

  const buySubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const rentSubtotal = rentCart.reduce((total, item) => total + item.pricePerDay, 0);

  const handleCheckout = () => {
    router.push('/dashboard/checkout');
  };
  
  const handleRentCheckout = () => {
    router.push('/dashboard/rent-checkout');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {totalItemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Items</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="buy" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">For Purchase ({buyItemCount})</TabsTrigger>
                <TabsTrigger value="rent">For Rent ({rentItemCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="buy" className="flex-1 flex flex-col overflow-hidden mt-2">
                 <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Your purchase cart is empty.</p>
                        </div>
                        ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                <Image src={item.image} alt={item.name} fill className="object-contain" />
                                </div>
                                <div className="flex-1">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    ₹{item.price.toLocaleString()}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                    >
                                    <Minus className="h-3 w-3" />
                                    </Button>
                                    <span>{item.quantity}</span>
                                    <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                    >
                                    <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                            ))}
                        </div>
                        )}
                    </ScrollArea>
                </div>
                 {cart.length > 0 && (
                <SheetFooter className="mt-4 border-t pt-4">
                    <div className="w-full space-y-4">
                    <div className="flex justify-between font-semibold">
                        <span>Subtotal</span>
                        <span>₹{buySubtotal.toLocaleString()}</span>
                    </div>
                    <Button onClick={handleCheckout} className="w-full">
                        Proceed to Checkout
                    </Button>
                    <Button variant="outline" className="w-full" onClick={clearCart}>
                        Clear Purchase Cart
                    </Button>
                    </div>
                </SheetFooter>
                )}
            </TabsContent>
            <TabsContent value="rent" className="flex-1 flex flex-col overflow-hidden mt-2">
                 <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        {rentCart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <CalendarPlus className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Your rental list is empty.</p>
                        </div>
                        ) : (
                        <div className="space-y-4">
                            {rentCart.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                <Image src={item.image} alt={item.name} fill className="object-contain" />
                                </div>
                                <div className="flex-1">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    ₹{item.pricePerDay.toLocaleString()} / day
                                </p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeFromRentCart(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                            ))}
                        </div>
                        )}
                    </ScrollArea>
                </div>
                 {rentCart.length > 0 && (
                <SheetFooter className="mt-4 border-t pt-4">
                    <div className="w-full space-y-4">
                    <div className="flex justify-between font-semibold">
                        <span>Total per day</span>
                        <span>₹{rentSubtotal.toLocaleString()}</span>
                    </div>
                    <Button onClick={handleRentCheckout} className="w-full">
                        Proceed to Booking
                    </Button>
                    <Button variant="outline" className="w-full" onClick={clearRentCart}>
                        Clear Rental List
                    </Button>
                    </div>
                </SheetFooter>
                )}
            </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

    