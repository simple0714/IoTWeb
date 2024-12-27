<script setup>
import HomeHeader from '../components/Home/HomeHeader.vue';
import HomeVide from '../components/Home/HomeVide.vue';
import HomeAbout from '../components/Home/HomeAbout.vue';
import HomeProject from '../components/Home/HomeProject.vue';
import HomeContact from '../components/Home/HomeContact.vue';
import HomeMap from '../components/Home/HomeMap.vue';
import HomeFooter from '../components/Home/HomeFooter.vue';
</script>

<template>
  <header>
    <HomeHeader />
  </header>
  <main>
    <HomeVide />
    <HomeAbout />
    <HomeProject />
    <HomeContact />
    <HomeMap />
  </main>
  <footer>
    <HomeFooter />
  </footer>
</template>

<style scoped>
@import '../assets/css/style.css';
</style>
