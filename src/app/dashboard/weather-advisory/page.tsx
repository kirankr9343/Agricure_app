
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAppState } from "@/hooks/use-app-state";
import { subDays, addDays, format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts"

const generateRainfallData = (location: string) => {
  const data = [];
  const today = new Date();
  
  let seed = 0;
  for (let i = 0; i < location.length; i++) {
    seed = location.charCodeAt(i) + ((seed << 5) - seed);
  }
  
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  }

  for (let i = -10; i <= 10; i++) {
    const date = i < 0 ? subDays(today, Math.abs(i)) : addDays(today, i);
    const daySeed = seed + date.getDate();
    
    const month = date.getMonth();
    let rainfall = 0;
    
    if (month >= 5 && month <= 9) { // Monsoon months
      rainfall = Math.floor(random(daySeed) * 30);
    } else {
      rainfall = Math.floor(random(daySeed) * 1.2 * 5);
    }
    
    data.push({
      date: format(date, "MMM d"),
      rainfall: rainfall,
      type: i < 0 ? "Actual" : "Forecast",
    });
  }
  return data;
}

const chartConfig = {
  rainfall: {
    label: "Rainfall (mm)",
    color: "hsl(204 100% 50%)",
  },
}

export default function WeatherAdvisoryPage() {
  const { onboardingData } = useAppState();
  const farmLocation = onboardingData.district && onboardingData.state ? `${onboardingData.district}, ${onboardingData.state}` : "Punjab, India";
  
  const chartData = generateRainfallData(farmLocation);
  const todayIndex = chartData.findIndex(d => d.type === 'Forecast');

  return (
    <div className="space-y-6">
       <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Weather Advisory</h1>
        <p className="text-muted-foreground">Rainfall trends for {farmLocation}.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>20-Day Rainfall Overview</CardTitle>
          <CardDescription>Showing actual rainfall for the last 10 days and forecasted rainfall for the next 10 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <AreaChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <defs>
                <linearGradient id="fillRainfall" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-rainfall)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-rainfall)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value} mm`}
              />
              <Tooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="rainfall"
                type="natural"
                fill="url(#fillRainfall)"
                fillOpacity={0.4}
                stroke="var(--color-rainfall)"
                stackId="a"
              />
               {todayIndex > 0 && (
                <ReferenceLine
                  x={chartData[todayIndex -1].date}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  label={{
                    position: 'insideTopLeft',
                    value: 'Today',
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 12,
                  }}
                />
              )}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
