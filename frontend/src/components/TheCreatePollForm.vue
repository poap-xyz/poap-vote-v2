<template>
  <div>
    <q-form class="column content-stretch">
      <div class="create-poll-container">
        <!--------------------- POLL TITLE AND DESCRIPTION ---------------------->
        <h5 class="section-header big-section-header dark-grey text-bold q-mt-none q-mb-lg">
          Title and Description
        </h5>
        <!-- Poll title -->
        <base-input
          id="createPoll-title"
          v-model="title"
          :counter="true"
          label="Title"
          :maxlength="80"
          :rules="isValidTitle"
        />

        <!-- Poll description -->
        <base-input
          id="createPoll-description"
          v-model="description"
          :counter="true"
          label="Description"
          :maxlength="4000"
          :rules="isValidDescription"
          type="textarea"
        />

        <!----------------------------- POLL OPTIONS ------------------------------>
        <h5
          class="section-header option-title dark-grey text-bold"
        >
          Poll Options
        </h5>
        <p
          class="section-header-description"
        >
          Add as many poll options as you'd like.
        </p>

        <!-- Options list -->
        <div
          v-for="(option, index) in poll_options"
          :key="index"
        >
          <!--
          If there 3 or more options, user can remove the last option. We
          do it this way instead of allowing user to remove any option
          because it is much simpler to implement. Two-way binding breaks
          if you remove an element from an array at an arbitrary index.
          -->
          <base-input
            :id="`createPoll-option-${index+1}`"
            v-model="poll_options[index].contents"
            :icon-append="index === poll_options.length - 1 && index > 1
              ? 'fas fa-minus-circle'
              : undefined"
            :label="`Option ${index + 1}`"
            :rules="isValidOption"
            @iconClicked="removeOption(index)"
          />
        </div>

        <!-- Add new option -->
        <div class="add-option-container">
          <base-button
            v-if="!isAtMaxOptions"
            id="createPoll-addOption"
            color="primary"
            :dense="true"
            label="Add option"
            :flat="true"
            :icon="require('../assets/icons/add-icon.svg')"
            @click="addOption"
          />
          <div
            v-else
            class="text-caption text-italic"
          >
            You have reached the maximum number of poll options
          </div>
        </div>

        <!-------------------- VALID EVENTS SELECTION --------------------->
        <h5 class="section-header dark-grey text-bold q-mb-md q-mt-xl q-pt-sm">
          Valid Events
        </h5>
        <div>
          <p class="section-header-description">
            A user will be able to vote on this poll only if they hold a valid POAP token from at
            least one of the selected events. Use the box below to search all events.
          </p>
          <span class="text-subtitle2 text-weight-regular dark-grey">
            Events
          </span>
          <q-select
            id="createPoll-selectEvents"
            v-model="valid_events"
            class="q-my-sm poap-select"
            outlined
            multiple
            option-label="name"
            :options="filteredEvents"
            :rules="[val => isValidEventSelection(val)]"
            use-input
            hide-dropdown-icon
            @filter="eventsSearchFilter"
          >
            <template v-slot:append>
              <span class="single-arrow-up custom-arrow" />
            </template>
            <!--
            Customize option appearance in dropdown menu
            -->
            <template v-slot:option="event">
              <q-item
                style="max-width:573px"
                v-bind="event.itemProps"
                v-on="event.itemEvents"
              >
                <q-item-section avatar>
                  <img
                    :src="event.opt.image_url"
                    class="event-image"
                  >
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ event.opt.name }}</q-item-label>
                  <q-item-label caption>
                    {{ event.opt.start_date }}
                  </q-item-label>
                  <q-item-label caption>
                    <span v-if="event.opt.city === 'Virtual'">Virtual</span>
                    <span v-else-if="!event.opt.city">Not specified</span>
                    <span v-else>{{ event.opt.city }}, {{ event.opt.country }}</span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <!--
            What to show when there's no search matches
            -->
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No events found
                </q-item-section>
              </q-item>
            </template>

            <!--
            Custom option appearance for selected events
            -->
            <template v-slot:selected-item="event">
              <q-chip
                removable
                :tabindex="event.tabindex"
                @remove="event.removeAtIndex(event.index)"
              >
                <q-avatar>
                  <img
                    :src="event.opt.image_url"
                    style="max-width:40px"
                  >
                </q-avatar>
                {{ event.opt.name }}
              </q-chip>
            </template>
          </q-select>
        </div>

        <!-------------------- POLL END DATE/TIME --------------------->
        <h5 class="section-header dark-grey text-bold q-mb-md q-mt-xl">
          End Date and Time
        </h5>
        <p class="section-header-description">
          Enter the polling end date and time, specified in 24-hour
          format using your local time zone
        </p>
        <div class="end-date-grid">
          <!-- End date -->
          <div id="createPoll-endDay">
            <span class="text-subtitle2 text-weight-regular dark-grey">
              End Date
            </span>
            <q-input
              v-model="end_day"
              outlined
              :hide-bottom-space="true"
              :hide-dropdown-icon="true"
              mask="date"
              :rules="['date']"
              class="q-my-sm poap-select"
            >
              <template v-slot:append>
                <q-icon
                  name="fas fa-calendar-alt"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="end_day"
                      :options="limitDateSelection"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- End time Hour -->
          <div>
            <span class="text-subtitle2 text-weight-regular dark-grey">
              Hour
            </span>
            <base-select
              id="createPoll-endHour"
              v-model="endHour"
              :is-time-dropdown="true"
              :options="endHourOptions"
            />
          </div>

          <div class="flex">
            <span class="text-subtitle1 text-secondary-light-grey">:</span>
          </div>

          <!-- End time Minute -->
          <div>
            <div>
              <span class="text-subtitle2 text-weight-regular dark-grey">
                Minute
              </span>
              <base-select
                id="createPoll-endMinute"
                v-model="endMinute"
                :is-time-dropdown="true"
                :options="endMinuteOptions"
              />
            </div>
          </div>
        </div>

        <!--
        Since datetime is composed of multiple components, we manually show the
        input validation error if it's invalid (i.e. if end date is in the past)
        -->
        <div
          v-if="!isEndDateValid"
          class="text-caption text-left negative"
        >
          &nbsp;&nbsp;&nbsp;&nbsp;End date must be in the future
        </div>
      </div>
      <!-------------------------------------- SUBMIT BUTTON -------------------------------------->
      <div class="create-button-container">
        <base-button
          id="createPoll-submit"
          color="primary"
          class="q-mt-xl"
          :disabled="!isFormValid"
          :loading="isLoading"
          label="Create Poll"
          outline
          unelevated
          :icon="require('../assets/icons/arrow-right-icon.svg')"
          @click="createPoll"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import eip712 from 'src/mixins/eip712';
import helpers from 'src/mixins/helpers';
import Fuse from 'fuse.js';
import { date } from 'quasar';

const { buildDate, formatDate } = date;

export default {
  name: 'TheCreatePollForm',

  mixins: [eip712, helpers],

  data() {
    return {
      // Poll properties (id and startDate will be generated by the server)
      title: undefined,
      description: undefined,
      end_day: undefined,
      end_time: undefined,
      valid_events: [],
      poll_options: [
        // start with two empty options
        { contents: undefined },
        { contents: undefined },
      ],
      // Parameters for computing end_time
      endHour: undefined,
      endHourOptions: [
        '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
        '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23',
      ],
      endMinute: undefined,
      endMinuteOptions: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
      // Parameters and options for fuse.js fuzzy-search generated with https://fusejs.io/,
      // used for event search/filtering
      filteredEvents: [],
      fuseOptions: {
        // https://fusejs.io/api/options.html
        keys: ['name'],
        distance: 70, // we don't care where in the string the match is found
        threshold: 0.3, // this seems to be a good value from trial and error
      },
      // UI helpers
      isLoading: false,
      maxOptions: 20, // maximum number of poll options
    };
  },

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
      events: (state) => state.poap.events,
    }),

    /**
     * @notice Returns true if the user is at the limit of poll options
     */
    isAtMaxOptions() {
      return this.poll_options.length === this.maxOptions;
    },

    /**
     * @notice Takes the entered date and time provided by the user and
     * converts it into a unix timestamp (therefore this is in seconds)
     */
    end_date() {
      if (!this.end_day) return undefined;
      const [year, month, day] = this.end_day.split('/');
      const hours = this.endHour;
      const minutes = this.endMinute;
      const lastDay = buildDate({
        year, month, date: day, hours, minutes,
      });
      return parseInt(lastDay.getTime() / 1000, 10);
    },

    /**
     * @notice Ensure selected end date is in the future. Unless all date/time
     * fields are filled out, we assume the date is valid
     */
    isEndDateValid() {
      if (!this.end_date) return true;
      if (!this.endHour) return true;
      if (!this.endMinute) return true;
      return this.end_date * 1000 > (new Date()).getTime();
    },

    /**
     * @notice Returns true if every input on the form is valid
     */
    isFormValid() {
      // We explicitly check that values are equal to true since the input
      // field `rules` property returns a string when input is invalid
      // and strings are truthy
      const areAllOptionsValid = this.poll_options
        .filter((val) => val.contents && val.contents.length > 0)
        .length === this.poll_options.length;

      return this.isValidTitle(this.title) === true
        && this.isValidDescription(this.description) === true
        && this.isValidEventSelection(this.valid_events) === true
        && areAllOptionsValid === true;
    },
  },

  mounted() {
    this.startDate = new Date();
    this.filteredEvents = this.events;
  },

  methods: {
    isValidTitle(val) {
      return (val && val.length > 4) ? true : 'Poll title must be at least 5 characters';
    },

    isValidDescription(val) {
      return (val && val.length > 4) ? true : 'Description must be at least 5 characters';
    },

    isValidOption(val) {
      return (val && val.length > 0) ? true : 'Option must have at least 1 character';
    },

    isValidEventSelection(val) {
      return (val && val.length > 0) ? true : 'Please select at least 1 event';
    },

    addOption() {
      this.poll_options.push({ contents: undefined });
    },

    removeOption(index) {
      this.poll_options = this.removeArrayElementByIndex(this.poll_options, index);
    },

    /**
     * @notice Fuzzy search for events filtering using Fuse.js
     * @dev https://quasar.dev/vue-components/select#Filtering-and-autocomplete
     */
    eventsSearchFilter(val, update) {
      // Return full list of options if search string is empty
      if (val === '') {
        update(() => {
          this.filteredEvents = this.events;
        });
        return;
      }

      // If not empty, use fuse.js to perform a fuzzy search on the event list
      update(() => {
        const fuse = new Fuse(this.events, this.fuseOptions);
        const filteredEvents = fuse.search(val);
        this.filteredEvents = filteredEvents.map((event) => event.item);
      });
    },

    /**
     * @notice Restrict user from choosing end date before tomorrow
     */
    limitDateSelection(val) {
      const today = formatDate(Date.now(), 'YYYY/MM/DD');
      return val > today;
    },

    async createPoll() {
      /* eslint-disable no-console */
      let response;
      try {
        if (!this.isFormValid) return;
        this.isLoading = true;

        // The actual data to be signed
        const pollData = {
          title: this.title,
          polltaker_account: '0x0000000000000000000000000000000000000000',
          description: this.description,
          valid_event_ids: this.valid_events.map((event) => event.id),
          poll_options: this.poll_options.map((option) => option.contents),
          end_date: this.end_date ? this.end_date : '',
        };

        // Generate object to send to server
        const payload = {
          ...pollData,
          attestation: new Date().getTime().toString(),
        };
        console.log('Server payload: ', payload);

        // Create poll
        console.log('Sending POST request to server to create poll...');
        response = await this.$serverApi.post('/api/polls', payload);
        console.log('Server response: ', response);

        // Notify user poll creation was successful
        this.notifyUser('positive', 'Your poll has been successfully created!');
      } catch (err) {
        this.isLoading = false;
        this.showError(err, 'Unable to create poll, please try again. ');
      }

      // If the previous request succeeded, navigate to the next page
      if (response.data) {
        try {
        // Get updated poll list and redirect to details page of the new poll
          await this.$store.dispatch('poap/getPolls');
          this.$router.push({ name: 'results', params: { id: response.data.id } });
        } catch (err) {
          this.isLoading = false;
          this.showError(err, 'Unable to fetch new poll. Please refresh the page and find your poll on the home page.');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.create-poll-container {
  padding: 0 16px;
  @media(min-width: 768px) {
    max-width: 573px;
    padding: 0;
    margin: 0 auto;
  }
  .section-header {
    font-size: 16px;
    line-height: 21px;
    font-family: $secondary-font;

    @media (min-width: 768px) {
      font-size: 22px;
      line-height: 27px;
    }

    &.big-section-header {
      @media (max-width: 767.98px) {
        font-size: 20px;
        line-height: 27px;
      }
    }

    &:first-child {
      text-align: center;
      @media(min-width: 768px) {
        text-align: left;
      }
    }
    &.option-title {
      margin: 32px 0 8px;
      @media(min-width: 768px) {
        margin: 64px 0 12px;
      }
    }
  }
  .section-header-description {
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 19px;
    font-weight: 400;
    color: $dark-grey-text;
    @media(min-width: 768px) {
      font-size: 14px;
      line-height: 21px;
      margin-bottom: 32px;
    }
  }
  .add-option-container {
    ::v-deep button {
      height: auto;
      min-width: unset;
      .q-btn__content {
        display: flex;
        flex-direction: row-reverse;
        .btn-icon {
          width: 14px;
          height: 14px;
          margin-right: 10px;
        }
      }
      @media (max-width: 767.98px) {
        font-size: 14px !important;
        line-height: 18px;
      }
    }
  }
  .poap-select {
    ::v-deep .q-field__control {
      border-radius: 6px;
      &::before {
        border: 1px solid $secondary-white !important;
      }
    }
  }
  .end-date-grid {
    display: grid;
    row-gap: 12px;
    column-gap: 4px;
    align-items: center;
    grid-template-columns: 1fr 8px 1fr;
    @media (min-width: 768px) {
      grid-template-columns: 210px 124px 8px 124px;
      column-gap: 12px;
    }
    > div {
      &:first-child {
        grid-area: 1 / 1 / 2 / 4;
        @media (min-width: 768px) {
          padding-right: 28px;
          grid-area: unset;
        }
      }
      &:nth-child(3) {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
      }
    }
  }
  .end-time-minute-container {
    display: flex;
    align-items: center;
    > div {
      &:first-child {
        padding: 0 22px;
      }
      &:last-child {
        flex: 1;
      }
    }
  }
  .custom-arrow {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.create-button-container {
  display: flex;
  justify-content: center;
  @media (max-width: 767.98px) {
    justify-content: center;
    padding: 0 16px;
  }
  ::v-deep {
    > div {
      min-width: 184px;
      @media (max-width: 767.98px) {
        width: 100%;
        max-width: 400px;
      }
      button {
        width: 100%;
        padding: 0 24px!important;
        margin-bottom: 0!important;
        .q-btn__wrapper {
          padding: 0!important;
          .q-btn__content {
            justify-content: space-between;
            .btn-icon {
              width: 16px;
              height: 14px;
              margin-left: 18px;
              filter: invert(86%) sepia(69%) saturate(4746%)
                hue-rotate(253deg) brightness(103%) contrast(102%);
            }
            @media (max-width: 767.98px) {
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
}
.event-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}
</style>
