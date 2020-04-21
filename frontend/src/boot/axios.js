import Vue from 'vue';
import axios from 'axios';

let baseURL;
if (process.env.DEV) {
  baseURL = 'http://localhost:3000';
} else if (process.env.PROD) {
  baseURL = 'http://tokenfaucet.eastus.cloudapp.azure.com';
} else {
  throw new Error('Invalid build environment');
}
// Create our own axios instance and set a custom base URL. This lets
// lets easily access this instance by importing serverApi in other files
const serverApi = axios.create({
  baseURL,
});
export { serverApi };

// Access within vue files via this.$serverApi
Vue.prototype.$serverApi = serverApi;
