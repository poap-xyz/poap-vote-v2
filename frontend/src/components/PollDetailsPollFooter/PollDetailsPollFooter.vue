<template>
  <div class="footer-container">
    <!-- Poll active -->
    <div v-if="typePoll !== 'finished'">
      <div
        v-if="!userAddress && isPollOngoing"
      >
        <connect-wallet
          label="Connect your wallet to vote"
        />
      </div>

      <div v-if="userAddress && !hasUserVoted">
        <base-button
          id="submitVote"
          color="primary"
          class="primary-btn-with-arrow"
          :outline="optionSelected && canUserVote"
          :unelevated="optionSelected && canUserVote"
          :background="optionSelected && canUserVote ? 'white' : ''"
          :disabled="!optionSelected || !canUserVote"
          :loading="isVoteSubmissionLoading"
          :label="!optionSelected && canUserVote ? 'Choose an option' : 'Place your vote'"
          :icon="optionSelected && canUserVote ?
            require('../../assets/icons/arrow-right-icon.svg') : ''"
          @click="() => !optionSelected || !canUserVote ? {} : submitVote()"
        />
      </div>
    </div>

    <!-- Vote button -->
    <div
      v-if="hasUserVoted"
      class="flex items-center"
    >
      <span class="circle-check-icon" />
      <span class="text-subtitle1 primary user-vote">You voted</span>
    </div>

    <div class="poll-results">
      <span
        v-if="totalVotes"
        class="col-auto text-subtitle2 dark-grey text-weight-regular"
      >
        {{ totalVotes.totalVotes }} <span>total vote</span><span v-if="totalVotes !== 1">s</span>
        ({{ votes.length + ' address' + (votes.length > 1 ? 'es' : '') }})
      </span>
      <button
        v-if="typePoll !== 'finished'"
        class="poll-results-button text-subtitle2 text-weight-regular"
        @click="toggleShowResults"
      >
        {{ showResults ? 'Hide ' :'Show ' }}
        current results
      </button>
    </div>
  </div>
</template>

<style src="./style.scss" lang="scss" scoped></style>
