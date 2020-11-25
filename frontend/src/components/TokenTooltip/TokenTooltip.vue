<template>
  <q-tooltip
    content-class="poap-tooltip"
    color="text-dark-grey"
  >
    <q-card>
      <!-- Layout copied and modified from CreatePollForm select component -->
      <q-item-section class="q-pa-md">
        <q-item-label class="text-caption text-bold">
          {{ event.name }}
        </q-item-label>
        <q-item-label class="text-caption text-bold">
          {{ event.start_date }} &ndash; {{ event.end_date }}
        </q-item-label>
        <q-item-label class="text-caption text-bold">
          <span v-if="event.city === 'Virtual'">Virtual</span>
          <span v-else-if="!event.city">Not specified</span>
          <span v-else>{{ event.city }}, {{ event.country }}</span>
        </q-item-label>
      </q-item-section>
    </q-card>
  </q-tooltip>
</template>
