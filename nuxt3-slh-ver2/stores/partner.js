import { defineStore } from 'pinia'
import axios from 'axios'

export const usePartnerStore = defineStore('partner', {
  state: () => ({
    partnerData: [],
  }),
  actions: {
    async fetchPartnerData(retryCount = 3) {
      try{
        const { data } = await axios.get('http://localhost:3001/api/partner' , {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        // console.log("파트너 데이터 형식 : ",data)
        this.partnerData = data.dataInfo
      } catch (error) {
        if (retryCount > 0) {
          console.log(`파트너 데이터 로딩 실패. 재시도 중... 남은 시도 횟수: ${retryCount}`)
          await this.fetchPartnerData(retryCount - 1)
        } else {
          console.error('파트너 데이터 로딩 실패:', error)
        }
      }
    }
  }
})
