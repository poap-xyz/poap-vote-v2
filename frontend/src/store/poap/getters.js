/**
 * @notice Returns the total number of votes
 */
function getTotalVotes(state) {
  // Flatten votes into array of the option IDs amd get total number of votes
  if (!state.selectedPollVotes) return undefined;
  let voteArray = [];
  state.selectedPollVotes.forEach((vote) => {
    voteArray = [...voteArray, ...(new Array(vote.token_ids.length)).fill(vote.poll_option_id)];
  });
  return voteArray.length;
}

/**
 * @notice Returns object where key is vote ID and value is total votes for that option
 */
function getVoteCounts(state) {
  // Get the count, i.e. number of times a vote was cast
  if (!state.selectedPollVotes) return undefined;
  // Get counts
  let voteArray = [];
  state.selectedPollVotes.forEach((vote) => {
    voteArray = [...voteArray, ...(new Array(vote.token_ids.length)).fill(vote.poll_option_id)];
  });
  const counts = voteArray.reduce((acc, val) => {
    if (acc[val] === undefined) acc[val] = 1;
    else acc[val] += 1;
    return acc;
  }, {});
  // Add missing elements (i.e. options with zero votes)
  state.selectedPoll.poll_options.forEach((option) => {
    if (!counts[option.id]) counts[option.id] = 0;
  });
  return counts;
}

/**
 * @notice Returns object where key is vote ID is the key and value is its percentage
 */
function getVotePercentages(state) {
  // Setup output object to ensure all fields (even those with zero votes) are present
  if (!state.selectedPollVotes) return undefined;
  const percentages = {};
  state.selectedPoll.poll_options.forEach((option) => {
    percentages[option.id] = 0;
  });
  // Convert vote count to percentages
  const voteCounts = getVoteCounts(state);
  Object.keys(voteCounts).forEach((key) => {
    percentages[key] = voteCounts[key] / getTotalVotes(state);
  });
  return percentages;
}

/**
 * @notice Returns various vote data for the selected poll
 */
export function voteData(state) {
  const totalVotes = getTotalVotes(state);
  const voteCounts = getVoteCounts(state);
  const votePercentages = getVotePercentages(state);

  return { totalVotes, voteCounts, votePercentages };
}

/**
 * @notice Returns event data for the selected poll
 */
export function selectedPollEvents(state) {
  // Get list of all event IDs
  if (!state.selectedPoll) return undefined;
  const eventIds = state.selectedPoll.valid_event_ids;
  // Get an array of all events
  const eventArray = state.events.filter((event) => eventIds.includes(event.id));
  return eventArray;
}
