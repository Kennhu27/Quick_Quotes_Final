import { api } from '$lib/api';

export interface QuoteData {
  feet_width: number;
  feet_length: number;
  sqr_feet: number;
  demolition: boolean;
  grout: boolean;
  pickup: boolean;
  thin_set: boolean;
}

export interface QuoteResponse {
  quoteId: string;
  feet_width: number;
  feet_length: number;
  sqr_feet: number;
  demolition: boolean;
  grout: boolean;
  pickup: boolean;
  thin_set: boolean;
  quote_total: number;
}

function toJsonCompatible(data: QuoteData): Record<string, unknown> {
  return {
    feet_width: data.feet_width,
    feet_length: data.feet_length,
    sqr_feet: data.sqr_feet,
    demolition: data.demolition,
    grout: data.grout,
    pickup: data.pickup,
    thin_set: data.thin_set
  };
}

export async function createQuote(quoteData: QuoteData): Promise<QuoteResponse> {
  console.log('Creating quote with data:', quoteData);
  
  const jsonData = toJsonCompatible(quoteData);
  const response = await api.post<QuoteResponse>('/quotes', jsonData);
  
  if (!response.ok) {
    console.error('API error details:', response);
    throw new Error(`Failed to create quote: ${response.status}`);
  }
  return response.data;
}

export async function updateDemolition(quoteId: string, demolition: boolean): Promise<QuoteResponse> {
  const response = await api.patch<QuoteResponse>(`/quotes/${quoteId}/demolition`, { demolition });
  if (!response.ok) {
    throw new Error('Failed to update demolition');
  }
  return response.data;
}

export async function updateGrout(quoteId: string, grout: boolean): Promise<QuoteResponse> {
  const response = await api.patch<QuoteResponse>(`/quotes/${quoteId}/grout`, { grout });
  if (!response.ok) {
    throw new Error('Failed to update grout');
  }
  return response.data;
}

export async function updatePickup(quoteId: string, pickup: boolean): Promise<QuoteResponse> {
  const response = await api.patch<QuoteResponse>(`/quotes/${quoteId}/pickup`, { pickup });
  if (!response.ok) {
    throw new Error('Failed to update pickup');
  }
  return response.data;
}

export async function updateThinSet(quoteId: string, thin_set: boolean): Promise<QuoteResponse> {
  const response = await api.patch<QuoteResponse>(`/quotes/${quoteId}/thinset`, { thin_set });
  if (!response.ok) {
    throw new Error('Failed to update thin set');
  }
  return response.data;
}

export async function calculateQuoteTotal(quoteId: string, quoteData: QuoteData): Promise<QuoteResponse> {
  const jsonData = toJsonCompatible(quoteData);
  const response = await api.post<QuoteResponse>(`/quotes/${quoteId}/calculate`, jsonData);
  if (!response.ok) {
    throw new Error('Failed to calculate quote total');
  }
  return response.data;
}
