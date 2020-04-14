/**
 * @notice This mixin contains generic helper functions
 */

export default {
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
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor(seconds % ((3600 * 24) / 3600));
      const m = Math.floor(seconds % (3600 / 60));
      // const s = Math.floor(seconds % 60);

      const dDisplay = d > 0 ? d + (d === 1 ? ' day' : ' days') : '';
      const hDisplay = h > 0 ? h + (h === 1 ? ' hour' : ' hours') : '';
      const mDisplay = m > 0 ? m + (m === 1 ? ' minute' : ' minutes') : '';
      // const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
      return `${dDisplay}, ${hDisplay}, ${mDisplay}`;
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
  },
};
