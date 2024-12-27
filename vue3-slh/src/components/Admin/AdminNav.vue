<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const display = useDisplay()
const props = defineProps({
  onSelect: {
    type: Function,
    required: true
  }
})

const openAbout = ref(false)
const openProject = ref(false)
const openPartner = ref(false)

const handleClick = (nav) => {
  props.onSelect(nav)
  if (display.mdAndDown.value) {
    // 모바일에서 메뉴 클릭 시 드로어 닫기
    drawer.value = false
  }
}
</script>

<template>
  <v-list nav>
    <div class="mgtop"> 

      <v-list-item @click="props.onSelect('dashboard')">
        <v-list-item-title class="nav-title">대시보드</v-list-item-title>
      </v-list-item>

      <v-list-item @click="props.onSelect('about')">
        <v-list-item-title class="nav-title">소개글 관리</v-list-item-title>
      </v-list-item>

      <v-list-item @click="props.onSelect('project')">
        <v-list-item-title class="nav-title">프로젝트 관리</v-list-item-title>
      </v-list-item>

      <v-list-item @click="props.onSelect('partner')">
        <v-list-item-title class="nav-title">협력사 배너관리</v-list-item-title>
      </v-list-item>

      <v-list-item @click="props.onSelect('contact')">
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
    padding-top: 16px;
  }
  
  .v-list-item {
    margin-bottom: 8px;
  }
}
</style>