<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">
      Sorry, nothing here...<strong>(404)</strong>
    </p>
    <q-btn
      color="primary"
      style="width:200px;"
      to="/"
      label="Go back"
    />
  </div>
</template>

<script>
import title from 'src/mixins/title';

export default {
  name: 'Error404',

  mixins: [title],

  mounted() {
    this.generateTitle();
  },
};
</script>
