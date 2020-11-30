<template>
  <q-page>
    <div class="home-container">
      <div
        class="hero-image"
        :style="{
          'background-image': 'url(' + require('../assets/images/hero/'
            + (
              isFullDesktop ? getRandomImageHero + '_large.jpg'
              : getRandomImageHero + '.jpg')
          ) + ')',
        }"
      />
      <div class="hero-layout">
        <div class="hero-content">
          <div class="text-content">
            <h1 class="purple-title home-title">
              POAP Vote
            </h1>
            <h3 class="description dark-grey-text-2">
              A sybil-resistant voting engine for anyone
              to run polls using Ethereum and POAP
            </h3>
          </div>

          <div class="btn-container">
            <base-button
              id="button--create-poll"
              :label="isMobile ? '' : 'Create Poll'"
              :outline="isMobile ? false : true"
              :unelevated="isMobile ? false : true"
              :background="isMobile ? '' : 'transparent'"
              :icon="isMobile ? require('../assets/icons/add-icon.svg') : ''"
              @click="$router.push({name: 'create'})"
            />
          </div>
        </div>
        <div class="mobile-tabs">
          <button
            class="tab-content text-subtitle1"
            :class="{'active': currentList === 'active'}"
            @click="toggleCurrentList('active')"
          >
            Active Polls
          </button>
          <button
            class="tab-content text-subtitle1"
            :class="{'active': currentList === 'completed'}"
            @click="toggleCurrentList('completed')"
          >
            Finished Polls
          </button>
        </div>
        <poll-list-all-poll :current-list="currentList" />
      </div>
    </div>
  </q-page>
</template>

<script>
import title from 'src/mixins/title';
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import helpers from '../mixins/helpers';

@Component({
  components: {
    ShapeBackground: () => import('components/ShapeBackground'),
    PollListAllPoll: () => import('components/PollListAllPolls.vue'),
  },
})
export default class Home extends mixins(title, helpers) {
  currentList = 'active';

  toggleCurrentList(option) {
    this.currentList = option;
  }

  mounted() {
    this.generateTitle();
    this.toggleBodyClass(true, 'home');
  }

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  destroyed() {
    this.toggleBodyClass(false, 'home');
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  position: relative;
  @media (min-width: 768px) {
    overflow: hidden;
  }
.hero-layout {
  @media (min-width: 768px) {
    padding-top: 70px;
  }
  .hero-content {
    padding-top: 64px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    background: $white;
    z-index: 3;

    @media (min-width: 768px) {
      background: transparent;
      width: 100%;
      margin: 0 auto;
      height: 540px;
      padding: 120px 67px 0;
      max-width: 1330px;
    }

    @media (min-width: 1080px) {
      padding: 120px 127px 0;
    }

    @media (min-width: 1280px) {
      padding: 120px 152px 0;
    }

    .text-content {
      @media (max-width: 767.98px) {
        text-align: center;
        padding: 24px 0;
      }
      .home-title {
        @media (max-width: 767.98px) {
          display: none;
        }
      }
      .description {
        font-size: 18px;
        line-height: 23px;
        font-weight: 400;
        margin: 0;
        padding: 0 44px;
        @media (min-width: 768px) {
          padding: 0;
          font-size: 20px;
          line-height: 30px;
          margin: 24px 0 26px;
          max-width: 350px;
        }
        @media (min-width: 992px) {
          max-width: 393px;
        }
      }
    }
    .btn-container {
      @media (max-width: 767.98px) {
        position: fixed;
        bottom: 0;
        z-index: 2;
        right: 14px;
      }
      ::v-deep {
        button {
          @media (max-width: 767.98px) {
            width: 56px;
            height: 56px !important;
          }
        }
        .q-btn__wrapper {
          padding: 10px 41px;
          @media (max-width: 767.98px) {
            padding: 0;
            .q-btn__content {
              img {
                width: 14px;
                height: 14px;
                filter: invert(149%) sepia(4%) saturate(18%)
                hue-rotate(132deg) brightness(243%) contrast(100%);
              }
            }
          }
        }
      }
    }
  }
  .mobile-tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    position: sticky;
    position: -webkit-sticky;
    align-self: flex-start;
    top: 64px;
    z-index: 3;
    background: $white;
    width: 100%;
    @media(min-width: 768px) {
      display: none;
    }

    .tab-content {
      background: transparent;
      border: 0;
      height: 48px;
      color: $dark-grey-text-2;
      font-weight: 400;
      border-bottom: 2px solid $light-grey;
      transition: all 0.2s linear;
      outline: none;
      &.active {
        color: $primary;
        border-bottom: 2px solid $primary;
      }
    }
  }
}
  .hero-image {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
    position: absolute;
    height: 749px;
    width: 100vw;
    top: 70px;
    left: 0;
    z-index: -1;
    @media (max-width: 767.98px) {
      display: none;
    }
    @media (min-width: 1440px) {
      background-position: center;
    }
  }
}
</style>
