import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import PollDetailsValidEvents from 'components/PollDetailsValidEvents';
import WhiteContainer from 'components/WhiteContainer';
import voting from 'src/mixins/voting';
import template from './PollValidEventsCollapse';

@Component({
  name: 'PollValidEventsCollapse',
  mixins: [template, voting],
  components: {
    PollDetailsValidEvents,
    WhiteContainer,
  },
  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
    }),
  },
})
export default class PollValidEventsCollapse extends Vue {
  @Prop(Boolean) isForVoting;

  @Prop(Number) validEventCount;
}
