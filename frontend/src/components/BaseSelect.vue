<template>
  <div>
    <q-select
      v-model="content"
      class="q-my-sm poap-s poap-select"
      outlined
      :hide-bottom-space="isTimeDropdown"
      :hide-dropdown-icon="isTimeDropdown"
      :label="label"
      :options="options"
      :type="type"
      :style="{'min-width': '70px'}"
      @input="handleInput"
    >
      <template v-slot:append>
        <span class="single-arrow-up custom-arrow" />
      </template>
    </q-select>
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
      required: false,
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

<style lang="scss" scoped>
.poap-select {
  ::v-deep &.q-field {
    .q-field__inner .q-field__control {
      &::before {
        border: 1px solid $secondary-white !important;
      }
    }
  }
  .custom-arrow {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
