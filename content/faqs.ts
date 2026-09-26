import { siteConfig } from "@/content/site";
import type { FaqItem } from "@/types/content";

export const faqsIntro = {
  title: "Frequently Asked Questions",
  scriptIntro: "Details",
  body: "A few notes to help you plan.",
};

export const faqs: FaqItem[] = [
  {
    id: "dress-code",
    question: "What is the dress code?",
    answer:
      "Cocktail to autumn formal. Think rich textures, jewel tones, and elegant neutrals. Dark suits and cocktail dresses are perfect. We gently ask guests to avoid white and ivory.",
  },
  {
    id: "children",
    question: "Are children invited?",
    answer:
      "We have reserved seats for the children of our immediate family. For everyone else, we hope this is a chance for an evening out, and we will miss the little ones dearly.",
  },
  {
    id: "plus-one",
    question: "Can I bring a guest?",
    answer:
      "Yes. Every invited guest is welcome to bring someone. Please add their name to your RSVP so we can set a place for them.",
  },
  {
    id: "rsvp-when",
    question: "When should I RSVP?",
    answer: `Please reply by ${siteConfig.rsvpDeadlineDisplay}. Our caterer needs the final count shortly after, so an early yes or no is a real kindness.`,
  },
  {
    // Final transportation policy is not confirmed. This repeats the Travel
    // page and does not promise a shuttle.
    id: "transportation",
    question: "Is transportation provided?",
    answer:
      "Recommended hotels are a short drive or rideshare from Paradise Cove. Holiday Inn is within walking distance of the venue.",
  },
  {
    id: "parking",
    question: "Is parking available?",
    answer:
      "Yes. Paradise Cove has self-parking on site. There is no valet, so please allow a few extra minutes to park and walk over to the ceremony.",
  },
  {
    id: "indoors-outdoors",
    question: "Is the ceremony indoors or outdoors?",
    answer:
      "Both. The ceremony is outdoors, beneath the oaks at the edge of the lake. Cocktail hour and the reception that follows are under a covered pavilion, so the evening stays comfortable whatever the sky decides to do.",
  },
  {
    id: "weather",
    question: "What weather should guests expect?",
    answer:
      "Early November in Orlando is usually lovely. Expect the mid-seventies in the late afternoon, cooling into the sixties once the sun goes down. A wrap or light jacket for the evening is a good idea.",
  },
  {
    // Venue accessibility has not been confirmed. Do not describe parking,
    // paths, restrooms, entrances, or seating as accessible.
    id: "accessible",
    question: "Is the venue accessible?",
    answer:
      "Please note any accessibility needs in your RSVP, and we will follow up with you directly.",
  },
  {
    id: "contact",
    question: "Who should I contact with questions?",
    answer: `Email us anytime at ${siteConfig.contactEmail}. We read every note.`,
  },
  {
    id: "arrive",
    question: "What time should guests arrive?",
    answer:
      "Our arrival window opens at 3:15 PM, which leaves time to park and settle in. Please be seated no later than 3:45 PM. The ceremony begins at 4:00 PM.",
  },
  {
    id: "dietary",
    question: "Can dietary restrictions be accommodated?",
    answer:
      "We are not plating individual meals, so there will be a good variety to choose from. Allergies are what we most need to know about. Please list any in your RSVP and we will make sure the kitchen plans for them.",
  },
];
