<template>
  <footer class="footer-wrapper">
    <div
      v-if="isMobile"
      class="image-container"
      :style="{
        'background-image':
          'url(' + require('../../assets/images/hero/'
            + getRandomImageHero + '.jpg'
          ) + ')',
      }"
    />
    <div class="top-section">
      <div class="logo-container">
        <div @click="$router.push({ name: 'home' })">
          <img
            alt="POAP logo"
            class="poap-logo"
            src="../../assets/icons/poap-logo.svg"
          >
        </div>
      </div>
      <div class="about-container">
        <p class="title text-subtitle1 primary text-bold">
          POAP Ecosystem
        </p>
        <ul class="about-list">
          <li>
            <a
              href="https://www.poap.xyz/"
              class="text-subtitle2"
              target="_blank"
            >
              poap.xyz
            </a>
          </li>
          <li>
            <a
              href="https://poap.fun/"
              class="text-subtitle2"
              target="_blank"
            >
              poap.fun
            </a>
          </li>
          <li>
            <a
              href="https://poap.chat/"
              class="text-subtitle2"
              target="_blank"
            >
              poap.chat
            </a>
          </li>
          <li>
            <a
              href="https://poap.gallery/"
              class="text-subtitle2"
              target="_blank"
            >
              poap.gallery
            </a>
          </li>
          <li>
            <a
              href="https://poap.delivery/"
              class="text-subtitle2"
              target="_blank"
            >
              poap.delivery
            </a>
          </li>
          <li>
            <a
              href="https://www.poap.xyz/"
              class="text-subtitle2"
              target="_blank"
            >
              POAP App
            </a>
          </li>
        </ul>
      </div>
      <div class="join-container">
        <p class="title text-subtitle1 primary text-bold">
          Join our community!
        </p>
        <div class="social-container">
          <a
            href="https://twitter.com/poapxyz"
            target="_blank"
          >
            <span class="social-link twitter" />
          </a>
          <a
            href="https://github.com/poapxyz"
            target="_blank"
          >
            <span class="social-link github" />
          </a>
          <a
            href="https://t.me/poapxyz"
            target="_blank"
          >
            <span class="social-link telegram" />
          </a>
          <a
            href="https://discord.com/invite/9s8U8Bn"
            target="_blank"
          >
            <span class="social-link discord" />
          </a>
          <a
            href="https://www.reddit.com/r/poap/"
            target="_blank"
          >
            <span class="social-link reddit" />
          </a>
        </div>
      </div>
    </div>
    <div class="built-on-container">
      <img
        src="../../assets/images/built-ethereum.png"
        alt="built ethereum"
        height="31"
        width="123"
      >
    </div>
  </footer>
</template>

<style src="./style.scss" lang="scss" scoped></style>
