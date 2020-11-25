<template>
  <div>
    <q-btn
      class="q-my-sm poap-btn"
      :class="{'full-width': fullWidth}"
      :color="color"
      :dense="dense"
      :flat="flat"
      :label="label"
      :loading="loading"
      :outline="outline"
      :unelevated="unelevated"
      rounded
      size="16px"
      :style="{textTransform: 'none', background: background ? `${background}!important` : ''}"
      @click="handleClick"
    >
      <template
        v-if="icon"
      >
        <img
          :src="icon"
          class="btn-icon"
        >
      </template>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'BaseButton',

  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },

    dense: {
      type: Boolean,
      required: false,
      default: false,
    },

    flat: {
      type: Boolean,
      required: false,
      default: false,
    },

    fullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },

    label: {
      type: String,
      required: true,
      default: undefined,
    },

    loading: {
      type: Boolean,
      required: false,
      default: false,
    },

    outline: {
      type: Boolean,
      required: false,
      default: false,
    },

    unelevated: {
      type: Boolean,
      required: false,
      default: false,
    },

    icon: {
      type: String,
      required: false,
      default: undefined,
    },

    background: {
      type: String,
      required: false,
      default: undefined,
    },
  },

  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.poap-btn {
  &.q-btn {
    height: 56px;
    @media(min-width: 768px) {
      height: 45px;
      min-width: 170px;
    }
  }
}
</style>
