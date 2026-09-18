import type { Activity, ActivityCategory } from "@/types/content";

export const activitiesIntro = {
  title: "Things To Do",
  scriptIntro: "Explore",
  body: "A curated guide to Orlando—restaurants, coffee, and easy outings near Paradise Cove. Disney Springs is about ten minutes away; Winter Garden is a slower local afternoon if you have extra time in town.",
};

export const activityCategories: { id: ActivityCategory | "all"; label: string }[] =
  [
    { id: "all", label: "All" },
    { id: "restaurants", label: "Restaurants" },
    { id: "coffee", label: "Coffee" },
    { id: "bars", label: "Bars" },
    { id: "attractions", label: "Attractions" },
    { id: "shopping", label: "Shopping" },
    { id: "outdoor", label: "Outdoor" },
    { id: "family", label: "Family" },
  ];

export const activities: Activity[] = [
  {
    id: "homecomin",
    name: "Chef Art Smith's Homecomin'",
    category: "restaurants",
    image: "/activities/homecomin.jpg",
    imageAlt:
      "The porch and entrance of Chef Art Smith's Homecomin' at Disney Springs",
    description:
      "Florida farm-to-table cooking on the waterfront at Disney Springs—comforting Southern plates and porch-side cocktails.",
    address: "1602 E Buena Vista Dr, Lake Buena Vista, FL 32830",
    distance: "10 min from Paradise Cove",
    websiteUrl: "https://www.homecominkitchen.com/",
    mapUrl:
      "https://maps.google.com/?q=1602+E+Buena+Vista+Dr,+Lake+Buena+Vista,+FL+32830",
    recommendation: "Reserve ahead; fried chicken and a moonshine cocktail on the porch are favorites.",
    priceRange: "$$$",
  },
  {
    id: "boathouse",
    name: "The BOATHOUSE",
    category: "restaurants",
    image: "/activities/boathouse.jpg",
    imageAlt:
      "The lighthouse and blue waterfront facade of The BOATHOUSE at Disney Springs",
    description:
      "Waterfront steaks, seafood, and a raw bar on Lake Buena Vista, with vintage Amphicars puttering past the docks.",
    address: "1620 E Buena Vista Dr, Lake Buena Vista, FL 32830",
    distance: "10 min from Paradise Cove",
    websiteUrl: "https://theboathouseorlando.com/",
    mapUrl:
      "https://maps.google.com/?q=1620+E+Buena+Vista+Dr,+Lake+Buena+Vista,+FL+32830",
    recommendation: "Book a waterfront table, then add an Amphicar ride if you want a one-of-a-kind souvenir.",
    priceRange: "$$$",
  },
  {
    id: "wine-bar-george",
    name: "Wine Bar George",
    category: "restaurants",
    image: "/activities/wine-bar-george.jpg",
    imageAlt:
      "The brick-walled bar and dining room at Wine Bar George in Disney Springs",
    description:
      "Florida’s only Master Sommelier-led wine bar, with more than 200 wines by the glass, bottle, or ounce and sharing plates.",
    address: "1610 E Buena Vista Dr, Lake Buena Vista, FL 32830",
    distance: "10 min from Paradise Cove",
    websiteUrl: "https://winebargeorge.com/",
    mapUrl:
      "https://maps.google.com/?q=1610+E+Buena+Vista+Dr,+Lake+Buena+Vista,+FL+32830",
    recommendation: "Ask for a by-the-ounce flight if you want to taste without committing to a bottle.",
    priceRange: "$$$",
  },
  {
    id: "polite-pig",
    name: "The Polite Pig",
    category: "restaurants",
    image: "/activities/polite-pig.jpg",
    imageAlt:
      "The tiled patio bar and sign at The Polite Pig in Disney Springs",
    description:
      "Modern Florida barbecue in Town Center—smoked meats, craft beer, and a walk-up patio that is easier than a full reservation.",
    address: "1536 E Buena Vista Dr, Lake Buena Vista, FL 32830",
    distance: "10 min from Paradise Cove",
    websiteUrl: "https://www.politepig.com/",
    mapUrl:
      "https://maps.google.com/?q=The+Polite+Pig,+Disney+Springs,+Lake+Buena+Vista,+FL",
    recommendation: "A good group option when Homecomin' and The BOATHOUSE are booked.",
    priceRange: "$$",
  },
  {
    id: "foxtail",
    name: "Foxtail Coffee",
    category: "coffee",
    image: "/activities/foxtail.jpg",
    imageAlt:
      "The coffee counter and Kelly's ice cream bar at Foxtail Coffee in Winter Garden",
    description:
      "An Orlando-born coffee shop on Winter Garden’s Plant Street, with patio seating and a slower start to the day.",
    address: "276 W Plant St, Winter Garden, FL 34787",
    distance: "20 min from Paradise Cove",
    websiteUrl:
      "https://www.foxtailcoffee.com/locations/foxtail-coffee-downtown-winter-garden",
    mapUrl: "https://maps.google.com/?q=276+W+Plant+St,+Winter+Garden,+FL+34787",
    recommendation: "Grab a latte, then wander the brick-lined shops a few doors down.",
    priceRange: "$",
  },
  {
    id: "gideons",
    name: "Gideon's Bakehouse",
    category: "coffee",
    image: "/activities/gideons.jpg",
    imageAlt:
      "The gothic brick exterior of Gideon's Bakehouse at Disney Springs",
    description:
      "Orlando’s famous half-pound cookies and scratch-made iced coffees in a storybook bakery at The Landing. Lines are part of the ritual.",
    address: "1486 E Buena Vista Dr, Lake Buena Vista, FL 32830",
    distance: "10 min from Paradise Cove",
    websiteUrl: "https://gideonsbakehouse.com/locations/disney-springs/",
    mapUrl:
      "https://maps.google.com/?q=Gideon's+Bakehouse,+Disney+Springs,+Lake+Buena+Vista,+FL",
    recommendation: "The peanut butter iced coffee is the order. Go early if you do not want a long wait.",
    priceRange: "$",
  },
  {
    id: "everglazed",
    name: "Everglazed Donuts & Cold Brew",
    category: "coffee",
    image: "/activities/everglazed.jpg",
    imageAlt: "A box of decorated donuts from Everglazed at Disney Springs",
    description:
      "Over-the-top donuts and cold brew on the West Side of Disney Springs—an easier sweet stop if Gideon's line is out the door.",
    address: "1500 E Buena Vista Dr, Lake Buena Vista, FL 32830",
    distance: "10 min from Paradise Cove",
    websiteUrl:
      "https://www.disneysprings.com/dining/everglazed-donuts-and-cold-brew/",
    mapUrl:
      "https://maps.google.com/?q=Everglazed+Donuts,+Disney+Springs,+Lake+Buena+Vista,+FL",
    recommendation: "Pair a cold brew with a donut and sit under the pergola if you want a slower morning.",
    priceRange: "$",
  },
  {
    id: "enzos",
    name: "Enzo's Hideaway",
    category: "bars",
    image: "/activities/enzos.jpg",
    imageAlt:
      "The neon Enzo's Hideaway Tunnel Bar entrance at Disney Springs",
    description:
      "A subterranean speakeasy at Disney Springs with Italian plates, tunnel rooms, and a quietly glamorous bar.",
    address: "1560 E Buena Vista Dr, Lake Buena Vista, FL 32830",
    distance: "10 min from Paradise Cove",
    websiteUrl: "https://www.enzoshideawayfla.com/",
    mapUrl:
      "https://maps.google.com/?q=1560+E+Buena+Vista+Dr,+Lake+Buena+Vista,+FL+32830",
    recommendation: "Ask for a table in the brick tunnels if you want the full hideaway mood.",
    priceRange: "$$",
  },
  {
    id: "hangar-bar",
    name: "Jock Lindsey's Hangar Bar",
    category: "bars",
    image: "/activities/hangar-bar.jpg",
    imageAlt:
      "The crane-lifted Hangar Bar sign outside Jock Lindsey's at Disney Springs",
    description:
      "An Indiana Jones–inspired hangar on the water, with inventive cocktails, small plates, and a family-friendly patio.",
    address: "1510 E Buena Vista Dr, Lake Buena Vista, FL 32830",
    distance: "10 min from Paradise Cove",
    websiteUrl:
      "https://disneyworld.disney.go.com/dining/downtown-disney/jock-lindseys-hangar-bar/",
    mapUrl:
      "https://maps.google.com/?q=Jock+Lindsey's+Hangar+Bar,+Disney+Springs,+FL",
    recommendation: "Go at golden hour for the lake view. The diving-bell booth is a fun ask if it is free.",
    priceRange: "$$",
  },
  {
    id: "edison",
    name: "The Edison",
    category: "bars",
    image: "/activities/edison.jpg",
    imageAlt:
      "The industrial gothic interior of The Edison at Disney Springs",
    description:
      "A 1920s power-plant supper club with theatrical rooms, live entertainment, and craft cocktails under soaring ceilings.",
    address: "1590 E Buena Vista Dr, Lake Buena Vista, FL 32830",
    distance: "10 min from Paradise Cove",
    websiteUrl:
      "https://disneyworld.disney.go.com/dining/disney-springs/edison/",
    mapUrl:
      "https://maps.google.com/?q=The+Edison,+Disney+Springs,+Lake+Buena+Vista,+FL",
    recommendation: "Dress a little more polished. Reservations are strongly recommended.",
    priceRange: "$$$",
  },
  {
    id: "crooked-can",
    name: "Crooked Can Brewing",
    category: "bars",
    image: "/activities/crooked-can.jpg",
    imageAlt:
      "Plant Street Market and the Crooked Can brewery patio in Winter Garden",
    description:
      "Winter Garden’s local craft brewery inside Plant Street Market, with live music, food-hall vendors, and a shaded patio.",
    address: "426 W Plant St, Winter Garden, FL 34787",
    distance: "20 min from Paradise Cove",
    websiteUrl: "https://crookedcan.com/winter-garden-brewery/",
    mapUrl: "https://maps.google.com/?q=426+W+Plant+St,+Winter+Garden,+FL+34787",
    recommendation: "Easy after a Foxtail coffee and a walk on the West Orange Trail.",
    priceRange: "$",
  },
  {
    id: "disney-springs",
    name: "Disney Springs",
    category: "attractions",
    image: "/activities/disney-springs.jpg",
    imageAlt:
      "The Paddlefish boat restaurant and promenade at Disney Springs",
    description:
      "A lakeside district of dining, shops, and live music. No park ticket is required—just a short drive from the hotels.",
    address: "1486 E Buena Vista Dr, Lake Buena Vista, FL 32830",
    distance: "10 min from Paradise Cove",
    websiteUrl: "https://www.disneysprings.com/",
    mapUrl: "https://maps.google.com/?q=Disney+Springs,+Lake+Buena+Vista,+FL",
    recommendation: "Come in the late afternoon for a stroll, then stay for dinner along the water.",
    priceRange: "Free",
  },
  {
    id: "icon-park",
    name: "ICON Park",
    category: "attractions",
    image: "/activities/icon-park.jpg",
    imageAlt: "The Orlando Eye observation wheel at ICON Park",
    description:
      "The Wheel, SEA LIFE, Madame Tussauds, and a stretch of restaurants on International Drive—no theme-park ticket required.",
    address: "8375 International Dr, Orlando, FL 32819",
    distance: "20 min from Paradise Cove",
    websiteUrl: "https://iconparkorlando.com/",
    mapUrl: "https://maps.google.com/?q=ICON+Park,+8375+International+Dr,+Orlando,+FL",
    recommendation: "Ride The Wheel at sunset. Parking in the garage is free for most visits.",
    priceRange: "$$",
  },
  {
    id: "celebration",
    name: "Celebration Town Center",
    category: "attractions",
    image: "/activities/celebration.jpg",
    imageAlt:
      "The fountain and Market Street shops in downtown Celebration, Florida",
    description:
      "A walkable lakeside town center with boutiques, ice cream, and a waterfront promenade—quieter than Disney Springs.",
    address: "701 Front St, Celebration, FL 34747",
    distance: "15 min from Paradise Cove",
    websiteUrl: "https://www.celebration.fl.us/",
    mapUrl: "https://maps.google.com/?q=701+Front+St,+Celebration,+FL+34747",
    recommendation: "A pretty hour if you want a stroll without a shopping mall or a theme park.",
    priceRange: "Free",
  },
  {
    id: "vineland-outlets",
    name: "Orlando Vineland Premium Outlets",
    category: "shopping",
    image: "/activities/vineland-outlets.jpg",
    imageAlt:
      "The Vineland sign at Orlando Vineland Premium Outlets at sunset",
    description:
      "The closest outlet shopping to Paradise Cove and the recommended hotels, with outdoor walkways and familiar brands.",
    address: "8200 Vineland Ave, Orlando, FL 32821",
    distance: "5 min from Paradise Cove",
    websiteUrl: "https://www.premiumoutlets.com/outlet/orlando-vineland",
    mapUrl: "https://maps.google.com/?q=8200+Vineland+Ave,+Orlando,+FL+32821",
    recommendation: "An easy, unhurried afternoon if you want a few hours off the wedding schedule.",
    priceRange: "$$",
  },
  {
    id: "millenia",
    name: "The Mall at Millenia",
    category: "shopping",
    image: "/activities/millenia.jpg",
    imageAlt: "The glass atrium inside The Mall at Millenia in Orlando",
    description:
      "Orlando’s upscale indoor mall—Bloomingdale’s, Apple, and a calmer air-conditioned afternoon if the outlets feel too busy.",
    address: "4200 Conroy Rd, Orlando, FL 32839",
    distance: "20 min from Paradise Cove",
    websiteUrl: "https://www.simon.com/mall/the-mall-at-millenia",
    mapUrl: "https://maps.google.com/?q=The+Mall+at+Millenia,+Orlando,+FL",
    recommendation: "Useful on a rainy day. Allow extra time on I-4.",
    priceRange: "$$$",
  },
  {
    id: "plant-street",
    name: "Plant Street, Winter Garden",
    category: "shopping",
    image: "/activities/plant-street.jpg",
    imageAlt:
      "The Winter Garden clock-tower arch along Plant Street at night",
    description:
      "Independent shops, galleries, and the food hall at Plant Street Market—the local alternative to outlet shopping.",
    address: "200 W Plant St, Winter Garden, FL 34787",
    distance: "20 min from Paradise Cove",
    websiteUrl: "https://downtownwg.com/",
    mapUrl: "https://maps.google.com/?q=Plant+Street,+Winter+Garden,+FL+34787",
    recommendation: "Pair with Foxtail, Crooked Can, and a short stretch of the West Orange Trail.",
    priceRange: "$",
  },
  {
    id: "west-orange-trail",
    name: "West Orange Trail",
    category: "outdoor",
    image: "/activities/west-orange-trail.jpg",
    imageAlt:
      "The Winter Garden clock tower on Plant Street, along the West Orange Trail",
    description:
      "A paved trail through historic downtown Winter Garden. Walk or rent a bike at Winter Garden Station, then stop for lunch on Plant Street.",
    address: "455 E Plant St, Winter Garden, FL 34787",
    distance: "20 min from Paradise Cove",
    websiteUrl: "https://downtownwg.com/locations/west-orange-trail/",
    mapUrl: "https://maps.google.com/?q=455+E+Plant+St,+Winter+Garden,+FL+34787",
    recommendation: "Sunrise-to-sunset hours. Comfortable shoes are all you need for a short downtown stretch.",
    priceRange: "Free",
  },
  {
    id: "lake-eola",
    name: "Lake Eola Park",
    category: "outdoor",
    image: "/activities/lake-eola.jpg",
    imageAlt:
      "The swan sculptures and downtown Orlando skyline at Lake Eola Park",
    description:
      "Downtown Orlando’s lake loop, with swan boats, a fountain, and the skyline—an easy hour if you want to see the city itself.",
    address: "512 E Washington St, Orlando, FL 32801",
    distance: "25 min from Paradise Cove",
    websiteUrl: "https://www.orlando.gov/Parks-Facilities/Lake-Eola-Park",
    mapUrl: "https://maps.google.com/?q=Lake+Eola+Park,+Orlando,+FL",
    recommendation: "Go in the morning or at golden hour. The farmers market is on Sundays.",
    priceRange: "Free",
  },
  {
    id: "lake-louisa",
    name: "Lake Louisa State Park",
    category: "outdoor",
    image: "/activities/lake-louisa.jpg",
    imageAlt: "Live oaks and Spanish moss at Lake Louisa State Park",
    description:
      "A quieter nature afternoon west of town—lakes, hammocks, and walking trails without the theme-park crowds.",
    address: "7305 US-27, Clermont, FL 34714",
    distance: "30 min from Paradise Cove",
    websiteUrl:
      "https://www.floridastateparks.org/parks-and-trails/lake-louisa-state-park",
    mapUrl: "https://maps.google.com/?q=Lake+Louisa+State+Park,+Clermont,+FL",
    recommendation: "Bring water and a Florida State Parks pass or the day-use fee. Closed at sunset.",
    priceRange: "$",
  },
  {
    id: "cf-zoo",
    name: "Central Florida Zoo & Botanical Gardens",
    category: "family",
    image: "/activities/cf-zoo.jpg",
    imageAlt:
      "A sloth in care at the Central Florida Zoo & Botanical Gardens",
    description:
      "A smaller, walkable zoo in Sanford—home to the sloths that mean a great deal to us. A meaningful outing if you have a free morning.",
    address: "3755 W Seminole Blvd, Sanford, FL 32771",
    distance: "50 min from Paradise Cove",
    websiteUrl: "https://www.centralfloridazoo.org/",
    mapUrl:
      "https://maps.google.com/?q=3755+W+Seminole+Blvd,+Sanford,+FL+32771",
    recommendation: "Check hours before you go, and leave extra time for I-4.",
    priceRange: "$$",
  },
  {
    id: "gatorland",
    name: "Gatorland",
    category: "family",
    image: "/activities/gatorland.jpg",
    imageAlt: "The giant alligator-mouth entrance to Gatorland in Orlando",
    description:
      "A classic Florida roadside zoo on Orange Blossom Trail—alligators, zip lines, and a walk-through swamp closer than the Sanford zoo.",
    address: "14501 S Orange Blossom Trl, Orlando, FL 32837",
    distance: "20 min from Paradise Cove",
    websiteUrl: "https://www.gatorland.com/",
    mapUrl:
      "https://maps.google.com/?q=14501+S+Orange+Blossom+Trl,+Orlando,+FL+32837",
    recommendation: "Open daily; the gator jumping show is the crowd-pleaser if you time it right.",
    priceRange: "$$",
  },
  {
    id: "andretti",
    name: "Andretti Indoor Karting & Games",
    category: "family",
    image: "/activities/andretti.jpg",
    imageAlt: "An indoor go-kart racing at Andretti Indoor Karting & Games",
    description:
      "Electric karting, arcade games, and bowling near International Drive—a strong rain-day plan that does not need a park ticket.",
    address: "9292 Universal Blvd, Orlando, FL 32819",
    distance: "20 min from Paradise Cove",
    websiteUrl: "https://andrettikarting.com/orlando/",
    mapUrl:
      "https://maps.google.com/?q=9292+Universal+Blvd,+Orlando,+FL+32819",
    recommendation: "Book karting online. Height and age rules apply for the adult track.",
    priceRange: "$$",
  },
];
