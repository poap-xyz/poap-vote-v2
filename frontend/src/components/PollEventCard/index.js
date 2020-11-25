import { Vue, Component, Prop } from 'vue-property-decorator';
import template from './PollEventCard.vue';

@Component({
  name: 'PollEventCard',
  mixins: [template],
})
export default class PollEventCard extends Vue {
  @Prop(Object) eventInfo;
}
