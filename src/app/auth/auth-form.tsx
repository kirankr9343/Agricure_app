// In src/components/auth/auth-form.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuth, 
  signInWithCustomToken 
} from 'firebase/auth'; // Imports for REAL Email
import { app } from '@/firebase/firebase'; // Your client-side Firebase app
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgricureLogo } from "@/components/icons/logo";
import { OtpInput } from "@/components/ui/otp-input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit } from 'lucide-react';
import { useTranslation } from '@/hooks/use-language';

export function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(app); // Get auth instance

  // --- EMAIL STATE ---
  const [emailStep, setEmailStep] = useState<'entry' | 'otp'>('entry');
  const [email, setEmail] = useState('');
  
  // --- PHONE STATE ---
  const [phoneStep, setPhoneStep] = useState<'entry' | 'otp'>('entry');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // --- SHARED OTP STATE ---
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const isOtpStep = phoneStep === 'otp' || emailStep === 'otp';
    if (isOtpStep && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneStep, emailStep, timer]);

  // --- PHONE HANDLERS (DUMMY VERSION) ---
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
      });
      return;
    }
    setIsLoading(true);
    
    // This is a FAKE 1-second delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setPhoneStep('otp');
    setTimer(60); // Reset timer
    setOtp(''); // Clear OTP field
    toast({
      title: "OTP Sent (TEST MODE)",
      description: `An OTP has been sent to ${countryCode} ${phoneNumber}. (Test code is 123456)`,
    });
  };
  
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ variant: "destructive", title: "Invalid OTP" });
      return;
    }
    setIsLoading(true);

    // This is a FAKE 1-second delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // This is the FAKE check
    if (otp === "123456") { 
      toast({ title: "Success", description: "Phone number verified." });
      // Go to onboarding
      router.push('/onboarding/language');
      // --- We do NOT set isLoading(false) on success, because we are navigating away ---
    } else {
      toast({ 
        variant: "destructive", 
        title: "Invalid OTP",
        description: "The test code is 123456"
      });
      setIsLoading(false); // Only set loading to false on FAILURE
    }
  };

  // --- NEW FUNCTION to handle dummy resend ---
  const handleResendPhoneOtp = async () => {
    setIsLoading(true);
    setOtp(''); 
    
    // This is a FAKE 1-second delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setTimer(60); // Reset timer
    toast({
      title: "OTP Resent (TEST MODE)",
      description: `An OTP has been resent to ${countryCode} ${phoneNumber}. (Test code is 123456)`,
    });
  };

  // --- EMAIL HANDLERS (REAL VERSION) ---
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOtp(''); // Clear OTP field

    try {
      const res = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg); // "Failed to send OTP email..."
      }

      // Success! Move to OTP step
      toast({
        title: "OTP Sent",
        description: data.msg,
      });
      setEmailStep('otp');
      setTimer(60); // Reset timer

    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ variant: "destructive", title: "Invalid OTP" });
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg); // "Invalid OTP", "OTP expired", "User already verified"
      }

      // --- FIX: Go to onboarding, DO NOT log in ---
      toast({ title: "Success!", description: "Email verified." });
      
      // We removed the `signInWithCustomToken` line
      
      // Go to onboarding
      router.push('/onboarding/language'); 
      
      // --- FIX: We do NOT set isLoading(false) on success, because we are navigating away ---

    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
      setIsLoading(false); // Only set loading to false on FAILURE
    }
  };

  // --- NEW FUNCTION to handle real resend ---
  const handleResendEmailOtp = async () => {
    setIsLoading(true);
    setOtp(''); 

    try {
      const res = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg); 
      }

      // Success!
      toast({
        title: "OTP Resent",
        description: data.msg,
      });
      setTimer(60); // Reset timer

    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to reset the form
  const resetEmailForm = () => {
    setEmailStep('entry');
    setOtp('');
  }

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm">
      <CardHeader className="items-center text-center">
        <AgricureLogo className="h-40 w-40 text-primary mb-4" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phone">{t('auth.phone')}</TabsTrigger>
            <TabsTrigger value="email">{t('auth.email')}</TabsTrigger>
          </TabsList>
          
          {/* --- PHONE TAB (DUMMY) --- */}
          <TabsContent value="phone">
            {/* We removed the <div id="recaptcha-container"> */}
            {phoneStep === 'entry' ? (
              <form onSubmit={handleSendPhoneOtp}>
                <CardContent className="p-0 pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('auth.phoneNumber')}</Label>
                    <div className="flex gap-2">
                      <Select defaultValue="+91" onValueChange={setCountryCode}>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="+91" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+91">IN +91</SelectItem>
                          <SelectItem value="+1">US +1</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="9876543210" 
                        maxLength={10} 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.sendOtp')}
                  </Button>
                </CardContent>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp}>
                <CardContent className="p-0 pt-6 space-y-4">
                  <div className="text-center text-sm text-muted-foreground">
                    <p>{t('auth.enterOtp')}</p>
                    <div className="font-semibold text-foreground flex items-center justify-center gap-2">
                      <span>{countryCode} {phoneNumber}</span>
                      {/* --- THIS IS THE FIX --- */}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => {setPhoneStep('entry'); setOtp('')}}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <OtpInput value={otp} onChange={setOtp} length={6} />
                  </div>
                  <div className="text-center text-sm">
                    {timer > 0 ? (
                      <p className="text-muted-foreground">{t('auth.resendOtpIn', { seconds: timer })}</p>
                    ) : (
                      <Button 
                        type="button" 
                        variant="link" 
                        size="sm" 
                        onClick={handleResendPhoneOtp} 
                        disabled={isLoading}
                      >
                        {t('auth.resendOtp')}
                      </Button>
                    )}
                  </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.verifyOtp')}
                  </Button>
                </CardContent>
              </form>
            )}
          </TabsContent>
          
          {/* --- EMAIL TAB (REAL) --- */}
          <TabsContent value="email">
            {emailStep === 'entry' ? (
              // STEP 1: Email Entry Form
              <form onSubmit={handleSendEmailOtp}>
                <CardContent className="p-0 pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="farmer@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.sendOtp')}
                  </Button>
                </CardContent>
              </form>
            ) : (
              // STEP 2: Email OTP Form
              <form onSubmit={handleVerifyEmailOtp}>
                <CardContent className="p-0 pt-6 space-y-4">
                  <div className="text-center text-sm text-muted-foreground">
                    <p>{t('auth.enterOtp')}</p>
                    <div className="font-semibold text-foreground flex items-center justify-center gap-2">
                      <span>{email}</span>
                      {/* --- THIS IS THE FIX --- */}
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={resetEmailForm}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <OtpInput value={otp} onChange={setOtp} length={6} />
                  </div>
                  <div className="text-center text-sm">
                    {timer > 0 ? (
                      <p className="text-muted-foreground">{t('auth.resendOtpIn', { seconds: timer })}</p>
                    ) : (
                      <Button 
                        type="button" 
                        variant="link" 
                        size="sm" 
                        onClick={handleResendEmailOtp} 
                        disabled={isLoading}
                      >
                        {t('auth.resendOtp')}
                      </Button>
                    )}
                  </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.verifyOtp')}
                  </Button>
                </CardContent>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4">
        {/* ... Footer (Unchanged) ... */}
        <p className="text-sm text-muted-foreground">{t('onboarding.step', { current: 1, total: 4 })}</p>
        <div className="w-full bg-muted rounded-full h-1.5 dark:bg-muted/30">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: "25%" }}
          />
        </div>
      </CardFooter>
    </Card>
  );
}