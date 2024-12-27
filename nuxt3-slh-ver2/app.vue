<script setup>
import { useContactStore } from '~/stores/contact'
import { useProjectStore } from '~/stores/project'
import { usePartnerStore } from '~/stores/partner'

const contactStore = useContactStore()
const projectStore = useProjectStore()
const partnerStore = usePartnerStore()

// 앱 시작 시 서비스 데이터 로드
onMounted(async () => {
  try {
    await Promise.all([
      contactStore.fetchServiceData(),
      projectStore.fetchProjectData(),
      projectStore.fetchStackData(),
      partnerStore.fetchPartnerData()
    ])
  } catch (error) {
    console.error('데이터 로드 오류:', error)
  }
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
@font-face {
  font-family: 'Chillax-Variable';
  src: url('/fonts/Chillax-Variable.woff2') format('woff2'),
       url('/fonts/Chillax-Variable.woff') format('woff'),
       url('/fonts/Chillax-Variable.ttf') format('truetype');
}
</style>