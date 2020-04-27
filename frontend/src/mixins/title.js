/**
 * @notice This mixin configures page titles
 */

export default {
  methods: {
    generateTitle() {
      // Can't put this in mounted hook since mixin hooks run after component hooks. So
      // instead we call this function on each page's mounted hook
      let prefix;
      const pageName = this.$route.name;
      if (pageName === 'home') prefix = 'All Polls';
      else if (pageName === 'create') prefix = 'Create Poll';
      else if (pageName === 'cast') prefix = `Vote: ${this.poll.title}`;
      else if (pageName === 'results') prefix = `Results: ${this.poll.title}`;
      else if (pageName === 'Error404') prefix = '404';
      const title = `${prefix} | POAP Vote`;
      document.title = title;
    },
  },
};
