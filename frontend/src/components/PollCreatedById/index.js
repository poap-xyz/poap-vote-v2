import { Component, Prop } from 'vue-property-decorator';
import helpers from 'src/mixins/helpers';
import { mixins } from 'vue-class-component';
import template from './PollCreatedById';

@Component({
  name: 'PollCreatedById',
  mixins: [template],
})
export default class PollCreatedById extends mixins(helpers) {
  @Prop(String) pollId;

  @Prop(Boolean) fullTitle;

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  }
}
