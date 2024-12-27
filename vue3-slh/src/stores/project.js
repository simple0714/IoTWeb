import { defineStore } from 'pinia'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001'  // 실제 API 서버 주소로 변경
})

export const useProjectStore = defineStore('project', {
  state: () => ({
    projectData: [],
    stackData: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProjectData() {
      this.loading = true
      try {
        const response = await axiosInstance.get('/apis/project/listAll')
        if (response.data?.dataInfo?.projectList) {
          this.projectData = response.data.dataInfo.projectList
        }
      } catch (error) {
        console.error('프로젝트 데이터 로딩 에러:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchStackData() {
      this.loading = true
      try {
        const response = await axiosInstance.get('/apis/stack')
        if (Array.isArray(response.data)) {
          this.stackData = response.data
        }
      } catch (error) {
        console.error('스택 데이터 로딩 에러:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    // 프로젝트 단건 조회
    async fetchProjectOneData(projectNb) {
      this.loading = true
      try {
          const response = await axiosInstance.get(`/apis/project/findOne?projectNb=${projectNb}`, {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        return response.data
      } catch (error) {
        console.error('프로젝트 상세 데이터 로딩 에러:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    }
  }
})