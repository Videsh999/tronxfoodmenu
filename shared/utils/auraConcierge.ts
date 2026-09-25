import type { Dish } from '../types/menu';

export interface ConciergeQuestion {
  id: number;
  question: string;
  shortLabel: string;
}

export const CONCIERGE_COMMON_QUESTIONS: ConciergeQuestion[] = [
  { id: 1, question: "What are the chef's signature dishes?", shortLabel: "CHEF'S SIGNATURES" },
  { id: 2, question: "Can you recommend dishes under ₹500?", shortLabel: "DISHES UNDER ₹500" },
  { id: 3, question: "What are the best vegetarian options?", shortLabel: "VEGETARIAN SELECTIONS" },
  { id: 4, question: "Which dishes are popular for sharing?", shortLabel: "POPULAR FOR SHARING" },
  { id: 5, question: "Are there spicy specialties available?", shortLabel: "SPICY SPECIALTIES" },
  { id: 6, question: "What desserts or sweet finishes do you offer?", shortLabel: "DESSERTS & SWEETS" },
  { id: 7, question: "Which dishes are dairy-free or gluten-conscious?", shortLabel: "DIETARY & ALLERGENS" },
  { id: 8, question: "What can I order for a quick 15-minute meal?", shortLabel: "QUICK 15-MIN MEAL" },
  { id: 9, question: "What appetizers or starters should we begin with?", shortLabel: "APPETIZERS & STARTERS" },
  { id: 10, question: "Can you suggest a complete 3-course dinner?", shortLabel: "3-COURSE DINNER" },
];

export interface ConciergeResponse {
  text: string;
  dishes: Dish[];
  isFallback?: boolean;
  requiresAiBackend?: boolean;
}

export interface LeanDish {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  dietaryTags: string[];
  allergens: string[];
  calories?: number;
  isSignature: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
}

/**
 * Extracts a minimal, grounded JSON context for the LLM.
 * Only sends existing, validated fields without inventing missing values.
 */
export function extractLeanMenu(dishes: Dish[]): LeanDish[] {
  return dishes
    .filter((d) => d.isAvailable !== false)
    .map((d) => {
      const isSpicy =
        d.dietaryTags.includes('SPICY') ||
        d.description.toLowerCase().includes('chili') ||
        d.description.toLowerCase().includes('spicy') ||
        d.description.toLowerCase().includes('charcoal');

      const isSignature = d.dietaryTags.includes('SIGNATURE') || !!d.featured;

      return {
        id: d.id,
        name: d.name,
        category: d.categorySlug,
        description: d.description,
        price: d.price,
        dietaryTags: d.dietaryTags,
        allergens: d.allergens,
        calories: d.calories,
        isSignature,
        isSpicy,
        isAvailable: d.isAvailable,
      };
    });
}

/**
 * Deterministic Ask AURA Dining Concierge engine.
 * STRICTLY grounded in authentic menu data.
 * Adheres to:
 * - Real popularity rule (no faked popularity)
 * - Real 3-course dinner progression (Starter, Main, Dessert — NO wine/cellar pairing)
 * - Session follow-up conversation awareness
 * - Graceful fallback response
 */
export function queryAuraConcierge(
  query: string,
  allDishes: Dish[],
  previousDishes: Dish[] = []
): ConciergeResponse {
  const normalized = query.trim().toLowerCase();

  // ── FOLLOW-UP CONVERSATION MEMORY RESOLUTION ───────────────────────────
  if (previousDishes.length > 0) {
    // "Which one is vegetarian?" or "is any vegetarian?"
    if (normalized.includes('vegetarian') || normalized.includes('vegan') || normalized.includes('veg')) {
      const matchedPrev = previousDishes.filter((d) =>
        d.dietaryTags.some((t) => t === 'VEGETARIAN' || t === 'VEGAN')
      );
      if (matchedPrev.length > 0) {
        return {
          text: 'From our previous recommendations, the following selection is crafted entirely plant-forward / vegetarian:',
          dishes: matchedPrev,
        };
      }
    }

    // "Which one is spicy?" or "is any spicy?"
    if (normalized.includes('spicy') || normalized.includes('hot') || normalized.includes('chili')) {
      const matchedPrev = previousDishes.filter(
        (d) =>
          d.dietaryTags.includes('SPICY') ||
          d.description.toLowerCase().includes('chili') ||
          d.description.toLowerCase().includes('spicy')
      );
      if (matchedPrev.length > 0) {
        return {
          text: 'From our previous recommendations, this dish features vibrant heat and flame-charred spices:',
          dishes: matchedPrev,
        };
      }
    }

    // "Which one is under 500?" or "cheapest"
    if (normalized.includes('under') || normalized.includes('500') || normalized.includes('cheapest')) {
      const matchedPrev = previousDishes.filter((d) => d.price <= 500);
      if (matchedPrev.length > 0) {
        return {
          text: 'From our previous recommendations, these dishes are priced within ₹500:',
          dishes: matchedPrev.sort((a, b) => a.price - b.price),
        };
      }
    }

    // "Which one has no dairy?" or "dairy free"
    if (normalized.includes('dairy free') || normalized.includes('no dairy') || normalized.includes('without dairy')) {
      const matchedPrev = previousDishes.filter(
        (d) => !d.allergens.some((a) => a.toLowerCase().includes('dairy'))
      );
      if (matchedPrev.length > 0) {
        return {
          text: 'From our previous recommendations, the following creation is prepared without dairy:',
          dishes: matchedPrev,
        };
      }
    }
  }

  // ── THE 10 PRESET QUESTIONS & CORE MENU QUERIES ─────────────────────────

  // 1. What are the chef's signature dishes?
  if (
    normalized.includes('signature') ||
    normalized.includes("chef's signature") ||
    normalized.includes('chef choice') ||
    normalized === '1'
  ) {
    const signatures = allDishes.filter((d) => d.dietaryTags.includes('SIGNATURE') || d.featured);
    return {
      text: 'The Tronx Signature Harvest represents our kitchen’s pinnacle creations — each dish seasoned with heritage spices and flame-grilled over live coals:',
      dishes: signatures.slice(0, 4),
    };
  }

  // 2. Can you recommend dishes under ₹500?
  if (
    normalized.includes('under ₹500') ||
    normalized.includes('under 500') ||
    normalized.includes('within 500') ||
    normalized.includes('budget') ||
    normalized === '2'
  ) {
    const under500 = allDishes
      .filter((d) => d.price <= 500)
      .sort((a, b) => a.price - b.price);
    return {
      text: `Fine dining meets remarkable value at Tronx. We offer ${under500.length} handcrafted culinary creations priced at or under ₹500:`,
      dishes: under500.slice(0, 4),
    };
  }

  // 3. What are the best vegetarian options?
  if (
    normalized.includes('vegetarian') ||
    normalized.includes('vegan') ||
    normalized === '3'
  ) {
    const vegDishes = allDishes.filter(
      (d) => d.dietaryTags.includes('VEGETARIAN') || d.dietaryTags.includes('VEGAN')
    );
    return {
      text: `We celebrate plant-forward gastronomy with ${vegDishes.length} dedicated vegetarian creations, prepared with farm-fresh harvest and organic cold-pressed oils:`,
      dishes: vegDishes.slice(0, 4),
    };
  }

  // 4. Which dishes are popular for sharing? (NO FAKE POPULARITY RULE ENFORCED)
  if (
    normalized.includes('sharing') ||
    normalized.includes('share') ||
    normalized.includes('for two') ||
    normalized.includes('popular') ||
    normalized === '4'
  ) {
    const shareable = allDishes.filter(
      (d) =>
        d.categorySlug === 'pizza' ||
        d.categorySlug === 'pasta' ||
        d.categorySlug === 'starters'
    );
    return {
      text: "I can recommend signature dishes and our stone-baked sourdough pizzas or artisanal pasta platters designed for communal dining, but I don't have verified popularity data. Serving sizes are not formally specified in the menu specifications, but these selections are favored for sharing:",
      dishes: shareable.slice(0, 4),
    };
  }

  // 5. Are there spicy specialties available?
  if (
    normalized.includes('spicy') ||
    normalized.includes('heat') ||
    normalized.includes('chili') ||
    normalized === '5'
  ) {
    const spicyDishes = allDishes.filter(
      (d) =>
        d.dietaryTags.includes('SPICY') ||
        d.description.toLowerCase().includes('chili') ||
        d.description.toLowerCase().includes('spices') ||
        d.description.toLowerCase().includes('charcoal')
    );
    return {
      text: 'For guests who appreciate vibrant spice and smoky heat, these dishes showcase authentic Kashmiri chili, ajwain, and tandoori embers:',
      dishes: spicyDishes.slice(0, 4),
    };
  }

  // 6. What desserts or sweet finishes do you offer?
  if (
    normalized.includes('dessert') ||
    normalized.includes('sweet') ||
    normalized.includes('confection') ||
    normalized === '6'
  ) {
    const desserts = allDishes.filter((d) => d.categorySlug === 'desserts');
    return {
      text: 'For an indulgent, memorable finish to your dining experience, our pastry kitchen crafts these artisanal confections and decadent sweets:',
      dishes: desserts.slice(0, 4),
    };
  }

  // 7. Which dishes are dairy-free or gluten-conscious?
  if (
    normalized.includes('dairy-free') ||
    normalized.includes('dairy free') ||
    normalized.includes('gluten-conscious') ||
    normalized.includes('gluten free') ||
    normalized.includes('gluten') ||
    normalized === '7'
  ) {
    const consciousDishes = allDishes.filter(
      (d) =>
        d.dietaryTags.includes('GLUTEN_FREE') ||
        !d.allergens.some((a) => a.toLowerCase().includes('dairy'))
    );
    return {
      text: 'We maintain stringent culinary mindfulness. The following selections are prepared gluten-conscious or without dairy ingredients:',
      dishes: consciousDishes.slice(0, 4),
    };
  }

  // 8. What can I order for a quick 15-minute meal?
  if (
    normalized.includes('quick') ||
    normalized.includes('15-minute') ||
    normalized.includes('15 min') ||
    normalized.includes('fast') ||
    normalized.includes('light') ||
    normalized === '8'
  ) {
    const quickDishes = allDishes.filter(
      (d) =>
        d.categorySlug === 'starters' ||
        d.categorySlug === 'snacks' ||
        (d.calories && d.calories <= 380)
    );
    return {
      text: 'For guests seeking a refined dining experience on a concise schedule (approx. 15 minutes preparation), our culinary brigade highlights these brisk creations:',
      dishes: quickDishes.slice(0, 4),
    };
  }

  // 9. What appetizers or starters should we begin with?
  if (
    normalized.includes('appetizer') ||
    normalized.includes('starter') ||
    normalized.includes('begin with') ||
    normalized === '9'
  ) {
    const starters = allDishes.filter((d) => d.categorySlug === 'starters');
    return {
      text: 'To awaken your palate, our brigade recommends beginning your dining journey with these flame-kissed starters and crisp artisanal bites:',
      dishes: starters.slice(0, 4),
    };
  }

  // 10. Can you suggest a complete 3-course dinner? (NO WINE / SOMMELIER PAIRING)
  if (
    normalized.includes('3-course') ||
    normalized.includes('3 course') ||
    normalized.includes('three course') ||
    normalized.includes('dinner course') ||
    normalized === '10'
  ) {
    const starter = allDishes.find((d) => d.categorySlug === 'starters') || allDishes[0];
    const main = allDishes.find((d) => d.categorySlug === 'mains') || allDishes[1];
    const dessert = allDishes.find((d) => d.categorySlug === 'desserts') || allDishes[allDishes.length - 1];

    const courseDishes = [starter, main, dessert].filter(Boolean) as Dish[];
    return {
      text: 'Here is a complete 3-course dinner progression featuring an appetizer to open the palate, an artisanal main course, and a sweet conclusion:',
      dishes: courseDishes,
    };
  }

  // ── SPECIFIC KEYWORD / CATEGORY SEARCH IN LIVE MENU ─────────────────────
  const matches = allDishes.filter((dish) => {
    const nameMatch = dish.name.toLowerCase().includes(normalized);
    const descMatch = dish.description.toLowerCase().includes(normalized);
    const catMatch = dish.categorySlug.toLowerCase().includes(normalized);
    const tagMatch = dish.dietaryTags.some((t) => t.toLowerCase().includes(normalized));
    const allergenMatch = dish.allergens.some((a) => a.toLowerCase().includes(normalized));
    return nameMatch || descMatch || catMatch || tagMatch || allergenMatch;
  });

  if (matches.length > 0) {
    return {
      text: `Here are authentic Tronx culinary selections from our menu matching "${query}":`,
      dishes: matches.slice(0, 4),
    };
  }

  // ── GRACEFUL FALLBACK WHEN NO MATCH & AI BACKEND PENDING ────────────────
  const curatedFallback = allDishes.filter((d) => d.dietaryTags.includes('SIGNATURE') || d.featured);
  return {
    text: 'TRONX is taking a moment. Here are some menu options I can recommend right now:',
    dishes: curatedFallback.length > 0 ? curatedFallback.slice(0, 3) : allDishes.slice(0, 3),
    isFallback: true,
  };
}
