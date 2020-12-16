<template>
  <div class="poll-valid-events">
    <!-- Wording for voting page -->
    <p
      v-if="!isPollOngoing"
      class="text-subtitle2 dark-grey text-weight-regular"
    >
      Users were eligible to vote in this poll if they held any of the following POAP tokens.
    </p>
    <p
      v-if="isPollOngoing"
      class="text-subtitle2 dark-grey text-weight-regular"
    >
      Users are eligible to vote in this poll if they hold any of the following POAP tokens.
    </p>
    <!-- Event cards -->
    <div
      v-if="orderedEvents && orderedEvents.length"
      class="events-circle-container"
    >
      <div
        v-for="event in orderedEvents"
        :key="event.id"
        class="event-circle"
        :class="{'active': userEventIds.includes(event.id)}"
      >
        <div>
          <div class="image-container">
            <span
              v-if="userEventIds.includes(event.id)"
              class="circle-check-icon check-container"
            />
            <img
              :src="event.image_url"
              :alt="event.name"
            >
          </div>
          <token-tooltip :event="event" />
        </div>
        <div
          v-if="isMobile"
          class="event-info"
        >
          <p class="text-subtitle1 dark-grey">
            {{ event.name }}
          </p>
          <p class="text-subtitle2 dark-grey-text-2">
            {{ event.end_date }} |
            {{ event.city }}, {{ event.country }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import helpers from 'src/mixins/helpers';
import voting from 'src/mixins/voting';
import TokenTooltip from './TokenTooltip';

export default {
  name: 'PollDetailsValidEvents',

  components: {
    TokenTooltip,
  },

  mixins: [helpers, voting],

  props: {
    isForVoting: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      settings: {
        arrows: true,
        dots: false,
        slidesToShow: 2.05,
        slidesToScroll: 1,
        infinite: false,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 1.1,
              arrows: false,
            },
          },
        ],
      },
    };
  },

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
    }),
    orderedEvents() {
      const qualifiedEvents = [...this.events].filter((item) => (
        this.eligibleTokens.includes(item.id)
      ));
      const noQualifiedEvents = [...this.events].filter((item) => (
        !this.eligibleTokens.includes(item.id)
      ));
      return qualifiedEvents.concat(noQualifiedEvents);
    },
  },

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },

};
</script>

<style lang="scss" scoped>
.poll-valid-events {
  padding: 0 16px 15px;
  @media (min-width: 768px) {
    border-top: 1px solid $light-grey;
    padding: 16px 24px 23px;
  }
  .dim-token {
    opacity: 0.6;
  }
  > p {
    @media (max-width: 767.98px) {
      font-size: 16px;
      line-height: 22px;
    }
  }
  .events-circle-container {
    display: flex;
    flex-direction: column;
    @media (min-width: 768px) {
      flex-wrap: wrap;
      flex-direction: row;
    }
    .event-circle {
      display: flex;
      align-items: center;
      opacity: 0.5;
      &.active {
        opacity: 1;
      }
      &:not(:last-child) {
        @media (max-width: 767.98px) {
          margin-bottom: 22px;
        }
      }
      @media (min-width: 768px) {
        margin: 0 12px 12px;
      }
      img {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        object-fit: cover;
        object-position: center;
        border: 2px solid $light-grey;
        @media (min-width: 768px) {
          height: 68px;
          width: 68px;
        }
      }
      .event-info {
        @media (max-width: 767.98px) {
          margin-left: 16px;
        }
        p {
          margin: 0;
        }
        p:first-child {
          font-weight: 400;
          margin-bottom: 4px;
          line-height: 20px;
        }
        p:last-child {
          line-height: 18px;
        }
      }
      .image-container {
        position: relative;
        .check-container {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }
}
</style>
