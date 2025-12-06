
"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Sun, CloudRain, Shield, BarChart, Leaf, Wind, Apple, Wheat, PawPrint, Sprout, Briefcase, FlaskConical, Fish, Dna } from "lucide-react";
import Link from 'next/link';
import { useTranslation } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { t } = useTranslation();

  const carouselItems = [
    {
      id: 1,
      title: t('dashboard.carousel.offer.title'),
      description: t('dashboard.carousel.offer.description'),
      image: "https://www.icl-group.com/wp-content/uploads/2022/07/fetilizers-101-1-1.jpg",
      imageHint: "fertilizer bags",
      badge: t('dashboard.carousel.offer.badge'),
      href: "/dashboard/marketplace"
    },
    {
      id: 2,
      title: t('dashboard.carousel.news.title'),
      description: t('dashboard.carousel.news.description'),
      image: "https://www.krishitek.com/wp-content/uploads/2024/11/Government-Schemes-for-Machinery-that-Power-Your-Farm.jpg",
      imageHint: "government agriculture",
      badge: t('dashboard.carousel.news.badge'),
      href: "/dashboard/subsidies"
    },
    {
      id: 3,
      title: t('dashboard.carousel.ad.title'),
      description: t('dashboard.carousel.ad.description'),
      image: "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png.webp",
      imageHint: "agriculture drone",
      badge: t('dashboard.carousel.ad.badge'),
      href: "/dashboard/equipment?category=Drones"
    }
  ];

  const advisoryCards = [
      {
          title: t('dashboard.glance.weather.title'),
          description: t('dashboard.glance.weather.description'),
          icon: CloudRain,
          href: "/dashboard/weather-advisory"
      },
      {
          title: t('dashboard.glance.soil.title'),
          description: t('dashboard.glance.soil.description'),
          icon: Leaf,
          href: "/dashboard/soil-health"
      },
      {
          title: t('dashboard.glance.market.title'),
          description: t('dashboard.glance.market.description'),
          icon: BarChart,
          href: "/dashboard/market-trends"
      },
      {
          title: t('dashboard.glance.disease.title'),
          description: t('dashboard.glance.disease.description'),
          icon: Shield,
          href: "/dashboard/disease-risk"
      }
  ]

  const interestFields = [
    {
      "field": "Horticulture",
      "description": "Cultivation of fruits, vegetables, flowers, and ornamental plants.",
      "icon": Apple,
      "href": "/dashboard/interests/horticulture"
    },
    {
      "field": "Agronomy",
      "description": "Science of soil management and crop production.",
      "icon": Wheat,
       "href": "/dashboard/interests/agronomy"
    },
    {
      "field": "Animal Husbandry",
      "description": "Care and breeding of domestic animals.",
      "icon": PawPrint,
       "href": "/dashboard/interests/animal-husbandry"
    },
    {
      "field": "Organic Farming",
      "description": "Farming without synthetic chemicals.",
      "icon": Sprout,
       "href": "/dashboard/interests/organic-farming"
    },
    {
      "field": "Agri-Business",
      "description": "Business of agricultural production.",
      "icon": Briefcase,
       "href": "/dashboard/interests/agri-business"
    },
    {
      "field": "Food Technology",
      "description": "Study of food processing and preservation.",
      "icon": FlaskConical,
       "href": "/dashboard/interests/food-technology"
    },
    {
      "field": "Aquaculture",
      "description": "Farming of aquatic organisms.",
      "icon": Fish,
       "href": "/dashboard/interests/aquaculture"
    },
    {
      "field": "Biotechnology",
      "description": "Use of tech for crop improvement.",
      "icon": Dna,
       "href": "/dashboard/interests/biotechnology"
    }
  ];

  return (
    <div className="space-y-6">
      <Carousel
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {carouselItems.map((item) => (
            <CarouselItem key={item.id}>
              <Link href={item.href} className="block group">
                <div className="relative aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3/1] rounded-lg overflow-hidden group-hover:ring-2 group-hover:ring-primary group-hover:ring-offset-2 transition-all">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    data-ai-hint={item.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-8 text-white">
                    <Badge variant="secondary" className="mb-2">{item.badge}</Badge>
                    <h2 className="text-2xl md:text-4xl font-bold font-headline">{item.title}</h2>
                    <p className="hidden md:block mt-2 max-w-2xl">{item.description}</p>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">{t('dashboard.glance.title')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {advisoryCards.map((card) => (
             <Link href={card.href} key={card.title}>
                <Card className="hover:bg-muted/80 transition-colors h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-bold text-primary">
                        {card.title}
                        </CardTitle>
                        <card.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {card.description}
                        </p>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </div>

       <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Interested in any other Fields??</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {interestFields.map(interest => (
            <Link href={interest.href} key={interest.field}>
              <Card className="flex flex-col h-full group hover:shadow-lg transition-shadow bg-[#F2F5F1]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg font-bold text-[#364D34]">
                    <interest.icon className="h-6 w-6 text-[#364D34]" />
                    {interest.field}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-[#343A40]">{interest.description}</p>
                </CardContent>
                 <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-[#56AB2F] to-[#A8E063] hover:from-[#A8E063] hover:to-[#56AB2F] text-white font-semibold py-2 px-6 rounded-xl shadow-[0_3px_10px_rgba(86,171,47,0.4)] border border-[#DCE35B] transition-all duration-300"
                    >
                      Learn More
                    </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
