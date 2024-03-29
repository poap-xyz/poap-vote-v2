/**
 * @notice This mixin contains generic helper functions
 */
import { date, Notify } from 'quasar';

const { formatDate, getDateDiff } = date;

export default {
  data() {
    return {
      now: undefined, // used for calculating time remaining
      windowWidth: 0,
    };
  },

  computed: {
    /**
     * @notice Time remaining until the poll ends
     */
    timeRemaining() {
      // If poll has ended, time remaining is zero
      if (!this.poll) return undefined;
      // Polls without end date
      if (this.poll.end_date === 0) return 0;
      const end = (new Date(this.poll.end_date)).getTime();
      if (this.now >= end) return -1;
      // Otherwise, convert to days/hours/minutes
      const secondsRemaining = (end - this.now) / 1000;
      return this.secondsToTicker(secondsRemaining);
    },

    /**
     * @notice Convert timeRemaining into a bool for convenience
     */
    isPollOngoing() {
      return this.timeRemaining !== -1;
    },

    isMobile() {
      return this.windowWidth < 768;
    },

    isFullDesktop() {
      return this.windowWidth >= 1920;
    },

    getRandomImageHero() {
      const imageArray = [
        'POAP-IMG_City-01-London',
        'POAP-IMG_City-02-Pittsburg',
        'POAP-IMG_City-03-Gibraltar',
        'POAP-IMG_City-04-Berlin',
        'POAP-IMG_City-05-Buenos-Aires',
        'POAP-IMG_City-06-Moscow',
        'POAP-IMG_City-07-Shangai',
        'POAP-IMG_City-08-San-Francisco',
        'POAP-IMG_City-09-Sydney',
        'POAP-IMG_City-10-Rio-de-Janeiro',
        'POAP-IMG_City-11-Toronto',
        'POAP-IMG_City-12-Paris',
        'POAP-IMG_City-13-New-York',
        'POAP-IMG_City-14-Hong-Kong',
        'POAP-IMG_City-15-Valparaiso',
        'POAP-IMG_City-16-Kuala-Lumpur',
        'POAP-IMG_City-17-Rome',
        'POAP-IMG_City-18-Chicago',
        'POAP-IMG_City-19-Dubai',
      ];

      const num = Math.floor(Math.random() * imageArray.length);
      return imageArray[num];
    },
  },

  mounted() {
    this.now = new Date();
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
      if (!seconds) return undefined;
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

      if (d === 0) {
        return `${hDisplay} ${mDisplay}`;
      }
      return `${dDisplay} ${hDisplay}`;
    },

    /**
     * @notice Convert number of seconds to date formatted as 15 Apr 2020 @ 10:30AM
     */
    secondsToFormattedDate(seconds) {
      const ms = seconds; // TODO multiply seconds by 1000 once #23 is fixed
      return `${formatDate(ms, 'DD-MMM-YYYY').toUpperCase()} @ ${formatDate(ms, 'hh:mm A')}`;
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

    /**
     * Show error message to user
     * @param {Any} err Error object thrown
     * @param {Any} msg Optional, fallback error message if one is not provided by the err object
     */
    showError(err, msg = 'An unknown error occurred') {
      console.error(err); // eslint-disable-line no-console
      if (!err) this.notifyUser('negative', msg);
      else if (err.isAxiosError && err.response.data.error) this.notifyUser('negative', err.response.data.error);
      else if (err.message) this.notifyUser('negative', err.message);
      else if (err.msg) this.notifyUser('negative', err.msg);
      else if (typeof err === 'string') this.notifyUser('negative', err);
      else this.notifyUser('negative', msg);
    },

    /**
    * Gets percentage of days completed since the poll started.
    */

    getPercentagePollTime(startDate, endDate) {
      let percentage = 0;
      if (endDate > 0) {
        const totalDays = getDateDiff(endDate, startDate);
        const daysRemaning = getDateDiff(endDate, new Date());
        percentage = Math.round((daysRemaning * 100) / totalDays) / 100;
      }
      return percentage;
    },

    handleResize() {
      this.windowWidth = window.innerWidth;
    },

    toggleBodyClass(addClass, className) {
      const element = document.body;
      if (addClass) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    },
  },
};
