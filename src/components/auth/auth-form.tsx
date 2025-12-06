
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { useAppState } from '@/hooks/use-app-state';

export function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setOnboardingData } = useAppState();
  
  const [phoneStep, setPhoneStep] = useState<'entry' | 'otp'>('entry');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phoneStep === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneStep, timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast({
        variant: "destructive",
        title: t('auth.toast.invalidPhoneTitle'),
        description: t('auth.toast.invalidPhoneDescription'),
      });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setPhoneStep('otp');
    setTimer(60); // Reset timer
    toast({
      title: t('auth.toast.otpSentTitle'),
      description: t('auth.toast.otpSentDescription', { phone: `${countryCode} ${phoneNumber}` }),
    });
  };
  
  const verifyOtp = async (currentOtp: string) => {
    if (isVerified) return; // Prevent re-verification
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    if (currentOtp === "123456" || currentOtp.length === 6) { // Mock success
      setIsVerified(true);
      toast({
        title: t('auth.toast.verificationSuccessTitle'),
        description: t('auth.toast.verificationSuccessDescription'),
      });
      setOnboardingData({ contactNumber: `${countryCode}${phoneNumber}` });
      router.push('/onboarding/language');
    } else {
      toast({
        variant: "destructive",
        title: t('auth.toast.invalidOtpTitle'),
        description: t('auth.toast.invalidOtpDescription'),
      });
    }
  }
  
  const handleOtpSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (otp.length !== 6) {
          toast({
              variant: "destructive",
              title: t('auth.toast.invalidOtpTitle'),
              description: t('auth.toast.invalidOtpLengthDescription'),
          });
          return;
      }
      await verifyOtp(otp);
  };
  
  const handleOtpComplete = async (completedOtp: string) => {
      setOtp(completedOtp);
      await verifyOtp(completedOtp);
  };


  const handleSendLoginLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: t('auth.toast.loginLinkSentTitle'),
      description: t('auth.toast.loginLinkSentDescription', { email }),
    });
    setOnboardingData({ emailAddress: email });
    router.push('/onboarding/language');
  }
  
  return (
    <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm shadow-2xl">
       <CardHeader className="items-center text-center pb-4">
        <AgricureLogo className="h-28 w-28 text-primary mb-2" />
        <div className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">{t('Agricure')}</CardTitle>
          <CardDescription className="text-muted-foreground">{t('Your personal farming companion')}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phone">{t('auth.phone')}</TabsTrigger>
            <TabsTrigger value="email">{t('auth.email')}</TabsTrigger>
          </TabsList>
          <TabsContent value="phone">
              <div id="recaptcha-container" className='my-2'></div>
                {phoneStep === 'entry' ? (
                  <form onSubmit={handleSendOtp}>
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
                  <form onSubmit={handleOtpSubmit}>
                  <CardContent className="p-0 pt-6 space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                      <p>{t('auth.enterOtp')}</p>
                      <div className="font-semibold text-foreground flex items-center justify-center gap-2">
                        <span>{countryCode} {phoneNumber}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setPhoneStep('entry'); setOtp(''); }}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otp">OTP</Label>
                      <OtpInput value={otp} onChange={setOtp} length={6} onComplete={handleOtpComplete} />
                    </div>
                    <div className="text-center text-sm">
                      {timer > 0 ? (
                        <p className="text-muted-foreground">{t('auth.resendOtpIn', { seconds: timer })}</p>
                      ) : (
                        <Button variant="link" size="sm" onClick={(e) => { e.preventDefault(); handleSendOtp(new Event('submit') as any); }} disabled={isLoading}>
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
          <TabsContent value="email">
            <form onSubmit={handleSendLoginLink}>
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
                  {t('auth.signInSignUp')}
                </Button>
              </CardContent>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
