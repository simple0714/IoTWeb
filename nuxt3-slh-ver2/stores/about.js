import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectedAboutId = defineStore('selectedAboutId', () => {
  const selectedAboutId = ref(null)

  return {
    selectedAboutId
  }
})