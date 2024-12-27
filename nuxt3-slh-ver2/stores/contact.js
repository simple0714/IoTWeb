import { defineStore } from 'pinia'
import axios from 'axios'

export const useContactStore = defineStore('contact', {
  state: () => ({
    orgNm: '',
    name: '',
    phone: '',
    email: '',
    budget: '',
    schedule: '',
    description: '',
    selectedServices: [],
    serviceError: null,
    errors: {},
    loading: false,
    error: null,
    // 서비스 데이터
    serviceData: [],
  }),

  actions: {
    async submitContactForm() {
      this.loading = true
      this.errors = {}

      // 유효성 검사
      this.errors.orgNm = this.orgNm ? null : '회사 또는 기관명을 입력해주세요'
      this.errors.name = this.name ? null : '담당자명을 입력해주세요'
      this.errors.phone = /^\d{10,11}$/.test(this.phone) ? null : '연락처는 10~11자리를 입력해주세요'
      this.errors.email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.email) ? null : '유효한 이메일 주소를 입력해주세요'
      this.errors.budget = this.budget ? null : '예산을 입력해주세요'
      this.errors.schedule = this.schedule ? null : '일정을 입력해주세요'
      this.errors.description = this.description ? null : '구상중인 내용을 입력해주세요'
      this.serviceError = this.selectedServices.length ? null : '최소 하나의 서비스를 선택해주세요'

      if (Object.values(this.errors).every(error => error === null) && !this.serviceError) {
        const jsonData = {
          orgNm: this.orgNm,
          name: this.name,
          phone: this.phone,
          email: this.email,
          budget: this.budget,
          schedule: this.schedule,
          description: this.description,
          service: this.selectedServices
        }

        try {
          const response = await axios.post('/api/contact', jsonData)
          // console.log('서버 응답:', response.data)
          return response.data
        } catch (error) {
          console.error('제출 오류:', error)
          this.error = error
        } finally {
          this.loading = false
        }
      } else {
        this.loading = false
        return null
      }
    },
    // 서비스 데이터 불러오기
    async fetchServiceData(retryCount = 3) {
      // console.log('서비스 데이터 불러오기')
      try {
        const response = await axios.get('http://localhost:3001/api/service',{
          headers: {
            'Content-Type': 'application/json'
          }
        })
        // console.log('서비스 데이터 불러오기 응답:', response)
        this.serviceData = response.data.dataInfo
      } catch (error) {
        if (retryCount > 0) {
          console.log(`서비스 데이터 로딩 실패. 재시도 중... 남은 시도 횟수: ${retryCount}`)
          await this.fetchServiceData(retryCount - 1)
        } else {
          console.error('서비스 데이터 로딩 실패:', error)
        }
      }
    },
  }
})