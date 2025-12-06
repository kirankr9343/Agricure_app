
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarCheck2, Repeat, XCircle, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";
import { useAppState, Booking } from "@/hooks/use-app-state";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const BookingCard = ({ booking }: { booking: Booking }) => {
    
    const canCancel = booking.status === 'Confirmed';

    return (
    <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-muted/50 p-4">
            <div className="grid gap-1 text-sm">
                <div className="font-semibold">Booking ID: {booking.id}</div>
                <div className="text-muted-foreground">Booked On: {booking.date}</div>
            </div>
            <div className="flex items-center gap-4">
                <Badge variant={booking.status === 'Completed' ? 'secondary' : booking.status === 'Cancelled' ? 'destructive' : 'outline'} className={`text-base ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}`}>
                    {booking.status}
                </Badge>
                 <div className="font-bold text-lg">₹{booking.total.toLocaleString()}</div>
            </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 grid gap-6">
            <div className="space-y-4">
                {booking.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                         <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                            <Image src={item.image} alt={item.name} fill className="object-contain" />
                        </div>
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">₹{item.pricePerDay.toLocaleString()} / day</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <Separator />

             <div className="grid md:grid-cols-2 gap-6 text-sm">
                 <div className="space-y-2">
                    <h3 className="font-semibold">Rental Period</h3>
                    <p><strong>Start:</strong> {booking.rentalStartDate}</p>
                    <p><strong>End:</strong> {booking.rentalEndDate}</p>
                    <p><strong>Duration:</strong> {booking.rentalDuration} days</p>
                 </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Pickup Information</h3>
                     <p>{booking.shipping.name}</p>
                     <p>{booking.shipping.address}</p>
                     <p>{booking.shipping.city}, {booking.shipping.state} - {booking.shipping.pincode}</p>
                 </div>
            </div>

            {booking.cancellationReason && (
                 <>
                    <Separator />
                    <div className="space-y-2 text-sm">
                        <h3 className="font-semibold text-destructive">Reason for Cancellation</h3>
                        <p className="text-muted-foreground">{booking.cancellationReason}</p>
                    </div>
                </>
            )}
            
        </CardContent>
        <CardFooter className="bg-muted/50 p-4 justify-end gap-2">
             {canCancel && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                        </Button>
                    </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This will cancel your equipment booking. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Go Back</AlertDialogCancel>
                            <AlertDialogAction>Confirm Cancellation</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              )}
        </CardFooter>
    </Card>
    )
};

export default function BookingsPage() {
  const { onboardingData } = useAppState();
  const router = useRouter();
  const allBookings = onboardingData.bookings || [];

  const activeBookings = allBookings.filter(booking => booking.status !== 'Completed' && booking.status !== 'Cancelled');
  const pastBookings = allBookings.filter(booking => booking.status === 'Completed' || booking.status === 'Cancelled');
  
  if (allBookings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold">No Bookings Yet</h1>
            <p className="text-muted-foreground">You haven't rented any equipment.</p>
            <Button onClick={() => router.push('/dashboard/equipment')} className="mt-4">
                Rent Equipment Now
            </Button>
        </div>
      )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">View your equipment rental history and manage upcoming bookings.</p>
      </div>
        
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="active">Active & Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-8 mt-6">
          {activeBookings.length > 0 ? (
            activeBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                You have no active or upcoming bookings.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="past" className="space-y-8 mt-6">
          {pastBookings.length > 0 ? (
            pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                You have no past bookings.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

    