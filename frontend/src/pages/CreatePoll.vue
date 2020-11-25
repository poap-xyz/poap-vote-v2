<template>
  <q-page>
    <div class="layout-container create-poll-wrapper">
      <shape-background theme="secondary" />
      <back-button />
      <div class="create-poll-container">
        <div class="title-container">
          <h2
            id="page-title"
            class="create-poll-title big-title"
          >
            Create Poll
          </h2>
        </div>
        <white-container>
          <the-create-poll-form />
        </white-container>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import title from 'src/mixins/title';
import helpers from 'src/mixins/helpers';
import TheCreatePollForm from 'components/TheCreatePollForm';
import ShapeBackground from 'components/ShapeBackground';
import BackButton from 'components/BackButton';
import WhiteContainer from 'components/WhiteContainer';

export default {
  name: 'CreatePoll',

  components: {
    TheCreatePollForm,
    ShapeBackground,
    BackButton,
    WhiteContainer,
  },

  mixins: [title, helpers],

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
    }),
  },

  mounted() {
    this.generateTitle();
    this.toggleBodyClass(true, 'create-poll');
  },

  destroyed() {
    this.toggleBodyClass(false, 'create-poll');
  },
};
</script>


<style lang="scss" scoped>
.create-poll-wrapper {
  @media (min-width: 768px) {
    margin-bottom: 70px;
  }
  .create-poll-container {
    width: 100%;
    padding: 30px 10px;
    @media (min-width: 768px) {
      width: 750px;
      margin: 20px auto 0;
      padding: 0;
    }
    @media (min-width: 992px) {
      margin: 0 auto;
      width: 795px;
    }
    > div:last-child {
      padding: 64px 0 44px;
      @media (max-width: 767.98px) {
        padding: 32px 0 42px;
        margin-bottom: 42px;
      }
    }
    .create-poll-title {
      text-align: center;
      color: $white;
      @media (min-width: 768px) {
        text-align: left;
      }
    }
    .title-container {
      margin: 0 0 22px;
      @media (min-width: 768px) {
        margin: 24px 0 32px;
      }
      h2 {
        margin: 0;
      }
    }
  }

  &::v-deep {
    .white-wrapper {
      @media(max-width: 767.98px) {
        box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.1);
      }
    }
    .back-btn-wrapper {
      .left-arrow {
        @media(max-width: 767.98px) {
          filter: unset;
        }
      }
    }
  }
}
</style>
