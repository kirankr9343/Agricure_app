
"use client";

import { useAppState } from "@/hooks/use-app-state";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { AgricureLogo } from "@/components/icons/logo";

export default function InvoicePage() {
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

    const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.05; // Assuming 5% tax

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
                </Button>
                 <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" /> Print Invoice
                </Button>
            </div>

            <Card className="print:shadow-none print:border-none">
                <CardHeader className="grid grid-cols-2 gap-4">
                    <div>
                        <AgricureLogo className="h-20 w-20" />
                        <h2 className="text-2xl font-bold mt-2">Agricure Inc.</h2>
                        <p className="text-muted-foreground">123 Agri Lane, Farmville, India</p>
                    </div>
                    <div className="text-right">
                        <CardTitle className="text-4xl text-muted-foreground">INVOICE</CardTitle>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-muted-foreground">Date: {order.date}</p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Bill To:</h3>
                            <div className="text-sm text-muted-foreground">
                                <p>{order.shipping.name}</p>
                                <p>{order.shipping.address}</p>
                                <p>{order.shipping.city}, {order.shipping.state} {order.shipping.pincode}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50%]">Item</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">₹{item.price.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">₹{(item.price * item.quantity).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-full max-w-sm space-y-2">
                             <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Taxes (5%)</span>
                                <span>₹{tax.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="text-center text-xs text-muted-foreground">
                    Thank you for your business!
                </CardFooter>
            </Card>
        </div>
    );
}

