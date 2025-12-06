
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ShoppingCart, Bolt, CalendarPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-language";
import { useAppState } from "@/hooks/use-app-state";


const equipment = [
  { id: 1, name: "Tractor", image: "https://www.deere.co.in/assets/images/region-1/products/tractors/john-deere-e-series-cab.jpg", imageHint: "tractor agriculture", priceRent: "₹1500/day", priceBuy: "₹8,00,000", available: true, category: "Heavy Machinery" },
  { id: 2, name: "Harvester", image: "https://5.imimg.com/data5/WC/IE/YH/ANDROID-86040604/prod-20200810-2031297210080910753376724-jpg.jpg", imageHint: "harvester field", priceRent: "₹8000/day", priceBuy: "₹25,00,000", available: true, category: "Heavy Machinery" },
  { id: 3, name: "Rotavator", image: "https://www.fieldking.com/blogs/wp-content/uploads/2025/05/tractor-blade.jpg", imageHint: "rotavator farm", priceRent: "₹1000/day", priceBuy: "₹1,20,000", available: false, category: "Implements" },
  { id: 4, name: "Pesticide Sprayer Drone", image: "https://www.kisanestore.com/image/cache/data/Prime%20UAV/Spraying-Picture-500x554.jpg", imageHint: "agriculture drone", priceRent: "₹3000/day", priceBuy: "₹5,00,000", available: true, category: "Drones" },
  { id: 5, name: "Seed Drill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRLIMnqBP69WFMRbdbVR_oYmbxndQK4WSDvA&s", imageHint: "seed drill", priceRent: "₹1200/day", priceBuy: "₹85,000", available: true, category: "Implements" },
  { id: 6, name: "Water Pump (5HP)", image: "https://m.media-amazon.com/images/I/81gfbaDrL1L.jpg", imageHint: "water pump", priceRent: "₹500/day", priceBuy: "₹25,000", available: false, category: "Pumps" },
  { id: 7, name: "Power Tiller", image: "https://www.mahindratractor.com/sites/default/files/styles/1532x912/public/2025-03/Blog-02-Power%20Tiller%20Uses%20Types%20%26%20Benefits%20%E2%80%93%20A%20Complete%20Guide-Detail.webp?itok=2StT5Bcr", imageHint: "power tiller", priceRent: "₹1800/day", priceBuy: "₹1,50,000", available: true, category: "Heavy Machinery" },
  { id: 8, name: "Thresher", image: "https://www.mahindratractor.com/sites/default/files/2024-07/DM_Paddy_Multi_Crop_Thresher.webp", imageHint: "thresher machine", priceRent: "₹2500/day", priceBuy: "₹2,00,000", available: true, category: "Heavy Machinery" },
  { id: 9, name: "Submersible Pump", image: "https://4.imimg.com/data4/YP/II/MY-6331039/submersible-pump.png", imageHint: "submersible pump", priceRent: "₹700/day", priceBuy: "₹40,000", available: true, category: "Pumps" },
  // Tools moved from marketplace
  { id: 401, name: "Gardening Hand Tools Kit", image: "https://nurserylive.com/cdn/shop/products/nurserylive-combo-packs-tools-basic-garden-tool-kit-gardening-tools-16968613363852.jpg?v=1634214058", imageHint: "gardening tools", priceRent: "₹100/day", priceBuy: "₹1100", available: true, category: "Tools" },
  { id: 402, name: "Shovel and Spade Set", image: "https://5.imimg.com/data5/SELLER/Default/2022/7/GC/JE/MX/157182572/gardening-tools-seed-handheld-shovel-rake-spade-trowel-with-pruning-shear-500x500.webp", imageHint: "shovel spade", priceRent: "₹90/day", priceBuy: "₹850", available: true, category: "Tools" },
  { id: 403, name: "Knapsack Sprayer (16L)", image: "https://www.machinerydukaan.com/assets/images/products/83_201008121639.png", imageHint: "knapsack sprayer", priceRent: "₹150/day", priceBuy: "₹1500", available: true, category: "Tools" },
  { id: 404, name: "Pruning Shear", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQuPyg-C2RCWVJUaRNg7N4RtRMv-ybFNOEug&s", imageHint: "pruning shear", priceRent: "₹40/day", priceBuy: "₹400", available: true, category: "Tools" },
  { id: 405, name: "Sickle (Hand tool)", image: "https://m.media-amazon.com/images/I/61aLOrNoLEL.jpg", imageHint: "sickle tool", priceRent: "₹30/day", priceBuy: "₹250", available: true, category: "Tools" },
  { id: 406, name: "Polyhouse UV Film", image: "https://www.alkarty.com/images/product/resized/500-500/161184037428-01-202161hUHqlS1wL._SL1500_.jpg", imageHint: "polyhouse farm", priceRent: "₹300/day", priceBuy: "₹3000", available: false, category: "Tools" },
  { id: 407, name: "Weeder (Manual)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqhGdyCksL39vzAKQcoIM4WxodqYcqHAu8jQ&s", imageHint: "manual weeder", priceRent: "₹100/day", priceBuy: "₹900", available: true, category: "Tools" },
  { id: 408, name: "Soil Testing Kit", image: "https://m.media-amazon.com/images/I/513TLeK7HpL._UF1000,1000_QL80_.jpg", imageHint: "soil test", priceRent: "₹200/day", priceBuy: "₹1200", available: true, category: "Tools" },
  { id: 409, name: "Pickaxe", image: "https://media.istockphoto.com/id/967674060/photo/pickaxe-vintage.jpg?s=612x612&w=0&k=20&c=2e1snM5I7fZdL1Cp4VfRESqxAvNhhMKsqLwFsT6YWeI=", imageHint: "pickaxe", priceRent: "₹70/day", priceBuy: "₹700", available: true, category: "Tools" },
  { id: 410, name: "Crowbar", image: "https://www.toolsaggarwalsteels.com/images/crowbar/crow-bar.jpg", imageHint: "crowbar", priceRent: "₹60/day", priceBuy: "₹600", available: true, category: "Tools" },
  { id: 411, name: "Wheelbarrow", image: "https://5.imimg.com/data5/QB/KR/MY-3469796/double-wheelbarrow-rubber.jpg", imageHint: "wheelbarrow", priceRent: "₹300/day", priceBuy: "₹3000", available: true, category: "Tools" },
  { id: 412, name: "Battery Sprayer (18L)", image: "https://m.media-amazon.com/images/I/61OCa-792mL._UF1000,1000_QL80_.jpg", imageHint: "battery sprayer", priceRent: "₹350/day", priceBuy: "₹3500", available: true, category: "Tools" },
  { id: 413, name: "Hand Cultivator", image: "https://m.media-amazon.com/images/I/61nvWAVzL3L._UF1000,1000_QL80_.jpg", imageHint: "hand cultivator", priceRent: "₹50/day", priceBuy: "₹450", available: true, category: "Tools" },
  { id: 414, name: "Rake", image: "https://www.faithfulltools.com/images/extralarge/FAIESSGRE.jpg?1625739611", imageHint: "garden rake", priceRent: "₹50/day", priceBuy: "₹500", available: true, category: "Tools" },
  { id: 415, name: "Hoe", image: "https://www.shutterstock.com/image-photo/grub-hoe-grab-garden-gardening-260nw-1788401426.jpg", imageHint: "garden hoe", priceRent: "₹40/day", priceBuy: "₹400", available: true, category: "Tools" },
  { id: 416, name: "Fruit Picker", image: "https://m.media-amazon.com/images/I/71T6lM0RPFL.jpg", imageHint: "fruit picker", priceRent: "₹120/day", priceBuy: "₹1200", available: true, category: "Tools" },
  { id: 417, name: "Gardening Gloves", image: "https://m.media-amazon.com/images/I/81C06reMvbL._UF1000,1000_QL80_.jpg", imageHint: "gardening gloves", priceRent: "₹20/day", priceBuy: "₹200", available: false, category: "Tools" },
  { id: 418, name: "Watering Can (10L)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWY00aF6PRIPw3poHlBNvetPkRKjn5YOfDJg&s", imageHint: "watering can", priceRent: "₹50/day", priceBuy: "₹500", available: true, category: "Tools" },
  { id: 419, name: "Hedge Shear", image: "https://m.media-amazon.com/images/I/31J1HCuZWML._UF1000,1000_QL80_.jpg", imageHint: "hedge shear", priceRent: "₹80/day", priceBuy: "₹800", available: true, category: "Tools" },
  { id: 420, name: "Power Weeder (Petrol)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvyiG_f9ShyqJ7aWkZ08j3B2KojQD0Fbh-6Q&s", imageHint: "power weeder", priceRent: "₹1500/day", priceBuy: "₹15000", available: true, category: "Tools" },
  { id: 421, name: "Brush Cutter", image: "https://yantratools.com:3000/public/uploads/products/photos/o7G7MgyhGVEajt9bUeAN14fhtFJY6CMzAZi5u16P.webp", imageHint: "brush cutter", priceRent: "₹800/day", priceBuy: "₹8000", available: true, category: "Tools" },
  { id: 422, name: "Chainsaw (Electric)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYA86PGpGYdah4hRjdRca2KT6_nBY8qwbDlA&s", imageHint: "chainsaw", priceRent: "₹750/day", priceBuy: "₹7500", available: true, category: "Tools" },
  { id: 423, name: "Manual Seed Planter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvjNZli9MevhH_uaJg6fgjAe-hBu8boxCx8Q&s", imageHint: "seed planter", priceRent: "₹250/day", priceBuy: "₹2500", available: true, category: "Tools" },
  { id: 424, name: "Earth Auger", image: "https://pre-live-admin.balwaan.com/uploads/media/2023/Earth-auger-machine-be-63-1.jpg", imageHint: "earth auger", priceRent: "₹1200/day", priceBuy: "₹12000", available: true, category: "Tools" },
  { id: 425, name: "Safety Goggles", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTITEC_WAg1T1FRAi1lAiRpFmwB2RJlkpHuOg&s", imageHint: "safety goggles", priceRent: "₹30/day", priceBuy: "₹300", available: false, category: "Tools" },
  { id: 426, name: "Tarpaulin Sheet (12x18 ft)", image: "https://static1.industrybuying.com/products/material-handling-and-packaging/tents-tarpaulins-pe-covers/tarpaulin/MAT.TAR.125853360_1708088116082.webp", imageHint: "tarpaulin sheet", priceRent: "₹80/day", priceBuy: "₹800", available: false, category: "Tools" },
  { id: 427, name: "Shade Net (50% Greening)", image: "https://agribegri.com/productimage/19979302941744113548.webp", imageHint: "shade net", priceRent: "₹150/day", priceBuy: "₹1500", available: false, category: "Tools" },
  { id: 428, name: "Lopper", image: "https://m.media-amazon.com/images/I/31TuAZTAbqL._UF1000,1000_QL80_.jpg", imageHint: "lopper tool", priceRent: "₹90/day", priceBuy: "₹900", available: true, category: "Tools" },
  { id: 429, name: "Grafting Knife", image: "https://m.media-amazon.com/images/I/51bGY2yFjmL._UF1000,1000_QL80_.jpg", imageHint: "grafting knife", priceRent: "₹40/day", priceBuy: "₹350", available: true, category: "Tools" },
  { id: 430, name: "Budding Knife", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_estnwc8shk48Eht0b_PHScK8B-UCp2-XQA&s", imageHint: "budding knife", priceRent: "₹40/day", priceBuy: "₹350", available: true, category: "Tools" },
  { id: 431, name: "Grafting Tape", image: "https://m.media-amazon.com/images/I/71fjnM2ih2L.jpg", imageHint: "grafting tape", priceRent: "₹15/day", priceBuy: "₹150", available: false, category: "Tools" },
  { id: 432, name: "pH Meter (Digital)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhbNMUVW1-S6iFIqmQg1vukasvawJzyxPV9A&s", imageHint: "ph meter", priceRent: "₹150/day", priceBuy: "₹1000", available: true, category: "Tools" },
  { id: 433, name: "EC/TDS Meter", image: "https://4.imimg.com/data4/QI/YP/MY-12365016/tds-ec-temp-ppm-meter.jpg", imageHint: "tds meter", priceRent: "₹100/day", priceBuy: "₹800", available: true, category: "Tools" },
  { id: 434, name: "Moisture Meter for Soil", image: "https://gardenerspath.com/wp-content/uploads/2021/02/Reading-a-Two-Prong-Moisture-Meter.jpg", imageHint: "moisture meter", priceRent: "₹100/day", priceBuy: "₹900", available: true, category: "Tools" },
  { id: 435, name: "Axe", image: "https://cdn.britannica.com/93/125393-050-BA7F4807/Ax.jpg?w=400&h=300&c=crop", imageHint: "axe tool", priceRent: "₹70/day", priceBuy: "₹650", available: true, category: "Tools" },
  { id: 436, name: "Sledge Hammer", image: "https://cpimg.tistatic.com/02576533/b/4/Sledge-Hammer.jpg", imageHint: "sledge hammer", priceRent: "₹120/day", priceBuy: "₹1200", available: true, category: "Tools" },
  { id: 437, name: "Post Hole Digger", image: "https://www.fieldking.com/images/seeding-and-plantation/post-hole-digger/lg/post-hole-digger.png", imageHint: "hole digger", priceRent: "₹150/day", priceBuy: "₹1500", available: true, category: "Tools" },
  { id: 438, name: "Measuring Tape (30m)", image: "https://m.media-amazon.com/images/I/61foAMNQ6WL._UF1000,1000_QL80_.jpg", imageHint: "measuring tape", priceRent: "₹40/day", priceBuy: "₹400", available: false, category: "Tools" },
  { id: 439, name: "Spading Fork", image: "https://m.media-amazon.com/images/I/51BuAXzKraL.jpg", imageHint: "garden fork", priceRent: "₹60/day", priceBuy: "₹550", available: true, category: "Tools" },
  { id: 440, name: "Hand Trowel", image: "https://www.trustbasket.com/cdn/shop/products/Untitled.png?v=1659474240", imageHint: "hand trowel", priceRent: "₹15/day", priceBuy: "₹150", available: false, category: "Tools" },
  { id: 441, name: "Khurpi (Hand Hoe)", image: "https://m.media-amazon.com/images/I/612trI6cMpL.jpg", imageHint: "hand hoe", priceRent: "₹12/day", priceBuy: "₹120", available: false, category: "Tools" },
  { id: 442, name: "Hand Fork", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi6OMkrVLJdXZvZDJrMGJk9KAsDZiP4XrDDw&s", imageHint: "hand fork", priceRent: "₹14/day", priceBuy: "₹140", available: false, category: "Tools" },
  { id: 443, name: "Tree Pruner (Long Reach)", image: "https://m.media-amazon.com/images/I/51D-OceEr5L.jpg", imageHint: "tree pruner", priceRent: "₹200/day", priceBuy: "₹1800", available: true, category: "Tools" },
  { id: 444, name: "Cono Weeder", image: "https://m.media-amazon.com/images/I/215VERbek2L._UF1000,1000_QL80_.jpg", imageHint: "cono weeder", priceRent: "₹250/day", priceBuy: "₹2200", available: true, category: "Tools" },
  { id: 445, name: "Paddy Weeder", image: "https://m.media-amazon.com/images/I/71HbNXYiU9L.jpg", imageHint: "paddy weeder", priceRent: "₹300/day", priceBuy: "₹2500", available: true, category: "Tools" },
  { id: 446, name: "Nursery Trays", image: "https://www.sveagritech.com/wp-content/uploads/2022/03/siddhi-agritech-buy-seedling-tray-online-seed-try-seed-pot-4.jpg", imageHint: "nursery trays", priceRent: "₹30/day", priceBuy: "₹300", available: false, category: "Tools" },
  { id: 447, name: "Grow Bags (12x12 inch)", image: "https://5.imimg.com/data5/SELLER/Default/2022/6/DZ/BK/CI/109107315/hdpe-uv-stabilised-grow-bag-12x12-inch.jpeg", imageHint: "grow bags", priceRent: "₹40/day", priceBuy: "₹400", available: false, category: "Tools" },
  { id: 448, name: "Poly Tunnels", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxQJFLi5PGmZqbYM5ocJHo4x2SiCs0VPAuwg&s", imageHint: "poly tunnel", priceRent: "₹500/day", priceBuy: "₹5000", available: false, category: "Tools" },
  { id: 449, name: "Insect Net", image: "https://5.imimg.com/data5/SELLER/Default/2024/2/393273302/UO/FJ/NB/34162890/insect-net.jpg", imageHint: "insect net", priceRent: "₹120/day", priceBuy: "₹1200", available: false, category: "Tools" },
  { id: 500, name: "Jute Rope (100m)", image: "https://5.imimg.com/data5/SELLER/Default/2024/11/463947623/QY/TX/YX/55714024/22mm-jute-twisted-rope-500x500.jpeg", imageHint: "jute rope", priceRent: "₹30/day", priceBuy: "₹300", available: false, category: "Tools" },
  { id: 501, name: "Bamboo Stakes (6ft)", image: "https://images-cdn.ubuy.co.in/633abf33c7837e5a7833d826-mininfa-natural-bamboo-stakes-6-feet.jpg", imageHint: "bamboo stakes", priceRent: "₹50/day", priceBuy: "₹500", available: false, category: "Tools" },
];

const categories = ["All", ...Array.from(new Set(equipment.map(e => e.category)))];

export default function EquipmentPage() {
  const { t } = useTranslation();
  const { addToCart, addToRentCart } = useAppState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mode, setMode] = useState<"rent" | "buy">("rent");

  useEffect(() => {
    if (initialCategory && categories.includes(initialCategory)) {
        setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredEquipment = equipment.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPrice = (item: (typeof equipment)[0]) => {
    const priceStr = mode === 'rent' ? item.priceRent : item.priceBuy;
    return parseFloat(priceStr.replace(/₹|,/g, '').split('/')[0]);
  }
  
  const handleBuyNow = (item: (typeof equipment)[0]) => {
     addToCart({
      id: item.id,
      name: item.name,
      price: getPrice(item),
      image: item.image,
      unit: mode === 'rent' ? 'day' : 'piece'
    });
    router.push('/dashboard/checkout');
  };

  const handleRentNow = (item: (typeof equipment)[0]) => {
    addToRentCart({
        id: item.id,
        name: item.name,
        pricePerDay: getPrice(item),
        image: item.image
    });
    router.push('/dashboard/rent-checkout');
  };

  return (
    <div className="space-y-6">
       <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.equipment.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.equipment.description')}</p>
      </div>

       <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={t('dashboard.equipment.searchPlaceholder')}
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
         <Tabs value={mode} onValueChange={(value) => setMode(value as "rent" | "buy")} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-2 w-full md:w-[200px]">
                <TabsTrigger value="rent">{t('dashboard.equipment.rent')}</TabsTrigger>
                <TabsTrigger value="buy">{t('dashboard.equipment.buy')}</TabsTrigger>
            </TabsList>
        </Tabs>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={t('dashboard.equipment.categoryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{t(`dashboard.equipment.categories.${category.toLowerCase().replace(' ', '')}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
                <div className="relative aspect-video">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                        data-ai-hint={item.imageHint}
                    />
                     <Badge variant={item.available ? "secondary" : "outline"} className={`absolute top-2 right-2 ${item.available ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : ""}`}>
                        {item.available ? t('dashboard.equipment.available') : t('dashboard.equipment.unavailable')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2 flex-grow">
                <Badge variant="outline">{t(`dashboard.equipment.categories.${item.category.toLowerCase().replace(' ', '')}`)}</Badge>
                <CardTitle className="text-xl">{item.name}</CardTitle>
                <CardDescription className="text-2xl font-bold text-primary">
                    {mode === 'rent' ? item.priceRent : item.priceBuy}
                </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Button variant="outline" disabled={!item.available} onClick={() => {
                  if (mode === 'rent') {
                    addToRentCart({
                        id: item.id,
                        name: item.name,
                        pricePerDay: getPrice(item),
                        image: item.image
                    });
                  } else {
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: getPrice(item),
                      image: item.image,
                      unit: 'piece'
                    });
                  }
                }}>
                    {mode === 'rent' ? <CalendarPlus className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4"/>}
                    {mode === 'rent' ? 'Add to Rent List' : 'Add to Cart'}
                </Button>
                <Button disabled={!item.available} onClick={() => mode === 'rent' ? handleRentNow(item) : handleBuyNow(item)}>
                    <Bolt className="mr-2 h-4 w-4"/>
                    {mode === 'rent' ? 'Rent Now' : 'Buy Now'}
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
        {filteredEquipment.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>{t('dashboard.equipment.noEquipment')}</p>
        </div>
      )}
    </div>
  );
}

    