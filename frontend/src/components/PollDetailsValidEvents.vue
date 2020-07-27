<template>
  <div>
    <div>
      <h6
        class="secondary"
        style="margin:0"
      >
        Valid Events
      </h6>
      <!-- Wording for voting page -->
      <div v-if="isForVoting">
        Users can vote in this poll if they hold any of the following POAP tokens.
        <br>
        <!-- If user has no eleigible tokens -->
        <span
            v-if="userAddress && eligibleTokenCount === 0"
            class="secondary text-bold text-center q-my-xl"
            >
          You do not hold any tokens qualified to vote in this poll.
        </span>
        <!-- If user has eligible tokens  -->
        <span v-else-if="userAddress">
          You hold {{ eligibleTokenCount }} eligible
          token<span v-if="eligibleTokenCount !== 1">s</span>
          and therefore your weighted vote is {{ eligibleTokenCount }}
          token<span v-if="eligibleTokenCount !== 1">s</span>.
        </span>
      </div>
      <!-- Wording for results page -->
      <div v-else>
        Users
        <span v-if="isPollOngoing">are</span>
        <span v-else>were</span>
        eligible to vote in this poll if they held any of the following POAP tokens.
      </div>
      <!-- Event cards -->
      <div class="row justify-start q-mt-md">
        <div
          v-for="event in events"
          :key="event.id"
          class="q-mr-md q-mt-md"
        >
          <q-card
            bordered
            v-bind:class="userAddress && (isForVoting &&
            !userEventIds.includes(event.id)) && 'dim-token'"
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="event.image_url">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ event.name }}</q-item-label>
                <q-item-label caption>
                  <div>
                    {{ event.start_date }}
                  </div>
                  <div>
                    <span v-if="event.city === 'Virtual'">Virtual</span>
                    <span v-else-if="!event.city">Not specified</span>
                    <span v-else>{{ event.city }}, {{ event.country }}</span>
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import helpers from 'src/mixins/helpers';
import voting from 'src/mixins/voting';

export default {
  name: 'PollDetailsValidEvents',

  mixins: [helpers, voting],

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
    }),
  },
  props: {
    isForVoting: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style lang="stylus" scoped>
  .dim-token {
    opacity: 0.6;
  }
</style>
