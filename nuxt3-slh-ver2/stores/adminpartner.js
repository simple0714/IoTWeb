import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSelectedPartnerId = defineStore('selectedPartnerId', () => {
  const value = ref(null)
  return { value }
})