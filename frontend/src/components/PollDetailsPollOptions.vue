<template>
  <div v-if="poll">
    <poll-details-poll-header />
    <div class="poll-options-container">
      <q-card
        v-for="(option, index) in options"
        :key="option.id"
        class="option"
        :class="{ 'user-cannot-vote': isForVoting && !canUserVote }"
      >
        <q-item
          :clickable="!isForVoting || !canUserVote ? false : true"
          :class="`items-center option-content
            ${!isForVoting && votePercentages ? '' : 'is-for-voting'}
            ${selectedOption === option.id ? 'selected' : ''}
            ${poll && poll.image_poll ? 'option-content-image' : ''}
            ${!isForVoting && getOptionHighestPercentage() === votePercentages[option.id]
          ? 'highestPercentage' : ''}
          `"
          @click="selectOption(option.id)"
        >
          <span
            v-if="index < alphabetArray.length"
            class="letter primary text-weight-regular"
          >
            {{ alphabetArray[index] }}
          </span>

          <div class="option-result-info">
            <q-item-section class="relative-position q-pl-md">
              <q-item-label>
                <template v-if="poll && !poll.image_poll">
                  <p class="text-subtitle2 text-weight-bold option-text">
                    {{ option.contents }}
                  </p>
                </template>
                <template v-else>
                  <img :src="option.contents" class="option-image" :alt="option.contents" />
                </template>
                <span
                  v-if="!isForVoting || showResults && votePercentages"
                  class="progress-line"
                  :style="{width: formatPercent(votePercentages[option.id], 2)}"
                />
              </q-item-label>
            </q-item-section>

            <q-item-section
              v-if="!isForVoting || showResults && votePercentages"
              avatar
              class="text-caption text-grey vote-percentages-container"
            >
              <q-item-label>
                <p class="text-subtitle2 primary q-mb-none">
                  {{ voteCounts[option.id] }}
                  vote<span v-if="voteCounts[option.id]!==1">s</span>
                </p>
              </q-item-label>
              <q-item-label class="percent-text">
                {{ formatPercent(votePercentages[option.id], 2) }}
              </q-item-label>
            </q-item-section>
          </div>
        </q-item>
      </q-card>
      <div
        v-if="showResults"
        class="caption-container"
      >
        <div
          class="text-caption hyperlink"
          @click="changeVoteDisplay"
        >
          Show results by
          <span v-if="showVotesByAddress">token counts</span>
          <span v-else>address</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import helpers from 'src/mixins/helpers';
import voting from 'src/mixins/voting';
import PollDetailsPollHeader from 'components/PollDetailsPollHeader';

export default {
  name: 'PollDetailsPollOptions',

  components: {
    PollDetailsPollHeader,
  },

  mixins: [helpers, voting],

  props: {
    isForVoting: {
      type: Boolean,
      required: false,
      default: false,
    },
    showResults: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      selectedOption: undefined,
      showVotesByAddress: false, // true to show votes by account, false to show by token
      alphabetArray: [...Array(55)].map((_, i) => {
        if (i > 25) {
          const dif = i - 26 < 26 ? i - 26 : i - 51;
          return `A${String.fromCharCode('A'.charCodeAt(0) + dif)}`;
        }
        return String.fromCharCode('A'.charCodeAt(0) + i);
      }),
    };
  },

  computed: {
    ...mapGetters({
      voteData: 'poap/voteData',
    }),

    ...mapState({
      poll: (state) => state.poap.selectedPoll,
    }),

    /**
     * @notice Based on the specific poll we are viewing, return the options as an array
     * to ensure items are in the order desired by the poll creator
     */
    options() {
      const options = this.poll.poll_options;
      return options.sort((x, y) => x.id - y.id);
    },

    totalVotes() {
      if (!this.showVotesByAddress) return this.voteData.totalVotes;
      return this.votes.length;
    },

    voteCounts() {
      if (!this.showVotesByAddress) return this.voteData.voteCounts;
      // Preallocate output so all options have a zero count
      const counts = {};
      this.options.forEach((option) => { counts[option.id] = 0; });
      // Get counts
      this.votes.forEach((vote) => { counts[vote.poll_option_id] += 1; });
      return counts;
    },

    votePercentages() {
      if (!this.showVotesByAddress) return this.voteData.votePercentages;
      // Preallocate output so all options have a zero count
      const percentages = {};
      this.options.forEach((option) => { percentages[option.id] = 0; });
      // Convert vote counts to percentages
      Object.keys(this.voteCounts).forEach((key) => {
        percentages[key] = this.voteCounts[key] / this.totalVotes;
      });
      return percentages;
    },
  },

  mounted() {
    if (this.$route.query.byAddress) {
      // Convert 0 or 1 from String to Boolean, passing through Number
      // since JS evaluates Boolean('0') to true and Boolean(0) to false
      this.showVotesByAddress = Boolean(Number(this.$route.query.byAddress));
    }
  },

  methods: {
    selectOption(id) {
      if (this.isForVoting && this.canUserVote) {
        this.selectedOption = id;
        this.$emit('optionSelected', id);
      }
    },

    changeVoteDisplay() {
      this.showVotesByAddress = !this.showVotesByAddress;
    },

    getOptionHighestPercentage() {
      let highestNumber = 0;
      highestNumber = Math.max(...Object.values(this.votePercentages));
      return highestNumber;
    },
  },
};
</script>

<style lang="scss" scoped>
.option {
  background: $white;
  box-shadow: $shadow;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  z-index: 2;

  &::v-deep .q-item {
    .q-focus-helper {
      background: rgba(101, 52, 255, 0.7) !important;
    }
  }

  .progress-line {
    position: absolute;
    top: 5px;
    left: 0;
    height: calc(100% - 10px);
    background: $primary;
    opacity: 0.1;
    transition: all 0.2s linear;
    border-radius: 10px;
    @media(max-width: 767.98px) {
      opacity: 0.15;
      z-index: 1;
    }
  }

  .option-content {
    height: 50px;
    padding: 5px 10px;
    border: 1px solid transparent !important;
    @media (min-width: 768px) {
      padding-right: 24px;
    }
    &.selected {
      border: 1px solid $primary !important;
    }
    &.highestPercentage {
      .progress-line {
        background: $light-green !important;
        opacity: 0.35;
      }
      .letter {
        background: #D1F4ED !important;
      }
    }
    &.option-content-image {
      height: 300px;
    }
  }

  .option-content:not(.is-for-voting) {
    @media (max-width: 767.98px) {
      display: grid;
      grid-template-columns: 30px 1fr;
      grid-template-rows: 1fr;
      column-gap: 15px;
    }
  }

  &:not(:last-child) {
    margin-bottom: 8px;
    @media(min-width: 768px) {
      margin-bottom: 16px;
    }
  }

  &-image {
    height: 280px;
    width: auto;
    max-width: 80%;
    object-fit: contain;
  }
}

.letter {
  width: 30px;
  height: 30px;
  background: $light-violet;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  flex-shrink: 0;
  font-size: 20px;
  line-height: 30px;
  padding-top: 3px;
  @media (max-width: 767.98px) {
    grid-area: 1 / 1 / 3 / 2;
    & + div {
      grid-area: 1 / 2 / 2 / 3;
      & + div {
        grid-area: 2 / 2 / 3 / 3;
        justify-content: flex-start;
      }
    }
  }
}

.user-cannot-vote {
  opacity: 0.6;
}

.vote-percentages-container {
  @media(max-width: 767.98px) {
    position: relative;
    padding: 0 5px;
    border-radius: 8px;
    overflow: hidden;
    .q-item__label {
      margin: 0;
      z-index: 2;
    }
  }

  .percent-text {
    opacity: 0.7;
    color: $primary-black;
  }
}

.option-result-info {
  width: 100%;
  display: flex;
  position: relative;
  height: 40px;
  .option-text {
    margin: 0;
    z-index: 2;
    position: relative;
    color: $primary-black;
    font-weight: 400;
    @media(max-width: 767.98px) {
      font-size: 16px;
      line-height: 22px;
      color: $dark-grey;
    }
  }
}

.poll-options-container {
  padding: 24px 40px 0;
  @media(max-width: 767.98px) {
    background: $other-light-grey;
    position: relative;
    padding: 8px 16px 15px;
  }
}

.caption-container {
  display: flex;
  justify-content: flex-end;
  padding: 0 5px;
}
</style>
