import { serverApi } from 'boot/axios';

const jsonFetch = (url) => fetch(url).then((res) => res.json());

/**
 * @notice GET list of all POAP events from the POAP API
 */
export async function getEvents({ commit }) {
  const events = await jsonFetch('https://api-event.poap.xyz');
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
  const activePollsUnsorted = [];
  const completedPolls = [];
  allPolls.forEach((poll) => {
    // Convert timestamps from seconds to milliseconds to simplify use with JS Date object
    poll.start_date *= 1000;
    poll.end_date *= 1000;
    // Check if this poll is active or complete
    const now = (new Date()).getTime();
    if (now >= poll.end_date && poll.end_date > 0) completedPolls.push(poll);
    else activePollsUnsorted.push(poll);
  });

  activePollsUnsorted
    .filter((poll) => poll.end_date !== 0)
    .sort((a, b) => a.end_date - b.end_date)
    .forEach((poll) => activePolls.push(poll));
  activePollsUnsorted
    .filter((poll) => poll.end_date === 0)
    .forEach((poll) => activePolls.push(poll));
  completedPolls.sort((a, b) => b.end_date - a.end_date);

  commit('setPolls', { activePolls, completedPolls });
}

/**
 * @notice Gets details for the poll user is viewing and updates state
 */
export async function getSelectedPoll({ commit }, id) {
  // Get poll data
  const pollResponse = await serverApi.get(`/api/polls/${id}`);

  // Get votes data
  const voteResponse = await serverApi.get(`/api/poll/${id}/votes`);
  const votes = voteResponse.data;

  // Convert timestamps to milliseconds
  const poll = pollResponse.data;
  poll.start_date *= 1000;
  poll.end_date *= 1000;

  commit('setSelectedPoll', { poll, votes });
}
