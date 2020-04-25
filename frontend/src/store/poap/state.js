export default function () {
  return {
    events: [],
    activePolls: [],
    completedPolls: [],
    selectedPoll: undefined, // poll being viewed by user
    selectedPollVotes: undefined, // votes for poll being viewed by user
  };
}
