<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useIntersectionObserver } from '../../plugins/useIntersectionObserver'

const { isVisible, target } = useIntersectionObserver()

const URL = "http://localhost:3001/apis/about"
const data = ref([])
const loading = ref(false)
const error = ref(null)

const fetchData = async () => {
    try {
        error.value = null
        loading.value = true

        const response = await axios.get(URL)
        data.value = response.data.dataInfo.rows

    } catch(e) {
        error.value = e
    }
    loading.value = false
}

onMounted(() => {
    fetchData()
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
