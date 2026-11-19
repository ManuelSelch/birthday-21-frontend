export type StatusResponse = {
    success: boolean, 
    warning?: string,
    error?: string
}

class API {
    async setPoints(guest: { _id: string }, points: number) {
        try {
            await this.post("/api/points", {
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: guest._id, points }),
            });
        } catch { }
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
        catch {
            return { success: false, error: "server error" } 
        } 
    }

    async confirmInvited(guest: { _id: string }) {
        try {
            await this.get(`/api/invited?id=${guest._id}`);
            return true;
        } catch {
            return false;
        }
    }

    async accept(guest: { _id: string }) {
        try {
            await this.get(`/api/accept?id=${guest._id}`);
            return true;
        } catch {
            return false;
        }
    }

    async cancel(guest: { _id: string }) {
        try {
            await this.get(`/api/cancel?id=${guest._id}`);
            return true;
        } catch {
            return false;
        }
    }

    async setCompanion(guest: { _id: string }, isCompanion: boolean) {
        const companion = isCompanion ? "1" : "0";

        try {
            await this.get(`/api/companion?id=${guest._id}&companion=${companion}`);
            return true;
        }
        catch {
            return false;
        }
    }

    private async get(endpoint: string) {
        return (await fetch(endpoint, { method: "GET", cache: 'no-store' })).json();
    }

    private async post(endpoint: string, body: RequestInit) {
        return (await fetch(endpoint, { ...body, method: "POST", cache: 'no-store' })).json();
    }
}

const api = new API();
export default api;