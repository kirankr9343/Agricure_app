
"use client"

import React, { useRef, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
  onComplete?: (otp: string) => void;
};

export function OtpInput({ value, onChange, length = 6, className, onComplete }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value.length === length) {
      onComplete?.(value);
    }
  }, [value, length, onComplete]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const target = e.target;
    let targetValue = target.value;
    const isTargetValueDigit = /^\d*$/.test(targetValue);

    if (!isTargetValueDigit) {
      return;
    }
    
    targetValue = targetValue.slice(0, 1);

    const newValue = value.substring(0, index) + targetValue + value.substring(index + 1);
    onChange(newValue);

    if (targetValue.length === 1 && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .trim()
      .slice(0, length)
      .replace(/[^0-9]/g, "");
    if (pastedData) {
      onChange(pastedData);
      if (pastedData.length < length) {
        inputRefs.current[pastedData.length]?.focus();
      }
    }
  };

  const values = useMemo(() => {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(value[i] || "");
    }
    return arr;
  }, [value, length]);

  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {values.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => {
            if (el) inputRefs.current[index] = el;
          }}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-10 h-12 md:w-12 md:h-14 text-center text-2xl font-semibold"
          aria-label={`Digit ${index + 1} of OTP`}
        />
      ))}
    </div>
  );
}
