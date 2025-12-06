'use client';
import { config } from 'dotenv';
config();

import '@/ai/flows/voice-assisted-navigation.ts';
import '@/ai/flows/chatbot-support.ts';
import '@/ai/flows/personalized-advisory-dashboard.ts';
import '@/ai/flows/diagnose-plant-flow.ts';
import '@/ai/flows/get-crop-suggestions.ts';
import '@/ai/flows/validate-crop-name.ts';
import '@/ai/flows/reverse-geocode.ts';
import '@/ai/flows/get-address-suggestions.ts';
import '@/ai/flows/validate-district.ts';
import '@/ai/flows/get-soil-testing-labs.ts';
import '@/ai/flows/get-soil-information.ts';
