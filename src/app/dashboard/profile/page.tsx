
"use client";

import React, { useState, useRef } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { ProfileSectionCard } from '@/components/profile/profile-section-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, MapPin, Tractor, Wheat, Bell, Languages, Leaf, PlusCircle, Trash2, Loader2, Settings, ShoppingCart, Activity, Camera } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useTranslation, useLanguage, languages as appLanguages } from '@/hooks/use-language';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { validateCropName } from '@/ai/flows/validate-crop-name';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const FARMER_TYPES = ['Small', 'Medium', 'Large', 'Tenant', 'Commercial', 'Hobby'];
const LAND_TYPES = ['Owned', 'Leased', 'Both'];
const IRRIGATION_SOURCES = ['Rainfed', 'Borewell', 'Drip', 'Canal', 'Well', 'Other'];
const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red', 'Laterite', 'Alluvial'];
const SOWING_SEASONS = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];
const LIVESTOCK_TYPES = ["Cattle", "Poultry", "Goat", "Fishery", "Sheep", "Pig", "Other"];
const notificationOptions = [
    { id: 'app', labelKey: 'notifications.options.app' },
    { id: 'whatsapp', labelKey: 'notifications.options.whatsapp' },
    { id: 'sms', labelKey: 'notifications.options.sms' },
    { id: 'email', labelKey: 'notifications.options.email' },
] as const;
const updateFrequencies = [
    { id: 'Daily', labelKey: 'notifications.frequencies.daily' },
    { id: 'Weekly', labelKey: 'notifications.frequencies.weekly' },
    { id: 'Monthly', labelKey: 'notifications.frequencies.monthly' },
    { id: 'Critical Alerts Only', labelKey: 'notifications.frequencies.critical' },
];


export default function ProfilePage() {
  const { onboardingData, setOnboardingData } = useAppState();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (updatedData: Partial<typeof onboardingData>) => {
    setOnboardingData(updatedData);
  };
  
  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        handleUpdate({ profilePictureUrl: dataUrl });
        toast({
            title: "Profile Picture Updated",
            description: "Your new picture has been saved.",
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const LabeledInput = ({ label, id, ...props }: { label: string, id: string } & React.ComponentProps<typeof Input>) => (
    <div>
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} {...props} />
    </div>
  );

  type CropEntry = { id?: string; name: string; season: string; yield: string; };
  type LivestockEntry = { id?: string; type: string; quantity: string; };

  const CropsEditComponent = ({ data, setData }: {data: typeof onboardingData, setData: (d: any) => void}) => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("primary");
    const [currentCrop, setCurrentCrop] = useState("");
    const [sowingSeason, setSowingSeason] = useState("");
    const [averageYield, setAverageYield] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    
    const handleAddCrop = async () => {
        if (currentCrop && sowingSeason) {
            setIsAdding(true);
            const validationResult = await validateCropName({ cropName: currentCrop });

            if (!validationResult.isValid) {
                toast({
                variant: "destructive",
                title: t('onboarding.crops.toast.invalidCropTitle'),
                description: t('onboarding.crops.toast.invalidCropDescription', { cropName: currentCrop }),
                });
                setIsAdding(false);
                return;
            }

            const newCrop = { id: Date.now().toString(), name: currentCrop, season: sowingSeason, yield: averageYield };
            
            const isInPrimary = data.primaryCrops.some(c => c.name.toLowerCase() === newCrop.name.toLowerCase());
            const isInSecondary = data.secondaryCrops.some(c => c.name.toLowerCase() === newCrop.name.toLowerCase());

            if (isInPrimary || isInSecondary) {
                 toast({
                    variant: "destructive",
                    title: t('onboarding.crops.toast.alreadyAddedTitle'),
                    description: t('onboarding.crops.toast.alreadyAddedDescription', { cropName: currentCrop }),
                });
            } else {
                if (activeTab === 'primary') {
                    setData({ ...data, primaryCrops: [...data.primaryCrops, newCrop] });
                } else {
                    setData({ ...data, secondaryCrops: [...data.secondaryCrops, newCrop] });
                }
                setCurrentCrop(""); setSowingSeason(""); setAverageYield("");
            }
            setIsAdding(false);
        }
    };
    
    const handleRemoveCrop = (id: string) => {
        if (activeTab === 'primary') {
            setData({ ...data, primaryCrops: data.primaryCrops.filter(c => c.id !== id) });
        } else {
            setData({ ...data, secondaryCrops: data.secondaryCrops.filter(c => c.id !== id) });
        }
    };
    const CropList = ({ crops }: { crops: CropEntry[] }) => (
        <ScrollArea className="h-24 rounded-md border p-2">
            {crops.length > 0 ? crops.map(crop => (
                <div key={crop.id} className="flex items-center justify-between p-1">
                    <div>
                        <p className="font-semibold text-sm">{crop.name}</p>
                        <p className="text-xs text-muted-foreground">{crop.season}</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => crop.id && handleRemoveCrop(crop.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
            )) : <p className="text-xs text-center text-muted-foreground p-4">{t('onboarding.crops.noCropsAdded')}</p>}
        </ScrollArea>
    );

    return (
        <div className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LabeledInput label={t('onboarding.crops.cropName')} id="cropName" value={currentCrop} onChange={e => setCurrentCrop(e.target.value)} placeholder="e.g., Wheat" />
                <div className="space-y-2">
                    <Label>{t('onboarding.crops.sowingSeason')}</Label>
                    <Select value={sowingSeason} onValueChange={setSowingSeason}>
                        <SelectTrigger><SelectValue placeholder={t('onboarding.crops.selectSeason')} /></SelectTrigger>
                        <SelectContent>{SOWING_SEASONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>
            <Button type="button" onClick={handleAddCrop} className="w-full" disabled={!currentCrop || !sowingSeason || isAdding}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {isAdding ? t('validating') : `${t('add')} to ${activeTab} list`}
            </Button>
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="primary">{t('profile.crops.primary')}</TabsTrigger>
                <TabsTrigger value="secondary">{t('profile.crops.secondary')}</TabsTrigger>
              </TabsList>
              <TabsContent value="primary" className="mt-2"><CropList crops={data.primaryCrops} /></TabsContent>
              <TabsContent value="secondary" className="mt-2"><CropList crops={data.secondaryCrops} /></TabsContent>
            </Tabs>
        </div>
    )
  };
  
  const LivestockEditComponent = ({ data, setData }: {data: typeof onboardingData, setData: (d: any) => void}) => {
      const [currentType, setCurrentType] = useState("");
      const [currentQuantity, setCurrentQuantity] = useState("");

      const handleAdd = () => {
          if(currentType && currentQuantity) {
              const newLivestock = {id: Date.now().toString(), type: currentType, quantity: currentQuantity};
              setData({...data, livestock: [...data.livestock, newLivestock]});
              setCurrentType("");
              setCurrentQuantity("");
          }
      };

      const handleRemove = (id: string) => {
          setData({...data, livestock: data.livestock.filter(l => l.id !== id)});
      };

      return (
           <div className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{t('onboarding.livestock.type')}</Label>
                    <Select value={currentType} onValueChange={setCurrentType}>
                        <SelectTrigger><SelectValue placeholder={t('onboarding.livestock.selectType')} /></SelectTrigger>
                        <SelectContent>{LIVESTOCK_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <LabeledInput label={t('onboarding.livestock.quantity')} id="quantity" value={currentQuantity} onChange={e => setCurrentQuantity(e.target.value)} placeholder="e.g., 10" />
            </div>
            <Button type="button" onClick={handleAdd} className="w-full" disabled={!currentType || !currentQuantity}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t('onboarding.livestock.add')}
            </Button>
            <ScrollArea className="h-24 rounded-md border p-2">
                {data.livestock.length > 0 ? data.livestock.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-1">
                        <div>
                            <p className="font-semibold text-sm">{item.type}</p>
                            <p className="text-xs text-muted-foreground">{item.quantity}</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemove(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                )) : <p className="text-xs text-center text-muted-foreground p-4">{t('onboarding.livestock.noLivestock')}</p>}
            </ScrollArea>
        </div>
      )
  };


  return (
    <div className="space-y-6">
      <div 
        className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-lg bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border border-[#A8E063]"
        style={{ boxShadow: '0 3px 12px rgba(86, 171, 47, 0.25)' }}
      >
        <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                <AvatarImage src={onboardingData.profilePictureUrl} alt={onboardingData.name} />
                <AvatarFallback>
                    <User className="h-12 w-12" />
                </AvatarFallback>
            </Avatar>
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background/80"
                onClick={() => fileInputRef.current?.click()}
                >
                <Camera className="h-4 w-4" />
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePictureUpload}
            />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-[#1A4D2E]">{onboardingData.name}</h1>
          <p className="text-[#4E4E4E]">{onboardingData.emailAddress || onboardingData.contactNumber}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        <ProfileSectionCard
          title={t('profile.personal.title')}
          icon={User}
          initialData={onboardingData}
          onSave={handleUpdate}
          renderView={data => (
            <>
              <p><strong>{t('onboarding.profile.fullName')}:</strong> {data.name}</p>
              <p><strong>{t('auth.phoneNumber')}:</strong> {data.contactNumber || t('profile.notSet')}</p>
              <p><strong>{t('profile.personal.aadhaar')}:</strong> {data.aadhaarNumber ? '**** **** ' + data.aadhaarNumber.slice(-4) : t('profile.notSet')}</p>
              <p><strong>{t('onboarding.profile.dob')}:</strong> {data.dob ? new Date(data.dob).toLocaleDateString() : t('profile.notSet')}</p>
              <p><strong>{t('onboarding.profile.gender')}:</strong> {data.gender || t('profile.notSet')}</p>
              <p><strong>{t('profile.personal.experience')}:</strong> {data.yearsOfExperience ? `${data.yearsOfExperience} ${t('profile.personal.years')}` : t('profile.notSet')}</p>
            </>
          )}
          renderEdit={(data, setData) => (
            <>
              <div className="relative mx-auto w-fit">
                <Avatar className="h-24 w-24 border-2">
                    <AvatarImage src={data.profilePictureUrl} alt={data.name} />
                    <AvatarFallback>
                        <User className="h-12 w-12" />
                    </AvatarFallback>
                </Avatar>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background/80"
                    onClick={() => fileInputRef.current?.click()}
                    >
                    <Camera className="h-4 w-4" />
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (loadEvent) => {
                            setData({ ...data, profilePictureUrl: loadEvent.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                    }}
                />
             </div>
              <div>
                <Label htmlFor="name">{t('onboarding.profile.fullName')}</Label>
                <Input id="name" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="contactNumber">{t('auth.phoneNumber')}</Label>
                <Input id="contactNumber" value={data.contactNumber} onChange={e => setData({ ...data, contactNumber: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="aadhaarNumber">{t('profile.personal.aadhaar')}</Label>
                <Input id="aadhaarNumber" value={data.aadhaarNumber} onChange={e => setData({ ...data, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })} />
              </div>
              <div>
                <Label>{t('onboarding.profile.dob')}</Label>
                <DatePicker date={data.dob ? new Date(data.dob) : undefined} setDate={(d) => setData({...data, dob: d?.toISOString()})} />
              </div>
              <div>
                 <Label>{t('onboarding.profile.gender')}</Label>
                 <Select value={data.gender} onValueChange={(v) => setData({...data, gender: v as any})}>
                      <SelectTrigger><SelectValue placeholder={t('onboarding.profile.genderPlaceholder')} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">{t('onboarding.profile.genderMale')}</SelectItem>
                        <SelectItem value="Female">{t('onboarding.profile.genderFemale')}</SelectItem>
                        <SelectItem value="Other">{t('onboarding.profile.genderOther')}</SelectItem>
                        <SelectItem value="Prefer not to say">{t('onboarding.profile.genderPreferNotToSay')}</SelectItem>
                      </SelectContent>
                 </Select>
              </div>
               <div>
                <Label htmlFor="yearsOfExperience">{t('profile.personal.experienceLabel')}</Label>
                <Input id="yearsOfExperience" type="number" value={data.yearsOfExperience} onChange={e => setData({ ...data, yearsOfExperience: e.target.value })} />
              </div>
            </>
          )}
        />

        <ProfileSectionCard
          title={t('profile.location.title')}
          icon={MapPin}
          initialData={onboardingData}
          onSave={handleUpdate}
          renderView={data => (
            <>
              <p><strong>{t('profile.location.address')}:</strong> {data.village}, {data.district}</p>
              <p><strong>{t('location.state')}:</strong> {data.state}, {data.country}</p>
              <p><strong>{t('location.pincode')}:</strong> {data.pincode}</p>
              <p><strong>{t('location.gpsCoordinates')}:</strong> {data.gpsCoordinates || t('profile.notSet')}</p>
            </>
          )}
          renderEdit={(data, setData) => (
             <>
                <LabeledInput label={t('location.country')} id="country" value={data.country} onChange={e => setData({ ...data, country: e.target.value })} />
                <LabeledInput label={t('location.state')} id="state" value={data.state} onChange={e => setData({ ...data, state: e.target.value })} />
                <LabeledInput label={t('location.district')} id="district" value={data.district} onChange={e => setData({ ...data, district: e.target.value })} />
                <LabeledInput label={t('location.village')} id="village" value={data.village} onChange={e => setData({ ...data, village: e.target.value })} />
                <LabeledInput label={t('location.pincode')} id="pincode" value={data.pincode} onChange={e => setData({ ...data, pincode: e.target.value })} />
                <LabeledInput label={t('location.gpsCoordinates')} id="gpsCoordinates" value={data.gpsCoordinates} onChange={e => setData({ ...data, gpsCoordinates: e.target.value })} />
            </>
          )}
        />
        
        <ProfileSectionCard
          title={t('profile.farming.title')}
          icon={Tractor}
          initialData={onboardingData}
          onSave={handleUpdate}
          renderView={data => (
            <>
              <p><strong>{t('profile.farming.farmerType')}:</strong> {data.farmerType}</p>
              <p><strong>{t('profile.farming.land')}:</strong> {data.landArea} {t('profile.farming.acres')}, {data.landType}</p>
              <p><strong>{t('profile.farming.soilType')}:</strong> {data.soilType}</p>
              <p><strong>{t('profile.farming.irrigation')}:</strong> {data.irrigationSource}</p>
            </>
          )}
          renderEdit={(data, setData) => (
            <>
                <div>
                  <Label>{t('profile.farming.farmerType')}</Label>
                  <Select value={data.farmerType} onValueChange={(v) => setData({...data, farmerType: v as any})}>
                      <SelectTrigger><SelectValue placeholder={t('profile.farming.farmerTypePlaceholder')} /></SelectTrigger>
                      <SelectContent>{FARMER_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                    <Label>{t('profile.farming.landType')}</Label>
                    <RadioGroup value={data.landType} onValueChange={(v) => setData({...data, landType: v as any})} className="flex gap-4 pt-2">
                        {LAND_TYPES.map(type => (<div className="flex items-center space-x-2" key={type}><RadioGroupItem value={type} id={`land-${type}`} /><Label htmlFor={`land-${type}`}>{type}</Label></div>))}
                    </RadioGroup>
                </div>
                <LabeledInput label={t('profile.farming.landArea')} id="landArea" type="number" value={data.landArea} onChange={e => setData({ ...data, landArea: e.target.value })} />
                 <div>
                  <Label>{t('profile.farming.irrigation')}</Label>
                  <Select value={data.irrigationSource} onValueChange={(v) => setData({...data, irrigationSource: v as any})}>
                      <SelectTrigger><SelectValue placeholder={t('profile.farming.irrigationPlaceholder')} /></SelectTrigger>
                      <SelectContent>{IRRIGATION_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label>{t('profile.farming.soilType')}</Label>
                  <Select value={data.soilType} onValueChange={(v) => setData({...data, soilType: v as any})}>
                      <SelectTrigger><SelectValue placeholder={t('profile.farming.soilTypePlaceholder')} /></SelectTrigger>
                      <SelectContent>{SOIL_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
            </>
          )}
        />
        
        <ProfileSectionCard
            title={t('profile.crops.title')}
            icon={Wheat}
            initialData={onboardingData}
            onSave={handleUpdate}
            renderView={data => (
                <>
                    <div>
                        <h4 className="font-semibold text-foreground">{t('profile.crops.primary')}</h4>
                        <p>{data.primaryCrops.map(c => c.name).join(', ') || t('profile.notSet')}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">{t('profile.crops.secondary')}</h4>
                        <p>{data.secondaryCrops.map(c => c.name).join(', ') || t('profile.notSet')}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">{t('profile.crops.livestock')}</h4>
                        <p>{data.livestock.map(l => `${l.type} (${l.quantity})`).join(', ') || t('profile.notSet')}</p>
                    </div>
                </>
            )}
            renderEdit={(data, setData) => (
                <>
                    <CropsEditComponent data={data} setData={setData} />
                    <hr/>
                    <LivestockEditComponent data={data} setData={setData} />
                </>
            )}
        />

        <ProfileSectionCard
          title={t('settings')}
          icon={Settings}
          initialData={{
            language: language,
            communicationModes: onboardingData.communicationModes,
            updateFrequency: onboardingData.updateFrequency,
          }}
          onSave={(data) => {
            setLanguage(data.language);
            handleUpdate({ communicationModes: data.communicationModes, updateFrequency: data.updateFrequency });
          }}
          renderView={data => (
            <>
              <p><strong>{t('language')}:</strong> {appLanguages.find(l => l.value === data.language)?.label}</p>
              <p><strong>{t('notifications.frequency')}:</strong> {t((updateFrequencies.find(f => f.id === data.updateFrequency) || {labelKey: ''}).labelKey)}</p>
              <p><strong>{t('notifications.channels')}:</strong> {data.communicationModes.map(m => t((notificationOptions.find(o => o.id === m) || {labelKey: ''}).labelKey)).join(', ')}</p>
            </>
          )}
          renderEdit={(data, setData) => (
            <>
                <div>
                  <Label>{t('language')}</Label>
                   <Select value={data.language} onValueChange={(v) => setData({...data, language: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {appLanguages.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
                      </SelectContent>
                  </Select>
                </div>
                <div>
                    <Label className="font-semibold">{t('notifications.frequency')}</Label>
                    <RadioGroup value={data.updateFrequency} onValueChange={(v) => setData({...data, updateFrequency: v as any})} className="pt-2 space-y-1">
                        {updateFrequencies.map(freq => (<div className="flex items-center space-x-2" key={freq.id}><RadioGroupItem value={freq.id} id={freq.id} /><Label htmlFor={freq.id} className="font-normal">{t(freq.labelKey)}</Label></div>))}
                    </RadioGroup>
                </div>
                 <div>
                    <Label className="font-semibold">{t('notifications.channels')}</Label>
                    <div className="space-y-2 pt-2">
                        {notificationOptions.map(opt => (
                            <div key={opt.id} className="flex items-center space-x-2">
                                <Checkbox id={`notify-${opt.id}`} checked={data.communicationModes.includes(opt.id)} onCheckedChange={(checked) => {
                                    const newModes = checked ? [...data.communicationModes, opt.id] : data.communicationModes.filter(m => m !== opt.id);
                                    setData({...data, communicationModes: newModes});
                                }}/>
                                <Label htmlFor={`notify-${opt.id}`} className="font-normal">{t(opt.labelKey)}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </>
          )}
        />
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity className="h-6 w-6 text-primary" />
                    <CardTitle>{t('myActivity.title')}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                    <p>{t('myActivity.scannedCrop')}</p>
                    <p>{t('myActivity.viewedTrends', { crop: 'Wheat' })}</p>
                    <p>{t('myActivity.askedChatbot')}</p>
                </div>
            </CardContent>
        </Card>


      </div>
    </div>
  );
}
