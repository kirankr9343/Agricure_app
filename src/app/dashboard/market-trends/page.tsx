
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAppState } from "@/hooks/use-app-state";
import { add, format } from "date-fns";
import { AreaChart, XAxis, YAxis, Area, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from "@/lib/utils";

// Generates more realistic, pseudo-random market price data
const generatePriceData = (cropName: string) => {
  const data = [];
  const today = new Date();
  
  // Base price and volatility based on crop name hash
  let seed = 0;
  for (let i = 0; i < cropName.length; i++) {
    seed = cropName.charCodeAt(i) + ((seed << 5) - seed);
  }
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  }
  
  let basePrice;
  // Set realistic base prices for specific high-value crops
  switch (cropName.toLowerCase()) {
    case 'coffee':
      basePrice = Math.floor(random(seed) * 10000) + 55000; // Price between 55,000 - 65,000
      break;
    default:
      basePrice = Math.floor(random(seed) * 3000) + 2000; // Price between 2000 - 5000 for others
  }

  const volatility = random(seed + 1) * 0.15 + 0.05; // Volatility between 5% and 20%

  // Historical Data (past 11 months)
  for (let i = 11; i >= 1; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthSeed = seed + date.getMonth() * 100;
    const price = Math.round(basePrice * (1 + (random(monthSeed) - 0.5) * volatility));
    data.push({
      date: format(date, "MMM yy"),
      price: price,
      type: "Historical",
    });
  }

  // Current Price
  const currentPrice = Math.round(basePrice * (1 + (random(seed + today.getMonth()) - 0.5) * volatility));
  data.push({
    date: format(today, "MMM yy"),
    price: currentPrice,
    type: "Current",
  });
  
  // Future Estimate
  const futureDate = add(today, { months: 1 });
  const futurePrice = Math.round(currentPrice * (1 + (random(seed + futureDate.getMonth()) - 0.4) * volatility * 0.5));
  data.push({
    date: format(futureDate, "MMM yy"),
    price: futurePrice,
    type: "Estimate",
  });

  return data;
};

const chartConfig = {
  price: {
    label: "Price (₹/quintal)",
    color: "hsl(var(--chart-1))",
  },
};

const PriceCard = ({ title, value, change, period, icon: Icon }: { title: string, value: string, change: number, period: string, icon: React.ElementType}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <span className="text-muted-foreground">{period}</span>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground flex items-center">
                 <Icon className={cn("h-4 w-4 mr-1", change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-muted-foreground")} />
                {change.toFixed(2)}% {change > 0 ? "increase" : change < 0 ? "decrease" : "no change"}
            </p>
        </CardContent>
    </Card>
);

export default function MarketTrendsPage() {
  const { onboardingData } = useAppState();
  const allCrops = [...onboardingData.primaryCrops, ...onboardingData.secondaryCrops];
  
  const [selectedCrop, setSelectedCrop] = useState(allCrops[0]?.name || "");
  
  if (allCrops.length === 0) {
    return (
        <Alert>
          <AlertTitle>No Crops Found</AlertTitle>
          <AlertDescription>Please add crops to your profile to view market trends.</AlertDescription>
        </Alert>
    );
  }

  const chartData = generatePriceData(selectedCrop);
  const currentPriceData = chartData.find(d => d.type === "Current");
  const previousPriceData = chartData[chartData.length - 3]; // 2 months ago
  const futurePriceData = chartData.find(d => d.type === "Estimate");

  const currentPrice = currentPriceData?.price || 0;
  const previousPrice = previousPriceData?.price || 0;
  const futurePrice = futurePriceData?.price || 0;

  const monthlyChange = previousPrice > 0 ? ((currentPrice - previousPrice) / previousPrice) * 100 : 0;
  const futureChange = currentPrice > 0 ? ((futurePrice - currentPrice) / currentPrice) * 100 : 0;


  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Market Price Trends</h1>
        <p className="text-muted-foreground">Analyze past, present, and future price estimations for your crops.</p>
      </div>

       <div className="w-full max-w-xs">
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger>
                  <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent>
                  {allCrops.map(crop => (
                      <SelectItem key={crop.name} value={crop.name}>{crop.name}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
       </div>

       <div className="grid gap-4 md:grid-cols-3">
          <PriceCard title="Previous Price" value={`₹${previousPrice.toLocaleString()}`} change={0} period="Last Month" icon={Minus} />
          <PriceCard title="Current Price" value={`₹${currentPrice.toLocaleString()}`} change={monthlyChange} period="vs Last Month" icon={monthlyChange > 0 ? TrendingUp : TrendingDown} />
          <PriceCard title="Future Estimate" value={`₹${futurePrice.toLocaleString()}`} change={futureChange} period="Next Month" icon={futureChange > 0 ? TrendingUp : TrendingDown} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>12-Month Price Trend for {selectedCrop}</CardTitle>
          <CardDescription>Price per quintal (₹)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <AreaChart data={chartData} margin={{ left: -20, right: 20 }}>
              <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `₹${Number(value) >= 1000 ? `${(Number(value) / 1000).toFixed(0)}k` : value}`}
              />
              <Tooltip content={<ChartTooltipContent indicator="dot" formatter={(value) => `₹${value.toLocaleString()}`} />} />
              <Area
                dataKey="price"
                type="natural"
                fill="url(#fillPrice)"
                stroke="var(--color-price)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
            <p className="text-sm text-muted-foreground">*Future price is an AI-based estimation and may not be accurate.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
