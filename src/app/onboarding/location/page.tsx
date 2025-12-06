"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
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
import { Loader2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-language";
import { useAppState } from "@/hooks/use-app-state";
// Server flows are called via API routes to avoid Server Actions errors.
import { useDebounce } from "@/hooks/use-debounce";
// validateDistrict is called via API route

// Dynamically import the MapPicker to prevent SSR errors
const MapPicker = dynamic(() => import('@/components/maps/map-picker'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse rounded-md" />
});

type Suggestion = { fullAddress?: string; village?: string; district?: string; state?: string; pincode?: string; latitude: number; longitude: number };

export default function LocationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { onboardingData, setOnboardingData } = useAppState();
  
  // Form state, initialized from global app state
  const [gpsCoordinates, setGpsCoordinates] = useState(onboardingData.gpsCoordinates || "");
  const [country, setCountry] = useState(onboardingData.country || "India");
  const [state, setState] = useState(onboardingData.state || "");
  const [district, setDistrict] = useState(onboardingData.district || "");
  const [village, setVillage] = useState(onboardingData.village || "");
  const [pincode, setPincode] = useState(onboardingData.pincode || "");
  
  // Component loading/UI state
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState<[number, number] | null>(
    onboardingData.gpsCoordinates ? 
    [parseFloat(onboardingData.gpsCoordinates.split(',')[0]), parseFloat(onboardingData.gpsCoordinates.split(',')[1])] : 
    null
  );

  // Address suggestion state
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const debouncedVillage = useDebounce(village, 300);
  const debouncedDistrict = useDebounce(district, 500);

  // Fetches address from coordinates (used by map drag and detect location)
  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    setIsDetecting(true); // Show loader on button
    try {
      const res = await fetch('/api/reverse-geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude }),
      });
      const json = await res.json();
      const address = json.address;
      if (address) {
        setState(address.state);
        setDistrict(address.district);
        setVillage(address.village);
        setPincode(address.pincode);
        toast({
          title: t('location.toast.title'),
          description: `${address.village}, ${address.district}, ${address.state}`
        })
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      toast({
        variant: "destructive",
        title: "Could not fetch address",
        description: "Failed to get address details. You can enter them manually.",
      });
    } finally {
      setIsDetecting(false);
    }
  }

  // Handles the "Use My Current Location" button click
  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: t('location.toast.notSupported'),
      });
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const detectedLocation = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setGpsCoordinates(detectedLocation);
        setCoords([latitude, longitude]);
        getAddressFromCoordinates(latitude, longitude); // Fetch address for new coords
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          variant: "destructive",
          title: t('location.toast.errorTitle'),
          description: t('location.toast.errorMessage'),
        });
        setIsDetecting(false);
      }
    );
  }, [toast, t]); // Dependencies for useCallback

  // Automatically detect location on page load if no data is present
  useEffect(() => {
    if (!onboardingData.gpsCoordinates && !onboardingData.state) {
        handleDetectLocation();
    }
  }, [handleDetectLocation, onboardingData.gpsCoordinates, onboardingData.state]);

  // Fetches address suggestions as the user types in the "Village" field
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedVillage && debouncedVillage.length > 2) {
        setIsSuggesting(true);
        try {
          // --- THIS IS THE FIX ---
          const res = await fetch('/api/get-address-suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country, query: debouncedVillage }),
          });
          const json = await res.json();
          if (json && Array.isArray(json.suggestions)) {
            setSuggestions(json.suggestions as Suggestion[]);
          } else {
            console.warn('Invalid suggestions response', json);
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsSuggesting(false);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedVillage]); // Runs only when the debounced village value changes
  
  // Validates the district against the state as the user types
  useEffect(() => {
    const checkDistrict = async () => {
        if (debouncedDistrict && state && debouncedDistrict.length > 2) {
            const r = await fetch('/api/validate-district', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ district: debouncedDistrict, state }) });
            const parsed = await r.json();
            const { isValid } = parsed || { isValid: false };
            if (!isValid) {
                toast({
                    variant: 'destructive',
                    title: "Invalid District",
                    description: `District '${debouncedDistrict}' does not seem to belong to the state '${state}'. Please choose a correct one.`,
                });
            }
        }
    };
    checkDistrict();
  }, [debouncedDistrict, state, toast]); // Runs when debounced district or state changes

  // Handles clicking on an address suggestion
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setVillage(suggestion.village);
    setDistrict(suggestion.district);
    setState(suggestion.state);
    setPincode(suggestion.pincode);
    const newCoords: [number, number] = [suggestion.latitude, suggestion.longitude];
    setCoords(newCoords); // Update map position
    setGpsCoordinates(`${suggestion.latitude.toFixed(6)}, ${suggestion.longitude.toFixed(6)}`);
    setSuggestions([]); // Close suggestion box
  }

  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOnboardingData({ 
        gpsCoordinates,
        country,
        state,
        district,
        village,
        pincode
    });
    // Simulate loading time before navigating
    setTimeout(() => {
      router.push("/onboarding/farm-details");
    }, 500);
  };
  
  // Callback for when the marker is moved on the MapPicker component
  const handleMapMarkerMove = (lat: number, lng: number) => {
    const newLocation = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    setGpsCoordinates(newLocation);
    setCoords([lat, lng]);
    getAddressFromCoordinates(lat, lng); // Get new address for the map position
    setSuggestions([]); // Clear any open suggestions
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-2xl font-headline font-bold">
          {t('location.title')}
        </CardTitle>
        <CardDescription>
          {t('location.description')}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleDetectLocation}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-4 w-4" />
            )}
            {isDetecting ? 'Detecting...' : 'Use My Current Location'}
          </Button>

          <div className="h-64 w-full rounded-lg overflow-hidden border">
            <MapPicker initialPosition={coords} onMarkerMove={handleMapMarkerMove} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">{t('location.country')}</Label>
                <Input id="country" placeholder={t('location.countryPlaceholder')} value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">{t('location.state')}</Label>
                <Input id="state" placeholder={t('location.statePlaceholder')} value={state} onChange={(e) => setState(e.target.value)} required />
              </div>
           </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">{t('location.district')}</Label>
                <Input id="district" placeholder={t('location.districtPlaceholder')} value={district} onChange={(e) => setDistrict(e.target.value)} required />
              </div>
              <div className="relative space-y-2">
                <Label htmlFor="village">{t('location.village')}</Label>
                <Input id="village" placeholder={t('location.villagePlaceholder')} value={village} onChange={(e) => setVillage(e.target.value)} required autoComplete="off"/>
                  {isSuggesting && <Loader2 className="absolute right-2 top-9 h-4 w-4 animate-spin text-muted-foreground" />}
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-background border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                className="w-full text-left p-2 text-sm hover:bg-accent"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion.fullAddress}
                            </button>
                        ))}
                    </div>
                  )}
              </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pincode">{t('location.pincode')}</Label>
                    <Input id="pincode" placeholder={t('location.pincodePlaceholder')} value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">{t('location.gpsCoordinates')}</Label>
                    <div className="flex gap-2">
                    <Input
                        id="location"
                        placeholder={t('location.gpsPlaceholder')}
                        value={gpsCoordinates}
                        onChange={(e) => setGpsCoordinates(e.target.value)}
                        readOnly
                    />
                    </div>
                </div>
           </div>


          <Button type="submit" className="w-full" disabled={isLoading || !state || !district || !pincode || !country || !village}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('continue')}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <p className="text-sm text-muted-foreground">{t('onboarding.step', { current: 3, total: 7 })}</p>
        <div className="w-full bg-muted rounded-full h-1.5 dark:bg-muted/30">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${3 * 100 / 7}%` }}
          />
        </div>
      </CardFooter>
    </Card>
  );
}