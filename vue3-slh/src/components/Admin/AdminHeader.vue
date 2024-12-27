<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const adminName = ref('')

onMounted(() => {
  const storedAdminName = localStorage.getItem('adminName')
  if (storedAdminName) {
    adminName.value = storedAdminName
  }
})

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('adminId')
  localStorage.removeItem('adminName')
  router.push('/')
}

const handleHomeClick = () => {
  router.push('/')
}
</script>

<template>
  <v-container class="d-flex align-center justify-end pa-0">
    <span v-if="adminName" class="mr-4 white--text">
      {{ adminName }}님 환영합니다
    </span>
    <v-btn
      text
      @click="handleHomeClick"
      class="mr-4 text-white"
    >
      홈 페이지
    </v-btn>
    <v-btn
      text
      @click="handleLogout"
      class="text-white"
    >
      로그아웃
    </v-btn>
  </v-container>
</template>