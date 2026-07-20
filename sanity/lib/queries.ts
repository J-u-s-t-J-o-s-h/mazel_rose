import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  ...,
  asset,
  hotspot,
  crop,
  alt
`;

export const WEDDING_DETAILS_QUERY = defineQuery(`
  *[_type == "weddingDetails" && _id == "weddingDetails"][0]{
    ...,
    socialImage{${imageFields}}
  }
`);

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0]{
    ...,
    heroImage{${imageFields}},
    welcomeImage{${imageFields}},
    storyImage{${imageFields}},
    featureImage{${imageFields}}
  }
`);

export const SCHEDULE_EVENTS_QUERY = defineQuery(`
  *[_type == "scheduleEvent" && showOnWebsite != false] | order(displayOrder asc) {
    _id,
    title,
    date,
    startTime,
    endTime,
    venue,
    address,
    description,
    dressCode,
    mapUrl,
    transportation,
    parking,
    invitationOnly,
    isPrivate,
    featured,
    displayOrder
  }
`);

export const TRAVEL_OVERVIEW_QUERY = defineQuery(`
  *[_type == "travelOverview" && _id == "travelOverview"][0]{
    ...,
    featureImage{${imageFields}}
  }
`);

export const AIRPORTS_QUERY = defineQuery(`
  *[_type == "airport" && showOnWebsite != false] | order(displayOrder asc)
`);

export const HOTELS_QUERY = defineQuery(`
  *[_type == "hotel" && showOnWebsite != false] | order(displayOrder asc) {
    ...,
    image{${imageFields}}
  }
`);

export const REGISTRY_INTRO_QUERY = defineQuery(`
  *[_type == "registryIntro" && _id == "registryIntro"][0]{
    ...,
    featureImage{${imageFields}}
  }
`);

export const REGISTRY_LINKS_QUERY = defineQuery(`
  *[_type == "registryLink" && showOnWebsite != false] | order(displayOrder asc) {
    ...,
    image{${imageFields}}
  }
`);

export const WEDDING_PARTY_QUERY = defineQuery(`
  *[_type == "weddingPartyMember" && showOnWebsite != false] | order(displayOrder asc) {
    ...,
    photo{${imageFields}}
  }
`);

export const GALLERY_SETTINGS_QUERY = defineQuery(`
  *[_type == "gallerySettings" && _id == "gallerySettings"][0]{
    ...,
    featureImage{${imageFields}}
  }
`);

export const GALLERY_PHOTOS_QUERY = defineQuery(`
  *[_type == "galleryPhoto" && showOnWebsite != false] | order(displayOrder asc) {
    _id,
    caption,
    photographerCredit,
    category,
    featured,
    displayOrder,
    image{${imageFields}}
  }
`);

export const LOCAL_GUIDE_INTRO_QUERY = defineQuery(`
  *[_type == "localGuideIntro" && _id == "localGuideIntro"][0]{
    ...,
    featureImage{${imageFields}}
  }
`);

export const ACTIVITIES_QUERY = defineQuery(`
  *[_type == "activity" && showOnWebsite != false] | order(displayOrder asc) {
    ...,
    image{${imageFields}}
  }
`);

export const FAQ_PAGE_QUERY = defineQuery(`
  *[_type == "faqPage" && _id == "faqPage"][0]
`);

export const FAQ_ITEMS_QUERY = defineQuery(`
  *[_type == "faqItem" && showOnWebsite != false] | order(displayOrder asc)
`);

export const RSVP_FORM_SETTINGS_QUERY = defineQuery(`
  *[_type == "rsvpFormSettings" && _id == "rsvpFormSettings"][0]
`);
