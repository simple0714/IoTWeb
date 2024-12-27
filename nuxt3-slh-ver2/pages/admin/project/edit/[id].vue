<script setup>
import { ref, computed, h, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'

//기본 컴포넌트
import AdminHeader from '~/components/Admin/AdminHeader.vue'
import AdminNav from '~/components/Admin/AdminNav.vue'
import AdminUpdateProject from '~/components/Admin/AdminUpdateProject.vue'

const display = useDisplay()
const route = useRoute()
const drawerWidth = 240
const drawer = ref(true)
const id = route.params.id

const handleDrawerToggle = () => {
  drawer.value = !drawer.value
}

onMounted(() => {
  display.value = useDisplay()
  // 마운트 된 후에 drawer 상태 업데이트
  drawer.value = !display.value?.mdAndDown.value
})

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true 
})
</script>

<template>
  <v-app>

    <v-app-bar
      :elevation="0"
      color="black"
      :class="{ 'pl-0': !display.mdAndDown.value }"
    >
      <v-app-bar-nav-icon
        v-if="display.mdAndDown.value"
        @click="handleDrawerToggle"
      ></v-app-bar-nav-icon>
      <!-- 헤더 -->
      <AdminHeader />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :permanent="!display.mdAndDown.value"
      :temporary="display.mdAndDown.value"
      :width="drawerWidth"
      app
      color="white"
      location="left"
      elevation="1"
    >
    <!-- 네비바 -->
      <AdminNav 
        :drawer="drawer"
        :onDrawerToggle="handleDrawerToggle"
      />
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <!-- 대시보드-->
        <AdminUpdateProject :id="id" />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  padding-top: 64px;
}

.v-navigation-drawer {
  top: 64px !important;
  height: calc(100% - 64px) !important;
}

@media (max-width: 960px) {
  .v-navigation-drawer {
    top: 0 !important;
    height: 100% !important;
  }
}
</style>

