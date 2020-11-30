<template>
  <header :class="`header-wrapper ${theme}`">
    <div
      class="navbar-brand is-desktop"
      @click="() => handleScrollToTop()"
    >
      <img
        alt="Ethereum logo"
        class="poap-logo"
        src="../../assets/icons/poap-logo.svg"
      >
      <h2>POAP Vote</h2>
    </div>
    <ul class="navbar-nav">
      <li :class="`navbar-item ${$store.state.user.userAddress ? '' : 'btn-container'}`">
        <div
          v-if="$store.state.user.userAddress"
          class="user-content"
        >
          <poap-popover :no-poaps="!$store.state.user.tokens.length ? true : false">
            <template slot="reference">
              <div class="address-content">
                <img
                  v-if="userImage"
                  :src="userImage"
                  alt="address image"
                  class="user-image"
                >
                <span>
                  {{
                    isMobile
                      ? $store.state.user.userAddress.slice(0, 6) + '...'
                        + $store.state.user.userAddress.slice(-4)
                      : $store.state.user.userAddress
                  }}
                </span>
                <poap-event-group
                  v-if="!isMobile"
                  :without-tooltip="true"
                  :event-group="$store.state.user.tokens && $store.state.user.tokens.length
                    ? $store.state.user.tokens : []"
                />
              </div>
            </template>
            <div
              slot="content"
              class="poaps-container"
            >
              <p class="title-popover">
                My POAPs
              </p>
              <div class="poaps-content">
                <div
                  v-if="!$store.state.user.tokens.length"
                  class="empty-tokens"
                >
                  No POAPs found
                </div>
                <div
                  v-else
                  class="tokens-scroller"
                >
                  <div class="tokens-card-container">
                    <a
                      v-for="item in $store.state.user.tokens"
                      :key="item.tokenId"
                      :href="'https://app.poap.xyz/token/'+item.tokenId"
                      class="image-container"
                      target="_blank"
                    >
                      <img
                        :src="item.event.image_url"
                        alt=""
                      >
                    </a>
                  </div>
                  <div class="spacer" />
                </div>
              </div>
              <base-button
                color="primary"
                label="Disconnect Wallet"
                unelevated
                outline
                @click="() => { onDisconnect() }"
              />
            </div>
          </poap-popover>
        </div>
        <connect-wallet
          v-else
          label="Connect wallet"
          :hide-icon="true"
        />
      </li>
      <li class="navbar-item faq">
        <router-link
          to="/faq"
          class="nav-link primary"
        >
          FAQ
        </router-link>
      </li>
    </ul>
  </header>
</template>

<style src="./style.scss" lang="scss" scoped></style>
