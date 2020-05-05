<template>
  <div style="max-width: 400px; margin: 0 auto;">
    <q-form class="column content-stretch q-mb-xl">
      <!------------------------------- POLL TITLE AND DESCRIPTION -------------------------------->
      <h5 class="section-header">
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

      <!-------------------------------------- POLL OPTIONS --------------------------------------->
      <h5 class="section-header">
        Poll Options
      </h5>
      <div class="text-left">
        Add as many poll options as you'd like.
      </div>

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
      <div class="text-left">
        <base-button
          v-if="!isAtMaxOptions"
          id="createPoll-addOption"
          color="primary"
          :dense="true"
          label="Add option"
          :flat="true"
          @click="addOption"
        />
        <div
          v-else
          class="text-caption text-italic"
        >
          You have reached the maximum number of poll options
        </div>
      </div>

      <!--------------------------------- VALID EVENTS SELECTION ---------------------------------->
      <h5 class="section-header">
        Valid Events
      </h5>
      <div class="text-left">
        A user will be able to vote on this poll only if they hold a valid POAP
        token from at least one of the selected events. Use the box below to
        search all events.
        <q-select
          id="createPoll-selectEvents"
          v-model="valid_events"
          class="q-my-sm"
          filled
          label="Events"
          multiple
          option-label="name"
          :options="filteredEvents"
          :rules="[val => isValidEventSelection(val)]"
          use-input
          @filter="eventsSearchFilter"
        >
          <!--
          Customize option appearance in dropdown menu
          -->
          <template v-slot:option="event">
            <q-item
              v-bind="event.itemProps"
              v-on="event.itemEvents"
            >
              <q-item-section avatar>
                <img
                  :src="event.opt.image_url"
                  style="max-width:40px"
                >
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ event.opt.name }}</q-item-label>
                <q-item-label caption>
                  {{ event.opt.start_date }} &ndash; {{ event.opt.end_date }}
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

      <!----------------------------------- POLL END DATE/TIME ------------------------------------>
      <h5 class="section-header">
        End Date and Time
      </h5>
      <div class="text-left">
        Enter the polling end date and time, specified in 24-hour
        format using your local time zone
      </div>
      <div>
        <div class="row justify-between">
          <!--
          End date
          -->
          <div
            id="createPoll-endDay"
            class="col-auto q-my-sm"
          >
            <q-input
              v-model="end_day"
              filled
              :hide-bottom-space="true"
              :hide-dropdown-icon="true"
              label="End date"
              mask="date"
              placeholder="YYYY/MM/DD"
              style="max-width: 175px;"
              :rules="['date']"
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

          <!--
          End time
          -->
          <div class="col-auto">
            <div class="row justify-end">
              <base-select
                id="createPoll-endHour"
                v-model="endHour"
                class="col q-mr-xs"
                label="HH"
                :is-time-dropdown="true"
                :options="endHourOptions"
              />
              <base-select
                id="createPoll-endMinute"
                v-model="endMinute"
                class="col q-mr-xs"
                label="MM"
                :is-time-dropdown="true"
                :options="endMinuteOptions"
              />
              <base-select
                id="createPoll-endAmPm"
                v-model="endAmPm"
                class="col"
                label="AM/PM"
                :is-time-dropdown="true"
                :options="endAmPmOptions"
              />
            </div>
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

      <!-------------------------------------- SUBMIT BUTTON -------------------------------------->
      <div>
        <base-button
          id="createPoll-submit"
          color="primary"
          class="q-mt-xl"
          :disabled="!isFormValid"
          :loading="isLoading"
          :full-width="true"
          label="Create"
          @click="createPoll"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { date } from 'quasar';
import eip712 from 'src/mixins/eip712';
import helpers from 'src/mixins/helpers';
import Fuse from 'fuse.js';

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
      endHourOptions: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      endMinute: undefined,
      endMinuteOptions: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
      endAmPm: undefined,
      endAmPmOptions: ['AM', 'PM'],
      // Parameters and options for fuse.js fuzzy-search generated with https://fusejs.io/,
      // used for event search/filtering
      filteredEvents: [],
      fuseOptions: {
        // https://fusejs.io/api/options.html
        keys: ['name'],
        distance: 1000, // we don't care where in the string the match is found
        threshold: 0.45, // this seems to be a good value from trial and error
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
      const hours = this.endAmPm === 'AM' ? this.endHour : String(Number(this.endHour) + 12);
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
      if (!this.endAmPm) return true;
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
        && areAllOptionsValid === true
        // isEndDateValid is true by default to avoid unnecessary error message,
        // therefore we also check the components individually to ensure they
        // are all filled out
        && this.isEndDateValid
        && this.end_date !== undefined
        && this.endHour !== undefined
        && this.endMinute !== undefined
        && this.endAmPm !== undefined;
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

        // Define EIP-712 signature format for creating polls
        const dataFormat = [
          { name: 'title', type: 'string' },
          { name: 'polltaker_account', type: 'address' },
          { name: 'description', type: 'string' },
          { name: 'valid_event_ids', type: 'bytes32' },
          { name: 'poll_options', type: 'string' },
          { name: 'end_date', type: 'string' },
        ];

        // The actual data to be signed
        const pollData = {
          title: this.title,
          polltaker_account: this.userAddress,
          description: this.description,
          valid_event_ids: this.valid_events.map((event) => event.id),
          poll_options: this.poll_options,
          end_date: this.end_date,
        };

        // Format data and get user's signature
        const signature = await this.getSignature('Poll', dataFormat, pollData, this.userAddress);

        // Generate object to send to server
        const payload = {
          ...pollData,
          attestation: signature,
        };
        console.log('Server payload: ', payload);

        // Create poll
        console.log('Sending POST request to server to create poll...');
        response = await this.$serverApi.post('/api/polls', payload);
        console.log('Server response: ', response);
      } catch (err) {
        this.isLoading = false;
        this.showError(err, 'Unable to create poll, please try again. ');
      }

      try {
        // Get updated poll list and redirect to details page of the new poll
        await this.$store.dispatch('poap/getPolls');
        this.$router.push({ name: 'results', params: { id: response.data.id } });
      } catch (err) {
        this.isLoading = false;
        this.showError(err, 'Unable to fetch new poll. Please refresh the page and find your poll on the home page.');
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.section-header {
  color: $secondary
  text-align: left
}
</style>
