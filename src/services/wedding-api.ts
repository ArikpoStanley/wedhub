import type { CreateRSVP, RSVP, RSVPResponse, Guest, CreateGuest, WeddingEvent, CreateWeddingEvent, Contact, CreateContact, ContactResponse, ContactListResponse } from '@shared/wedding-schema';
import type { PublicSite, CreateSite, UpdateSite, SiteRecord } from '@shared/site-schema';
import { apiUrl } from '@/lib/api-base';
import { readApiJson } from '@/lib/read-api-response';

const API_BASE = '/api';

function withSiteQuery(endpoint: string, siteId?: string | null, slug?: string | null): string {
  const q = new URLSearchParams();
  if (siteId) q.set('siteId', siteId);
  if (slug) q.set('slug', slug);
  const qs = q.toString();
  if (!qs) return endpoint;
  return `${endpoint}${endpoint.includes('?') ? '&' : '?'}${qs}`;
}

class WeddingApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(apiUrl(`${API_BASE}${endpoint}`), {
      credentials: 'include',
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

  async getAllRSVPs(site?: { siteId?: string | null; slug?: string | null }): Promise<{ success: boolean; message: string; data: RSVP[]; total: number }> {
    return this.request(withSiteQuery('/rsvps', site?.siteId, site?.slug));
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

  async getAllGuests(site?: { siteId?: string | null; slug?: string | null }): Promise<{ success: boolean; message: string; data: Guest[]; total: number }> {
    return this.request(withSiteQuery('/guests', site?.siteId, site?.slug));
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

  async getAllWeddingEvents(site?: { siteId?: string | null; slug?: string | null }): Promise<{ success: boolean; message: string; data: WeddingEvent[] }> {
    return this.request(withSiteQuery('/events', site?.siteId, site?.slug));
  }

  async getWeddingEvent(id: string): Promise<{ success: boolean; message: string; data: WeddingEvent }> {
    return this.request(`/events/${id}`);
  }

  // Contact methods
  async createContact(contactData: CreateContact): Promise<ContactResponse> {
    return this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async getAllContacts(site?: { siteId?: string | null; slug?: string | null }): Promise<ContactListResponse> {
    return this.request(withSiteQuery('/contacts', site?.siteId, site?.slug));
  }

  async getContact(id: string): Promise<ContactResponse> {
    return this.request(`/contacts/${id}`);
  }

  async updateContact(id: string, updates: Partial<CreateContact>): Promise<ContactResponse> {
    return this.request(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteContact(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // Search contacts by name, email, or phone
  async searchContacts(
    query: string,
    site?: { siteId?: string | null; slug?: string | null }
  ): Promise<ContactListResponse> {
    if (!query.trim()) {
      return {
        success: false,
        message: "Search query is required",
        data: [],
        total: 0
      };
    }

    const path = `/contacts/search/${encodeURIComponent(query.trim())}`;
    return this.request<ContactListResponse>(withSiteQuery(path, site?.siteId, site?.slug));
  }

  async getPublicSite(
    slug: string
  ): Promise<{ success: boolean; message: string; data?: PublicSite }> {
    return this.request(`/public/sites/${encodeURIComponent(slug)}`);
  }

  async listSites(): Promise<{ success: boolean; message: string; data?: SiteRecord[] }> {
    return this.request("/sites");
  }

  async getSite(id: string): Promise<{ success: boolean; message: string; data?: SiteRecord }> {
    return this.request(`/sites/${encodeURIComponent(id)}`);
  }

  async createSite(body: CreateSite): Promise<{ success: boolean; message: string; data?: SiteRecord }> {
    return this.request("/sites", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async updateSite(
    id: string,
    body: UpdateSite
  ): Promise<{ success: boolean; message: string; data?: SiteRecord }> {
    return this.request(`/sites/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  /** Upload wedding images to Cloudinary (authenticated). Field name must be `images`. */
  async uploadSiteImages(siteId: string, files: File[], kind: "gallery" | "hero"): Promise<string[]> {
    const fd = new FormData();
    for (const f of files) {
      fd.append("images", f);
    }
    const response = await fetch(
      apiUrl(`/api/sites/${encodeURIComponent(siteId)}/media?kind=${encodeURIComponent(kind)}`),
      {
        method: "POST",
        credentials: "include",
        body: fd,
      },
    );
    type UploadBody = { success?: boolean; message?: string; data?: { urls: string[] } };
    const { ok, data } = await readApiJson<UploadBody>(response);
    if (!ok || data.success !== true || !data.data?.urls) {
      throw new Error(typeof data.message === "string" ? data.message : "Upload failed");
    }
    return data.data.urls;
  }

  async suggestSlug(
    partnerOne: string,
    partnerTwo: string
  ): Promise<{
    success: boolean;
    message?: string;
    data?: { suggested: string; candidates: string[]; taken: string[] };
  }> {
    const q = new URLSearchParams({ partnerOne, partnerTwo });
    return this.request(`/sites/suggest-slug?${q.toString()}`);
  }

  // Health check
  async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string }> {
    return this.request('/health');
  }
}

export const weddingApi = new WeddingApiService();