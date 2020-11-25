import { Vue, Component, Prop } from 'vue-property-decorator';
import template from './TokenTooltip';

@Component({
  name: 'TokenTooltip',
  mixins: [template],
})
export default class TokenTooltip extends Vue {
  @Prop(Object) event;
}
