
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Camera } from "lucide-react";
import { useTranslation } from "@/hooks/use-language";
import { useAppState } from "@/hooks/use-app-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { onboardingData, setOnboardingData } = useAppState();
  
  const [name, setName] = useState(onboardingData.name === "New Farmer" ? "" : onboardingData.name);
  const [dob, setDob] = useState<Date | undefined>(onboardingData.dob ? new Date(onboardingData.dob) : undefined);
  const [gender, setGender] = useState(onboardingData.gender);
  const [profilePicture, setProfilePicture] = useState(onboardingData.profilePictureUrl);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        setProfilePicture(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOnboardingData({ 
        name, 
        dob: dob?.toISOString(),
        gender,
        profilePictureUrl: profilePicture
    });
    setTimeout(() => {
      router.push("/onboarding/location");
    }, 500);
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-2xl font-headline font-bold">
          {t('onboarding.profile.title')}
        </CardTitle>
        <CardDescription>
          {t('onboarding.profile.description')}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
             <div className="relative">
                <Avatar className="h-32 w-32">
                    <AvatarImage src={profilePicture} alt={name} />
                    <AvatarFallback>
                        <User className="h-16 w-16" />
                    </AvatarFallback>
                </Avatar>
                <Button 
                    type="button"
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-1 right-1 rounded-full h-10 w-10 bg-background/80"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Camera className="h-5 w-5" />
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handlePictureUpload}
                />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('onboarding.profile.fullName')}</Label>
              <Input
                id="name"
                placeholder={t('onboarding.profile.fullNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">{t('onboarding.profile.dob')}</Label>
                  <DatePicker date={dob} setDate={setDob} placeholder={t('onboarding.profile.dobPlaceholder')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">{t('onboarding.profile.gender')}</Label>
                    <Select value={gender} onValueChange={(v) => setGender(v as any)}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder={t('onboarding.profile.genderPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">{t('onboarding.profile.genderMale')}</SelectItem>
                        <SelectItem value="Female">{t('onboarding.profile.genderFemale')}</SelectItem>
                        <SelectItem value="Other">{t('onboarding.profile.genderOther')}</SelectItem>
                        <SelectItem value="Prefer not to say">{t('onboarding.profile.genderPreferNotToSay')}</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !name || !dob}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('continue')}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <p className="text-sm text-muted-foreground">{t('onboarding.step', { current: 2, total: 7 })}</p>
        <div className="w-full bg-muted rounded-full h-1.5 dark:bg-muted/30">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${2 * 100 / 7}%` }}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
