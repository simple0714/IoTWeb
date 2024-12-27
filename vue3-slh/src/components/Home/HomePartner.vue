<script setup>
import { usePartnerStore } from '../../stores/partner'
import { onMounted, computed } from 'vue'

const partnerStore = usePartnerStore()

onMounted(async () => {
  await partnerStore.fetchPartnerData()
})

const extendedPartnerData = computed(() => {
  return [
    ...partnerStore.partnerData,
    ...partnerStore.partnerData,
    ...partnerStore.partnerData
  ]
})
</script>

<template>
  <div class="animation">
    <ul class="banner">
      <li v-for="partner in extendedPartnerData" :key="partner.PARTNER_NM">
        <img :src="partner.PARTNER_IMG" alt="">
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
