import axios from 'axios';

class POAP {

    static async fetchEvents() {
        const response = await axios.get('https://api.poap.xyz/events');
        return response.data;
    }
}

export default POAP;
