import type { Airport, Hotel } from "@/types/content";

export const travelIntro = {
  title: "Travel & Stay",
  scriptIntro: "Journey",
  body: "We want your arrival to feel unhurried. Below you will find airport guidance, preferred hotels, and notes on driving and parking.",
};

export const airports: Airport[] = [
  {
    name: "Orlando Sanford International Airport",
    code: "SFB",
    distance: "Approximately 35–50 minutes",
    notes: "A smaller airport north of Orlando, often with simpler arrival and rental-car pickup.",
    isPlaceholder: true,
  },
  {
    name: "Orlando International Airport",
    code: "MCO",
    distance: "Approximately 20–40 minutes",
    notes: "The primary Orlando airport, with the broadest choice of airlines and connections.",
    isPlaceholder: true,
  },
];

export const hotels: Hotel[] = [
  {
    id: "grand-beach",
    name: "Grand Beach by Hilton",
    image: "/travel/hotels/grand-beach.jpg",
    imageAlt:
      "White lakeside suites at Grand Beach by Hilton reflected in Lake Bryan",
    address: "8317 Lake Bryan Beach Blvd, Orlando, FL 32821",
    distance: "Approximately 5 minutes from venue",
    description:
      "Spacious 1–3 bedroom suites on Lake Bryan, a few minutes from Paradise Cove.",
    bookingUrl:
      "https://www.hiltongrandvacations.com/en/resorts-and-destinations/florida/grand-beach-a-hilton-vacation-club",
    groupCode: "Paradise Cove",
    phone: "(407) 238-2500",
    contactName: "Yamile Rivera",
    contactEmail: "yamile.rivera@hgv.com",
    amenities: ["1–3 bedroom suites"],
  },
  {
    id: "holiday-inn",
    name: "Holiday Inn",
    image: "/travel/hotels/holiday-inn.jpg",
    imageAlt:
      "Heated resort pool at Holiday Inn Resort Orlando–Lake Buena Vista",
    address: "13351 State Road 535, Orlando, FL 32821",
    distance: "Walking distance from venue",
    description:
      "A Lake Buena Vista resort within walking distance of Paradise Cove.",
    bookingUrl: "https://www.hiresortlbv.com/",
    groupCode: "Paradise Cove",
    phone: "(407) 239-4500",
    contactEmail: "sales@hiresortlbv.com",
    amenities: ["Walking distance"],
  },
  {
    id: "marriott-village",
    name: "Marriott Village",
    image: "/travel/hotels/marriott-village.jpg",
    imageAlt:
      "Nighttime entrance at Marriott Village, with the Fairfield Inn canopy and circular drive",
    address: "8623 Vineland Avenue, Orlando, FL 32821",
    distance: "Approximately 8 minutes from venue",
    description:
      "One village with three Marriott options: Courtyard, Fairfield Inn & Suites, and SpringHill Suites.",
    bookingUrl: "https://marriott-village-florida.marriott.com/",
    groupCode: "Paradise Cove",
    phone: "(407) 938-9001",
    contactName: "Mary Nasarzewski",
    contactEmail: "Mary.Nasarzewski@MarriottVillageOrlando.com",
    amenities: ["Three Marriott hotels"],
  },
  {
    id: "caribe-royale",
    name: "Caribe Royale",
    image: "/travel/hotels/caribe-royale.jpg",
    imageAlt: "Dusk view of the pink Caribe Royale facade and arched entrance",
    address: "8101 World Center Drive, Orlando, FL 32821",
    distance: "Approximately 10 minutes from venue",
    description:
      "A resort-style stay with suites, pools, and easy access to the celebration.",
    bookingUrl: "https://www.cariberoyale.com",
    groupCode: "Paradise Cove",
    phone: "(407) 238-8000",
    contactName: "Saudia Sookram",
    contactEmail: "ssookram@cariberoyale.com",
    amenities: ["Resort style"],
  },
  {
    id: "sheraton-lbv",
    name: "Sheraton Orlando Lake Buena Vista",
    image: "/travel/hotels/sheraton-lbv.jpg",
    imageAlt:
      "Aerial view of the lagoon-style pools at Sheraton Orlando Lake Buena Vista",
    address: "12205 S. Apopka Vineland Rd., Orlando, FL 32836",
    distance: "Approximately 2 minutes from venue",
    description:
      "A Lake Buena Vista resort just down the road from Paradise Cove.",
    bookingUrl: "https://lnk.bio/sheratonlbv",
    groupCode: "Paradise Cove",
    phone: "(407) 550-1040",
    contactName: "Danilla Henry",
    contactEmail: "Danilla.Henry@SheratonLBV.com",
    amenities: ["Pool resort"],
  },
];

export const travelDetails = {
  driving:
    "Paradise Cove sits on Lake Bryan in Orlando, just south of I-4 near Apopka Vineland Road (SR 535). Use 13245 Lake Bryan Drive, Orlando, FL 32821 in your navigation app. Allow extra time on I-4 around theme-park rush hours.",
  shuttle:
    "Recommended hotels are a short drive or rideshare from Paradise Cove. Holiday Inn is within walking distance of the venue.",
  parking:
    "On-site parking is available at Paradise Cove. Overnight parking is at your hotel. Rideshare drop-off is at the Lake Bryan Drive entrance.",
  localContact: {
    label: "Local travel questions",
    email: "travel@mazelrose.life",
    note: "",
  },
};
