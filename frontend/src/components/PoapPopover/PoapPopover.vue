<template>
  <popper
    :trigger="isMobile ? 'clickToToggle' : 'hover'"
    :options="{
      placement: 'bottom',
    }"
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div class="popper">
      <div :class="`${noPoaps ? 'no-poaps' : ''} popover-content`">
        <slot name="content" />
      </div>
    </div>

    <div slot="reference">
      <slot name="reference" />
    </div>
  </popper>
</template>

<style src="./style.scss" lang="scss" scoped></style>
