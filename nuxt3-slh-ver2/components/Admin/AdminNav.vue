<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const display = useDisplay()
const props = defineProps({
  drawer: {
    type: Boolean,
    required: true
  },
  onDrawerToggle: {
    type: Function,
    required: true
  }
})

const handleClick = (nav) => {
  if (display.mdAndDown.value) {
    props.onDrawerToggle()
  }
}
</script>

<template>
  <v-list nav>
    <div class="mgtop"> 

      <v-list-item to="/admin" @click="handleClick">
        <v-list-item-title class="nav-title">대시보드</v-list-item-title>
      </v-list-item>

      <v-list-item to="/admin/about" @click="handleClick">
        <v-list-item-title class="nav-title">소개글 관리</v-list-item-title>
      </v-list-item>

        <v-list-item to="/admin/project" @click="handleClick">
        <v-list-item-title class="nav-title">프로젝트 관리</v-list-item-title>
      </v-list-item>

      <v-list-item to="/admin/partner" @click="handleClick">
        <v-list-item-title class="nav-title">협력사 배너관리</v-list-item-title>
      </v-list-item>

      <v-list-item to="/admin/contact" @click="handleClick">
      <v-list-item-title class="nav-title">프로젝트 요청 조회</v-list-item-title>
      </v-list-item>
    </div>
  </v-list>
</template>
<style scoped>
.v-list {
  height: 100%;
  padding-top: 8px;
}

.v-list-item {
  margin-bottom: 4px;
}
.mgtop {
  margin-top: 3rem;
}

/* 모바일에서의 스타일 조정 */
@media (max-width: 960px) {
  .v-list {
    padding-top: 40px;
  }
  
  .v-list-item {
    margin-bottom: 8px;
  }
}
</style>