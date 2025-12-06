
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const subsidySchemes = [
    {
        title: "PM-KISAN Scheme",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "Provides income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
        benefits: ["Direct income support", "Financial stability for small and marginal farmers"],
        eligibility: "All landholding farmer families with cultivable land.",
        link: "https://pmkisan.gov.in/"
    },
    {
        title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "An insurance service for farmers for their yields. It covers pre-sowing to post-harvest losses due to non-preventable natural risks.",
        benefits: ["Low premium for farmers (2% for Kharif, 1.5% for Rabi, 5% for commercial crops)", "Comprehensive risk coverage"],
        eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
        link: "https://pmfby.gov.in/"
    },
    {
        title: "Soil Health Card Scheme",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "A scheme to issue 'Soil Health Cards' to farmers every 2 years to provide a basis to address nutritional deficiencies in soil.",
        benefits: ["Customized fertilizer recommendations", "Improved soil health and productivity", "Reduced cultivation cost"],
        eligibility: "All farmers in the country.",
        link: "https://soilhealth.dac.gov.in/"
    },
     {
        title: "Kisan Credit Card (KCC) Scheme",
        ministry: "Ministry of Finance",
        description: "Provides farmers with timely access to credit for their cultivation and other needs.",
        benefits: ["Credit for cultivation, post-harvest expenses, and consumption requirements", "Flexible repayment", "Lower interest rates, with subvention"],
        eligibility: "Farmers, animal husbandry farmers, and fishermen.",
        link: "https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card"
    },
    {
        title: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "Aims to enhance water use efficiency with the motto 'Har Khet Ko Pani' and 'More Crop Per Drop'.",
        benefits: ["Financial assistance for adopting micro-irrigation systems like drip & sprinklers", "Promotes water conservation", "Increases crop productivity"],
        eligibility: "Individual farmers, groups of farmers, cooperatives, FPOs.",
        link: "https://pmksy.gov.in/"
    },
    {
        title: "National Agriculture Market (e-NAM)",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "A pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.",
        benefits: ["Transparent price discovery", "Access to a wider market", "Direct payment to farmers"],
        eligibility: "Farmers, traders, and buyers registered with APMCs integrated with e-NAM.",
        link: "https://www.enam.gov.in/web/"
    },
    {
        title: "Agriculture Infrastructure Fund (AIF)",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "A medium-long term debt financing facility for investment in projects for post-harvest management infrastructure and community farming assets.",
        benefits: ["Interest subvention of 3% per annum up to a limit of ₹2 crore", "Credit guarantee coverage"],
        eligibility: "PACS, FPOs, SHGs, Agri-entrepreneurs, Startups.",
        link: "https://agriinfra.dac.gov.in/"
    },
    {
        title: "Sub-Mission on Agricultural Mechanization (SMAM)",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "Promotes farm mechanization to increase the reach of farm equipment to small and marginal farmers and to regions where availability of farm power is low.",
        benefits: ["Subsidy for purchase of various farm machinery and equipment", "Establishment of Custom Hiring Centers (CHCs)"],
        eligibility: "Farmers, FPOs, Cooperatives, and rural entrepreneurs.",
        link: "https://farmech.dac.gov.in/"
    },
    {
        title: "Paramparagat Krishi Vikas Yojana (PKVY)",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "Promotes organic farming through the adoption of the organic village by cluster approach and PGS (Participatory Guarantee System) certification.",
        benefits: ["Financial assistance of ₹50,000 per hectare for 3 years", "Support for organic inputs, certification, and marketing"],
        eligibility: "Farmers in a cluster of 20 hectares or 50 acres.",
        link: "https://pgsindia-ncof.gov.in/pkvy/index.aspx"
    },
    {
        title: "National Food Security Mission (NFSM)",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "Aims to increase production of rice, wheat, pulses, coarse cereals & commercial crops through area expansion and productivity enhancement.",
        benefits: ["Demonstrations on improved technology", "Distribution of quality seeds", "Assistance for micronutrients and soil amendments"],
        eligibility: "Farmers in the identified districts of the country.",
        link: "https://www.nfsm.gov.in/"
    },
    {
        title: "Dairy Entrepreneurship Development Scheme (DEDS)",
        ministry: "Ministry of Animal Husbandry, Dairying & Fisheries",
        description: "A scheme managed by NABARD to generate self-employment and provide infrastructure for the dairy sector.",
        benefits: ["Back-ended capital subsidy of 25% for general category and 33.33% for SC/ST farmers", "Covers activities like milk production, processing, and cold storage"],
        eligibility: "Farmers, individual entrepreneurs, NGOs, companies, FPOs.",
        link: "https://www.nabard.org/content.aspx?id=517"
    },
    {
        title: "National Mission for Sustainable Agriculture (NMSA)",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "Aims to make agriculture more productive, sustainable, and climate-resilient by promoting location-specific integrated/composite farming systems.",
        benefits: ["Promotion of traditional farming systems", "Resource conservation", "Soil and water conservation"],
        eligibility: "Varies by sub-scheme, generally targets small and marginal farmers.",
        link: "https://nmsa.dac.gov.in/"
    },
    {
        title: "Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        description: "A scheme to incentivize states to increase public investment in Agriculture and allied sectors to achieve 4% annual growth.",
        benefits: ["Flexibility to states for selecting schemes", "Funding for agri-startups and agri-entrepreneurship"],
        eligibility: "State Governments, Government-sponsored bodies.",
        link: "https://rkvy.nic.in/"
    }
];


export default function SubsidiesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Government Subsidies & Schemes</h1>
        <p className="text-muted-foreground">Explore central government schemes available for farmers in India.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subsidySchemes.map((scheme, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">{scheme.ministry}</Badge>
              <CardTitle>{scheme.title}</CardTitle>
              <CardDescription>{scheme.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Key Benefits:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {scheme.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Eligibility:</h4>
                <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
              </div>
            </CardContent>
            <CardFooter>
                <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full">
                        Visit Official Site
                    </Button>
                </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
