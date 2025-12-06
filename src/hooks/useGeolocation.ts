// src/hooks/useGeolocation.ts

import { useState } from 'react';

interface GeolocationState {
  isLoading: boolean;
  position: { lat: number; lng: number } | null;
  error: GeolocationPositionError | { message: string } | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    isLoading: false,
    position: null,
    error: null,
  });

  const getPosition = () => {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: { message: 'Geolocation is not supported by your browser.' },
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    // This is the browser API call
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (pos) => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }));
      },
      // Error callback
      (error) => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error,
        }));
      }
    );
  };

  return { ...state, getPosition };
}