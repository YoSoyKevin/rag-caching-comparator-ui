/// <reference types="vite/client" />

const ENDPOINT_EXACT = import.meta.env.VITE_ENDPOINT_EXACT;
const ENDPOINT_SEMANTIC = import.meta.env.VITE_ENDPOINT_SEMANTIC;

export interface BotResponse {
  result: string;
  cache_status: string;
  elapsed: number;
  min_distance?: number; // solo para semantic
}

export const getBotResponse = async (prompt: string, cachingType: 'exact' | 'semantic'): Promise<BotResponse> => {
  const endpoint = cachingType === 'exact' ? ENDPOINT_EXACT : ENDPOINT_SEMANTIC;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // Para exact: { result, cache_status, elapsed }
    // Para semantic: { result, cache_status, min_distance, elapsed }
    return {
      result: data.result || '',
      cache_status: data.cache_status || '',
      elapsed: data.elapsed || 0,
      ...(cachingType === 'semantic' && { min_distance: data.min_distance })
    };
  } catch (error) {
    console.error('Error fetching bot response:', error);
    return {
      result: 'Sorry, I encountered an error. Please try again.',
      cache_status: 'error',
      elapsed: 0
    };
  }
}; 