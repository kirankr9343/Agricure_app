
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube2, CheckCircle, ListChecks, Phone, MapPin, Loader2, AlertCircle, Sprout } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { getSoilTestingLabs } from "@/ai/flows/get-soil-testing-labs";
import { getSoilInformation, GetSoilInformationOutput } from "@/ai/flows/get-soil-information";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/hooks/use-language";

type Lab = {
  name: string;
  city: string;
  phone: string;
  address: string;
};

const fallbackAgencies: Lab[] = [
    { name: "National Agro Foundation - Soil Testing Lab", city: "Chennai, Tamil Nadu", phone: "044-2222-3333", address: "123 Agri Street, Guindy" },
    { name: "Krishi Vigyan Kendra (KVK) Soil Lab", city: "Pune, Maharashtra", phone: "020-1122-4455", address: "456 Farm Road, Shivaji Nagar" },
    { name: "Indian Agricultural Research Institute (IARI) Lab", city: "New Delhi, Delhi", phone: "011-9988-7766", address: "Pusa Campus, Hillside Road" },
    { name: "Punjab Agricultural University (PAU) Soil Testing", city: "Ludhiana, Punjab", phone: "0161-5544-3322", address: "PAU Campus, Ferozepur Road" },
    { name: "TNAU Soil and Water Testing Laboratory", city: "Coimbatore, Tamil Nadu", phone: "0422-7788-9900", address: "TNAU Campus, Lawley Road" },
    { name: "Agri-Tech Solutions Pvt. Ltd.", city: "Hyderabad, Telangana", phone: "040-6655-8899", address: "789 Tech Park, Hitech City" }
];

const InfoCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-3 bg-primary/10 rounded-full">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export default function SoilHealthPage() {
  const { onboardingData } = useAppState();
  const { language } = useLanguage();
  const [agencies, setAgencies] = useState<Lab[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  const [errorAgencies, setErrorAgencies] = useState<string | null>(null);

  const [soilInfo, setSoilInfo] = useState<GetSoilInformationOutput | null>(null);
  const [loadingSoilInfo, setLoadingSoilInfo] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      if (!onboardingData.district || !onboardingData.state) {
        setAgencies(fallbackAgencies);
        setLoadingAgencies(false);
        return;
      }

      try {
        setLoadingAgencies(true);
        const result = await getSoilTestingLabs({ location: `${onboardingData.district}, ${onboardingData.state}` });
        if (result.labs && result.labs.length > 0) {
          setAgencies(result.labs);
        } else {
          setAgencies(fallbackAgencies);
        }
      } catch (e: any) {
        console.error("Failed to fetch soil testing labs:", e);
        setErrorAgencies("Could not fetch local agencies. Displaying a general list.");
        setAgencies(fallbackAgencies);
      } finally {
        setLoadingAgencies(false);
      }
    };

    const fetchSoilInfo = async () => {
      if (onboardingData.soilType) {
        try {
          setLoadingSoilInfo(true);
          const result = await getSoilInformation({ 
            soilType: onboardingData.soilType,
            preferredLanguage: language,
          });
          setSoilInfo(result);
        } catch (e) {
          console.error("Failed to fetch soil information:", e);
          setSoilInfo(null);
        } finally {
          setLoadingSoilInfo(false);
        }
      } else {
        setLoadingSoilInfo(false);
      }
    };

    fetchAgencies();
    fetchSoilInfo();
  }, [onboardingData.district, onboardingData.state, onboardingData.soilType, language]);


  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Soil Health & Testing</h1>
        <p className="text-muted-foreground">Understand your soil to boost your yield.</p>
      </div>
      
      {onboardingData.soilType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary"/>
              About Your Soil: {onboardingData.soilType}
            </CardTitle>
            <CardDescription>A summary of your primary soil type's characteristics and needs.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSoilInfo ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading soil analysis...</p>
              </div>
            ) : soilInfo ? (
              <div className="space-y-6">
                  <div>
                      <h4 className="font-semibold text-lg mb-2">Characteristics</h4>
                      <p className="text-muted-foreground">{soilInfo.characteristics}</p>
                  </div>
                   <div>
                      <h4 className="font-semibold text-lg mb-2">Suitable Crops</h4>
                      <p className="text-muted-foreground">{soilInfo.suitableCrops}</p>
                  </div>
                   <div>
                      <h4 className="font-semibold text-lg mb-2">Nutrient Recommendations</h4>
                      <p className="text-muted-foreground">{soilInfo.nutrientRecommendations}</p>
                  </div>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Could Not Load Analysis</AlertTitle>
                <AlertDescription>We couldn't retrieve information for your soil type at this moment.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
          <InfoCard 
            icon={TestTube2}
            title="Why Test Your Soil?"
            description="Soil testing is like a health check-up for your farm. It reveals vital information about nutrient levels (N, P, K), pH, and organic matter, helping you make informed decisions for fertilizer application and crop selection."
          />
          <InfoCard 
            icon={CheckCircle}
            title="Benefits of Soil Testing"
            description="Optimize fertilizer use to save money, increase crop yields and quality, improve soil health for the long term, and protect the environment by preventing nutrient runoff."
          />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Soil Testing Procedure</CardTitle>
          <CardDescription>Follow these steps to collect a proper soil sample.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>**Select the Area:** Choose a uniform area of your farm. If you have different types of soil or slopes, take separate samples for each area.</li>
            <li>**Use the Right Tool:** Use a soil auger, tube, or a shovel/spade to collect the sample. Clean the tools before use.</li>
            <li>**Collect Samples:** Scrape away surface litter. Make a 'V' shaped cut about 15 cm (6 inches) deep. Collect a slice of soil from top to bottom.</li>
            <li>**Mix Samples:** Take 10-15 such samples from random spots in a zig-zag pattern across the field. Mix them thoroughly in a clean bucket.</li>
            <li>**Prepare Final Sample:** From the mixed soil, take about half a kilogram (500g) as your final sample. Let it air dry in the shade (never in direct sun).</li>
            <li>**Package and Label:** Put the dried sample in a clean cloth or plastic bag. Label it clearly with your name, address, farm details, and the crops you plan to grow.</li>
            <li>**Send to Lab:** Send the sample to your nearest soil testing laboratory.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Soil Testing Agencies Near You</CardTitle>
          <CardDescription>Contact one of these laboratories in or near {onboardingData.district} to get your soil tested.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          {loadingAgencies ? (
            <div className="col-span-full flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Finding labs near you...</p>
            </div>
          ) : errorAgencies ? (
             <div className="col-span-full">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorAgencies}</AlertDescription>
                </Alert>
             </div>
          ) : (
            agencies.map((agency) => (
              <Card key={agency.name} className="p-4">
                <CardTitle className="text-lg">{agency.name}</CardTitle>
                <CardDescription>{agency.city}</CardDescription>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>{agency.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{agency.phone}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
