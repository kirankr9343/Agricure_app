
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useEffect } from 'react';
import {
  Bell,
  BotMessageSquare,
  Home,
  Menu,
  ScanLine,
  ShoppingBag,
  Tractor,
  User,
  Wheat,
  LogOut,
  ShieldQuestion,
  Award,
  Settings,
  Sun,
  Moon,
  Laptop,
  Languages,
  Landmark,
  CloudRain,
  Leaf,
  BarChart,
  Shield,
  Loader2,
  ShoppingCart,
  Package,
  CalendarCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AgricureLogo } from "@/components/icons/logo";
import { useAppState } from "@/hooks/use-app-state";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/use-language";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CartSheet } from '@/components/cart/cart-sheet';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { onboardingData, isLoaded } = useAppState();
  const { t } = useTranslation();

  useEffect(() => {
    // Basic check if onboarding is complete.
    // A real app would have more robust auth checks.
    if (isLoaded && !onboardingData.onboardingComplete) {
       if(!pathname.startsWith('/onboarding')) {
         router.push('/onboarding/language');
       }
    }
  }, [isLoaded, onboardingData.onboardingComplete, router, pathname]);

  const handleLogout = async () => {
    // In a real app, this would clear auth state.
    router.push('/');
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: t('dashboard.nav.dashboard') },
    { href: "/dashboard/marketplace", icon: ShoppingBag, label: t('dashboard.nav.marketplace') },
    { href: "/dashboard/equipment", icon: Tractor, label: t('dashboard.nav.equipment') },
    { href: "/dashboard/subsidies", icon: Landmark, label: 'Subsidies' },
    { href: "/dashboard/orders", icon: Package, label: 'My Orders' },
    { href: "/dashboard/bookings", icon: CalendarCheck2, label: 'My Bookings' },
    { href: "/dashboard/disease-scan", icon: ScanLine, label: t('dashboard.nav.diseaseScan') },
    { href: "/dashboard/chatbot", icon: BotMessageSquare, label: t('dashboard.nav.chatbot') },
  ];
  
  const advisoryNavItems = [
     { href: "/dashboard/weather-advisory", icon: CloudRain, label: "Weather Advisory" },
     { href: "/dashboard/soil-health", icon: Leaf, label: "Soil Health" },
     { href: "/dashboard/market-trends", icon: BarChart, label: "Market Trends" },
     { href: "/dashboard/disease-risk", icon: Shield, label: "Disease Risk" },
  ];

  const NavLinks = ({className}: {className?: string}) => (
    <nav className={cn("grid items-start px-2 text-sm font-medium lg:px-4", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            { "bg-muted text-primary": pathname === item.href }
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
      <Accordion type="single" collapsible className="w-full" defaultValue={advisoryNavItems.some(item => pathname.startsWith(item.href)) ? "advisory" : undefined}>
        <AccordionItem value="advisory" className="border-b-0">
          <AccordionTrigger className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:no-underline", { "bg-muted text-primary": advisoryNavItems.some(item => pathname.startsWith(item.href)) })}>
            <div className="flex items-center gap-3">
              <Wheat className="h-4 w-4" />
              {t('dashboard.nav.advisory')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-8">
            {advisoryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  { "bg-muted text-primary": pathname === item.href }
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </nav>
  );
  
  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <AgricureLogo className="h-8 w-8" />
              <span className="font-bold text-primary tracking-wider">{t('Agricure')}</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">{t('dashboard.userMenu.toggleNotifications')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('dashboard.userMenu.notifications')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span>{t('dashboard.notifications.advisory')}</span>
                    <span className="text-xs text-muted-foreground">{t('dashboard.notifications.time1')}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span>{t('dashboard.notifications.stock')}</span>
                    <span className="text-xs text-muted-foreground">{t('dashboard.notifications.time2')}</span>
                  </div>
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
                   {t('dashboard.notifications.seeAll')}
                 </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <NavLinks />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('dashboard.userMenu.toggleNav')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
               <div className="flex h-14 items-center border-b px-4">
                 <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                  <AgricureLogo className="h-8 w-8" />
                  <span className="font-bold text-primary tracking-wider">{t('Agricure')}</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <NavLinks className="px-4" />
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <CartSheet />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={onboardingData.profilePictureUrl || undefined} alt={onboardingData.name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">{t('dashboard.userMenu.toggleUserMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{onboardingData.name}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>{t('dashboard.userMenu.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/membership')}>
                <Award className="mr-2 h-4 w-4" />
                <span>Membership</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('dashboard.userMenu.settings')}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>{t('dashboard.userMenu.theme')}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>{t('dashboard.userMenu.light')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>{t('dashboard.userMenu.dark')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Laptop className="mr-2 h-4 w-4" />
                        <span>{t('dashboard.userMenu.system')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                   <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <Languages className="mr-2 h-4 w-4" />
                    <span>{t('dashboard.userMenu.language')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>{t('dashboard.userMenu.notifications')}</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/chatbot')}>
                <ShieldQuestion className="mr-2 h-4 w-4" />
                <span>{t('dashboard.userMenu.support')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('dashboard.userMenu.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-farm-landscape overflow-auto">
          {children}
        </main>
      </div>
    </div>
    </>
  );
}

    