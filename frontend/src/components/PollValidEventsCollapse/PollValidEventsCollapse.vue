
<template>
  <!-- Show valid events -->
  <div class="valid-events-container">
    <white-container>
      <q-expansion-item
        expand-separator
        default-opened
      >
        <template v-slot:header>
          <div class="collapse-header">
            <h4 class="text-subtitle1 text-bold no-margin primary">
              Valid Events
            </h4>

            <div
              v-if="userAddress"
              class="eligible-content"
            >
              <span
                :class="eligibleTokenCount === 0 ? 'circle-error-icon' : 'circle-check-icon'"
              />
              <span
                :class="`eligible-text
                  ${ eligibleTokenCount !== 0 ? 'eligible' : 'not-eligible'}`"
              >
                {{
                  eligibleTokenCount === 0 ? (
                    'You do not hold any tokens qualified to vote in this poll.'
                  ) : (
                    'You hold tokens qualified to vote in this poll.'
                  )
                }}
              </span>
            </div>
          </div>
        </template>

        <q-card>
          <q-card-section>
            <poll-details-valid-events :is-for-voting="isForVoting" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </white-container>
  </div>
</template>

<style src="./style.scss" lang="scss" scoped></style>
