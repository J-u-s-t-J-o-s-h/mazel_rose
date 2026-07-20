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
    id: "rehearsal",
    title: "Rehearsal Dinner",
    date: "October 17, 2027",
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    venue: "The Copper Room",
    address: "210 Laurens Street, Aiken, SC 29801",
    description:
      "A private dinner for the wedding party and immediate family.",
    dressCode: "Cocktail attire",
    invitationOnly: true,
    isPrivate: true,
    isPlaceholder: true,
  },
  {
    id: "ceremony",
    title: "Ceremony",
    date: "October 18, 2027",
    startTime: "4:00 PM",
    endTime: "4:45 PM",
    venue: "The Willow Estate",
    address: "123 Magnolia Lane, Aiken, SC 29801",
    description:
      "Please be seated by 3:45 PM. The ceremony will take place outdoors beneath the oaks, weather permitting.",
    dressCode: "Cocktail / autumn formal",
    mapUrl: "https://maps.google.com/?q=Aiken,+South+Carolina",
    transportation: "Shuttle service begins at 3:15 PM from preferred hotels.",
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
    date: "October 18, 2027",
    startTime: "6:00 PM",
    endTime: "11:00 PM",
    venue: "The Willow Estate Ballroom",
    address: "123 Magnolia Lane, Aiken, SC 29801",
    description:
      "Dinner, toasts, and dancing beneath candlelight and autumn florals.",
    dressCode: "Cocktail / autumn formal",
    parking: "Complimentary valet through the evening.",
    isPlaceholder: true,
  },
  {
    id: "after-party",
    title: "After-Party",
    date: "October 18, 2027",
    startTime: "11:00 PM",
    endTime: "1:00 AM",
    venue: "The Velvet Lounge",
    address: "88 Whiskey Road, Aiken, SC 29801",
    description:
      "Continue the celebration with late-night music and nightcaps.",
    dressCode: "Cocktail attire",
    invitationOnly: true,
    isPlaceholder: true,
  },
  {
    id: "brunch",
    title: "Farewell Brunch",
    date: "October 19, 2027",
    startTime: "10:00 AM",
    endTime: "12:30 PM",
    venue: "Hotel Veranda",
    address: "12 Whitney Drive, Aiken, SC 29801",
    description:
      "A relaxed morning meal before guest departures. Come as you are.",
    dressCode: "Casual",
    isPlaceholder: true,
  },
];

export const scheduleIntro = {
  title: "Schedule of Events",
  scriptIntro: "The Day",
  body: "A carefully composed sequence of gatherings—from welcome moments to farewell brunch. Times and details below are placeholders until confirmed.",
};
