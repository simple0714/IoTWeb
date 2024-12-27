<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useIntersectionObserver } from '@vueuse/core'

const isVisible = ref(false)
const target = ref(null)

// vue3와 다르게 옵저버 사용, isVisible 상태 변경 시 콜백 함수 실행
useIntersectionObserver(target, ([{ isIntersecting }]) => {
  isVisible.value = isIntersecting
})

const data = ref([])
const error = ref(null)
const loading = ref(false)

const { data: aboutData } = await useFetch('/api/about')

// aboutData가 변경될 때마다 data ref 업데이트
watchEffect(() => {
  if (aboutData.value?.dataInfo) {
    data.value = aboutData.value.dataInfo
  }
})
</script>

<template>
  <div ref="target">
    <section id="page02" class="section" :class="{ view: isVisible }">
        <div class="wrap">
            <div class="component">
                <div class="maintext">About</div>
                <span>" 사람을 위한 실용적인 기술을 만드는 소프트랩 흄 입니다. "</span>
            </div>

            <ul class="grid">
                <li v-for="(item, index) in data" :key="index">
                    <img :src="item.ICON" alt="" />
                    <div class="name">{{ item.TITLE }}</div>
                    <div class="subname">{{ item.SUB_TITLE }}</div>
                </li>
            </ul>
        </div>
    </section>
  </div>
</template>

<style scoped>

</style>
