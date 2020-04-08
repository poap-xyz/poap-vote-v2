import BaseInput from 'components/BaseInput';
import BaseButton from 'components/BaseButton';

// "async" is optional
export default async ({ Vue /* app, router, store, ... */ }) => {
  Vue.component('base-input', BaseInput);
  Vue.component('base-button', BaseButton);
};
