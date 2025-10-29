class API {
    async setPoints(guest: any, points: number) {
        try {
            await this.get(`/api/points?id=${guest._id}&points=${points}`);
        } catch (err: any) { }
    };

    async getGuests() {
        return await this.get(`/api/guests`);
    }

    private async get(endpoint: string) {
        return (await fetch(endpoint, { method: "GET", cache: 'no-store' })).json();
    }
}

export default new API();