
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Save, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-language';

interface ProfileSectionCardProps<T> {
  title: string;
  icon: React.ElementType;
  initialData: T;
  onSave: (data: T) => void;
  renderView: (data: T) => React.ReactNode;
  renderEdit: (data: T, setData: (data: T) => void) => React.ReactNode;
}

export function ProfileSectionCard<T>({
  title,
  icon: Icon,
  initialData,
  onSave,
  renderView,
  renderEdit,
}: ProfileSectionCardProps<T>) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<T>(initialData);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsEditing(false);
      setIsLoading(false);
      toast({
        title: `${title} Updated`,
        description: 'Your information has been saved successfully.',
      });
    }, 500);
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            {t('Edit')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {isEditing ? (
          <div className="space-y-4">
            {renderEdit(formData, setFormData)}
          </div>
        ) : (
          <div className="space-y-2">
            {renderView(initialData)}
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            {t('Cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t('Save')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
