import axios from 'axios';

class POAP {
    poapApiHttpClient;

    /**
     * @param apiKey The POAP API API-Key: see {@link https://documentation.poap.tech} for more information
     */
    constructor(apiKey) {
        this.poapApiHttpClient = axios.create({
            baseURL: 'https://api.poap.tech',
            headers: {'x-api-key': apiKey}
        });
    }

    /**
     * Fetch all the existing POAP events
     * @return {Promise<any>}
     */
    static async fetchEvents() {
        const response = await axios.get('https://api-event.poap.xyz');

        return response.data;
    }

    /**
     *
     * @param account ENS or Ethereum address
     * @return {Promise<*>}
     */
    async fetchTokens(account) {
        const response = await this.poapApiHttpClient.get(`/actions/scan/${account}`);
        return response.data;
    }
}

export default POAP;
