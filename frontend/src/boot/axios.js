import Vue from 'vue';
import axios from 'axios';

const ENVIRONMENT_URLS = {
  production: 'https://poap.vote',
  // development: 'http://localhost:300',
  development: 'https://api-poap-vote.xivis.com',
  staging: 'https://api-poap-vote.xivis.com',
};

const baseURL = ENVIRONMENT_URLS[process.env.NODE_ENV] || '';
// Create our own axios instance and set a custom base URL. This lets
// lets easily access this instance by importing serverApi in other files
const serverApi = axios.create({
  baseURL,
});
export { serverApi };

// Access within vue files via this.$serverApi
Vue.prototype.$serverApi = serverApi;
