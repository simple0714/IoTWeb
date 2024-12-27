<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  onSelect: Function
})

const URL = "http://localhost:3001/apis/about"
const URL2 = "http://localhost:3001/apis/project/listAll"
const URL3 = "http://localhost:3001/apis/partner/list"

const aboutData = ref([])
const projectData = ref([])
const partnerData = ref([])
const loading = ref(false)
const error = ref(null)

const fetchData = async () => {
  try {
    loading.value = true
    const [aboutRes, projectRes, partnerRes] = await Promise.all([
      axios.get(URL),
      axios.get(URL2),
      axios.get(URL3)
    ])
    
    aboutData.value = aboutRes.data.dataInfo.rows
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
            <span class="text-h6 font-weight-bold" @click="onSelect('about')" style="cursor: pointer;">소개글 (적용중)</span>
            <v-btn
              color="black"
              class="ml-4"
              @click="onSelect('addabout')"
            >
              추가
            </v-btn>
          </v-card-title>
          <v-table>
            <tbody>
              <tr
                v-for="row in aboutData"
                :key="row.ID"
                @click="onSelect('about')"
                style="cursor: pointer"
              >
                <td class="text-left" width="30%">{{ row.TITLE }}</td>
                <td class="text-left">{{ row.SUB_TITLE }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- 프로젝트 섹션 -->
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <span class="text-h6 font-weight-bold" @click="onSelect('project')" style="cursor: pointer;">프로젝트 (적용중)</span>
            <v-btn
              color="black"
              class="ml-4"
              @click="onSelect('addproject')"
            >
              추가
            </v-btn>
          </v-card-title>
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
                @click="onSelect('project')"
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
        </v-card>

        <!-- 협력사 섹션 -->
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <span class="text-h6 font-weight-bold" @click="onSelect('partner')" style="cursor: pointer;">협력사 배너 (적용중)</span>
            <v-btn
              color="black"
              class="ml-4"
              @click="onSelect('addpartner')"
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
                @click="onSelect('partner')"
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