<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const props = defineProps({
  onSelect: Function
})

const aboutAPI = "/api/about"
const projectAPI = "http://localhost:3001/api/project"
const partnerAPI = "http://localhost:3001/api/partner"

const aboutData = ref([])
const projectData = ref([])
const partnerData = ref([])
const loading = ref(false)
const error = ref(null)

const router = useRouter()

const fetchData = async () => {
  try {
    loading.value = true
    const [aboutRes, projectRes, partnerRes] = await Promise.all([
      axios.get(aboutAPI),
      axios.get(projectAPI),
      axios.get(partnerAPI)
    ])

    // console.log(aboutRes.data.dataInfo)
    
    aboutData.value = aboutRes.data.dataInfo
    projectData.value = projectRes.data.dataInfo.projectList
    partnerData.value = partnerRes.data.dataInfo
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">대시보드</h2>
        
        <!-- 소개글 섹션 -->
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <span class="text-h6 font-weight-bold" to="/admin/about" style="cursor: pointer;">소개글 (적용중)</span>
            <v-btn
              color="black"
              class="ml-4"
              to="/admin/about/create"
            >
              추가
            </v-btn>
          </v-card-title>
          <v-table>
            <tbody>
              <tr
                v-for="row in aboutData"
                :key="row.ID"
                @click="router.push(`/admin/about`)"
                style="cursor: pointer"
              >
                <td class="text-center title-cell" width="30%">{{ row.TITLE }}</td>
                <td class="text-left subtitle-cell">{{ row.SUB_TITLE }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- 프로젝트 섹션 -->
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <span class="text-h6 font-weight-bold" to="/admin/project" style="cursor: pointer;">프로젝트 (적용중)</span>
            <v-btn
              color="black"
              class="ml-4"
              to="/admin/project/create"
            >
              추가
            </v-btn>
          </v-card-title>
          <client-only> 
            <v-slide-group
              show-arrows
              class="pa-4"
            >
              <v-slide-group-item
                v-for="project in projectData"
                :key="project.ID"
            >
              <v-card
                class="ma-4"
                  width="250"
                  @click="router.push(`/admin/project`)"
                >
                <v-img
                  :src="project.PROJECT_IMG"
                  height="200"
                  cover
                ></v-img>
                <v-card-title class="text-center">
                  {{ truncateText(project.TITLE, 10) }}
                </v-card-title>
              </v-card>
              </v-slide-group-item>
            </v-slide-group>
          </client-only>
        </v-card>

        <!-- 협력사 섹션 -->
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <span class="text-h6 font-weight-bold" to="/admin/partner" style="cursor: pointer;">협력사 배너 (적용중)</span>
            <v-btn
              color="black"
              class="ml-4"
              to="/admin/partner/create"
            >
              추가
            </v-btn>
          </v-card-title>
          <v-slide-group
            show-arrows
            class="pa-4"
          >
            <v-slide-group-item
              v-for="partner in partnerData"
              :key="partner.ID"
            >
              <v-card
                class="ma-4"
                width="200"
                @click="router.push(`/admin/partner`)"
              >
                <v-img
                  :src="partner.PARTNER_IMG"
                  height="100"
                  contain
                  class="ma-4"
                ></v-img>
                <v-card-title class="text-center">
                  {{ truncateText(partner.PARTNER_NM, 10) }}
                </v-card-title>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.title-cell {
  border-right: 1px solid rgba(0, 0, 0, 0.12); /* 수직 구분선 추가 */
  padding-right: 16px; /* 구분선과 텍스트 사이 여백 */
}
.subtitle-cell {
  padding-left: 16px; /* 구분선과 텍스트 사이 여백 */
}
</style>
