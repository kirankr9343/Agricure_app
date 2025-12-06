
"use client"

import * as React from "react"
import { format } from "date-fns"
import type { Locale } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react"
import { enUS, hi, kn, bn, gu, ta, te } from 'date-fns/locale';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLanguage } from "@/hooks/use-language"

const dateLocales: { [key: string]: Locale } = {
  en: enUS,
  hi,
  kn,
  bn,
  gu,
  ta,
  te,
};


interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    placeholder?: string;
}

export function DatePicker({ date, setDate, placeholder = "Pick a date" }: DatePickerProps) {
  const { language } = useLanguage();
  
  const getLocale = () => {
    return dateLocales[language] || enUS;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: getLocale() }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={1930}
          toYear={new Date().getFullYear()}
          locale={getLocale()}
        />
      </PopoverContent>
    </Popover>
  )
}
