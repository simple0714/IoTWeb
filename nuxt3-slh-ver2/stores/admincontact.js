import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectedContactId = defineStore('selectedContactId', () => {
  const selectedId = ref(null)

  const setSelectedId = (id) => {
    selectedId.value = id
  }

  return {
    selectedId,
    setSelectedId
  }
})