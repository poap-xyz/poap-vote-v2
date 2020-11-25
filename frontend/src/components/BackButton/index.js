import { Vue, Component } from 'vue-property-decorator';
import template from './BackButton.vue';

@Component({
  name: 'BackButton',
  mixins: [template],
})
export default class BackButton extends Vue {
  goBack() {
    if (window.history.length > 2) {
      this.$router.back();
    } else {
      this.$router.push('/');
    }
  }
}
