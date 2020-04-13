<template>
  <div>
    <q-input
      v-model="content"
      class="q-my-sm"
      filled
      :label="label"
      lazy-rules
      :rules="[val => rules(val)]"
      :type="type"
      @input="handleInput"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseInput',

  props: {
    label: {
      type: String,
      required: true,
      default: undefined,
    },

    rules: {
      type: Function,
      required: false,
      default() {
        return true;
      },
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
