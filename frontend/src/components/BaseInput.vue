<template>
  <div class="input-wrapper">
    <span class="text-subtitle2 text-weight-regular dark-grey">
      {{ label }}
    </span>
    <q-input
      v-model="content"
      class="q-my-sm"
      :counter="counter"
      outlined
      lazy-rules
      :maxlength="maxlength"
      :rules="[val => rules(val)]"
      :type="type"
      @input="handleInput"
    >
      <template
        v-if="iconAppend"
        v-slot:append
      >
        <q-icon
          class="cursor-pointer"
          :name="iconAppend"
          @click="$emit('iconClicked')"
        />
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',

  props: {
    counter: {
      type: Boolean,
      required: false,
      default: false,
    },

    iconAppend: {
      type: String,
      required: false,
      default: undefined,
    },

    label: {
      type: String,
      required: true,
      default: undefined,
    },

    maxlength: {
      type: Number,
      required: false,
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

<style lang="scss" scoped>
.input-wrapper {
  ::v-deep .q-field__control {
    border-radius: 6px;
    textarea {
      resize: none;
    }
    &::before {
      border: 1px solid $secondary-white !important;
    }
    & + .q-field__bottom .q-field__counter{
      font-weight: 400;
      font-size: 14px;
      line-height: 14px;
      color: $secondary-light-grey;
    }
  }
}
</style>
