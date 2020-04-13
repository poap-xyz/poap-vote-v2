import BaseButton from 'components/BaseButton';
import BaseInput from 'components/BaseInput';
import BaseSelect from 'components/BaseSelect';

// "async" is optional
export default async ({ Vue /* app, router, store, ... */ }) => {
  Vue.component('base-button', BaseButton);
  Vue.component('base-input', BaseInput);
  Vue.component('base-select', BaseSelect);
};
