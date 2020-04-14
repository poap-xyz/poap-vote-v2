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
    // TODO update the lines below once timestamp issue in #23 is resolved
    const endDate = (new Date((new Date(poll.end_date)).getTime() * 1000)).getTime();
    poll.end_date = endDate;
    poll.start_date = (new Date(poll.start_date)).getTime();
    // END TODO

    const now = (new Date()).getTime();
    if (now >= endDate) completedPolls.push(poll);
    else activePolls.push(poll);
  });

  commit('setPolls', { activePolls, completedPolls });
}
