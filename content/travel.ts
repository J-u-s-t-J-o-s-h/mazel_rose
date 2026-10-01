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
    id: "hyatt-grand-cypress",
    name: "Hyatt Regency Grand Cypress",
    image: "/travel/hotels/hyatt-grand-cypress.jpg",
    imageAlt:
      "Atrium lobby of Hyatt Regency Grand Cypress, with palms and guest-room balconies",
    imageCredit: "Photograph by Josh Hallett, CC BY-SA 2.0",
    address: "1 Grand Cypress Blvd, Orlando, FL 32836",
    distance: "Approximately 5 minutes from venue",
    description:
      "A Lake Buena Vista resort a short drive from Paradise Cove. Use the group booking link for the wedding block.",
    bookingUrl:
      "https://www.hyatt.com/events/en-US/group-booking/VISTA/G-WR26",
    groupCode: "G-WR26",
    phone: "(407) 239-1234",
    amenities: ["Resort"],
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
    "Recommended hotels are a short drive or rideshare from Paradise Cove.",
  parking:
    "On-site parking is available at Paradise Cove. Overnight parking is at your hotel. Rideshare drop-off is at the Lake Bryan Drive entrance.",
  localContact: {
    label: "Local travel questions",
    email: "travel@mazelrose.life",
    note: "",
  },
};
