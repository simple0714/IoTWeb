import { defineStore } from 'pinia'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001'
})

export const usePartnerStore = defineStore('partner', {
  state: () => ({
    partnerData: [],
  }),
  actions: {
    async fetchPartnerData() {
      try{
        const response = await axiosInstance.get('/apis/partner/list')
        this.partnerData = response.data.dataInfo
      } catch (error) {
        console.error('파트너 데이터 로딩 에러:', error)
      }
    }
  }
})
