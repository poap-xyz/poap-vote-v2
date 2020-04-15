import { serverApi } from 'boot/axios';

const jsonFetch = (url) => fetch(url).then((res) => res.json());

/**
 * @notice GET list of all POAP events from the POAP API
 */
export async function getEvents({ commit }) {
  const events = await jsonFetch('https://api.poap.xyz/events');
  commit('setEvents', events);
}

/**
 * @notice GET list of all polls from our server
 */
export async function getPolls({ commit }) {
  // First we get all polls
  const response = await serverApi.get('/api/polls');
  const allPolls = response.data;

  // Then we split polls between active and completed
  const activePolls = [];
  const completedPolls = [];
  allPolls.forEach((poll) => {
    // Convert timestamps from seconds to milliseconds to simplify use with JS Date object
    poll.start_date *= 1000;
    poll.end_date *= 1000;
    // Check if this poll is active or complete
    const now = (new Date()).getTime();
    if (now >= poll.end_date) completedPolls.push(poll);
    else activePolls.push(poll);
  });

  commit('setPolls', { activePolls, completedPolls });
}
