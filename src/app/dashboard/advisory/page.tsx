
"use client";

import { useState, useEffect } from 'react';
import { Loader2, CloudRain, Leaf, BarChart, Shield } from "lucide-react";
import { getPersonalizedAdvisoryDashboard, PersonalizedAdvisoryDashboardOutput } from '@/ai/flows/personalized-advisory-dashboard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage, useTranslation } from '@/hooks/use-language';
import { useAppState } from '@/hooks/use-app-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AdvisoryCard = ({ title, icon: Icon, content }: { title: string; icon: React.ElementType; content: string }) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-primary">{title}</CardTitle>
            <Icon className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <Separator className="mb-4" />
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                <p>{content || "Not available."}</p>
            </div>
        </CardContent>
    </Card>
);

export default function AdvisoryPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { onboardingData } = useAppState();
  const [advisory, setAdvisory] = useState<PersonalizedAdvisoryDashboardOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allCrops = [...(onboardingData.primaryCrops || []), ...(onboardingData.secondaryCrops || [])];

  useEffect(() => {
    const fetchAdvisory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const input = {
          farmLocation: onboardingData.district && onboardingData.state ? `${onboardingData.district}, ${onboardingData.state}` : "Punjab, India",
          soilType: onboardingData.soilType || "Loamy",
          crops: allCrops.length > 0 ? allCrops.map(c => `${c.name} (Season: ${c.season})`) : ["Wheat (Season: Rabi)"],
          preferredLanguage: language,
        };

        const result = await getPersonalizedAdvisoryDashboard(input);
        setAdvisory(result);
      } catch (e: any) {
        if (e.message && e.message.includes('503')) {
          setError(t('dashboard.advisory.error.overloaded'));
        } else {
          setError(t('dashboard.advisory.error.failed'));
        }
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (allCrops.length > 0) {
      fetchAdvisory();
    } else {
      setLoading(false);
    }
  }, [language, onboardingData, t, allCrops]);

  if (allCrops.length === 0 && !loading) {
    return (
       <Alert>
          <AlertTitle>{t('dashboard.advisory.noCropsTitle')}</AlertTitle>
          <AlertDescription>{t('dashboard.advisory.noCropsDescription')}</AlertDescription>
        </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.advisory.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.advisory.description', { crops: allCrops.map(c => c.name).join(', ') })}</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">{t('dashboard.advisory.loading')}</p>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>{t('dashboard.advisory.error.title')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && advisory && (
        <div className="grid gap-6 md:grid-cols-2">
            <AdvisoryCard title={t('dashboard.advisory.weather.title')} icon={CloudRain} content={advisory.weatherAdvisory} />
            <AdvisoryCard title={t('dashboard.advisory.soil.title')} icon={Leaf} content={advisory.soilConditionAdvisory} />
            <AdvisoryCard title={t('dashboard.advisory.market.title')} icon={BarChart} content={advisory.marketPriceAdvisory} />
            <AdvisoryCard title={t('dashboard.advisory.disease.title')} icon={Shield} content={advisory.diseaseRiskAdvisory} />
        </div>
      )}
    </div>
  );
}
