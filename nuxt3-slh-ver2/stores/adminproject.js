import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectedProjectId = defineStore('adminSelectedProjectId', () => {
  const selectedProjectId = ref(null)

  return {
    selectedProjectId
  }
})