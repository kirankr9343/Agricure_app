
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Camera, Sparkles, AlertCircle, Upload, CheckCircle2, Leaf, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { diagnosePlant, DiagnosePlantOutput } from "@/ai/flows/diagnose-plant-flow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation, languages as appLanguages } from "@/hooks/use-language";

export default function DiseaseScanPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosePlantOutput | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [languageSelected, setLanguageSelected] = useState(false);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: t('dashboard.diseaseScan.error.cameraNotSupportedTitle'),
          description: t('dashboard.diseaseScan.error.cameraNotSupportedDescription'),
        });
        return;
      }
      try {
        // Ask for camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsStreaming(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    // Only try to get permission if we haven't taken a picture yet
    if (languageSelected && !capturedImage) {
        getCameraPermission();
    }

    // Cleanup function to stop camera stream when component unmounts or image is captured
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast, capturedImage, languageSelected, t]);
  
  const processImage = async (photoDataUri: string) => {
    setIsLoading(true);
    setDiagnosis(null);
    setCapturedImage(photoDataUri);
    setIsStreaming(false); // Stop streaming after capture
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
    }

    try {
      const result = await diagnosePlant({ photoDataUri, description: 'A crop leaf from a farm.', preferredLanguage });
      setDiagnosis(result);
    } catch (e: any) {
       console.error("Error diagnosing plant:", e);
       let description = t('dashboard.diseaseScan.error.analysisFailedDescription');
       if (e.message?.includes('503')) {
          description = t('dashboard.diseaseScan.error.overloaded');
       }
       toast({
          variant: 'destructive',
          title: t('dashboard.diseaseScan.error.analysisFailedTitle'),
          description: description,
        });
       setDiagnosis(null); // Clear previous results on error
    } finally {
      setIsLoading(false);
    }
  };


  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    const photoDataUri = canvas.toDataURL('image/jpeg');
    processImage(photoDataUri);
  };
  
  const handleReset = () => {
    setCapturedImage(null);
    setDiagnosis(null);
    setIsLoading(false);
    setHasCameraPermission(null); // Re-check permission
    // Don't reset language, keep it for next scan
    if (languageSelected) {
        setIsStreaming(true);
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        processImage(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
       <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.diseaseScan.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.diseaseScan.description')}</p>
      </div>

    {!languageSelected ? (
        <Card className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">{t('dashboard.diseaseScan.selectLanguageTitle')}</CardTitle>
                <CardDescription>{t('dashboard.diseaseScan.selectLanguageDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="w-full max-w-sm space-y-4">
                <Select onValueChange={setPreferredLanguage} value={preferredLanguage}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('dashboard.diseaseScan.selectLanguagePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        {appLanguages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.label}>{lang.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button className="w-full" onClick={() => setLanguageSelected(true)} disabled={!preferredLanguage}>
                    <Languages className="mr-2 h-4 w-4" />
                    {t('continue')}
                </Button>
            </CardContent>
        </Card>
      ) : (
      <Card>
        <CardContent className="p-4 md:p-6 grid gap-6 md:grid-cols-2">
            <div className="relative aspect-video rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                {capturedImage ? (
                  <Image src={capturedImage} alt="Captured or uploaded plant" fill style={{objectFit: "contain"}} />
                ) : (
                  <>
                    <video ref={videoRef} className={`w-full h-full object-cover ${!isStreaming ? 'hidden': ''}`} autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                  </>
                )}
                 {hasCameraPermission === false && !capturedImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <Alert variant="destructive" className="sm:max-w-sm">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t('dashboard.diseaseScan.error.cameraAccessDeniedTitle')}</AlertTitle>
                            <AlertDescription>
                                {t('dashboard.diseaseScan.error.cameraAccessDeniedDescription')}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {capturedImage ? (
                         <Button onClick={handleReset} size="lg" variant="outline">
                            {t('dashboard.diseaseScan.scanAnother')}
                         </Button>
                    ) : (
                        <>
                         <Button onClick={handleScan} disabled={isLoading || !isStreaming || hasCameraPermission === false} size="lg">
                            {isLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Camera className="mr-2 h-5 w-5" />
                            )}
                            {t('dashboard.diseaseScan.scanWithCamera')}
                        </Button>
                        <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading} size="lg" variant="outline">
                           <Upload className="mr-2 h-5 w-5" />
                           {t('dashboard.diseaseScan.uploadImage')}
                        </Button>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>
                
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center p-4 rounded-md bg-muted/50 flex-1">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="font-semibold">{t('dashboard.diseaseScan.analyzingTitle')}</p>
                        <p className="text-sm text-muted-foreground">{t('dashboard.diseaseScan.analyzingDescription')}</p>
                    </div>
                )}

                {diagnosis && !isLoading && (
                    <Card className="flex-1 bg-transparent border-0 shadow-none">
                        <CardHeader className="p-0 pb-4">
                            <CardTitle>{t('dashboard.diseaseScan.result.title')}</CardTitle>
                             {diagnosis.identification.commonName && <CardDescription>{diagnosis.identification.commonName} ({diagnosis.identification.latinName})</CardDescription>}
                        </CardHeader>
                        <CardContent className="p-0">
                            {!diagnosis.identification.isPlant ? (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{t('dashboard.diseaseScan.result.notAPlantTitle')}</AlertTitle>
                                    <AlertDescription>
                                        {t('dashboard.diseaseScan.result.notAPlantDescription')}
                                    </AlertDescription>
                                </Alert>
                            ) : diagnosis.diagnosis.isHealthy ? (
                                <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-950">
                                     <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <AlertTitle className="text-green-800 dark:text-green-300">{t('dashboard.diseaseScan.result.healthyTitle')}</AlertTitle>
                                    <AlertDescription className="text-green-700 dark:text-green-400">
                                        {t('dashboard.diseaseScan.result.healthyDescription')}
                                    </AlertDescription>
                                </Alert>
                            
                            ) : (
                                <div className="space-y-4">
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>{t('dashboard.diseaseScan.result.diseaseDetectedTitle')}: {diagnosis.diagnosis.disease || t('dashboard.diseaseScan.result.unknownIssue')}</AlertTitle>
                                        <AlertDescription>
                                            {t('dashboard.diseaseScan.result.diseaseDetectedDescription')}
                                        </AlertDescription>
                                    </Alert>
                                    <Card>
                                        <CardHeader>
                                           <CardTitle className="text-lg">{t('dashboard.diseaseScan.result.solutionTitle')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm">{diagnosis.diagnosis.solution || t('dashboard.diseaseScan.result.noSolution')}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
                 {!diagnosis && !isLoading && (
                    <div className="flex flex-col items-center justify-center text-center p-4 rounded-md bg-muted/50 flex-1">
                       <Sparkles className="h-8 w-8 text-muted-foreground mb-4" />
                       <p className="font-semibold">{t('dashboard.diseaseScan.getDiagnosisTitle')}</p>
                       <p className="text-sm text-muted-foreground">{t('dashboard.diseaseScan.getDiagnosisDescription')}</p>
                    </div>
                 )}
            </div>
        </CardContent>
      </Card>
    )}
    </div>
  );
}
