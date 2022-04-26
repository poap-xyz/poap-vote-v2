import axios from 'axios';

class POAP {

    static async fetchEvents() {
        const response = await axios.get('https://api.poap.tech/events');
        return response.data;
    }

    static async fetchTokens(account) {
        const response = await axios.get(`https://api.poap.tech/actions/scan/${account}`);
        return response.data;
    }
}

export default POAP;
