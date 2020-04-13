<template>
  <q-layout view="hhh Lpr fff">
    <!-- HEADER -->
    <q-header
      bordered
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
            <div class="text-h5 dark-toggle">
              POAP Vote
            </div>
          </div>
        </div>
        <!-- ADDRESS AND SETTINGS AND SETTINGS -->
        <div class="col-auto q-mr-md">
          <div class="text-caption dark-toggle">
            Address: {{ userAddress }}
          </div>

          <div class="row justify-end q-mt-xs">
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
    </q-header>

    <!-- APP CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- FOOTER -->
    <q-footer
      bordered
      class="q-mt-xl"
      style="color: #000000; background-color: rgba(0,0,0,0)"
    >
      <div class="row justify-center text-center items-center dark-toggle q-my-xl">
        <div class="text-caption">
          Footer content here
        </div>
      </div>
    </q-footer>
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
