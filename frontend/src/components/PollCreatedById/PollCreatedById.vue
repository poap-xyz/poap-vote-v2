<template>
  <div
    class="created-by-container small-text text-bold text-secondary-dark-grey"
  >
    <p
      v-if="fullTitle"
      class="q-my-none q-mr-sm"
    >
      Poll created by:
    </p>
    <span class="circle" />
    <p
      v-if="pollId"
      class="q-my-none"
    >
      {{ pollId.replace(/(^.{6})(.+)(.{6}$)/g,'$1...$3') }}
    </p>
  </div>
</template>

<style src="./style.scss" lang="scss" scoped>
</style>
