import { config } from '../config/env';

interface AdviceSlipResponse {
  slip?: {
    id?: number;
    advice?: string;
  };
}

export interface ExternalAdvice {
  text: string;
  source: string;
  fetchedAt: string;
}

export const fetchExternalAdvice = async (): Promise<ExternalAdvice> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.externalAdviceApiTimeoutMs);

  try {
    const response = await fetch(config.externalAdviceApiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`External API failed with status ${response.status}`);
    }

    const data = (await response.json()) as AdviceSlipResponse;
    const text = data.slip?.advice?.trim();

    if (!text) {
      throw new Error('External API returned empty advice');
    }

    return {
      text,
      source: config.externalAdviceApiUrl,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    // Keep endpoint resilient: fallback if external API is unavailable.
    return {
      text: 'Break down large tasks into small, testable steps and ship progressively.',
      source: 'fallback',
      fetchedAt: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
};
