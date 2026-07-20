import type { Airport, Hotel } from "@/types/content";

export const travelIntro = {
  title: "Travel & Stay",
  scriptIntro: "Journey",
  body: "We want your arrival to feel unhurried. Below you will find airport guidance, preferred hotels, and transportation notes. PLACEHOLDER: Confirm room blocks, codes, and shuttle times before launch.",
};

export const airports: Airport[] = [
  {
    name: "Augusta Regional Airport",
    code: "AGS",
    distance: "Approximately 30 minutes",
    notes: "Closest commercial airport with rental car options.",
    isPlaceholder: true,
  },
  {
    name: "Columbia Metropolitan Airport",
    code: "CAE",
    distance: "Approximately 1 hour 15 minutes",
    notes: "Broader flight options; ideal for guests flying from farther away.",
    isPlaceholder: true,
  },
  {
    name: "Charlotte Douglas International",
    code: "CLT",
    distance: "Approximately 2 hours 30 minutes",
    notes: "Major hub with frequent connections; consider a rental car.",
    isPlaceholder: true,
  },
];

export const hotels: Hotel[] = [
  {
    id: "hotel-estate",
    name: "The Magnolia Inn",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Elegant hotel lobby with warm lighting and refined interiors",
    address: "100 Whitney Drive, Aiken, SC 29801",
    distance: "8 minutes from venue",
    description:
      "Our preferred lodging—quiet rooms, polished service, and a short ride to the celebration.",
    bookingUrl: "https://example.com/hotel-magnolia",
    groupCode: "MAZELROSE",
    reservationDeadline: "September 1, 2027",
    phone: "(803) 555-0142",
    amenities: ["Complimentary breakfast", "Shuttle access", "Parking"],
    isPlaceholder: true,
  },
  {
    id: "hotel-garden",
    name: "Garden House Hotel",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Boutique hotel room with soft neutrals and natural light",
    address: "44 Park Avenue, Aiken, SC 29801",
    distance: "12 minutes from venue",
    description:
      "A boutique stay with garden views and easy access to downtown restaurants.",
    bookingUrl: "https://example.com/hotel-garden",
    groupCode: "MRWEDDING",
    reservationDeadline: "September 1, 2027",
    phone: "(803) 555-0198",
    amenities: ["Courtyard", "Fitness center", "Evening wine hour"],
    isPlaceholder: true,
  },
  {
    id: "hotel-reserve",
    name: "The Reserve Suites",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Luxury suite bedroom with warm ambient lighting",
    address: "220 Whiskey Road, Aiken, SC 29801",
    distance: "15 minutes from venue",
    description:
      "Spacious suites for families or guests seeking a longer stay.",
    bookingUrl: "https://example.com/hotel-reserve",
    reservationDeadline: "August 20, 2027",
    phone: "(803) 555-0177",
    amenities: ["Kitchenette options", "Pool", "Free parking"],
    isPlaceholder: true,
  },
];

export const travelDetails = {
  driving:
    "Aiken is accessible via I-20. Allow extra time for autumn weekend traffic. Venue entrance signage will be posted along Magnolia Lane. PLACEHOLDER: Confirm final driving directions.",
  shuttle:
    "Complimentary shuttle service will run between preferred hotels and the venue on the wedding day, beginning mid-afternoon. Exact timing will be shared closer to the date.",
  parking:
    "Valet parking will be available at the venue. Overnight parking is available at preferred hotels.",
  localContact: {
    label: "Local travel questions",
    email: "travel@mazel.rose",
    note: "PLACEHOLDER: Replace with a real contact before launch.",
  },
};
