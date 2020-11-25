import { Vue, Component, Prop } from 'vue-property-decorator';
import template from './LittleBadge.vue';

@Component({
  name: 'LittleBadge',
  mixins: [template],
})
export default class LittleBadge extends Vue {
  @Prop(String) pollType;
}
