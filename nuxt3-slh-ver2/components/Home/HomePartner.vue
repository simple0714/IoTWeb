<script setup>
import { usePartnerStore } from '~/stores/partner'
import { computed } from 'vue'

const partnerStore = usePartnerStore()

const extendedPartnerData = computed(() => {
  const partnerData = partnerStore.partnerData || []
  return [
    ...partnerData,
    ...partnerData,
    ...partnerData
  ]
})
</script>

<template>
  <div class="animation">
    <ul class="banner">
      <!-- <li v-for="partner in extendedPartnerData" :key="partner.PARTNER_NM">
        <img :src="partner.PARTNER_IMG" alt="">
      </li> -->
      <li v-for="partner in extendedPartnerData" :key="partner.PARTNER_NM">
        <template v-if="partner.PARTNER_IMG === 'NO_IMG'">
          <div class="partner-name">{{ partner.PARTNER_NM }}</div>
        </template>
        <template v-else>
          <img :src="partner.PARTNER_IMG" :alt="partner.PARTNER_NM">
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.animation {
  width: 100%;
  overflow: hidden;
  position: relative; /* 추가 */
}

.banner {
  display: flex;
  white-space: nowrap;
  animation: roll 40s linear infinite;
}

.banner li {
  flex-shrink: 0; /* 추가 */
  padding: 0 20px;
}

.banner li img {
  max-width: 140px;
  max-height: 40px;
  width: auto;
  height: auto;
}

.partner-name {
  font-size: 1.2rem;
  padding: 1rem;
  text-align: center;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

@keyframes roll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@media screen and (max-width: 768px) {
  .banner li img {
    max-width: 100px;
    max-height: 30px;
  }
}

</style>
