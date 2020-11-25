<template>
  <div class="poll-list-wrapper">
    <div
      v-if="isLoading"
      class="row justify-center q-my-xl q-py-xl"
    >
      <q-spinner
        color="primary"
        size="3rem"
      />
      <div class="col-xs-12 text-center text-italic q-mt-lg">
        Loading polls...
      </div>
    </div>
    <div
      v-else
      class="list-container"
    >
      <poll-list
        v-if="!isMobile || (currentList === 'active')"
        poll-type="activePolls"
      />
      <poll-list
        v-if="!isMobile || (currentList === 'completed')"
        poll-type="completedPolls"
      />
    </div>
  </div>
</template>

<script>
import { Component, Prop } from 'vue-property-decorator';
import helpers from 'src/mixins/helpers';
import { mixins } from 'vue-class-component';

@Component({
  components: {
    PollList: () => import('components/PollList'),
  },
})

export default class PollListAllPolls extends mixins(helpers) {
  isLoading = false;

  @Prop(String) currentList;

  async mounted() {
    try {
      this.isLoading = true;
      await this.$store.dispatch('poap/getPolls');
      this.isLoading = false;
    } catch (err) {
      this.showError(err, 'Unable to fetch polls. Please refresh the page and try again.');
    }
  }

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style lang="scss">
.poll-list-wrapper {
  position: relative;
  background: $secondary-light-violet;
  padding-top: 16px;
  @media (min-width: 768px) {
    background: $white;
    padding: 0;
    margin-top: 40px;
  }
  &::after {
    content: "";
    height: 425px;
    width: 100%;
    position: absolute;
    top: -200px;
    left: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 48.44%, #FFFFFF 100%);
    z-index: 1;
    @media (max-width: 767.98px) {
      display: none;
    }
  }
  .list-container {
    margin-bottom: 96px;
    z-index: 2;
    position: relative;
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    @media (min-width: 768px) {
      padding: 0 56px;
    }
    @media (min-width: 1440px) {
      padding: 0 64px;
    }
    @media (max-width: 767.98px) {
      padding: 0 16px 40px;
      max-width: 500px;
      margin: 0 auto;
    }
    > div:not(:first-child) {
      margin-top: 80px;
    }
  }
}
</style>
