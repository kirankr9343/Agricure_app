
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useDebounce } from './use-debounce';
import { useToast } from './use-toast';
import { add, sub, format, differenceInDays } from 'date-fns';

type CropData = {
  id?: string;
  name: string;
  season: string;
  yield: string; // optional
};

type LivestockData = {
    id?: string;
    type: string;
    quantity: string;
};

type SellerProfile = {
  businessName: string;
  gstin: string;
  pickupAddress: string;
  agreedToTerms: boolean;
};

export type CartItem = {
    id: number | string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    unit: string;
};

export type RentCartItem = {
    id: number | string;
    name: string;
    pricePerDay: number;
    image: string;
};

export type Booking = {
    id: string;
    date: string;
    status: 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
    total: number;
    items: RentCartItem[];
    cancellationReason?: string;
    shipping: {
        name: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        deliveryInstructions: string;
    };
    rentalStartDate: string;
    rentalEndDate: string;
    rentalDuration: number;
};


export type Order = {
    id: string;
    date: string;
    status: 'Placed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    total: number;
    items: CartItem[];
    cancellationReason?: string;
    shipping: {
        name: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        deliveryInstructions: string;
        trackingNumber: string;
        estimatedDelivery: string;
    };
};

export type OnboardingData = {
  // 1. Personal Details
  name: string;
  contactNumber: string;
  aadhaarNumber: string;
  emailAddress: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | '';
  dob: string | undefined; // Store as ISO string (may be undefined)
  profilePictureUrl: string;
  farmPhotos: string[];
  yearsOfExperience: string;

  // 2. Location Details
  country: string;
  state: string;
  district: string;
  village: string;
  pincode: string;
  gpsCoordinates: string; // optional

  // 3. Farming Details
  farmerType: 'Small' | 'Medium' | 'Large' | 'Tenant' | 'Commercial' | 'Hobby' | '';
  landType: 'Owned' | 'Leased' | 'Both' | '';
  landArea: string; // in acres or hectares
  landAreaUnit: 'acres' | 'hectares';
  irrigationSource: 'Rainfed' | 'Borewell' | 'Drip' | 'Canal' | 'Well' | 'Other' | '';
  soilType: 'Clay' | 'Sandy' | 'Loamy' | 'Black' | 'Red' | 'Laterite' | 'Alluvial' | '';

  // 4. Crop Information
  primaryCrops: CropData[];
  secondaryCrops: CropData[];

  // 5. Livestock & Allied Activities
  livestock: LivestockData[];
  
  // 6. Equipment & Resources
  machineryOwned: string[];
  availableForRent: boolean;

  // 7. Preferences
  preferredLanguage: string;
  communicationModes: ("app" | "whatsapp" | "sms" | "email")[];
  updateFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Critical Alerts Only' | '';

  // 8. Optional Fields
  govtSchemeParticipation: string;
  certifications: string[];

  // 9. Seller Profile
  sellerProfile: SellerProfile | null;
  
  // 10. Cart, Orders, Bookings
  cart: CartItem[];
  rentCart: RentCartItem[];
  orders: Order[];
  bookings: Booking[];

  // Internal state
  onboardingComplete: boolean;
  agreedToTerms: boolean;

  // Timestamps
  createdAt?: any;
  updatedAt?: any;
};

type AppStateContextType = {
  onboardingData: OnboardingData;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  isLoaded: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (itemId: CartItem['id']) => void;
  updateCartQuantity: (itemId: CartItem['id'], quantity: number) => void;
  clearCart: () => void;
  placeOrder: (orderDetails: Omit<Order, 'id' | 'date' | 'status' | 'shipping' | 'cancellationReason'> & { shipping: Omit<Order['shipping'], 'trackingNumber' | 'estimatedDelivery'> }) => void;
  reorder: (orderId: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;

  // Rental specific
  addToRentCart: (item: RentCartItem) => void;
  removeFromRentCart: (itemId: RentCartItem['id']) => void;
  clearRentCart: () => void;
  placeBooking: (bookingDetails: Omit<Booking, 'id' | 'date' | 'status' | 'cancellationReason'>) => void;
};

const defaultState: OnboardingData = {
  // Personal
  name: "New Farmer",
  contactNumber: "",
  aadhaarNumber: "",
  emailAddress: "",
  gender: "",
  dob: "",
  profilePictureUrl: "",
  farmPhotos: [],
  yearsOfExperience: "",
  // Location
  gpsCoordinates: '',
  country: "India",
  state: "",
  district: "",
  village: "",
  pincode: "",
  // Farming
  farmerType: '',
  landType: '',
  landArea: '',
  landAreaUnit: 'acres',
  irrigationSource: '',
  soilType: '',
  // Crops
  primaryCrops: [],
  secondaryCrops: [],
  // Livestock
  livestock: [],
  // Equipment
  machineryOwned: [],
  availableForRent: false,
  // Preferences
  preferredLanguage: "en",
  communicationModes: ['app'],
  updateFrequency: 'Weekly',
  // Optional
  govtSchemeParticipation: "",
  certifications: [],
  // Seller Profile
  sellerProfile: null,
  // Cart, Orders, Bookings
  cart: [],
  rentCart: [],
  orders: [],
  bookings: [],
  // Internal
  onboardingComplete: false,
  agreedToTerms: false,
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [onboardingData, setOnboardingDataState] = useState<OnboardingData>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const debouncedOnboardingData = useDebounce(onboardingData, 1000);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('onboardingData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (!parsedData.orders) parsedData.orders = [];
        if (!parsedData.bookings) parsedData.bookings = [];
        if (!parsedData.cart) parsedData.cart = [];
        if (!parsedData.rentCart) parsedData.rentCart = [];
        setOnboardingDataState(parsedData);
      }
    } catch (error) {
      console.error("Could not load data from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('onboardingData', JSON.stringify(debouncedOnboardingData));
    } catch (error) {
      console.error("Could not save data to localStorage", error);
    }
  }, [debouncedOnboardingData]);

  const setOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingDataState(prev => ({ ...prev, ...data }));
  };
  
  const resetOnboarding = () => {
    setOnboardingDataState(defaultState);
    try {
        localStorage.removeItem('onboardingData');
    } catch (error) {
        console.error("Could not clear localStorage", error);
    }
  }
  
  // Purchase Cart Logic
  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setOnboardingDataState((prev) => {
      const currentCart = prev.cart || [];
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        const updatedCart = currentCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
        );
        return { ...prev, cart: updatedCart };
      } else {
        const newCart = [...currentCart, { ...item, quantity: quantity }];
        return { ...prev, cart: newCart };
      }
    });
     toast({
        title: "Added to Cart",
        description: `${item.name} has been added to your cart.`,
      });
  }, [toast]);
  
  const removeFromCart = useCallback((itemId: CartItem['id']) => {
    setOnboardingDataState((prev) => ({
      ...prev,
      cart: (prev.cart || []).filter(item => item.id !== itemId)
    }));
  }, []);
  
  const updateCartQuantity = useCallback((itemId: CartItem['id'], quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setOnboardingDataState((prev) => ({
      ...prev,
      cart: (prev.cart || []).map(item => item.id === itemId ? { ...item, quantity } : item)
    }));
  }, [removeFromCart]);
  
  const clearCart = useCallback(() => {
      setOnboardingDataState(prev => ({...prev, cart: []}));
  }, []);

  // Order Logic
  const placeOrder = useCallback((orderDetails: Omit<Order, 'id' | 'date' | 'status' | 'shipping' | 'cancellationReason'> & { shipping: Omit<Order['shipping'], 'trackingNumber' | 'estimatedDelivery'> }) => {
      const now = new Date();
      const newOrder: Order = {
        ...orderDetails,
        id: `ORD-${now.getTime()}`,
        date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: 'Placed',
        shipping: {
            ...orderDetails.shipping,
            trackingNumber: `AGR${now.getTime()}`,
            estimatedDelivery: add(now, { days: 5 }).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        },
      };

      setOnboardingDataState(prev => ({
          ...prev,
          orders: [newOrder, ...(prev.orders || [])],
          cart: [],
      }));
  }, []);
  
  const reorder = useCallback((orderId: string) => {
    const order = onboardingData.orders.find(o => o.id === orderId);
    if(order) {
        order.items.forEach(item => {
            addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                unit: item.unit
            }, item.quantity)
        });
    }
  }, [onboardingData.orders, addToCart]);
  
  const cancelOrder = useCallback((orderId: string, reason: string) => {
    setOnboardingDataState(prev => ({
        ...prev,
        orders: prev.orders.map(order => 
            order.id === orderId 
            ? { ...order, status: 'Cancelled', cancellationReason: reason }
            : order
        )
    }));
  }, []);

  // Rental Cart Logic
  const addToRentCart = useCallback((item: RentCartItem) => {
    setOnboardingDataState((prev) => {
      const currentRentCart = prev.rentCart || [];
      if (currentRentCart.some(rentItem => rentItem.id === item.id)) {
        toast({
          variant: "destructive",
          title: "Already in Rent List",
          description: `${item.name} is already in your rental list.`,
        });
        return prev;
      }
      return { ...prev, rentCart: [...currentRentCart, item] };
    });
    toast({
      title: "Added to Rent List",
      description: `${item.name} has been added to your rental list.`,
    });
  }, [toast]);

  const removeFromRentCart = useCallback((itemId: RentCartItem['id']) => {
    setOnboardingDataState((prev) => ({
      ...prev,
      rentCart: (prev.rentCart || []).filter(item => item.id !== itemId),
    }));
  }, []);

  const clearRentCart = useCallback(() => {
    setOnboardingDataState((prev) => ({ ...prev, rentCart: [] }));
  }, []);
  
  const placeBooking = useCallback((bookingDetails: Omit<Booking, 'id' | 'date' | 'status' | 'cancellationReason'>) => {
    const now = new Date();
    const newBooking: Booking = {
      ...bookingDetails,
      id: `BOK-${now.getTime()}`,
      date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Confirmed',
    };
    setOnboardingDataState(prev => ({
      ...prev,
      bookings: [newBooking, ...(prev.bookings || [])],
      rentCart: [], // Clear rent cart after booking
    }));
  }, []);


  return (
    <AppStateContext.Provider value={{ onboardingData, setOnboardingData, resetOnboarding, isLoaded, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, reorder, cancelOrder, addToRentCart, removeFromRentCart, clearRentCart, placeBooking }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
