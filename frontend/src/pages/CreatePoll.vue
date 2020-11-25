<template>
  <q-page padding>
    <div
      class="text-center"
      style="margin:0 auto; max-width:400px"
    >
      <h2
        id="page-title"
        class="primary text-bold q-mb-md"
      >
        Create Poll
      </h2>
      <div>
        <the-create-poll-form />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import title from 'src/mixins/title';
import TheCreatePollForm from 'components/TheCreatePollForm';

export default {
  name: 'CreatePoll',

  components: {
    TheCreatePollForm,
  },

  mixins: [title],

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
    }),
  },

  mounted() {
    this.generateTitle();
  },
};
</script>
