import { Vue, Component, Prop } from 'vue-property-decorator';
import Popper from 'vue-popperjs';
import helpers from '../../mixins/helpers';
import template from './PoapPopover';
import 'vue-popperjs/dist/vue-popper.css';

@Component({
  name: 'PoapPopover',
  mixins: [template, helpers],
  components: {
    popper: Popper,
  },
})
export default class PoapPopover extends Vue {
  @Prop(Boolean) noPoaps;

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  }
}
