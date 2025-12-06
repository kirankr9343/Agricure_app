
"use client";

import { useAppState } from "@/hooks/use-app-state";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Package, Truck, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock tracking history generation based on order status
const generateTrackingHistory = (status: 'Placed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled', date: string) => {
    const history = [
        { status: 'Placed', description: 'Your order has been placed successfully.', date, icon: CheckCircle, completed: false },
        { status: 'Shipped', description: 'Your package has been shipped from the warehouse.', date: '...', icon: Package, completed: false },
        { status: 'Out for Delivery', description: 'Your package is out for delivery with our courier partner.', date: '...', icon: Truck, completed: false },
        { status: 'Delivered', description: 'Your package has been delivered.', date: '...', icon: Home, completed: false }
    ];

    const statusIndex: Record<string, number> = { 'Placed': 0, 'Shipped': 1, 'Out for Delivery': 2, 'Delivered': 3 };
    const currentIndex = status === 'Cancelled' ? -1 : statusIndex[status];

    const baseDate = new Date(date);

    return history.map((item, index) => {
        if (currentIndex >= 0 && index <= currentIndex) {
            const eventDate = new Date(baseDate.setDate(baseDate.getDate() + (index > 0 ? 1 : 0)));
             return {
                ...item,
                completed: true,
                date: eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            };
        }
        return item;
    });
};


export default function TrackOrderPage() {
    const { onboardingData } = useAppState();
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;

    const order = onboardingData.orders.find(o => o.id === orderId);

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-2xl font-bold">Order Not Found</h1>
                <p className="text-muted-foreground">The requested order could not be found.</p>
                <Button onClick={() => router.back()} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }
    
    const trackingHistory = generateTrackingHistory(order.status, order.date);

    return (
        <div className="max-w-4xl mx-auto">
             <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Track Your Order</CardTitle>
                    <CardDescription>
                        Order ID: {order.id} | Tracking #: {order.shipping.trackingNumber}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6">
                         {/* Timeline line */}
                        <div className="absolute left-[35px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                        
                        <div className="space-y-8">
                            {trackingHistory.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className={cn(
                                        "z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                                        item.completed ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-muted-foreground"
                                    )}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className={cn("pt-1", item.completed ? "font-semibold" : "text-muted-foreground")}>
                                        <p>{item.status}</p>
                                        <p className="text-sm">{item.description}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                 <CardFooter>
                    <p className="text-sm text-muted-foreground">Estimated Delivery: {order.shipping.estimatedDelivery}</p>
                </CardFooter>
            </Card>
        </div>
    );
}

