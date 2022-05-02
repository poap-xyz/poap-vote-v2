import axios from 'axios';

class POAP {

    static async fetchEvents() {
        const response = await axios.get('https://api-event.poap.xyz');
        return response.data;
    }

    static async fetchTokens(account) {
        const response = await axios.get(`https://api.poap.xyz/actions/scan/${account}`);
        return response.data;
    }
}

export default POAP;
