<script setup>
import HomeHeader from '../components/Home/HomeHeader.vue' // 헤더
import HomeVideo from '../components/Home/HomeVideo.vue' // 비디오
import HomeAbout from '../components/Home/HomeAbout.vue' // 소개
import HomeProject from '../components/Home/HomeProject.vue' // 프로젝트
import HomeContact from '../components/Home/HomeContact.vue' // 컨택
import HomeMap from '../components/Home/HomeMap.vue' // 오시는 길
import HomeFooter from '../components/Home/HomeFooter.vue' // 푸터
</script>

<template>
  <header>
    <HomeHeader />
  </header>
  <main>
    <HomeVideo /> 
    <!-- todo: 비디오 화질 낮춰야함 -->
    <HomeAbout />
    <HomeProject />
    <!-- todo: 디테일 페이지 연결해야함 -->
    <HomeContact />
    <!-- todo: 컨텐트 페이지 연결해야함 -->
    <HomeMap />
  </main>
  <footer>
    <HomeFooter />
  </footer>
</template>

<style scoped>
</style>
