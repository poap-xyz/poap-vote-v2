import Vue from 'vue';
import axios from 'axios';

let baseURL;
if (process.env.BUILD_ENV === 'development') {
  baseURL = 'http://localhost:3000';
} else if (process.env.BUILD_ENV === 'staging') {
  baseURL = 'http://staging.poap.vote';
} else if (process.env.BUILD_ENV === 'production') {
  throw new Error('Production not yet defined');
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
