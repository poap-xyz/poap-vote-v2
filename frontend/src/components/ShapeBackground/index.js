import { Vue, Component, Prop } from 'vue-property-decorator';
import template from './ShapeBackground.vue';

@Component({
  name: 'ShapeBackground',
  mixins: [template],
})
export default class ShapeBackground extends Vue {
  @Prop(String) theme;
}
