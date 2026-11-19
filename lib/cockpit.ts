interface CockpitOptions {
  filter?: Record<string, unknown>;
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

  async request<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      cache: 'no-store',
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

  async getItems<T = unknown>(collection: string, options: CockpitOptions = {}): Promise<T[]> {
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

  async getItem<T = unknown>(collection: string, id: string): Promise<T> {
    return this.request<T>(`/content/item/${collection}/${id}`);
  }

  async getSingleton<T = unknown>(singleton: string): Promise<T> {
    return this.request<T>(`/content/item/${singleton}`);
  }

   /**
   * Create or update a collection item
   * @param collection - the collection name
   * @param data - the item data. Include _id to update existing item
   */
  async saveItem<T = unknown>(collection: string, data: Record<string, unknown>): Promise<T> {
    const endpoint = `/content/item/${collection}`;

    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify({
        data: data
      }),
    });
  }
}

const cockpit = new CockpitAPI();
export default cockpit;