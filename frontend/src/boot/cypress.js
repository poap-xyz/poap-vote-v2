export default ({ app }) => {
  if (window.Cypress || process.env.DEV) {
    // Only available during development/testing, used to access store. Source:
    // https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/#UI-to-store
    window.app = app;
  }
};
