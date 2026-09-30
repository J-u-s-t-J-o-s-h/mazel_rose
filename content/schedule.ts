import type { ScheduleEvent } from "@/types/content";

const paradiseCove = {
  venue: "Paradise Cove",
  address: "13245 Lake Bryan Dr, Orlando, FL 32821",
  mapUrl:
    "https://www.google.com/maps/dir//Paradise+Cove+Orlando,+13245+Lake+Bryan+Dr,+Orlando,+FL+32821/",
};

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: "welcome",
    title: "Welcome Gathering",
    date: "Saturday, November 7, 2026",
    startTime: "12:00 PM",
    endTime: "8:00 PM",
    venue: "The Great Escape Lakeside",
    address: "Clermont, Florida",
    description:
      "A day of fun, laughter, shenanigans, good food and warm conversation as guests arrive in town.",
    dressCode: "Casual, bring a swim suit and towel **weather permitting**",
  },
  {
    id: "ceremony",
    title: "Ceremony",
    date: "Sunday, November 8, 2026",
    startTime: "4:00 PM",
    venue: paradiseCove.venue,
    address: paradiseCove.address,
    description:
      "Guests may arrive from 3:15 PM. Please be seated by 3:45 PM. The ceremony begins at 4:00 PM. The ceremony will take place outdoors beneath the oaks, weather permitting.",
    dressCode: "Cocktail / autumn formal",
    mapUrl: paradiseCove.mapUrl,
    parking: "On-site parking available for guests arriving by car.",
  },
  {
    id: "cocktail",
    title: "Cocktail Hour",
    date: "Sunday, November 8, 2026",
    startTime: "Immediately following ceremony",
    endTime: "6:00 PM",
    venue: paradiseCove.venue,
    address: paradiseCove.address,
    description:
      "Seasonal cocktails, beer, wine and passed hors d'oeuvres as the golden hour settles in.",
    dressCode: "Cocktail / autumn formal",
    mapUrl: paradiseCove.mapUrl,
  },
  {
    id: "reception",
    title: "Give Thanks and Come Celebrate",
    date: "Sunday, November 8, 2026",
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    venue: paradiseCove.venue,
    address: paradiseCove.address,
    description:
      "Dinner, toasts, and dancing beneath candlelight and autumn florals.",
    dressCode: "Cocktail / autumn formal",
    mapUrl: paradiseCove.mapUrl,
  },
];

export const scheduleIntro = {
  title: "Schedule of Events",
  scriptIntro: "The Day",
  body: "A carefully composed sequence of gatherings—from welcome moments through Give Thanks and Come Celebrate.",
};
