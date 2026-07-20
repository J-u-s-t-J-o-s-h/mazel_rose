import type { WeddingPartyMember } from "@/types/content";

export const weddingPartyIntro = {
  title: "Wedding Party",
  scriptIntro: "Beloved Circle",
  body: "The friends and family standing beside us—each one a chapter in our story. PLACEHOLDER: Replace names, roles, portraits, and biographies.",
};

export const weddingParty: WeddingPartyMember[] = [
  {
    id: "wp1",
    name: "Ava Ellison",
    role: "Maid of Honor",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Portrait of Ava Ellison",
    relationship: "Sister of Rose",
    bio: "Lifelong confidante, travel companion, and the first to know every chapter of this love story.",
    funFact: "Plans the best spontaneous dinner parties.",
    side: "partnerTwo",
    isPlaceholder: true,
  },
  {
    id: "wp2",
    name: "Jonah Hale",
    role: "Best Man",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Portrait of Jonah Hale",
    relationship: "Brother of Mazel",
    bio: "Steady, witty, and always ready with the right toast—or the right playlist.",
    funFact: "Once drove across three states for a vinyl record.",
    side: "partnerOne",
    isPlaceholder: true,
  },
  {
    id: "wp3",
    name: "Camille Soto",
    role: "Bridesmaid",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Portrait of Camille Soto",
    relationship: "College roommate of Rose",
    bio: "A creative spirit who has celebrated every milestone with warmth and humor.",
    funFact: "Speaks four languages and collects vintage postcards.",
    side: "partnerTwo",
    isPlaceholder: true,
  },
  {
    id: "wp4",
    name: "Marcus Bell",
    role: "Groomsman",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Portrait of Marcus Bell",
    relationship: "Closest friend of Mazel",
    bio: "The friend who shows up early, stays late, and makes every gathering feel like home.",
    funFact: "Makes an unforgettable espresso martini.",
    side: "partnerOne",
    isPlaceholder: true,
  },
  {
    id: "wp5",
    name: "Lila Quinn",
    role: "Bridesmaid",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Portrait of Lila Quinn",
    relationship: "Cousin of Rose",
    bio: "Gentle, stylish, and endlessly thoughtful—our family's quiet bright light.",
    funFact: "Can identify any flower by scent alone.",
    side: "partnerTwo",
    isPlaceholder: true,
  },
  {
    id: "wp6",
    name: "Theo Grant",
    role: "Groomsman",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Portrait of Theo Grant",
    relationship: "Friend from childhood",
    bio: "A storyteller at heart and the person most likely to keep the dance floor full.",
    funFact: "Has a standing Sunday crossword tradition.",
    side: "partnerOne",
    isPlaceholder: true,
  },
];
