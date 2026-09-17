import type { ScheduleEvent } from "@/types/content";

/**
 * PLACEHOLDER: Confirm times, venues, dress codes, and private-event details.
 */
export const scheduleEvents: ScheduleEvent[] = [
  {
    id: "welcome",
    title: "Welcome Gathering",
    date: "October 17, 2027",
    startTime: "6:00 PM",
    endTime: "8:00 PM",
    venue: "The Garden Courtyard",
    address: "45 Park Avenue, Aiken, SC 29801",
    description:
      "An informal evening of light bites and warm conversation as guests arrive in town.",
    dressCode: "Smart casual",
    mapUrl: "https://maps.google.com/?q=Aiken,+South+Carolina",
    isPrivate: false,
    isPlaceholder: true,
  },
  {
    id: "ceremony",
    title: "Ceremony",
    date: "October 18, 2027",
    startTime: "4:00 PM",
    endTime: "9:00 PM",
    venue: "The Willow Estate",
    address: "123 Magnolia Lane, Aiken, SC 29801",
    description:
      "Please be seated by 3:45 PM. The ceremony will take place outdoors beneath the oaks, weather permitting.",
    dressCode: "Cocktail / autumn formal",
    mapUrl: "https://maps.google.com/?q=Aiken,+South+Carolina",
    parking: "On-site valet available for guests arriving by car.",
    isPlaceholder: true,
  },
  {
    id: "cocktail",
    title: "Cocktail Hour",
    date: "October 18, 2027",
    startTime: "4:45 PM",
    endTime: "6:00 PM",
    venue: "Estate Terrace",
    address: "123 Magnolia Lane, Aiken, SC 29801",
    description:
      "Champagne, seasonal cocktails, and passed hors d'oeuvres as the golden hour settles in.",
    dressCode: "Cocktail / autumn formal",
    isPlaceholder: true,
  },
  {
    id: "reception",
    title: "Reception",
    date: "Sunday, November 8, 2026",
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    venue: "The Willow Estate Ballroom",
    address: "123 Magnolia Lane, Aiken, SC 29801",
    description:
      "Dinner, toasts, and dancing beneath candlelight and autumn florals.",
    dressCode: "Cocktail / autumn formal",
    isPlaceholder: true,
  },
];

export const scheduleIntro = {
  title: "Schedule of Events",
  scriptIntro: "The Day",
  body: "A carefully composed sequence of gatherings—from welcome moments through the reception. Times and details below are placeholders until confirmed.",
};
