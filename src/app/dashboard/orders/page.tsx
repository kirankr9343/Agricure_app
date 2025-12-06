
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Truck, Package, PackageCheck, Home, CheckCircle, FileText, Repeat, XCircle } from "lucide-react";
import Image from "next/image";
import { useAppState } from "@/hooks/use-app-state";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/hooks/use-app-state";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


const getTrackingProgress = (status: 'Placed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled') => {
    switch(status) {
        case 'Placed': return 25;
        case 'Shipped': return 50;
        case 'Out for Delivery': return 75;
        case 'Delivered': return 100;
        default: return 0;
    }
}
const trackingSteps = ['Placed', 'Shipped', 'Out for Delivery', 'Delivered'];

const CancelOrderDialog = ({ orderId }: { orderId: string }) => {
    const { cancelOrder } = useAppState();
    const { toast } = useToast();
    const [reason, setReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    const handleCancel = () => {
        const finalReason = reason === 'other' ? otherReason : reason;
        if (!finalReason) {
            toast({
                variant: 'destructive',
                title: "Reason Required",
                description: "Please provide a reason for cancellation."
            });
            return;
        }
        cancelOrder(orderId, finalReason);
        toast({
            title: "Order Cancelled",
            description: `Order ${orderId} has been cancelled.`
        });
    };

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. Please provide a reason for cancellation.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
                <RadioGroup value={reason} onValueChange={setReason}>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Ordered by mistake" id="r1" /><Label htmlFor="r1">Ordered by mistake</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Item not required anymore" id="r2" /><Label htmlFor="r2">Item not required anymore</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Incorrect item or quantity" id="r3" /><Label htmlFor="r3">Incorrect item or quantity</Label></div>
                     <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="r4" /><Label htmlFor="r4">Other</Label></div>
                </RadioGroup>
                {reason === 'other' && (
                    <Textarea 
                        placeholder="Please specify your reason..." 
                        value={otherReason} 
                        onChange={(e) => setOtherReason(e.target.value)} 
                    />
                )}
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Go Back</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel} disabled={!reason || (reason === 'other' && !otherReason)}>Confirm Cancellation</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}


const OrderCard = ({ order }: { order: Order }) => {
    const { reorder } = useAppState();
    const { toast } = useToast();
    const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);

    const handleReorder = () => {
        reorder(order.id);
        toast({
            title: "Items Added to Cart",
            description: `All items from order ${order.id} have been added to your cart.`
        });
    };
    
    const canCancel = order.status === 'Placed';

    return (
    <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-muted/50 p-4">
            <div className="grid gap-1 text-sm">
                <div className="font-semibold">Order ID: {order.id}</div>
                <div className="text-muted-foreground">Date: {order.date}</div>
            </div>
            <div className="flex items-center gap-4">
                <Badge variant={order.status === 'Delivered' ? 'secondary' : order.status === 'Cancelled' ? 'destructive' : 'outline'} className={`text-base ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}`}>
                    {order.status}
                </Badge>
                 <div className="font-bold text-lg">₹{order.total.toLocaleString()}</div>
            </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 grid gap-6">
            <div className="space-y-4">
                {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                         <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                            <Image src={item.image} alt={item.name} fill className="object-contain" />
                        </div>
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity} x ₹{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
            {order.cancellationReason && (
                 <>
                    <Separator />
                    <div className="space-y-2 text-sm">
                        <h3 className="font-semibold text-destructive">Reason for Cancellation</h3>
                        <p className="text-muted-foreground">{order.cancellationReason}</p>
                    </div>
                </>
            )}
            <Separator />
            <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Shipping Information</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p className="flex items-start gap-2"><Home className="h-4 w-4 mt-0.5" /><span>{order.shipping.address}, {order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}</span></p>
                        <p><strong>Tracking #:</strong> {order.shipping.trackingNumber}</p>
                        <p><strong>Estimated Delivery:</strong> {order.shipping.estimatedDelivery}</p>
                    </div>
                </div>
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Order Tracking</h3>
                        <div className="relative pt-2">
                            <Progress value={getTrackingProgress(order.status)} className="h-2" />
                            <div className="absolute top-8 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                                {trackingSteps.map((step, index) => {
                                    const stepProgress = (index + 1) * 25;
                                    const isCompleted = getTrackingProgress(order.status) >= stepProgress;
                                    return (
                                        <div key={step} className="flex flex-col items-center text-center w-20">
                                            <div className={`h-5 w-5 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-primary border-primary' : 'bg-muted border-border'}`}>
                                                {isCompleted && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                                            </div>
                                            <span className={`mt-1 font-medium ${isCompleted ? 'text-foreground' : ''}`}>{step}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CardContent>
        <CardFooter className="bg-muted/50 p-4 justify-end gap-2">
             <Button variant="secondary" onClick={handleReorder}>
                <Repeat className="mr-2 h-4 w-4" /> Order Again
             </Button>
             <Button variant="outline" asChild>
                <Link href={`/dashboard/orders/invoice/${order.id}`}>
                    <FileText className="mr-2 h-4 w-4" /> View Invoice
                </Link>
             </Button>
             {order.status !== 'Delivered' && order.status !== 'Cancelled' &&
                <Button asChild>
                    <Link href={`/dashboard/orders/track/${order.id}`}>
                         <Truck className="mr-2 h-4 w-4" /> Track Order
                    </Link>
                </Button>
             }
              {canCancel && (
                <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                        </Button>
                    </AlertDialogTrigger>
                    <CancelOrderDialog orderId={order.id} />
                </AlertDialog>
              )}
        </CardFooter>
    </Card>
    )
};

export default function OrdersPage() {
  const { onboardingData } = useAppState();
  const router = useRouter();
  const allOrders = onboardingData.orders || [];

  const ongoingOrders = allOrders.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled');
  const deliveredOrders = allOrders.filter(order => order.status === 'Delivered');
  const cancelledOrders = allOrders.filter(order => order.status === 'Cancelled');

  if (allOrders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold">No Orders Yet</h1>
            <p className="text-muted-foreground">You haven't placed any orders.</p>
            <Button onClick={() => router.push('/dashboard/marketplace')} className="mt-4">
                Shop Now
            </Button>
        </div>
      )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">View your order history and track shipments.</p>
      </div>
        
      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="delivered">Previously Ordered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing" className="space-y-8 mt-6">
          {ongoingOrders.length > 0 ? (
            ongoingOrders.map(order => <OrderCard key={order.id} order={order} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                You have no ongoing orders.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="delivered" className="space-y-8 mt-6">
          {deliveredOrders.length > 0 ? (
            deliveredOrders.map(order => <OrderCard key={order.id} order={order} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                You have no previously delivered orders.
              </CardContent>
            </Card>
          )}
        </TabsContent>
         <TabsContent value="cancelled" className="space-y-8 mt-6">
          {cancelledOrders.length > 0 ? (
            cancelledOrders.map(order => <OrderCard key={order.id} order={order} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                You have no cancelled orders.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
