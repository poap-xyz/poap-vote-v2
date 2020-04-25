export function setEvents(state, events) {
  state.events = events;
}

export function setPolls(state, polls) {
  state.activePolls = polls.activePolls;
  state.completedPolls = polls.completedPolls;
}

export function setSelectedPoll(state, pollData) {
  state.selectedPoll = pollData.poll;
  state.selectedPollVotes = pollData.votes;
}
