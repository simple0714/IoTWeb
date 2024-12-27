import { defineStore } from 'pinia'
import axios from 'axios'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projectData: [],
    stackData: [],
    error: null
  }),

  actions: {
    async fetchProjectData(retryCount = 3) {
      try {
        const { data } = await axios.get('http://localhost:3001/api/project', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        // console.log("프로젝트 데이터",data)
        if (data.dataInfo?.projectList) {
          this.projectData = data.dataInfo.projectList
          // console.log('프로젝트 데이터:', this.projectData)
        }
      } catch (error) {
        if (retryCount > 0) {
          console.log(`프로젝트 데이터 로딩 실패. 재시도 중... 남은 시도 횟수: ${retryCount}`)
          await this.fetchProjectData(retryCount - 1)
        } else {
          console.error('프로젝트 데이터 로딩 실패:', error)
        }
      } 
    },

    async fetchStackData(retryCount = 3) {
      try {
        const { data } = await axios.get('http://localhost:3001/api/stack', {
          method: 'GET'
        })
        // console.log("스택 데이터",data)
        if (data) {
          this.stackData = data
          // console.log('스택 데이터:', this.stackData)
        }
        
      } catch (error) {
        if (retryCount > 0) {
          console.log(`스택 데이터 로딩 실패. 재시도 중... 남은 시도 횟수: ${retryCount}`)
          await this.fetchStackData(retryCount - 1)
        } else {
          console.error('스택 데이터 로딩 실패:', error)
        }
      }
    }
  }
})