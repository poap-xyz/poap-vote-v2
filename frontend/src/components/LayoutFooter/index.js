import { Vue, Component } from 'vue-property-decorator';
import helpers from '../../mixins/helpers';
import template from './LayoutFooter';

@Component({
  name: 'LayoutFooter',
  mixins: [template, helpers],
})
export default class LayoutFooter extends Vue {
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  }
}
