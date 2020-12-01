import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import helpers from '../../mixins/helpers';
import TokenTooltip from '../TokenTooltip';
import template from './PoapEventGroup';

@Component({
  name: 'PoapEventGroup',
  mixins: [template],
  components: {
    TokenTooltip,
  },
})
export default class PoapEventGroup extends mixins(helpers) {
    @Prop(Array) eventGroup;

    @Prop(Boolean) withoutTooltip;

    @Prop(Boolean) siteHeader;

    created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    }

    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    }
}
