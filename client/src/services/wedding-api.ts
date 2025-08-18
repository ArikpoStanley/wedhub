import type { CreateRSVP, RSVP, RSVPResponse, Guest, CreateGuest, WeddingEvent, CreateWeddingEvent } from '@shared/wedding-schema';

const API_BASE = '/api';

class WeddingApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // RSVP methods
  async submitRSVP(rsvpData: CreateRSVP): Promise<RSVPResponse> {
    return this.request<RSVPResponse>('/rsvp', {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    });
  }

  async getRSVP(id: string): Promise<RSVPResponse> {
    return this.request<RSVPResponse>(`/rsvp/${id}`);
  }

  async getAllRSVPs(): Promise<{ success: boolean; message: string; data: RSVP[]; total: number }> {
    return this.request('/rsvps');
  }

  async updateRSVP(id: string, updates: Partial<CreateRSVP>): Promise<RSVPResponse> {
    return this.request<RSVPResponse>(`/rsvp/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Guest methods
  async createGuest(guestData: CreateGuest): Promise<{ success: boolean; message: string; data: Guest }> {
    return this.request('/guests', {
      method: 'POST',
      body: JSON.stringify(guestData),
    });
  }

  async getAllGuests(): Promise<{ success: boolean; message: string; data: Guest[]; total: number }> {
    return this.request('/guests');
  }

  async getGuest(id: string): Promise<{ success: boolean; message: string; data: Guest }> {
    return this.request(`/guests/${id}`);
  }

  // Wedding Events methods
  async createWeddingEvent(eventData: CreateWeddingEvent): Promise<{ success: boolean; message: string; data: WeddingEvent }> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getAllWeddingEvents(): Promise<{ success: boolean; message: string; data: WeddingEvent[] }> {
    return this.request('/events');
  }

  async getWeddingEvent(id: string): Promise<{ success: boolean; message: string; data: WeddingEvent }> {
    return this.request(`/events/${id}`);
  }

  // Health check
  async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string }> {
    return this.request('/health');
  }
}

export const weddingApi = new WeddingApiService();