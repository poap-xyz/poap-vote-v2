/**
 * @notice This mixin contains generic helper functions
 */
import { date, Notify } from 'quasar';

const { formatDate } = date;

export default {
  data() {
    return {
      now: undefined, // used for calculating time remaining
    };
  },

  mounted() {
    setInterval(() => this.now = new Date(), 1000); // eslint-disable-line
  },

  methods: {
    /**
     * @dev Source: https://gist.github.com/oleole90/de5e187f3d462e8adf93aa96d04e7f6b
     */
    removeArrayElementByIndex(array, index) {
      return [
        ...array.slice(0, index),
        ...array.slice(index + 1),
      ];
    },

    /**
     * @notice Convert number of seconds to days, hours, minutes
     * @dev https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
     */
    secondsToTicker(seconds) {
      // Convert to days, hours, minutes, seconds
      const roundedSeconds = Math.round(seconds);
      const d = Math.floor(roundedSeconds / (3600 * 24));
      const h = Math.floor((roundedSeconds - (d * 24 * 3600)) / 3600);
      // If showing seconds, change round to floor. Round makes it appear to match better with
      // system clock only showing minutes
      const m = Math.round((roundedSeconds - (d * 24 * 3600) - (h * 3600)) / 60);
      // const s = Math.floor(roundedSeconds - (d * 24 * 3600) - (h * 3600) - (m * 60));

      // Format for display
      const dDisplay = d > 0 ? d + (d === 1 ? ' day' : ' days') : '';
      const hDisplay = h > 0 ? h + (h === 1 ? ' hour' : ' hours') : '';
      const mDisplay = m > 0 ? m + (m === 1 ? ' minute' : ' minutes') : '';
      // const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
      return `${dDisplay} ${hDisplay} ${mDisplay}`;
    },

    /**
     * @notice Convert number of seconds to date formatted as 15 Apr 2020 @ 10:30AM
     */
    secondsToFormattedDate(seconds) {
      const ms = seconds; // TODO multiply seconds by 1000 once #23 is fixed
      return `${formatDate(ms, 'DD MMM YYYY')} @ ${formatDate(ms, 'hh:mm A')}`;
    },

    /**
     * @notice Takes in a number and returns a string version formatted as a percent
     * @param {number, string} value the number to be formatted, e.g. input 3.5 for 3.5%
     * @param {number} maxNumDigits maximum number of digits to show, use 2 to force 2
     * @returns {string} the value formatted as a percent
     */
    formatPercent(value, maxNumDigits = 4) {
      // Return a dash if given an undefined value
      if (value === undefined || value === null || Number.isNaN(value)) {
        return '-%';
      }
      // Convert to a number if given a string
      const numberValue = typeof value === 'string' ? Number(value) : value;
      if (numberValue === undefined || numberValue === null || Number.isNaN(value)) {
        return '-%';
      }
      // Format as percentage
      const val = numberValue * 100;
      const percent = val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: maxNumDigits,
      });
      return `${percent}%`;
    },

    /**
     * Present notification alert to the user
     * @param {string} color alert color, choose positive, negative, warning, info, or others
     * @param {string} message message to display on notification
     */
    notifyUser(color, message) {
      Notify.create({
        color,
        message,
        // If positive, timeout after 5 seconds. Otherwise, show until dismissed by user
        timeout: color.toLowerCase() === 'positive' ? 5000 : 0,
        position: 'top',
        actions: [{ label: 'Dismiss', color: 'white' }],
      });
    },
  },
};
