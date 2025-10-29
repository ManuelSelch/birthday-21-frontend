export type StatusResponse = {
    success: boolean, 
    warning?: string,
    error?: string
}

class API {
    async setPoints(guest: any, points: number) {
        try {
            await this.get(`/api/points?id=${guest._id}&points=${points}`);
        } catch (err: any) { }
    };

    async getGuests() {
        return await this.get(`/api/guests`);
    }

    async checkIn(id: string): Promise<StatusResponse> {
        try {
            return await this.post("/api/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
        } 
        catch (e) { 
            return { success: false, error: "server error" } 
        } 
    }

    private async get(endpoint: string) {
        return (await fetch(endpoint, { method: "GET", cache: 'no-store' })).json();
    }

    private async post(endpoint: string, body: RequestInit) {
        return (await fetch(endpoint, { method: "POST", cache: 'no-store' })).json();
    }
}

export default new API();