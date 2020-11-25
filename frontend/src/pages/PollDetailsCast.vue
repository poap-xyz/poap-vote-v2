<template>
  <q-page>
    <div class="layout-container">
      <shape-background
        v-if="!isMobile"
        theme="secondary"
      />
      <div class="poll-detail-wrapper">
        <back-button />
        <div class="poll-detail-container">
          <white-container v-if="poll">
            <poll-details-poll-options
              :is-for-voting="true"
              :show-results="showResults"
              @optionSelected="onOptionSelected"
            />

            <div v-if="poll && poll.polltaker_account">
              <!-- Vote button  -->
              <poll-details-poll-footer
                :submit-vote="submitVote"
                :is-vote-submission-loading="isVoteSubmissionLoading"
                :option-selected="selectedOption ? true : false"
                :show-results="showResults"
                :toggle-show-results="toggleShowResults"
              />
            </div>
          </white-container>
        </div>

        <poll-valid-events-collapse
          v-if="poll"
          :is-for-voting="true"
          :valid-event-count="poll.valid_event_ids && poll.valid_event_ids.length"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import eip712 from 'src/mixins/eip712';
import getPollData from 'src/mixins/getPollData';
import helpers from 'src/mixins/helpers';
import voting from 'src/mixins/voting';
import PollDetailsPollOptions from 'components/PollDetailsPollOptions';
import ShapeBackground from 'components/ShapeBackground';
import BackButton from 'components/BackButton';
import WhiteContainer from 'components/WhiteContainer';
import PollValidEventsCollapse from 'components/PollValidEventsCollapse';
import PollDetailsPollFooter from 'components/PollDetailsPollFooter';

export default {
  name: 'PollDetailsCast',

  components: {
    PollDetailsPollOptions,
    ShapeBackground,
    BackButton,
    WhiteContainer,
    PollValidEventsCollapse,
    PollDetailsPollFooter,
  },

  mixins: [eip712, getPollData, helpers, voting],

  data() {
    return {
      selectedOption: undefined,
      isVoteSubmissionLoading: undefined,
      showResults: false,
    };
  },

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
      poll: (state) => state.poap.selectedPoll,
    }),
  },

  mounted() {
    this.toggleBodyClass(true, 'poap-poll');
  },

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
    this.toggleBodyClass(false, 'poap-poll');
  },

  methods: {
    onOptionSelected(id) {
      this.selectedOption = id;
    },

    async submitVote() {
      /* eslint-disable no-console */
      let response;
      try {
        if (!this.canUserVote) return;
        this.isVoteSubmissionLoading = true;

        // Define EIP-712 signature format for submitting votes
        const dataFormat = [
          { name: 'voter_account', type: 'address' },
          { name: 'token_ids', type: 'uint256[]' },
          { name: 'poll_option_id', type: 'uint256' },
        ];

        // The actual data to be signed
        const voteData = {
          voter_account: this.userAddress,
          token_ids: this.userEligibleNftIds,
          poll_option_id: this.selectedOption,
        };

        // Format data and get user's signature
        const signature = await this.getSignature('Vote', dataFormat, voteData, this.userAddress);

        // Generate object to send to server
        const payload = {
          ...voteData,
          attestation: signature,
        };
        console.log('Server payload: ', payload);

        // Submit vote
        console.log('Sending POST request to server to submit vote...');
        response = await this.$serverApi.post(`/api/poll/${this.selectedPollId}/votes`, payload);
        console.log('Server response: ', response);

        // Notify user vote submission was successful
        this.notifyUser('positive', 'Your vote has been successfully recorded!');
      } catch (err) {
        this.isVoteSubmissionLoading = false;
        this.showError(err, 'Unable to cast vote, please try again');
      }

      if (response.data) {
        try {
          await this.getSelectedPollData(true);
          this.$router.push({ name: 'results', params: { id: this.selectedPollId } });
        } catch (err) {
          this.isVoteSubmissionLoading = false;
          this.showError(err, 'Unable to get updated poll data. Please refresh the page and try again');
        }
      }
      this.isVoteSubmissionLoading = false;
    },

    toggleShowResults() {
      this.showResults = !this.showResults;
    },
  },

};
</script>

<style lang="scss" scoped>
.poll-detail-wrapper {
  .poll-detail-container {
    @media(min-width: 768px) {
      margin-top: 32px;
    }
  }

  h3 {
    @media(max-width: 767.98px) {
      line-height: 19px;
    }
  }
}

.valid_events_container {
  border-top: 1px solid $light-grey;
  margin-top: 28px;
  padding-top: 24px;
  ::v-deep .q-expansion-item {
    .q-expansion-item__container {
      .q-item {
        padding: 0 !important;
        &:hover .q-focus-helper {
          background: transparent;
        }
        .q-item__section {
          flex: unset;
        }
        .q-item__section--main ~ .q-item__section--side {
          padding-left: 9px;
          i {
            color: $light-red;
            font-size: 14px;
          }
        }
      }
      .q-card__section {
        padding: 0 !important;
        margin-top: 20px;
      }
    }
  }
}
</style>
