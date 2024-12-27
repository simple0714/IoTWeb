import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePwFindStore = defineStore('pwFind', () => {
  const isAuthenticated = ref(false)
  const userId = ref('')

  const setAuth = (id) => {
    isAuthenticated.value = true
    userId.value = id
  }

  const clearAuth = () => {
    isAuthenticated.value = false
    userId.value = ''
  }

  return { isAuthenticated, userId, setAuth, clearAuth }
})