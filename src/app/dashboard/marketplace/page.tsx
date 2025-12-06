
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
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
import { Search, ShoppingCart, Store, Bolt } from "lucide-react";
import { useTranslation } from "@/hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppState } from "@/hooks/use-app-state";

const products = [
  // Chemical Fertilizers (50 products)
  { id: 1, name: "Urea", image: "https://5.imimg.com/data5/SELLER/Default/2023/3/WN/LY/OL/157840235/iffco-urea-50kg.png", imageHint: "urea fertilizer", price: "₹268", unit: "45kg bag", category: "Chemical Fertilizers", applicationRate: "40-50 kg/acre" },
  { id: 2, name: "Ammonium Sulfate", image: "https://5.imimg.com/data5/SELLER/Default/2023/5/307164853/AV/JW/OU/160980021/ammonium-sulphate-fertilizer.jpeg", imageHint: "ammonium sulfate crystals", price: "₹1100", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "80-100 kg/acre" },
  { id: 4, name: "Calcium Ammonium Nitrate (CAN)", image: "https://i0.wp.com/nutrimaster.co.zw/wp-content/uploads/2022/10/cal_amm_nit50.png?resize=300%2C300&ssl=1", imageHint: "calcium nitrate", price: "₹1200", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "50-60 kg/acre" },
  { id: 8, name: "Sulfur-Coated Urea", image: "https://www.unikeyterra.com/wp-content/uploads/2020/01/Unikey-Sulfur-Coated-Urea.png", imageHint: "coated urea", price: "₹650", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "35-45 kg/acre" },
  { id: 10, name: "Urea Ammonium Nitrate (UAN) Solution", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYcAXAI_2cFgrumQEI-fOI34rUk6chwPSlQw&s", imageHint: "liquid fertilizer", price: "₹1500", unit: "20L can", category: "Chemical Fertilizers", applicationRate: "15-20 L/acre" },
  { id: 11, name: "Di-Ammonium Phosphate (DAP)", image: "https://tiimg.tistatic.com/fp/1/007/503/high-plant-nutrition-diammonium-phosphate-dap-fertilizer-for-agriculture-use-50-kg-bag-757.jpg", imageHint: "dap fertilizer", price: "₹1350", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "50-60 kg/acre" },
  { id: 12, name: "Mono-Ammonium Phosphate (MAP)", image: "https://kisaancart.in/wp-content/uploads/2025/01/IMG-20250104-WA0019.jpg", imageHint: "map fertilizer", price: "₹220", unit: "1kg pack", category: "Chemical Fertilizers", applicationRate: "25-30 kg/acre" },
  { id: 13, name: "Single Super Phosphate (SSP)", image: "https://www.agroes.in/product-images/20170416110602.jpeg/105281000004422510/600x600", imageHint: "ssp fertilizer", price: "₹450", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "100-150 kg/acre" },
  { id: 17, name: "Rock Phosphate", image: "https://5.imimg.com/data5/SELLER/Default/2022/8/AC/BY/HT/8713839/rock-phosphate.jpeg", imageHint: "rock phosphate", price: "₹800", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "200-300 kg/acre (basal)" },
  { id: 18, name: "Urea Phosphate", image: "https://5.imimg.com/data5/SELLER/Default/2024/12/475946174/HU/AZ/KC/19370731/1-kg-aksha-urea-phosphate-water-soluble-fertilizer.jpeg", imageHint: "urea phosphate", price: "₹300", unit: "1kg pack", category: "Chemical Fertilizers", applicationRate: "3-5 kg/acre (foliar)" },
  { id: 21, name: "Muriate of Potash (MOP)", image: "https://www.kribhco.net/assets/img/product/bharat_mop.jpg", imageHint: "mop potash", price: "₹1700", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "25-35 kg/acre" },
  { id: 22, name: "Sulfate of Potash (SOP)", image: "https://5.imimg.com/data5/ANDROID/Default/2022/5/QV/WG/PS/5610246/product-jpeg-500x500.jpg", imageHint: "sop potash", price: "₹280", unit: "1kg pack", category: "Chemical Fertilizers", applicationRate: "25-35 kg/acre" },
  { id: 23, name: "Potassium Nitrate", image: "https://cpimg.tistatic.com/09075577/b/4/AgriWin-Potassium-Nitrate-13-00-45-1-kg.jpg", imageHint: "potassium nitrate", price: "₹200", unit: "1kg pack", category: "Chemical Fertilizers", applicationRate: "3-5 kg/acre (foliar)" },
  { id: 26, name: "Potassium Magnesium Sulfate (K-Mag)", image: "https://m.media-amazon.com/images/I/71J02UPYJAL._UF1000,1000_QL80_.jpg", imageHint: "k-mag fertilizer", price: "₹1500", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "40-50 kg/acre" },
  { id: 31, name: "NPK 12-32-16", image: "https://5.imimg.com/data5/SELLER/Default/2022/2/IF/KB/MF/16301773/coromandel-gromor-12-32-16.png", imageHint: "npk fertilizer", price: "₹1400", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "50-75 kg/acre" },
  { id: 32, name: "NPK 10-26-26", image: "https://5.imimg.com/data5/SELLER/Default/2022/10/FZ/VL/NE/3930350/gromor-10-26-26-fertilizer.png", imageHint: "npk fertilizer", price: "₹1470", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "50-75 kg/acre" },
  { id: 33, name: "NPK 19-19-19", image: "https://m.media-amazon.com/images/I/51kygh1Ee7L._UF1000,1000_QL80_.jpg", imageHint: "npk water soluble", price: "₹150", unit: "1kg pack", category: "Chemical Fertilizers", applicationRate: "3-5 kg/acre (foliar)" },
  { id: 37, name: "NPK 15-15-15", image: "https://5.imimg.com/data5/SELLER/Default/2022/2/ZE/PJ/NE/16301773/gromor-15-15-15-09-fertiliser.png", imageHint: "npk complex", price: "₹1200", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "60-80 kg/acre" },
  { id: 38, name: "NPK 17-17-17", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8iT96ouWNxSWz_FV7UPv5UdtknnQUZM2WNQ&s", imageHint: "npk complex", price: "₹1300", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "60-80 kg/acre" },
  { id: 41, name: "Zinc Sulfate", image: "https://mahadhan.co.in/wp-content/uploads/2017/05/mircronutrients5.jpg", imageHint: "zinc sulphate", price: "₹400", unit: "5kg bag", category: "Chemical Fertilizers", applicationRate: "5-10 kg/acre" },
  { id: 42, name: "Ferrous Sulfate", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLjeLofOah7gg_YUch4Uriu68lBljZv3BuuQ&s", imageHint: "ferrous sulphate", price: "₹150", unit: "1kg pack", category: "Chemical Fertilizers", applicationRate: "10-12 kg/acre" },
  { id: 43, name: "Manganese Sulfate", image: "https://m.media-amazon.com/images/I/71hYbLasIyL.jpg", imageHint: "manganese sulphate", price: "₹200", unit: "1kg pack", category: "Chemical Fertilizers", applicationRate: "4-5 kg/acre" },
  { id: 44, name: "Copper Sulfate", image: "https://5.imimg.com/data5/SELLER/Default/2024/5/420870358/CB/BC/DF/41673194/copper-sulphate-powder-500x500.jpeg", imageHint: "copper sulphate", price: "₹300", unit: "500g pack", category: "Chemical Fertilizers", applicationRate: "2-3 kg/acre" },
  { id: 45, name: "Borax (Boron Source)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrkHjsAExIIh1xvIRC0RoQSsU34IyETUDt6Q&s", imageHint: "boron fertilizer", price: "₹250", unit: "1kg pack", category: "Chemical Fertilizers", applicationRate: "1-2 kg/acre" },
  { id: 48, name: "Calcium Nitrate", image: "https://m.media-amazon.com/images/I/51XJ3Cv7vsL._UF1000,1000_QL80_.jpg", imageHint: "calcium nitrate", price: "₹180", unit: "1kg pack", category: "Chemical Fertilizers", applicationRate: "5-10 kg/acre" },
  { id: 49, name: "Magnesium Sulfate (Epsom Salt)", image: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2024/12/7/17bf5d4d-f123-4957-ad46-f5fbea93898a_818365_1.png", imageHint: "epsom salt", price: "₹120", unit: "1kg pack", category: "Chemical Fertilizers", applicationRate: "8-10 kg/acre" },
  { id: 50, name: "Gypsum (Calcium Sulfate)", image: "https://5.imimg.com/data5/SELLER/Default/2023/11/363276185/TQ/SF/RJ/116294758/vijeta-super-power-gypsum-agriculture-grade-50-kg-500x500.jpeg", imageHint: "gypsum powder", price: "₹250", unit: "50kg bag", category: "Chemical Fertilizers", applicationRate: "200-400 kg/acre (for reclamation)" },

  // Organic Fertilizers (50 products)
  { id: 101, name: "Cow Dung Manure", image: "https://m.media-amazon.com/images/I/71+CZ2NYGWL._UF1000,1000_QL80_.jpg", imageHint: "cow manure", price: "₹200", unit: "5kg bag", category: "Organic Fertilizers", applicationRate: "400-500 kg/acre" },
  { id: 102, name: "Poultry Litter", image: "https://m.media-amazon.com/images/I/61hJGdxALdL._UF1000,1000_QL80_.jpg", imageHint: "poultry manure", price: "₹300", unit: "10kg bag", category: "Organic Fertilizers", applicationRate: "200-300 kg/acre" },
  { id: 103, name: "Goat Manure", image: "https://m.media-amazon.com/images/I/710NRiJ1hML.jpg", imageHint: "goat manure", price: "₹250", unit: "5kg bag", category: "Organic Fertilizers", applicationRate: "300-400 kg/acre" },
  { id: 107, name: "Bone Meal", image: "https://m.media-amazon.com/images/I/61C+sf-8SBL._UF1000,1000_QL80_.jpg", imageHint: "bone meal", price: "₹450", unit: "5kg bag", category: "Organic Fertilizers", applicationRate: "80-100 kg/acre" },
  { id: 108, name: "Blood Meal", image: "https://m.media-amazon.com/images/I/71s669Kke3L.jpg", imageHint: "blood meal", price: "₹600", unit: "5kg bag", category: "Organic Fertilizers", applicationRate: "40-50 kg/acre" },
  { id: 109, name: "Fish Meal", image: "https://m.media-amazon.com/images/I/81vILoWOoQL.jpg", imageHint: "fish meal", price: "₹700", unit: "5kg bag", category: "Organic Fertilizers", applicationRate: "60-80 kg/acre" },
  { id: 111, name: "Neem Cake", image: "https://m.media-amazon.com/images/I/61otkTP3huL.jpg", imageHint: "neem cake", price: "₹500", unit: "10kg bag", category: "Organic Fertilizers", applicationRate: "150-200 kg/acre" },
  { id: 112, name: "Castor Cake", image: "https://m.media-amazon.com/images/I/51ZZ4rvHxpL._UF1000,1000_QL80_.jpg", imageHint: "castor cake", price: "₹350", unit: "5kg bag", category: "Organic Fertilizers", applicationRate: "150-200 kg/acre" },
  { id: 113, name: "Groundnut Cake", image: "https://dukaan.b-cdn.net/700x700/webp/download-and-upload/f44a016b-7878-4c98-94f5-1f50e7b5eb68.jpeg", imageHint: "groundnut cake", price: "₹450", unit: "5kg bag", category: "Organic Fertilizers", applicationRate: "150-200 kg/acre" },
  { id: 114, name: "Mustard Cake", image: "https://m.media-amazon.com/images/I/71GQ3MxIBEL._UF1000,1000_QL80_.jpg", imageHint: "mustard cake", price: "₹400", unit: "5kg bag", category: "Organic Fertilizers", applicationRate: "150-200 kg/acre" },
  { id: 120, name: "Seaweed Extract", image: "https://5.imimg.com/data5/SELLER/Default/2024/6/431046543/MU/BY/BT/225058468/premium-seaweed-extract-liquid-500x500.jpg", imageHint: "seaweed fertilizer", price: "₹600", unit: "1L bottle", category: "Organic Fertilizers", applicationRate: "1-2 L/acre (foliar)" },
  { id: 121, name: "Compost (General)", image: "https://m.media-amazon.com/images/I/51uIq5knykL._UF1000,1000_QL80_.jpg", imageHint: "compost pile", price: "₹250", unit: "10kg bag", category: "Organic Fertilizers", applicationRate: "1-2 tons/acre" },
  { id: 122, name: "Vermicompost", image: "https://m.media-amazon.com/images/I/612JPcKSEPL._UF1000,1000_QL80_.jpg", imageHint: "vermicompost", price: "₹350", unit: "5kg bag", category: "Organic Fertilizers", applicationRate: "0.5-1 ton/acre" },
  { id: 123, name: "Farmyard Manure (FYM)", image: "https://rukminim2.flixcart.com/image/480/480/jped7rk0/soil-manure/f/2/v/7-5-organic-farm-yard-manure-7-5-kg-s-turtye-original-imafb5emtyseyksh.jpeg?q=90", imageHint: "farmyard manure", price: "₹1500", unit: "tractor trolley", category: "Organic Fertilizers", applicationRate: "4-5 tons/acre" },
  { id: 124, name: "City Compost", image: "https://d91ztqmtx7u1k.cloudfront.net/ClientContent/Images/Catalogue/city-compost-fertilizer-for-a-20240529155811971.png", imageHint: "city compost", price: "₹300", unit: "40kg bag", category: "Organic Fertilizers", applicationRate: "1-2 tons/acre" },
  { id: 125, name: "Sugarcane Press Mud", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbr1zQGcjQvKsI50EoWXukbgreNGSNnbtV8Q&s", imageHint: "pressmud", price: "₹200", unit: "50kg bag", category: "Organic Fertilizers", applicationRate: "2-3 tons/acre" },
  { id: 126, name: "Green Manure (Sunhemp Seeds)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe2BEusZFUiZn0xHBccoNIMr2kuCajvgMBsQ&s", imageHint: "sunhemp seeds", price: "₹150", unit: "1kg pack", category: "Organic Fertilizers", applicationRate: "20-25 kg seed/acre" },
  { id: 130, name: "Kitchen Waste Compost", image: "https://m.media-amazon.com/images/I/71zxEAIaI7L.jpg", imageHint: "kitchen compost", price: "₹300", unit: "5kg bag", category: "Organic Fertilizers", applicationRate: "Varies, for home use" },
  { id: 131, name: "Jeevamrutha", image: "https://5.imimg.com/data5/SELLER/Default/2021/4/XX/PE/OE/11421514/20-litre-jivamrit-liquid-organic-fertilizer-500x500.jpg", imageHint: "jeevamrutha liquid", price: "₹500", unit: "20L can", category: "Organic Fertilizers", applicationRate: "200 L/acre per application" },
  { id: 132, name: "Panchagavya", image: "https://5.imimg.com/data5/HZ/JQ/DH/ANDROID-10753644/product-jpeg-500x500.jpg", imageHint: "panchagavya liquid", price: "₹800", unit: "5L can", category: "Organic Fertilizers", applicationRate: "3% solution for foliar spray" },
  { id: 135, name: "Compost Tea", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXnrkEqPvYgQENKOaSS7_OefSMK7zYYy4l8g&s", imageHint: "compost tea", price: "₹250", unit: "5L can", category: "Organic Fertilizers", applicationRate: "10-20 L/acre" },
  { id: 136, name: "Vermiwash", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST1R47V2dCb4zBq8DRmUrYtmIyM1xGXT3WBA&s", imageHint: "vermiwash liquid", price: "₹400", unit: "5L can", category: "Organic Fertilizers", applicationRate: "5-10% solution for foliar spray" },
  { id: 141, name: "Rhizobium Biofertilizer", image: "https://agribegri.com/productimage/9352917941718885003.webp", imageHint: "biofertilizer packet", price: "₹200", unit: "1L bottle", category: "Organic Fertilizers", applicationRate: "200-250 ml/acre (seed treatment)" },
  { id: 143, name: "Azotobacter Biofertilizer", image: "https://5.imimg.com/data5/SELLER/Default/2023/7/329971960/GY/QK/HW/32061424/azotobacter-biofertilizers.jpg", imageHint: "biofertilizer bottle", price: "₹200", unit: "1L bottle", category: "Organic Fertilizers", applicationRate: "200-250 ml/acre" },
  { id: 144, name: "Phosphobacteria Biofertilizer (PSB)", image: "https://agribegri.com/productimage/9707464451727151616.webp", imageHint: "psb biofertilizer", price: "₹220", unit: "1L bottle", category: "Organic Fertilizers", applicationRate: "200-250 ml/acre" },
  { id: 146, name: "Vesicular-Arbuscular Mycorrhiza (VAM)", image: "https://m.media-amazon.com/images/I/71fkLReFWEL._UF1000,1000_QL80_.jpg", imageHint: "mycorrhiza powder", price: "₹450", unit: "1kg pack", category: "Organic Fertilizers", applicationRate: "4-5 kg/acre" },
  { id: 147, name: "Trichoderma Biofertilizer", image: "https://5.imimg.com/data5/SELLER/Default/2024/10/457129452/NY/CG/EY/82549912/trichoderma-biofertilizer-500x500.jpg", imageHint: "trichoderma powder", price: "₹680", unit: "1kg pack", category: "Organic Fertilizers", applicationRate: "1-2 kg/acre" },
  { id: 150, name: "Azolla Biofertilizer", image: "https://trivandrumnursery.com/img/p/7/6/8/768-large_default.jpg", imageHint: "azolla plant", price: "₹300", unit: "1kg live culture", category: "Organic Fertilizers", applicationRate: "400-500 kg/acre (in paddy)" },

  // Seeds
  { id: 201, name: "Hybrid Paddy Seeds (Basmati)", image: "https://rukminim2.flixcart.com/image/480/640/xif0q/plant-seed/o/r/o/1-hybrid-1kg-hybrid-paddy-seeds-highest-yield-verity-very-testy-original-imahd8cyf3hchvvr.jpeg?q=90", imageHint: "paddy seeds", price: "₹400", unit: "1kg pack", category: "Seeds" },
  { id: 202, name: "High-Yield Wheat Seeds", image: "https://5.imimg.com/data5/SELLER/Default/2025/7/526114408/IL/MQ/CW/1769358/ifsa-wheat-dhruv-seed-500x500.png", imageHint: "wheat seeds", price: "₹1200", unit: "20kg pack", category: "Seeds" },
  { id: 203, name: "Hybrid Maize Seeds", image: "https://m.media-amazon.com/images/I/41ljkpz1bPL._UF1000,1000_QL80_.jpg", imageHint: "maize seeds", price: "₹950", unit: "5kg pack", category: "Seeds" },
  { id: 204, name: "Soybean Seeds (JS-335)", image: "https://5.imimg.com/data5/SELLER/Default/2025/8/539878864/MG/XC/AI/109013098/19-500x500.png", imageHint: "soybean seeds", price: "₹2500", unit: "30kg pack", category: "Seeds" },
  { id: 205, name: "Mustard Seeds (Hybrid)", image: "https://tiimg.tistatic.com/fp/2/007/002/hybrid-mustard-seed--069.jpg", imageHint: "mustard seeds", price: "₹500", unit: "1kg pack", category: "Seeds" },
  { id: 206, name: "Cotton Seeds (BT)", image: "https://5.imimg.com/data5/SELLER/Default/2022/4/ZP/KX/RI/101068562/dried-cotton-seeds-500x500.jpeg", imageHint: "cotton seeds", price: "₹850", unit: "450g pack", category: "Seeds" },
  { id: 210, name: "Tomato Seeds (Hybrid)", image: "https://m.media-amazon.com/images/I/61c8UcyuByL._UF1000,1000_QL80_.jpg", imageHint: "tomato seeds", price: "₹350", unit: "10g pack", category: "Seeds" },
  { id: 211, name: "Onion Seeds (Red)", image: "https://tiimg.tistatic.com/fp/2/007/982/natural-sun-drying-onion-vegetable-seeds-packaging-size-500-gm-785.jpg", imageHint: "onion seeds", price: "₹900", unit: "500g pack", category: "Seeds" },
  { id: 212, name: "Chilli Seeds (Hybrid)", image: "https://agribegri.com/productimage/63aa8de86dc3e485e14138ca85f76c59-08-06-25-09-55-04.jpg", imageHint: "chilli seeds", price: "₹450", unit: "10g pack", category: "Seeds" },

  // Pesticides (Insecticides)
  { id: 302, name: "Imidacloprid 17.8% SL", image: "https://agribegri.com/productimage/9177795341754294797.webp", imageHint: "pesticide bottle", price: "₹550", unit: "1L bottle", category: "Pesticides", applicationRate: "120-150 ml/acre" },
  { id: 304, name: "Chlorpyrifos 20% EC", image: "https://5.imimg.com/data5/SELLER/Default/2025/8/538956534/KN/XK/LI/150866550/chlorpyrifos-20-ec.png", imageHint: "pesticide bottle", price: "₹700", unit: "1L bottle", category: "Pesticides", applicationRate: "300-400 ml/acre" },
  { id: 314, name: "Fipronil 5% SC", image: "https://5.imimg.com/data5/SELLER/Default/2024/10/460023700/AM/ET/NF/157546748/fipronil-5-percent-sc-insecticide-500x500.png", imageHint: "insecticide bottle", price: "₹900", unit: "1L bottle", category: "Pesticides", applicationRate: "400-500 ml/acre" },
  { id: 315, name: "Thiamethoxam 25% WG", image: "https://cpimg.tistatic.com/5961346/b/1/thiamethoxam-25-wg-insecticide.jpg", imageHint: "insecticide granules", price: "₹1200", unit: "500g pack", category: "Pesticides", applicationRate: "40-50 g/acre" },
  { id: 320, name: "Emamectin Benzoate 5% SG", image: "https://cdn.moglix.com/p/q8oP3puAYCdUN-xxlarge.jpg", imageHint: "insecticide sachet", price: "₹1500", unit: "250g pack", category: "Pesticides", applicationRate: "80-100 g/acre" },

  // Pesticides (Fungicides)
  { id: 326, name: "Mancozeb 75% WP", image: "https://5.imimg.com/data5/SELLER/Default/2021/7/YQ/QT/WW/134851546/mancozeb-75-wp.jpg", imageHint: "fungicide powder", price: "₹600", unit: "1kg pack", category: "Pesticides", applicationRate: "500-600 g/acre" },
  { id: 327, name: "Carbendazim 50% WP", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV2tAUuCHajH0l6QLJNRY1a-Hy-7QnmsMtdg&s", imageHint: "fungicide sachet", price: "₹450", unit: "500g pack", category: "Pesticides", applicationRate: "200-250 g/acre" },
  { id: 328, name: "Copper Oxychloride 50% WP", image: "https://dujjhct8zer0r.cloudfront.net/media/prod_image/10405480521750828538.webp", imageHint: "fungicide blue powder", price: "₹700", unit: "1kg pack", category: "Pesticides", applicationRate: "800-1000 g/acre" },
  { id: 330, name: "Hexaconazole 5% SC", image: "https://static.agrostar.in/static/AGS-CP-935_N3_1.jpg", imageHint: "fungicide bottle", price: "₹850", unit: "1L bottle", category: "Pesticides", applicationRate: "200-300 ml/acre" },
  { id: 337, name: "Azoxystrobin 23% SC", image: "https://5.imimg.com/data5/SELLER/Default/2025/7/527269343/EZ/XS/QA/4405231/azoxystrobin-23-sc-500x500.png", imageHint: "fungicide liquid", price: "₹1800", unit: "1L bottle", category: "Pesticides", applicationRate: "200-250 ml/acre" },

  // Pesticides (Herbicides)
  { id: 346, name: "Glyphosate 41% SL", image: "https://agribegri.com/productimage/7354035311733221089.webp", imageHint: "herbicide bottle", price: "₹850", unit: "1L bottle", category: "Pesticides", applicationRate: "0.8-1.2 L/acre" },
  { id: 347, name: "2,4-D Amine Salt 58% SL", image: "https://kisansewakendra.in/cdn/shop/files/WhatsAppImage2025-04-18at13.24.28_1.jpg?v=1744963783", imageHint: "herbicide can", price: "₹650", unit: "1L bottle", category: "Pesticides", applicationRate: "400-500 ml/acre" },
  { id: 348, name: "Butachlor 50% EC", image: "https://5.imimg.com/data5/SELLER/Default/2022/3/DJ/KA/ZS/55734837/agriculture-butachlor-50-ec-herbicide.jpg", imageHint: "herbicide liquid", price: "₹600", unit: "1L bottle", category: "Pesticides", applicationRate: "1-1.2 L/acre (in paddy)" },
  { id: 349, name: "Pendimethalin 30% EC", image: "https://dujjhct8zer0r.cloudfront.net/media/prod_image/11530436271747117184.webp", imageHint: "herbicide yellow can", price: "₹750", unit: "1L bottle", category: "Pesticides", applicationRate: "1-1.3 L/acre" },
  { id: 350, name: "Atrazine 50% WP", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAHg4HUxAGlIFy8Qj--uuq9AVBoLCfjy8dqQ&s", imageHint: "herbicide powder", price: "₹500", unit: "500g pack", category: "Pesticides", applicationRate: "400-600 g/acre (in maize/sugarcane)" },

  // Pesticides (Biopesticides)
  { id: 351, name: "Neem Oil (1500 PPM)", image: "https://kisansewakendra.in/cdn/shop/files/WhatsAppImage2025-01-06at5.06.25PM_1.jpg?v=1736165162", imageHint: "neem oil", price: "₹800", unit: "1L bottle", category: "Pesticides", applicationRate: "1-2 L/acre" },
  { id: 352, name: "Bacillus thuringiensis (Bt)", image: "https://5.imimg.com/data5/SELLER/Default/2023/2/CE/IN/IF/108900452/bacillus-thuringiensis.jpg", imageHint: "bio insecticide", price: "₹900", unit: "1kg pack", category: "Pesticides", applicationRate: "400-500 g/acre" },
  { id: 353, name: "Trichoderma viride", image: "https://m.media-amazon.com/images/I/61kA8t-efbL._UF1000,1000_QL80_.jpg", imageHint: "bio fungicide powder", price: "₹650", unit: "1kg pack", category: "Pesticides", applicationRate: "2-3 kg/acre (soil application)" },
  { id: 354, name: "Beauveria bassiana", image: "https://m.media-amazon.com/images/I/71iomyPyWCL._UF1000,1000_QL80_.jpg", imageHint: "bio pesticide", price: "₹750", unit: "1kg pack", category: "Pesticides", applicationRate: "1-1.5 kg/acre" },
  { id: 355, name: "Pseudomonas fluorescens", image: "https://m.media-amazon.com/images/I/61kjIv0BicL.jpg", imageHint: "bio bactericide", price: "₹700", unit: "1kg pack", category: "Pesticides", applicationRate: "1-2 kg/acre" },
  
  // Irrigation
  { id: 401, name: "Drip Irrigation Kit (1 Acre)", image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcReB75GpE376XkEkW1y0CCwZuC5ygy0wEqW87Ef9R0PYOelT9UbCwFQX87uscDSF7N5hDrFX9poyjp8O2qXGyYoA_rtiPO2", imageHint: "drip irrigation", price: "₹4500", unit: "per kit", category: "Irrigation" },
  { id: 402, name: "Sprinkler System (Full Set)", image: "https://m.media-amazon.com/images/I/61y79NQkt3L.jpg", imageHint: "sprinkler system", price: "₹7500", unit: "per set", category: "Irrigation" },
  { id: 403, name: "16mm Drip Lateral Pipe (100m)", image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSLoTpk1VHGBhcYcOEqeMbONzoPNuPznUKZcFZcaTiy_YBbCJS7qvf6oimQmnDAnNf9kIKAJom_WKS5bVeStCv4DsFrh-HMg_T8xIsE-umLzBSiyYu7Q8dVYg", imageHint: "irrigation pipe", price: "₹800", unit: "per roll", category: "Irrigation" },
  { id: 406, name: "Rain Gun Sprinkler", image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSxoAak5YHhMCv3-kRdeM-F--Ql32mo3oGPWDGodfcYxUQKsNpvMPom2D-fG_EIcC0fuRgt-ob06_sf_Ge0xtpShl7_SdFWMwgJrssrH8cmJ6RIW2n2hJjC", imageHint: "rain gun", price: "₹3500", unit: "per piece", category: "Irrigation" },
  { id: 407, name: "Venturi Fertilizer Injector (1 inch)", image: "https://m.media-amazon.com/images/I/51X0PTs1iGL.jpg", imageHint: "fertilizer injector", price: "₹1200", unit: "per piece", category: "Irrigation" },
];


const categories = ["All", "Chemical Fertilizers", "Organic Fertilizers", "Seeds", "Pesticides", "Irrigation"];

export default function MarketplacePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { addToCart } = useAppState();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuyNow = (product: (typeof products)[0]) => {
     addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace('₹', '')),
      image: product.image,
      unit: product.unit
    });
    router.push('/dashboard/checkout');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.marketplace.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.marketplace.description')}</p>
      </div>
      
      <Tabs defaultValue="buy">
        <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
          <TabsTrigger value="buy">
            <ShoppingCart className="mr-2 h-4 w-4" /> Buy Inputs
          </TabsTrigger>
          <TabsTrigger value="sell">
            <Store className="mr-2 h-4 w-4" /> Sell Produce
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="mt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder={t('dashboard.marketplace.searchPlaceholder')}
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[240px]">
                <SelectValue placeholder={t('dashboard.marketplace.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{t(`dashboard.marketplace.categories.${category.toLowerCase().replace(/ /g, '')}`, {defaultValue: category})}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            {filteredProducts.map((product) => {
                const displayPrice = product.price;
                const priceUnit = `/ ${t(`dashboard.marketplace.units.${(product.unit || '').replace(/ /g, '').replace(/\//g, '')}`, {defaultValue: product.unit})}`;

              return (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                 <CardHeader className="p-0">
                    <div className="relative aspect-video">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                            data-ai-hint={product.imageHint}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 flex-grow">
                  <Badge variant="outline">{t(`dashboard.marketplace.categories.${product.category.toLowerCase().replace(/ /g, '')}`, {defaultValue: product.category})}</Badge>
                  <CardTitle className="text-xl h-14">{product.name}</CardTitle>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{displayPrice}</span>
                     <span className="text-sm text-muted-foreground">{priceUnit}</span>
                  </div>
                   {product.applicationRate && (
                     <CardDescription>
                       <strong>Application Rate:</strong> {product.applicationRate}
                     </CardDescription>
                   )}
                </CardContent>
                <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: parseFloat(product.price.replace('₹', '')),
                      image: product.image,
                      unit: product.unit
                    })}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                  </Button>
                   <Button onClick={() => handleBuyNow(product)}>
                      <Bolt className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                </CardFooter>
              </Card>
            )})}
          </div>
           {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t('dashboard.marketplace.noProducts')}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sell" className="mt-6">
           <Card className="text-center">
              <CardHeader>
                <CardTitle>Sell Your Produce Directly</CardTitle>
                <CardDescription>Sell your produce at your fingertip</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="h-48 w-48 relative mx-auto mb-4">
                      <Image src="https://picsum.photos/seed/agricure-payment/400" alt="Agricure Payment" fill className="object-cover rounded-lg" data-ai-hint="digital payment farm" />
                  </div>
                   <Button asChild>
                    <Link href="/dashboard/sell">Start Selling</Link>
                  </Button>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
