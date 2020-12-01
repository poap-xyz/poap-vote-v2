<template>
  <div class="event-group-container"
       v-bind:class="siteHeader ? 'header' : ''"
  >
    <div
      v-for="item in (eventGroup.length > (isMobile || siteHeader ? 3 : 5)
        ? [...eventGroup].slice(0, (isMobile || siteHeader ? 3 : 5))
        : eventGroup)"
      :key="item.tokenId"
      class="token-item"
    >
      <img :src="item.event.image_url">
      <token-tooltip
        v-if="!withoutTooltip"
        :event="item.event"
      />
    </div>
    <div
      v-if="eventGroup.length > (isMobile || siteHeader ? 3 : 5)"
      v-bind:class="siteHeader ? 'header-more' : 'token-item more'"
    >
      <span>+{{ eventGroup.length - (isMobile || siteHeader ? 3 : 5) }}</span>
      <q-tooltip
        v-if="!withoutTooltip"
        content-class="poap-tooltip"
        color="text-dark-grey"
      >
        <q-card>
          <!-- Layout copied and modified from CreatePollForm select component -->
          <q-item-section class="q-pa-md">
            <q-item-label
              v-for="(item, index) in eventGroup.slice(5)"
              :key="index"
              class="text-caption text-bold"
            >
              • {{ item.event.name }}
            </q-item-label>
          </q-item-section>
        </q-card>
      </q-tooltip>
    </div>
  </div>
</template>
<style src="./style.scss" lang="scss" scoped></style>
