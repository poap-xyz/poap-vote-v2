<template>
  <q-card class="event-card-wrapper">
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img :src="eventInfo.image_url">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="secondary event-name">
          {{ eventInfo.name }}
        </q-item-label>
        <q-item-label class="text-subtitle2 text-bold text-secondary-dark-grey">
          <div class="q-my-sm">
            {{ eventInfo.start_date }}
          </div>
          <div>
            <span v-if="eventInfo.city === 'Virtual'">Virtual</span>
            <span v-else-if="!eventInfo.city">Not specified</span>
            <span v-else>{{ eventInfo.city }}, {{ eventInfo.country }}</span>
          </div>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<style src="./style.scss" lang="scss" scoped></style>
