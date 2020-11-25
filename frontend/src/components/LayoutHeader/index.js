import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import ConnectWallet from 'components/ConnectWallet';
import PoapPopover from 'components/PoapPopover';
import PoapEventGroup from 'components/PoapEventGroup';
import blockies from 'ethereum-blockies-png';
import helpers from '../../mixins/helpers';
import template from './LayoutHeader.vue';

@Component({
  name: 'LayoutHeader',
  mixins: [template],
  components: {
    ConnectWallet,
    PoapPopover,
    PoapEventGroup,
  },
})
export default class LayoutHeader extends mixins(helpers) {
  theme = 'flat';

  userImage = '';

  async mounted() {
    const { userAddress } = window.localStorage;
    if (userAddress) {
      this.userImage = blockies.createDataURL({ seed: JSON.parse(userAddress), size: 6 });
    }
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 0) {
      this.theme = 'shadow';
    } else {
      this.theme = 'flat';
    }
  }

  onDisconnect = () => {
    this.$store.commit('user/disconnectWallet');
  };

  handleScrollToTop = () => {
    if (this.$route.name === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.$router.push({ name: 'home' });
    }
  };

  created() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }
}
