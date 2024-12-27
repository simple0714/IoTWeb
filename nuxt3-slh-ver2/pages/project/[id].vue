<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Swiper 스타일
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

const route = useRoute()
const projectNb = parseInt(route.params.id)
const data = ref(null)
const loading = ref(true)
const error = ref(null)

const formatStack = (stackString) => {
  try {
    const stackObj = JSON.parse(stackString)
    return stackObj.stack
  } catch (e) {
    console.error('Failed to format stack:', e)
    return []
  }
}

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    error.value = null
    const response = await axios.get(`/api/project/findOne`, {
      params: { projectNb }
    })
    data.value = response.data.dataInfo
    // console.log('프로젝트 데이터:', data.value)

    if (data.value.projectFiles) {
      data.value.projectFiles.sort((a, b) => a.SORT - b.SORT)
    }
  } catch (e) {
    error.value = e
    console.error('프로젝트 데이터 로딩 실패:', e)
  } finally {
    loading.value = false
  }
}



// Swiper 설정
const swiperOptions = {
  modules: [Navigation, Pagination, Autoplay],
  slidesPerView: 4,
  spaceBetween: 10,
  centeredSlides: false,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    enabled: true,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: (index, className) => {
      return `<span class="${className}" style="margin: 0px 5px; width: 10px; height: 10px; border-radius: 100%;"></span>`
    },
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    300: { slidesPerView: 1 },
    400: { slidesPerView: 1 },
    600: { slidesPerView: 2 },
    800: { slidesPerView: 3 },
    1000: { slidesPerView: 3 },
    1100: { slidesPerView: 3 }
  }
}
</script>

<template>
  <main>
    <section v-if="!loading && data" class="project-section">
      <div class="wrap">
        <div class="title">
          <div class="text">
            {{ data.projectInfo.TITLE }}<br/>
            <span>{{ data.projectInfo.SUB_TITLE }}</span>
          </div>
          <div class="stack">
            {{ formatStack(data.projectInfo.STACK).join(' / ') }}
          </div>
        </div>

        <ul class="list">
          <img :src="data.projectInfo.PROJECT_IMG" alt="">
          <textarea class="explain" readonly v-model="data.projectInfo.PROJECT_INFO"></textarea>
        </ul>

        <span class="app">*실제 사용 시 어플리케이션 이미지</span>

        <div class="swiper-container">
          <Swiper v-bind="swiperOptions">
            <SwiperSlide 
              v-for="file in data.projectFiles" 
              :key="file.ID"
            >
              <img :src="file.PROJECT_IMG" alt="">
            </SwiperSlide>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-pagination"></div>
          </Swiper>
        </div>
      </div>
    </section>
    <div v-else-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>No data available</div>
  </main>
</template>

<style scoped>
main {
  padding-bottom: 20vw;
}

.title {
  text-align: center;
  padding: 7vw 0px;
}

.title .text {
  font-size: 2.3rem;
  font-weight: bold;
  transition: all 0.3s 0s;
}

.title .text span {
  font-size: 18px;
}

.title .stack {
  padding-top: 2rem;
  transition: all 0.3s 0s;
  opacity: 0.5;
}

.list {
  display: inline-grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-gap: 3vw;
  padding-bottom: 7vw;
}

.list img {
  width: 100%;
  max-height: 500px;
  transition: all 0.3s 0s;
}

.list .explain {
  text-align: left;
  font-size: 1.3rem;
  padding: 20px 5px;
  transition: all 0.3s 0s;
}

.app {
  width: 100%;
  padding: 20px 0px;
  transition: all 0.3s 0s;
}

/* 스와이퍼 스타일 */
.swiper-container {
  position: relative;
  width: 100%;
  padding: 0 20px;
}

.swiper-slide img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  color: white;
  z-index: 10;
  cursor: pointer;
}

.swiper-button-prev {
  left: 10px;
}

.swiper-button-next {
  right: 10px;
}

.swiper-button-prev:after,
.swiper-button-next:after {
  font-size: 18px;
  font-weight: bold;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.swiper-pagination {
  position: relative;
  margin-top: 20px;
}

/* 반응형 스타일 */
@media only screen and (max-width: 1100px) {
  .title .text { font-size: 1.8rem; }
  .title .stack { padding-top: 10px; }
  .list .explain { font-size: 17px; }
}

@media only screen and (max-width: 800px) {
  .title .text { font-size: 20px; }
  .title .text span { font-size: 15px; }
  .swiper-button-prev,
  .swiper-button-next {
    width: 30px;
    height: 30px;
  }
  .swiper-button-prev:after,
  .swiper-button-next:after {
    font-size: 14px;
  }
}

@media only screen and (max-width: 700px) {
  .title .text {
    font-size: 20px;
    line-height: 26px;
  }
  .list .explain { font-size: 16px; }
}

@media only screen and (max-width: 600px) {
  .title {
    text-align: center;
    padding: 7vw 10px 2vw;
  }
  .list {
    grid-template-columns: 1fr;
    padding-bottom: 10vw;
  }
  .list img { max-height: 350px; }
}

@media only screen and (max-width: 400px) {
  .title .text {
    font-size: 24px;
    line-height: 32px;
  }
  .title .text span { font-size: 13px; }
  .title .stack { font-size: 13px; }
  .list img { max-height: 230px; }
  .list .explain { padding: 0px 5px; }
}
</style>