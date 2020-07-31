<template>
  <q-layout view="hhh Lpr fff">
    <!-- HEADER -->
    <q-header
      class="q-mx-md q-mt-md"
      style="color: #000000; background-color: rgba(0,0,0,0)"
    >
      <div class="row justify-between items-center no-wrap">
        <div class="col-auto">
          <!-- LOGO AND TITLE -->
          <div
            class="row justify-start items-center"
            style="cursor: pointer;"
            @click="$router.push({ name: 'home' })"
          >
            <img
              alt="Ethereum logo"
              class="q-ml-md"
              src="statics/app-logo-128x128.png"
              style="max-width: 50px;"
            >
            <div class="text-h6 dark-toggle">
              <span class="primary text-bold">POAP Vote</span>
            </div>
          </div>
        </div>
        <!-- ADDRESS AND SETTINGS AND SETTINGS -->
        <div class="col-auto row q-mr-md">
        <div
          v-if="userAddress"
          class="text-caption primary-lightened-text q-mr-md"
        >
          Address: {{ userAddress.slice(0, 4) }}...{{ userAddress.slice(-4) }}
        </div>
        <div>
          <div class="row justify-end items-center q-mt-xs">
            <div
              v-if="!isValidChainId"
              class="negative text-bold q-mr-md"
            >
              You must connect to the mainnet to use this app
            </div>
            <q-icon
              v-if="!$q.dark.isActive"
              class="col-auto dark-toggle"
              name="fas fa-moon"
              style="cursor: pointer;"
              @click="toggleNightMode()"
            />
            <q-icon
              v-else
              class="col-auto dark-toggle"
              name="fas fa-sun"
              style="cursor: pointer;"
              @click="toggleNightMode()"
            />
          </div>
        </div>
      </div>
      </div>
    </q-header>

    <!-- APP CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- FOOTER -->
    <!-- <q-footer
      bordered
      class="q-mt-xl"
      style="color: #000000; background-color: rgba(0,0,0,0)"
    >
      <div class="row justify-center text-center items-center dark-toggle q-my-xl">
        <div class="text-caption">
          Footer content here
        </div>
      </div>
    </q-footer> -->
  </q-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'BaseLayout',

  data() {
    return {};
  },

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
      isValidChainId: (state) => {
        const { provider } = state.user;
        if (!provider) return true; // assume valid if not connected
        const { chainId } = provider;
        if (chainId === '0x1' || chainId === '0x01' || chainId === '1' || chainId === 1) return true;
        return false;
      },
    }),
  },

  methods: {
    toggleNightMode() {
      const isDark = !this.$q.dark.isActive;
      this.$q.dark.set(isDark);
      this.$q.localStorage.set('isDark', isDark);
      this.$store.commit('user/setDarkModeStatus', isDark);
    },
  },
};
</script>
