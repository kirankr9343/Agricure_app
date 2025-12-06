
"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useLanguage, useTranslation, languages } from "@/hooks/use-language";

export default function LanguagePage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLanguage(selectedLanguage);
    
    setTimeout(() => {
      router.push("/onboarding/profile");
    }, 500);
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-2xl font-headline font-bold">
          {t('onboarding.language.title')}
        </CardTitle>
        <CardDescription>
          {t('onboarding.language.description')}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedLanguage} value={selectedLanguage} required>
            <SelectTrigger>
              <SelectValue placeholder={t('onboarding.language.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full" disabled={isLoading || !selectedLanguage}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('continue')}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <p className="text-sm text-muted-foreground">{t('onboarding.step', { current: 1, total: 7 })}</p>
        <div className="w-full bg-muted rounded-full h-1.5 dark:bg-muted/30">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${1 * 100 / 7}%` }}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
