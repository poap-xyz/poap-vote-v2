<template>
  <div>
    <q-select
      v-model="content"
      class="q-my-sm"
      filled
      :hide-bottom-space="isTimeDropdown"
      :hide-dropdown-icon="isTimeDropdown"
      :label="label"
      :options="options"
      :type="type"
      :style="{'min-width': '70px'}"
      @input="handleInput"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseInput',

  props: {
    isTimeDropdown: {
      type: Boolean,
      required: false,
      default: false,
    },

    label: {
      type: String,
      required: true,
      default: undefined,
    },

    options: {
      type: Array,
      required: true,
    },

    type: {
      type: String,
      required: false,
      default: undefined,
    },

    value: {
      type: undefined,
      required: true,
      default: undefined,
    },
  },

  data() {
    return {
      content: this.value,
    };
  },

  methods: {
    handleInput() {
      this.$emit('input', this.content);
    },
  },

};
</script>
