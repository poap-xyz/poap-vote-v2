<template>
  <span
    :class="`little-badge ${ pollType === 'activePolls' ? 'active' : 'finished'}`"
  >
    {{ pollType === 'activePolls' ? "Active" : "Finished" }}
  </span>
</template>

<style src="./style.scss" lang="scss" scoped></style>
