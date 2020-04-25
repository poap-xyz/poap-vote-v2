<template>
  <div>
    <div>
      <h6
        class="secondary"
        style="margin:0"
      >
        Valid Events
      </h6>
      <div>
        Users
        <span v-if="isPollOngoing">are</span>
        <span v-else>were</span>
        eligible to vote in this poll if they held any of the following POAP tokens.
      </div>
      <div class="row justify-start q-mt-md">
        <div
          v-for="event in events"
          :key="event.id"
          class="cursor-pointer q-mr-md q-mt-md"
        >
          <a
            :href="event.event_url"
            target="_blank"
            style="text-decoration: none; color: inherit;"
          >
            <q-card
              bordered
              class="card-border"
            >
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="event.image_url">
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ event.name }}</q-item-label>
                  <q-item-label caption>
                    <div>
                      {{ event.start_date }} &ndash; {{ event.end_date }}
                    </div>
                    <div>
                      <span v-if="event.city === 'Virtual'">Virtual</span>
                      <span v-else-if="!event.city">Not specified</span>
                      <span v-else>{{ event.city }}, {{ event.country }}</span>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import helpers from 'src/mixins/helpers';

export default {
  name: 'PollDetailsValidEvents',

  mixins: [helpers],

  computed: {
    ...mapGetters({
      events: 'poap/selectedPollEvents',
    }),
  },
};
</script>
