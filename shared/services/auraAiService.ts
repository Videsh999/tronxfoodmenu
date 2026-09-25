import { supabase } from './supabaseClient';
import type { Dish } from '../types/menu';
import {
  extractLeanMenu,
  queryAuraConcierge,
  type ConciergeResponse,
} from '../utils/auraConcierge';

export interface ChatHistoryEntry {
  role: 'user' | 'assistant';
  content: string;
  dishIds?: string[];
}

export interface AuraAiResult {
  message: string;
  dishes: Dish[];
  isFallback: boolean;
  provider?: string;
}

/**
 * Communicates with the secure server-side Supabase Edge Function 'ask-aura'.
 * Strictly grounds the request in real menu data.
 * If the Edge function is not deployed or no provider API key is configured,
 * it seamlessly falls back to the deterministic live-menu concierge.
 * No API keys are ever stored or exposed in the client.
 */
export async function requestAskAura(
  query: string,
  allDishes: Dish[],
  history: ChatHistoryEntry[] = []
): Promise<AuraAiResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      message: 'How may I assist your dining selection at Tronx today?',
      dishes: [],
      isFallback: false,
    };
  }

  // Determine previous dishes from immediate conversation turn for follow-up resolution
  const lastAssistantTurn = [...history].reverse().find((h) => h.role === 'assistant');
  const previousDishes =
    lastAssistantTurn?.dishIds && lastAssistantTurn.dishIds.length > 0
      ? allDishes.filter((d) => lastAssistantTurn.dishIds!.includes(d.id))
      : [];

  const leanMenu = extractLeanMenu(allDishes);

  try {
    // 8-second timeout protection for client responsiveness
    const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), 8000)
    );

    const edgeFunctionPromise = supabase.functions.invoke('ask-aura', {
      body: {
        message: trimmed,
        history: history.slice(-6).map((h) => ({
          role: h.role,
          content: h.content,
        })),
        menu: leanMenu,
      },
    });

    const response = (await Promise.race([edgeFunctionPromise, timeoutPromise])) as {
      data: any;
      error: any;
    };

    if (response.error || !response.data) {
      // Backend unavailable or no API key set -> Execute deterministic fallback
      const fallback: ConciergeResponse = queryAuraConcierge(trimmed, allDishes, previousDishes);
      return {
        message: fallback.text,
        dishes: fallback.dishes,
        isFallback: true,
      };
    }

    const { message, recommendedDishIds, provider } = response.data;
    const safeDishIds = Array.isArray(recommendedDishIds) ? recommendedDishIds : [];
    const matchedDishes = allDishes.filter((d) => safeDishIds.includes(d.id));

    return {
      message: message || 'Here are our chef’s recommended selections from the menu:',
      dishes: matchedDishes,
      isFallback: false,
      provider,
    };
  } catch (_err) {
    // Network error, 503, or timeout -> Fall back gracefully to live-menu concierge
    const fallback: ConciergeResponse = queryAuraConcierge(trimmed, allDishes, previousDishes);
    return {
      message: fallback.text,
      dishes: fallback.dishes,
      isFallback: true,
    };
  }
}
