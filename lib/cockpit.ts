interface CockpitOptions {
  filter?: Record<string, any>;
  sort?: Record<string, number>;
  limit?: number;
  skip?: number;
  populate?: number;
}

class CockpitAPI {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.COCKPIT_API_URL!;
    this.apiKey = process.env.COCKPIT_API_KEY!;
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getItems<T = any>(collection: string, options: CockpitOptions = {}): Promise<T[]> {
    const params = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });

    const query = params.toString();
    const endpoint = `/content/items/${collection}${query ? `?${query}` : ''}`;

    return this.request<T[]>(endpoint);
  }

  async getItem<T = any>(collection: string, id: string): Promise<T> {
    return this.request<T>(`/content/item/${collection}/${id}`);
  }

  async getSingleton<T = any>(singleton: string): Promise<T> {
    return this.request<T>(`/content/item/${singleton}`);
  }
}

export default new CockpitAPI();