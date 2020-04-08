<template>
  <div>
    <q-input
      v-model="content"
      class="q-my-sm"
      filled
      :label="label"
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
