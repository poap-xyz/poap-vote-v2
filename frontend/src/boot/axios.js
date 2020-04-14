import Vue from 'vue';
import axios from 'axios';

let baseURL; // replace this with production URL later
if (process.env.DEV) {
  baseURL = 'http://localhost:3000';
}
// Create our own axios instance and set a custom base URL. This lets
// lets easily access this instance by importing serverApi in other files
const serverApi = axios.create({
  baseURL,
});
export { serverApi };

// Access within vue files via this.$serverApi
Vue.prototype.$serverApi = serverApi;
