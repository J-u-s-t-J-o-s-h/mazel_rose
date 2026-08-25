export type FieldType =
  | "string"
  | "text"
  | "url"
  | "email"
  | "datetime"
  | "boolean"
  | "number"
  | "select"
  | "stringList"
  | "initials"
  | "cta"
  | "image"
  | "optionList";

export type StudioField = {
  name: string;
  title: string;
  type: FieldType;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  options?: { title: string; value: string }[];
  optionValueKey?: "value" | "key";
};

export type StudioSection = {
  key: string;
  title: string;
  description?: string;
  kind: "singleton" | "list";
  documentType: string;
  documentId?: string;
  previewPath: string;
  titleField: string;
  fields: StudioField[];
};

export type StudioPage = {
  key: string;
  title: string;
  previewPath: string;
  sections: StudioSection[];
};

const showOnWebsite: StudioField = {
  name: "showOnWebsite",
  title: "Show this on the website",
  type: "boolean",
};

const displayOrder: StudioField = {
  name: "displayOrder",
  title: "Display order",
  type: "number",
  hint: "Lower numbers appear first.",
};

const featured: StudioField = {
  name: "featured",
  title: "Featured",
  type: "boolean",
};

const listMeta: StudioField[] = [featured, showOnWebsite, displayOrder];

export const STUDIO_PAGES: StudioPage[] = [
  {
    key: "site",
    title: "Wedding Details",
    previewPath: "/",
    sections: [
      {
        key: "couple",
        title: "Names & monogram",
        kind: "singleton",
        documentType: "weddingDetails",
        documentId: "weddingDetails",
        previewPath: "/",
        titleField: "coupleDisplayName",
        fields: [
          { name: "partnerOneName", title: "First partner's name", type: "string", required: true, maxLength: 40 },
          { name: "partnerTwoName", title: "Second partner's name", type: "string", required: true, maxLength: 40 },
          { name: "coupleDisplayName", title: "Couple display name", type: "string", required: true, maxLength: 80, hint: "Shown as Mazel & Rose throughout the site." },
          { name: "initials", title: "Monogram initials", type: "initials" },
          { name: "tagline", title: "Tagline", type: "string" },
          { name: "footerMessage", title: "Footer message", type: "text", rows: 3, required: true, maxLength: 240 },
          { name: "contactEmail", title: "Contact email", type: "email", required: true },
          { name: "contactPhone", title: "Contact phone", type: "string" },
        ],
      },
      {
        key: "dates",
        title: "Dates & RSVP deadline",
        kind: "singleton",
        documentType: "weddingDetails",
        documentId: "weddingDetails",
        previewPath: "/",
        titleField: "weddingDateDisplay",
        fields: [
          { name: "weddingDate", title: "Wedding date and time", type: "datetime", required: true },
          { name: "weddingDateDisplay", title: "Wedding date display text", type: "string", required: true, maxLength: 60, hint: "Example: October 18, 2027" },
          { name: "rsvpDeadline", title: "RSVP deadline", type: "datetime", required: true },
          { name: "rsvpDeadlineDisplay", title: "RSVP deadline display text", type: "string", required: true, maxLength: 60 },
          { name: "timezone", title: "Default timezone", type: "string", hint: "Used for countdown context. Example: America/New_York" },
        ],
      },
      {
        key: "venue",
        title: "Venue & location",
        kind: "singleton",
        documentType: "weddingDetails",
        documentId: "weddingDetails",
        previewPath: "/",
        titleField: "ceremonyVenueName",
        fields: [
          { name: "locationCity", title: "City", type: "string", required: true },
          { name: "locationState", title: "State", type: "string", required: true },
          { name: "locationDisplay", title: "Location display text", type: "string", required: true, hint: "Example: Aiken, South Carolina" },
          { name: "ceremonyVenueName", title: "Ceremony venue name", type: "string", required: true },
          { name: "ceremonyVenueAddress", title: "Ceremony venue address", type: "string", required: true },
          { name: "receptionVenueName", title: "Reception venue name", type: "string" },
          { name: "receptionVenueAddress", title: "Reception venue address", type: "string" },
          { name: "mapUrl", title: "Venue map link", type: "url" },
        ],
      },
      {
        key: "theme",
        title: "Site theme",
        kind: "singleton",
        documentType: "weddingDetails",
        documentId: "weddingDetails",
        previewPath: "/",
        titleField: "theme",
        fields: [
          {
            name: "theme",
            title: "Colors & fonts",
            type: "select",
            hint: "Publish to restyle the whole website.",
            options: [
              { title: "Peacock & Burgundy (classic)", value: "classic" },
              { title: "Midnight & Gold", value: "midnight" },
              { title: "Sage & Blush", value: "sage" },
              { title: "Dusty Blue & Terracotta", value: "coastal" },
            ],
          },
        ],
      },
      {
        key: "seo",
        title: "SEO & social sharing",
        kind: "singleton",
        documentType: "weddingDetails",
        documentId: "weddingDetails",
        previewPath: "/",
        titleField: "socialDescription",
        fields: [
          { name: "socialDescription", title: "Social sharing description", type: "text", rows: 3, required: true, maxLength: 300 },
          { name: "socialImage", title: "Social sharing image", type: "image", hint: "Recommended 1200 × 630 pixels." },
          { name: "allowSearchIndexing", title: "Allow search engines to index this website", type: "boolean", hint: "Turn on only when you are ready for the site to appear in Google." },
        ],
      },
      {
        key: "announcement",
        title: "Guest announcement",
        kind: "singleton",
        documentType: "weddingDetails",
        documentId: "weddingDetails",
        previewPath: "/",
        titleField: "announcementText",
        fields: [
          { name: "announcementText", title: "Announcement text", type: "string", hint: "Optional banner message for guests." },
          { name: "announcementVisible", title: "Show announcement", type: "boolean" },
        ],
      },
    ],
  },
  {
    key: "home",
    title: "Home Page",
    previewPath: "/",
    sections: [
      {
        key: "hero",
        title: "Invitation hero",
        kind: "singleton",
        documentType: "homePage",
        documentId: "homePage",
        previewPath: "/",
        titleField: "heroHeading",
        fields: [
          { name: "heroEyebrow", title: "Hero eyebrow text", type: "string", maxLength: 40 },
          { name: "heroScript", title: "Hero script text", type: "string", required: true, maxLength: 40 },
          { name: "heroHeading", title: "Hero heading", type: "string", required: true, maxLength: 48 },
          { name: "heroSubheading", title: "Hero invitation line", type: "string", required: true, maxLength: 120 },
          { name: "heroImage", title: "Hero image", type: "image", hint: "Horizontal image, at least 2400 × 1400 pixels." },
          { name: "primaryCta", title: "Primary button", type: "cta" },
          { name: "secondaryCta", title: "Secondary button", type: "cta" },
        ],
      },
      {
        key: "welcome",
        title: "Welcome",
        kind: "singleton",
        documentType: "homePage",
        documentId: "homePage",
        previewPath: "/",
        titleField: "welcomeHeading",
        fields: [
          { name: "welcomeScript", title: "Welcome script text", type: "string" },
          { name: "welcomeHeading", title: "Welcome heading", type: "string", required: true, maxLength: 80 },
          { name: "welcomeMessage", title: "Welcome message", type: "text", rows: 5, required: true, maxLength: 800 },
          { name: "welcomeImage", title: "Welcome image", type: "image" },
        ],
      },
      {
        key: "story",
        title: "Our story",
        kind: "singleton",
        documentType: "homePage",
        documentId: "homePage",
        previewPath: "/",
        titleField: "storyHeading",
        fields: [
          { name: "storyHeading", title: "Story heading", type: "string", required: true, maxLength: 80 },
          { name: "storyBody", title: "Story body", type: "text", rows: 6, required: true, maxLength: 1200 },
          { name: "storyAccentNote", title: "Story accent note", type: "string" },
          { name: "storyImage", title: "Story image", type: "image" },
        ],
      },
      {
        key: "feature",
        title: "Feature quote",
        kind: "singleton",
        documentType: "homePage",
        documentId: "homePage",
        previewPath: "/",
        titleField: "featureQuote",
        fields: [
          { name: "featureQuote", title: "Feature quote", type: "text", rows: 3, required: true, maxLength: 280 },
          { name: "featureAttribution", title: "Quote attribution", type: "string" },
          { name: "featureImage", title: "Feature image", type: "image" },
        ],
      },
      {
        key: "previews",
        title: "Section previews",
        kind: "singleton",
        documentType: "homePage",
        documentId: "homePage",
        previewPath: "/",
        titleField: "schedulePreviewTitle",
        fields: [
          { name: "schedulePreviewTitle", title: "Schedule preview title", type: "string" },
          { name: "schedulePreviewBody", title: "Schedule preview message", type: "text", rows: 3 },
          { name: "schedulePreviewCtaLabel", title: "Schedule preview button label", type: "string" },
          { name: "travelPreviewTitle", title: "Travel preview title", type: "string" },
          { name: "travelPreviewBody", title: "Travel preview message", type: "text", rows: 3 },
          { name: "travelPreviewCtaLabel", title: "Travel preview button label", type: "string" },
          { name: "travelPreviewHighlights", title: "Travel preview highlights", type: "stringList", hint: "One highlight per line." },
          { name: "galleryPreviewTitle", title: "Gallery preview title", type: "string" },
          { name: "galleryPreviewBody", title: "Gallery preview message", type: "text", rows: 3 },
          { name: "galleryPreviewCtaLabel", title: "Gallery preview button label", type: "string" },
        ],
      },
      {
        key: "rsvp",
        title: "Final RSVP",
        kind: "singleton",
        documentType: "homePage",
        documentId: "homePage",
        previewPath: "/",
        titleField: "rsvpFinaleTitle",
        fields: [
          { name: "rsvpFinaleTitle", title: "Final RSVP heading", type: "string", required: true, maxLength: 80 },
          { name: "rsvpFinaleBody", title: "Final RSVP message", type: "text", rows: 3, required: true, maxLength: 400 },
          { name: "rsvpFinaleCtaLabel", title: "Final RSVP button label", type: "string" },
        ],
      },
      {
        key: "visibility",
        title: "Section visibility",
        kind: "singleton",
        documentType: "homePage",
        documentId: "homePage",
        previewPath: "/",
        titleField: "showWelcome",
        fields: [
          { name: "showWelcome", title: "Show welcome section", type: "boolean" },
          { name: "showStory", title: "Show story section", type: "boolean" },
          { name: "showCountdown", title: "Show countdown", type: "boolean" },
          { name: "showSchedulePreview", title: "Show schedule preview", type: "boolean" },
          { name: "showFeature", title: "Show feature quote", type: "boolean" },
          { name: "showTravelPreview", title: "Show travel preview", type: "boolean" },
          { name: "showGalleryPreview", title: "Show gallery preview", type: "boolean" },
          { name: "showRsvpFinale", title: "Show final RSVP section", type: "boolean" },
        ],
      },
    ],
  },
  {
    key: "schedule",
    title: "Schedule",
    previewPath: "/schedule",
    sections: [
      {
        key: "events",
        title: "Events",
        kind: "list",
        documentType: "scheduleEvent",
        previewPath: "/schedule",
        titleField: "title",
        fields: [
          { name: "title", title: "Event title", type: "string", required: true, maxLength: 80 },
          { name: "date", title: "Date", type: "string", required: true, hint: "Example: October 18, 2027" },
          { name: "startTime", title: "Start time", type: "string", required: true, hint: "Example: 4:00 PM" },
          { name: "endTime", title: "End time", type: "string" },
          { name: "venue", title: "Venue", type: "string", required: true },
          { name: "address", title: "Address", type: "string", required: true },
          { name: "description", title: "Description", type: "text", rows: 4, required: true, maxLength: 600 },
          { name: "dressCode", title: "Dress code", type: "string" },
          { name: "mapUrl", title: "Map link", type: "url" },
          { name: "transportation", title: "Transportation notes", type: "text", rows: 3 },
          { name: "parking", title: "Parking notes", type: "text", rows: 3 },
          { name: "invitationOnly", title: "Invitation-only event", type: "boolean" },
          { name: "isPrivate", title: "Private event note", type: "boolean" },
          ...listMeta,
        ],
      },
    ],
  },
  {
    key: "travel",
    title: "Travel",
    previewPath: "/travel",
    sections: [
      {
        key: "overview",
        title: "Travel overview",
        kind: "singleton",
        documentType: "travelOverview",
        documentId: "travelOverview",
        previewPath: "/travel",
        titleField: "heading",
        fields: [
          { name: "scriptIntro", title: "Script introduction", type: "string" },
          { name: "heading", title: "Page heading", type: "string", required: true, maxLength: 80 },
          { name: "intro", title: "Introductory note", type: "text", rows: 4, required: true, maxLength: 800 },
          { name: "drivingInfo", title: "Driving information", type: "text", rows: 4 },
          { name: "transportationOverview", title: "Transportation overview", type: "text", rows: 4 },
          { name: "shuttleInfo", title: "Shuttle information", type: "text", rows: 4 },
          { name: "parkingInfo", title: "Parking information", type: "text", rows: 4 },
          { name: "generalMapUrl", title: "General map link", type: "url" },
          { name: "contactNote", title: "Contact note", type: "text", rows: 2 },
          { name: "contactEmail", title: "Travel contact email", type: "email" },
          { name: "featureImage", title: "Feature image", type: "image" },
        ],
      },
      {
        key: "airports",
        title: "Airports",
        kind: "list",
        documentType: "airport",
        previewPath: "/travel",
        titleField: "name",
        fields: [
          { name: "name", title: "Airport name", type: "string", required: true },
          { name: "code", title: "Airport code", type: "string", required: true, maxLength: 8 },
          { name: "address", title: "Address", type: "string" },
          { name: "distance", title: "Distance from venue", type: "string" },
          { name: "driveTime", title: "Approximate drive time", type: "string", required: true },
          { name: "description", title: "Description", type: "text", rows: 3, required: true, maxLength: 400 },
          { name: "websiteUrl", title: "Website URL", type: "url" },
          { name: "mapUrl", title: "Map URL", type: "url" },
          showOnWebsite,
          displayOrder,
        ],
      },
      {
        key: "hotels",
        title: "Hotels",
        kind: "list",
        documentType: "hotel",
        previewPath: "/travel",
        titleField: "name",
        fields: [
          { name: "name", title: "Hotel name", type: "string", required: true },
          { name: "image", title: "Hotel photograph", type: "image", hint: "Horizontal image, at least 1600 × 1000 pixels." },
          { name: "address", title: "Address", type: "string", required: true },
          { name: "distance", title: "Distance from venue", type: "string", required: true },
          { name: "driveTime", title: "Approximate drive time", type: "string" },
          { name: "description", title: "Description", type: "text", rows: 4, required: true, maxLength: 500 },
          { name: "bookingUrl", title: "Booking link", type: "url", required: true },
          { name: "groupCode", title: "Group code", type: "string" },
          { name: "bookingDeadline", title: "Booking deadline", type: "string" },
          { name: "phone", title: "Phone number", type: "string" },
          { name: "amenities", title: "Amenities", type: "stringList", hint: "One amenity per line." },
          ...listMeta,
        ],
      },
    ],
  },
  {
    key: "registry",
    title: "Registry",
    previewPath: "/registry",
    sections: [
      {
        key: "intro",
        title: "Registry introduction",
        kind: "singleton",
        documentType: "registryIntro",
        documentId: "registryIntro",
        previewPath: "/registry",
        titleField: "heading",
        fields: [
          { name: "scriptIntro", title: "Script introduction", type: "string" },
          { name: "heading", title: "Page heading", type: "string", required: true, maxLength: 80 },
          { name: "message", title: "Message from the couple", type: "text", rows: 5, required: true, maxLength: 800 },
          { name: "honeymoonIntro", title: "Honeymoon fund introduction", type: "text", rows: 3 },
          { name: "charityIntro", title: "Charitable-giving introduction", type: "text", rows: 3 },
          { name: "featureImage", title: "Feature image", type: "image" },
        ],
      },
      {
        key: "links",
        title: "Registry links",
        kind: "list",
        documentType: "registryLink",
        previewPath: "/registry",
        titleField: "name",
        fields: [
          { name: "name", title: "Registry name", type: "string", required: true },
          {
            name: "registryType",
            title: "Registry type",
            type: "select",
            required: true,
            options: [
              { title: "Retailer", value: "retailer" },
              { title: "Honeymoon fund", value: "honeymoon" },
              { title: "Cash fund", value: "cash" },
              { title: "Charity", value: "charity" },
            ],
          },
          { name: "image", title: "Image or logo", type: "image" },
          { name: "description", title: "Description", type: "text", rows: 3, required: true, maxLength: 400 },
          { name: "url", title: "External URL", type: "url", required: true },
          { name: "buttonLabel", title: "Button label", type: "string" },
          ...listMeta,
        ],
      },
    ],
  },
  {
    key: "wedding-party",
    title: "Wedding Party",
    previewPath: "/wedding-party",
    sections: [
      {
        key: "members",
        title: "Members",
        kind: "list",
        documentType: "weddingPartyMember",
        previewPath: "/wedding-party",
        titleField: "name",
        fields: [
          { name: "name", title: "Name", type: "string", required: true },
          { name: "role", title: "Role", type: "string", required: true },
          { name: "photo", title: "Photograph", type: "image", hint: "Vertical portrait, at least 1200 × 1600 pixels." },
          { name: "relationship", title: "Relationship to the couple", type: "string", required: true },
          { name: "biography", title: "Biography", type: "text", rows: 4, required: true, maxLength: 600 },
          { name: "funFact", title: "Fun fact", type: "string" },
          {
            name: "side",
            title: "Side / group",
            type: "select",
            options: [
              { title: "Partner one", value: "partnerOne" },
              { title: "Partner two", value: "partnerTwo" },
              { title: "Shared", value: "shared" },
            ],
          },
          ...listMeta,
        ],
      },
    ],
  },
  {
    key: "gallery",
    title: "Gallery",
    previewPath: "/gallery",
    sections: [
      {
        key: "settings",
        title: "Gallery settings",
        kind: "singleton",
        documentType: "gallerySettings",
        documentId: "gallerySettings",
        previewPath: "/gallery",
        titleField: "heading",
        fields: [
          { name: "scriptIntro", title: "Script introduction", type: "string" },
          { name: "heading", title: "Page heading", type: "string", required: true, maxLength: 80 },
          { name: "introduction", title: "Page introduction", type: "text", rows: 4, required: true, maxLength: 600 },
          { name: "featureImage", title: "Feature image", type: "image" },
          { name: "showCaptions", title: "Show captions", type: "boolean" },
        ],
      },
      {
        key: "photos",
        title: "Photos",
        kind: "list",
        documentType: "galleryPhoto",
        previewPath: "/gallery",
        titleField: "caption",
        fields: [
          { name: "image", title: "Photo", type: "image", hint: "Upload the highest-quality original you have." },
          { name: "caption", title: "Caption", type: "string", maxLength: 120 },
          { name: "photographerCredit", title: "Photographer credit", type: "string" },
          { name: "category", title: "Category", type: "string" },
          ...listMeta,
        ],
      },
    ],
  },
  {
    key: "things-to-do",
    title: "Things To Do",
    previewPath: "/things-to-do",
    sections: [
      {
        key: "intro",
        title: "Local guide introduction",
        kind: "singleton",
        documentType: "localGuideIntro",
        documentId: "localGuideIntro",
        previewPath: "/things-to-do",
        titleField: "heading",
        fields: [
          { name: "scriptIntro", title: "Script introduction", type: "string" },
          { name: "heading", title: "Page heading", type: "string", required: true, maxLength: 80 },
          { name: "introduction", title: "Introductory text", type: "text", rows: 4, required: true, maxLength: 800 },
          { name: "featureImage", title: "Feature image", type: "image" },
          { name: "personalNote", title: "Personal note", type: "text", rows: 3 },
        ],
      },
      {
        key: "activities",
        title: "Recommendations",
        kind: "list",
        documentType: "activity",
        previewPath: "/things-to-do",
        titleField: "name",
        fields: [
          { name: "name", title: "Name", type: "string", required: true },
          {
            name: "category",
            title: "Category",
            type: "select",
            required: true,
            options: [
              { title: "Restaurants", value: "restaurants" },
              { title: "Coffee", value: "coffee" },
              { title: "Bars", value: "bars" },
              { title: "Attractions", value: "attractions" },
              { title: "Shopping", value: "shopping" },
              { title: "Outdoor Activities", value: "outdoor" },
              { title: "Family Friendly", value: "family" },
            ],
          },
          { name: "image", title: "Image", type: "image" },
          { name: "description", title: "Description", type: "text", rows: 3, required: true, maxLength: 400 },
          { name: "address", title: "Address", type: "string", required: true },
          { name: "distance", title: "Distance from venue", type: "string" },
          { name: "websiteUrl", title: "Website URL", type: "url" },
          { name: "mapUrl", title: "Map URL", type: "url" },
          { name: "priceRange", title: "Price range", type: "string" },
          { name: "recommendation", title: "Personal recommendation", type: "text", rows: 2 },
          ...listMeta,
        ],
      },
    ],
  },
  {
    key: "faqs",
    title: "FAQs",
    previewPath: "/faqs",
    sections: [
      {
        key: "page",
        title: "FAQ page",
        kind: "singleton",
        documentType: "faqPage",
        documentId: "faqPage",
        previewPath: "/faqs",
        titleField: "heading",
        fields: [
          { name: "scriptIntro", title: "Script introduction", type: "string" },
          { name: "heading", title: "Page heading", type: "string", required: true, maxLength: 80 },
          { name: "introduction", title: "Introductory text", type: "text", rows: 4, required: true, maxLength: 600 },
          { name: "contactMessage", title: "Contact message", type: "text", rows: 2 },
          { name: "contactEmail", title: "Contact email or link", type: "string" },
        ],
      },
      {
        key: "items",
        title: "Questions and answers",
        kind: "list",
        documentType: "faqItem",
        previewPath: "/faqs",
        titleField: "question",
        fields: [
          { name: "question", title: "Question", type: "string", required: true, maxLength: 160 },
          { name: "answer", title: "Answer", type: "text", rows: 5, required: true, maxLength: 1200 },
          { name: "category", title: "Category", type: "string" },
          showOnWebsite,
          displayOrder,
        ],
      },
    ],
  },
  {
    key: "rsvp",
    title: "RSVP",
    previewPath: "/rsvp",
    sections: [
      {
        key: "form",
        title: "RSVP form settings",
        description: "Guest responses are stored separately (Airtable). This only edits form wording and options.",
        kind: "singleton",
        documentType: "rsvpFormSettings",
        documentId: "rsvpFormSettings",
        previewPath: "/rsvp",
        titleField: "heading",
        fields: [
          { name: "heading", title: "Page heading", type: "string", required: true, maxLength: 80 },
          { name: "scriptIntro", title: "Script introduction", type: "string" },
          { name: "introduction", title: "Introductory message", type: "text", rows: 4, required: true, maxLength: 600 },
          { name: "rsvpDeadlineDisplay", title: "RSVP deadline display text", type: "string" },
          { name: "formOpen", title: "Form is open for responses", type: "boolean" },
          { name: "closedMessage", title: "Closed-form message", type: "text", rows: 3 },
          { name: "confirmationHeading", title: "Confirmation heading", type: "string" },
          { name: "confirmationMessage", title: "Confirmation message", type: "text", rows: 3 },
          { name: "mealOptions", title: "Meal options", type: "optionList", optionValueKey: "value" },
          { name: "eventOptions", title: "Event attendance options", type: "optionList", optionValueKey: "key" },
          { name: "showDietaryField", title: "Show dietary restrictions field", type: "boolean" },
          { name: "showSongRequestField", title: "Show song request field", type: "boolean" },
          { name: "showPhoneField", title: "Show phone field", type: "boolean" },
          { name: "showEmailField", title: "Show email field", type: "boolean" },
          { name: "helpMessage", title: "Contact-for-help message", type: "text", rows: 2 },
        ],
      },
    ],
  },
];

export function getStudioPage(pageKey: string): StudioPage | undefined {
  return STUDIO_PAGES.find((page) => page.key === pageKey);
}

export function getStudioSection(
  pageKey: string,
  sectionKey: string,
): { page: StudioPage; section: StudioSection } | undefined {
  const page = getStudioPage(pageKey);
  if (!page) return undefined;
  const section = page.sections.find((item) => item.key === sectionKey);
  if (!section) return undefined;
  return { page, section };
}

export function findSectionForType(documentType: string): {
  page: StudioPage;
  section: StudioSection;
} | undefined {
  for (const page of STUDIO_PAGES) {
    const section = page.sections.find((item) => item.documentType === documentType);
    if (section) return { page, section };
  }
  return undefined;
}
