import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { mapState, mapGetters } from 'vuex';
import helpers from 'src/mixins/helpers';
import voting from 'src/mixins/voting';
import ConnectWallet from 'components/ConnectWallet';
import template from './PollDetailsPollFooter';

@Component({
  name: 'PollDetailsPollFooter',
  mixins: [template],
  computed: {
    ...mapGetters({
      voteData: 'poap/voteData',
    }),
    ...mapState({
      userAddress: (state) => state.user.userAddress,
    }),
    totalVotes() {
      return this.voteData;
    },
  },
  components: {
    ConnectWallet,
  },
})
export default class PollDetailsPollFooter extends mixins(helpers, voting) {
  @Prop(Function) submitVote;

  @Prop(Boolean) isVoteSubmissionLoading;

  @Prop(String) typePoll;

  @Prop(Boolean) optionSelected;

  @Prop(Boolean) showResults;

  @Prop(Function) toggleShowResults;
}
