
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/use-app-state";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User, Edit, Save, X, Camera } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function ProfileDialog({ isOpen, onOpenChange }: ProfileDialogProps) {
  const { onboardingData, setOnboardingData } = useAppState();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  
  // Create a separate state for form data to avoid updating global state on every keystroke
  const [formData, setFormData] = useState(onboardingData);

  useEffect(() => {
    if (isOpen) {
      setFormData(onboardingData);
    } else {
        setIsEditing(false); // Reset editing state when closing
    }
  }, [isOpen, onboardingData]);

  const handleSave = () => {
    // Basic validation
     if (!formData.name) {
        toast({
            variant: "destructive",
            title: "Name is required",
            description: "Please enter your name.",
        });
        return;
    }
    setOnboardingData(formData);
    toast({
        title: "Profile Updated",
        description: "Your account details have been saved.",
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData(onboardingData);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const dataUrl = loadEvent.target?.result as string;
            setFormData(prev => ({ ...prev, profilePictureUrl: dataUrl }));
        };
        reader.readAsDataURL(file);
    }
  };

  const InputField = ({ id, label, value, isProtected = false, type = "text" }: { id: keyof typeof formData, label: string, value: string, isProtected?: boolean, type?: string }) => (
      <div className="space-y-2">
          <Label htmlFor={id as string}>{label}</Label>
          <Input id={id as string} value={value} onChange={handleInputChange} readOnly={!isEditing || isProtected} type={type} />
      </div>
  )


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update your account details." : "View your account details. Click 'Edit' to make changes."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={formData.profilePictureUrl} alt={formData.name} />
                        <AvatarFallback>
                            <User className="h-12 w-12" />
                        </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
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
                        </>
                    )}
                </div>
                <div className="space-y-2 flex-1">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={formData.name} onChange={handleInputChange} readOnly={!isEditing} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField id="contactNumber" label="Phone Number" value={formData.contactNumber} isProtected />
                <InputField id="emailAddress" label="Email Address" value={formData.emailAddress} isProtected />
            </div>
        </div>
        <DialogFooter className="sm:justify-between">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
