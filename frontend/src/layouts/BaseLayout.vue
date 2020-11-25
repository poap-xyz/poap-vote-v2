<template>
  <q-layout view="hhh Lpr fff">
    <!-- HEADER -->
    <layout-header />

    <!-- APP CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- FOOTER -->
    <layout-footer />
  </q-layout>
</template>

<script>
// import { mapState } from 'vuex';
import { Vue, Component } from 'vue-property-decorator';
import LayoutHeader from '../components/LayoutHeader';
import LayoutFooter from '../components/LayoutFooter';

@Component({
  components: {
    LayoutHeader,
    LayoutFooter,
  },
})
export default class BaseLayout extends Vue {
  // computed: {
  //   ...mapState({
  //     userAddress: (state) => state.user.userAddress,
  //     isValidChainId: (state) => {
  //       const { provider } = state.user;
  //       if (!provider) return true; // assume valid if not connected
  //       const { chainId } = provider;
  //       if (chainId === '0x1' || chainId === '0x01'
  //        || chainId === '1' || chainId === 1) return true;
  //       return false;
  //     },
  //   }),
  // },
}
</script>
