<template>
  <q-page>
    <div class="layout-container">
      <div class="faq-container">
        <h1 class="purple-title">
          FAQ
        </h1>
        <div>
          <div
            v-for="(faq, index) in faqInfo"
            :key="index"
            class="faq-info-container"
          >
            <div class="image-container">
              <img
                :src="require('../assets/images/faq/faq-image-' + (index + 1) + '.svg')"
                alt=""
              >
            </div>
            <div class="text-container">
              <h2 class="sections-title">
                {{ faq.title }}
              </h2>
              <p class="text-subtitle2 dark-grey">
                {{ faq.descripition }}
              </p>
            </div>
          </div>
          <div class="last-section">
            <div class="image-container">
              <img
                :src="require('../assets/images/faq/faq-image-5.svg')"
                alt=""
              >
            </div>
            <div
              v-for="(faq, index) in faqLastSection"
              :key="index"
            >
              <h2 class="sections-title">
                {{ faq.title }}
              </h2>
              <p class="text-subtitle2 dark-grey">
                {{ faq.descripition }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Vue } from 'vue-property-decorator';

export default class Faq extends Vue {
  faqInfo = [
    {
      img: '../assets/images/built-ethereum.png',
      title: 'What is POAP vote?',
      descripition: `POAP.vote it’s a website part of the POAP ecosystem that gives
        anyone the ability to easily create polls between POAP token holders.`,
    },
    {
      img: '../assets/images/faq/faq-image-2.svg',
      title: 'How do I create a poll?',
      descripition: 'Anyone can create a raffle starting at: https://poap.vote/create',
    },
    {
      img: '../assets/images/faq/faq-image-1.svg',
      title: 'How do participants know the results are not rigged?',
      descripition: `POAP.vote requires users to sign a message using EIP712 and
      stored for verification. Results are fully auditable.`,
    },
    {
      img: '../assets/images/faq/faq-image-1.svg',
      title: 'Do I have to remain attentive to the poll?',
      descripition: `No! Once you signed up by signing a message, you are participating.
        You can visit the poll at any moment to see the results`,
    },
  ];

  faqLastSection = [
    {
      title: 'Do the amounts of POAP increase my voting power?',
      descripition: `POAP.vote registers the amount of POAPs and the amount
      of unique addresses that participate in the poll`,
    },
    {
      title: 'How much does POAP.vote cost?',
      descripition: `POAP.vote is free! It's an open source
        community initiative.`,
    },
  ];
}
</script>

<style lang="scss" scoped>
.faq-container {
  padding-top: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    text-align: center;
    margin-bottom: 70px;
  }
  .faq-info-container {
    display: flex;
    align-items: center;
    margin-bottom: 100px;
    flex-direction: column;
    padding: 0 30px;
    @media(min-width: 768px) {
      flex-direction: row;
      padding: 0;
    }
    &:nth-child(2n) {
      @media(min-width: 768px) {
        flex-direction: row-reverse;
      }
    }
  }
  .last-section {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 40px;
    column-gap: 70px;
    align-items: center;
    padding: 0 30px 40px;
    @media(min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      row-gap: 70px;
      padding: 0;
    }
    .image-container {
      margin: 0 auto;
      @media(min-width: 768px) {
        grid-area: 1 / 1 / 2 / 3;
      }
    }
  }
  .sections-title {
    font-size: 24px;
    line-height: 26px;
    margin-top: 0;
    margin-bottom: 20px;
    font-weight: 700;
    color: $primary;
  }
  .image-container {
    width: 100%;
    padding-bottom: 40px;
    @media(min-width: 768px) {
      width: 50%;
      padding: 0;
    }
    text-align: center;
    img {
      max-width: 220px;
      @media(min-width: 768px) {
        max-width: 300px;
      }
    }
  }
  .text-container {
    width: 100%;
    @media(min-width: 768px) {
      width: 50%;
    }
  }
}

</style>
