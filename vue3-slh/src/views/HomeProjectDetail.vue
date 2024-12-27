<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '../stores/project'
import Swiper from 'swiper'
import { Navigation,Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation' 
import 'swiper/css/autoplay'

const route = useRoute()
const projectStore = useProjectStore()
const info = ref(null)
const files = ref([])
let swiper = null

const formatStack = (stackString) => {
  try {
    const stackObj = JSON.parse(stackString)
    return stackObj.stack
  } catch (e) {
    console.error('Failed to format stack:', e)
    return []
  }
}

// project store에 단건 조회 action 추가 필요
onMounted(async () => {
  try {
    const response = await projectStore.fetchProjectOneData(route.params.projectNb)
    if (response?.dataInfo) {
      info.value = response.dataInfo.projectInfo
      files.value = response.dataInfo.projectFiles
    }

    // DOM이 업데이트된 후 Swiper 초기화
    await nextTick()
    if (files.value.length > 0) {  // 파일이 있을 때만 Swiper 초기화
      swiper = new Swiper('.swiper', {  
        modules: [Pagination, Autoplay, Navigation],
        slidesPerView: 4,
        spaceBetween: 10,
        centeredSlides: false,
        loop: true,  // loop 활성화
        // 네비 버튼
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
          1100: { slidesPerView: 3 },
        },
      })
    }
  } catch (error) {
    console.error('프로젝트 상세 데이터 로딩 에러:', error)
  }
})
</script>

<template>
  <main>
    <section v-if="info" id="project01" class="section">
      <div class="wrap">
        <div class="title">
          <div class="text">
            {{ info?.TITLE }}<br/>
            <span>{{ info?.SUB_TITLE }}</span>
          </div>
          <div class="stack">{{ formatStack(info.STACK).join(' / ') }}</div>
        </div>

        <ul class="list">
          <img :src="info.PROJECT_IMG" alt="" />
          <div class="explain">
            {{ info.PROJECT_INFO }}
          </div>
        </ul>

        <span class="app">*실제 사용 시 어플리케이션 이미지</span>
        <div class="swiper-container">
          <div class="swiper">
            <div class="swiper-wrapper">
              <div v-for="(item, index) in files" :key="index" class="swiper-slide">
                <img :src="item.PROJECT_IMG" alt="" />
              </div>
            </div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-pagination"></div>
          </div>
        </div>
      </div>
    </section>
    <p v-else>Loading...</p>
  </main>
</template>

<style scoped>
main {
  padding-bottom: 20vw;
}
main #project01 .title {
  text-align: center;
  padding: 7vw 0px;
}
main #project01 .title .text {
  font-size: 2.3rem;
  font-weight: bold;
  transition: all 0.3s 0s;
}
main #project01 .title .text span {
  font-size: 18px;
}
main #project01 .title .stack {
  padding-top: 2rem;
  transition: all 0.3s 0s;
  opacity: 0.5;
}
main #project01 .list {
  display: inline-grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-gap: 3vw;
  padding-bottom: 7vw;
}
main #project01 .list img {
  width: 100%;
  max-height: 500px;
  transition: all 0.3s 0s;
}
main #project01 .list .explain {
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
.swiper .swiper-wrapper .swiper-slide img {
  width: 100%;
}
.swiper-pagination {
  position: relative;
}

@media only screen and (max-width: 1100px) {
  main #project01 .title .text {
    font-size: 1.8rem;
  }
  main #project01 .title .stack {
    padding-top: 10px;
  }
  main #project01 .list .explain {
    font-size: 17px;
  }
}
@media only screen and (max-width: 800px) {
  main #project01 .title .text {
    font-size: 20px;
  }
  main #project01 .title .text span {
    font-size: 15px;
  }
}
@media only screen and (max-width: 700px) {
  main #project01 .title .text {
    font-size: 20px;
    line-height: 26px;
  }
  main #project01 .list .explain {
    font-size: 16px;
  }
}
@media only screen and (max-width: 600px) {
  main #project01 .title {
    text-align: left;
    padding: 7vw 10px 2vw;
  }
  main #project01 .list {
    grid-template-columns: 1fr;
    padding-bottom: 10vw;
  }
  main #project01 .list img {
    max-height: 350px;
  }
}
@media only screen and (max-width: 400px) {
  main #project01 .title .text {
    font-size: 17px;
    line-height: 25px;
  }
  main #project01 .title .text span {
    font-size: 13px;
  }
  main #project01 .title .stack {
    font-size: 13px;
  }
  main #project01 .list img {
    max-height: 230px;
  }
  main #project01 .list .explain {
    padding: 0px 5px;
  }
}
/* 스와이퍼 컨테이너 스타일 추가 */
.swiper-container {
  position: relative;
  width: 100%;
  padding: 0 20px;  /* 네비게이션 버튼을 위한 여백 */
}

.swiper {
  position: relative;
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
}

.swiper-slide img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* 네비게이션 버튼 스타일 수정 */
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
  z-index: 10;  /* 이미지 위에 표시되도록 z-index 추가 */
  cursor: pointer;
}

.swiper-button-prev {
  left: 10px;
}

.swiper-button-next {
  right: 10px;
}

/* 네비게이션 버튼 화살표 크기 조정 */
.swiper-button-prev:after,
.swiper-button-next:after {
  font-size: 18px;
  font-weight: bold;
}

/* 호버 효과 */
.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

/* 페이지네이션 위치 조정 */
.swiper-pagination {
  position: relative;
  margin-top: 20px;
}

/* 반응형 디자인 */
@media only screen and (max-width: 768px) {
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
</style>