import { Vue, Component } from 'vue-property-decorator';
import template from './WhiteContainer.vue';

@Component({
  name: 'WhiteContainer',
  mixins: [template],
})
export default class WhiteContainer extends Vue {

}
