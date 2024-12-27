<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const projectApi = "/api/project"
const deleteProjectApi = "/api/project/delete"

const data = ref([])
const loading = ref(false)
const error = ref(null)
const dialog = ref(false)
const dialogProps = reactive({
  title: '',
  message: '',
  mode: 'alert',
  action: null
})

// 페이지네이션 관련 상태 추가
const page = ref(1)
const itemsPerPage = 5
const searchTerm = ref("")
const filteredResults = ref([])
const isSearchClicked = ref(false)

// computed 속성 수정
const pageCount = computed(() => {
  const projects = isSearchClicked.value ? filteredResults.value : data.value
  if (!projects || projects.length === 0) return 0
  return Math.ceil(projects.length / itemsPerPage)
})

const displayedProjects = computed(() => {
  const projects = isSearchClicked.value ? filteredResults.value : data.value
  if (!projects || projects.length === 0) return []
  
  // 최신순 정렬
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(b.CREATE_AT) - new Date(a.CREATE_AT)
  )
  
  return sortedProjects.slice(
    (page.value - 1) * itemsPerPage, 
    page.value * itemsPerPage
  )
})

const fetchData = async () => {
  try {
    error.value = null
    loading.value = true
    const response = await axios.get(projectApi)
    // console.log('API Response:', response.data)
    
    if (response.data?.dataInfo?.projectList) {
      data.value = response.data.dataInfo.projectList
      filteredResults.value = response.data.dataInfo.projectList
    } else {
      console.error('Invalid API response structure:', response.data)
      error.value = new Error('Invalid API response structure')
    }
  } catch (e) {
    console.error('Error fetching data:', e)
    error.value = e
  } finally {
    loading.value = false
  }
}

// 검색 기능 추가
const handleSearch = async () => {
  if (!searchTerm.value || searchTerm.value.trim() === '') {
    // 검색어가 없을 때
    await fetchData()  // 데이터 다시 불러오기
    isSearchClicked.value = false  // 검색 상태 초기화
    page.value = 1  // 페이지 초기화
    return
  }
  
  // 기존 검색 로직
  if (!data.value) return
  
  const results = data.value.filter(
    (project) =>
      project.PROJECT_INFO?.includes(searchTerm.value) ||
      project.CREATE_AT?.includes(searchTerm.value)
  )
  filteredResults.value = results
  isSearchClicked.value = true
  page.value = 1
}

onMounted(() => {
  fetchData()
})

const showConfirmDialog = (title, message, confirmAction) => {
  dialogProps.title = title
  dialogProps.message = message
  dialogProps.mode = 'confirm'
  dialogProps.action = confirmAction
  dialog.value = true
}

const showAlertDialog = (title, message) => {
  dialogProps.title = title
  dialogProps.message = message
  dialogProps.mode = 'alert'
  dialogProps.action = null
  dialog.value = true
}

const handleDelete = async (id) => {
  showConfirmDialog(
    "프로젝트 삭제",
    "정말로 이 프로젝트를 삭제하시겠습니까?",
    async () => {
      try {
        dialog.value = false
        const response = await axios.delete(`${deleteProjectApi}?projectNb=${id}`)
        
        if (!response.data.error) {
          await fetchData()
          showAlertDialog("성공", "프로젝트가 성공적으로 삭제되었습니다.")
        } else {
          showAlertDialog("오류", `프로젝트 삭제에 실패했습니다: ${response.data.error}`)
        }
      } catch (error) {
        console.error("Error deleting project:", error)
        showAlertDialog("오류", "프로젝트 삭제 중 오류가 발생했습니다.")
      }
    }
  )
}

const handleUpdate = (projectNb) => {
  // store 사용 대신 직접 라우팅
  router.push(`/admin/project/edit/${projectNb}`)
}
const handleClearSearch = (value) => {
  if (!value) {
    isSearchClicked.value = false
    filteredResults.value = data.value
  }
}
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">프로젝트 조회</h2>
        
        <div class="search-area mb-4">
          <div class="search-container">
            <v-text-field
              v-model="searchTerm"
              placeholder="프로젝트명 검색"
              density="compact"
              class="search-field"
              @keyup.enter="handleSearch"
              clearable
              @update:model-value="handleClearSearch"
              hide-details
            />
            <v-btn
              color="black"
              @click="handleSearch"
              class="search-button"
              height="40"
            >
              검색
            </v-btn>
          </div>
          <v-btn
            color="black"
            class="add-button"
            height="40"
            to="/admin/project/create"
          >
            추가
          </v-btn>
        </div>

        <v-table>
          <thead>
            <tr>
              <th class="text-center">이미지</th>
              <th class="text-center">프로젝트명</th>
              <th class="text-center hide-sm-and-down">Stack</th>
              <th class="text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            <!-- 실제 프로젝트 데이터 행 -->
            <tr v-for="project in displayedProjects" :key="project.PROJECT_NB" class="project-row">
              <td class="text-center">
                <v-img
                  :src="project.PROJECT_IMG"
                  max-width="100"
                  height="60"
                  class="mx-auto"
                  contain
                />
              </td>
              <td class="text-center">
                <div class="truncate-text">{{ project.TITLE }}</div>
              </td>
              <td class="text-center hide-sm-and-down">
                <div class="truncate-text">
                  {{ JSON.parse(project.STACK).stack.join(", ") }}
                </div>
              </td>
              <td>
                <div class="d-flex justify-center gap-2">
                  <v-btn
                    color="grey-darken-3"
                    class="white--text small-button"
                    @click="handleUpdate(project.PROJECT_NB)"
                  >
                    수정
                  </v-btn>
                  <v-btn
                    color="grey-darken-3"
                    class="white--text small-button"
                    @click="handleDelete(project.PROJECT_NB)"
                  >
                    삭제
                  </v-btn>
                </div>
              </td>
            </tr>
            <!-- 빈 행 추가 -->
            <tr 
              v-for="index in (itemsPerPage - displayedProjects.length)" 
              :key="`empty-${index}`"
              class="project-row empty-row"
            >
              <td class="text-center">
                <div class="empty-img-placeholder"></div>
              </td>
              <td></td>
              <td class="hide-sm-and-down"></td>
              <td></td>
            </tr>
          </tbody>
        </v-table>

        <div v-if="pageCount > 1" class="d-flex justify-center mt-4">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="7"
          />
        </div>

      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ dialogProps.title }}</v-card-title>
        <v-card-text>{{ dialogProps.message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            v-if="dialogProps.mode === 'alert'" 
            color="primary" 
            @click="dialog = false"
          >
            확인
          </v-btn>
          <template v-else>
            <v-btn 
              color="primary" 
              @click="dialogProps.action"
            >
              확인
            </v-btn>
            <v-btn 
              color="error" 
              @click="dialog = false"
            >
              취소
            </v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.search-area {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.search-container {
  display: flex;
  gap: 8px;
  max-width: 600px;
  width: 100%;
  align-items: center;
}

.search-field {
  flex: 1;
}

:deep(.v-field__input) {
  min-height: 40px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

:deep(.v-field__outline) {
  --v-field-border-width: 1px !important;
}

.search-button {
  white-space: nowrap;
  height: 40px !important;
}

.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gap-2 {
  gap: 8px;
}
.project-row {
  height: 100px; /* 모든 행의 높이를 고정 */
}

.empty-row {
  background-color: transparent !important;
}

.empty-img-placeholder {
  height: 60px; /* v-img와 동일한 높이 */
}

/* v-img 스타일 조정 */
:deep(.v-img) {
  height: 60px !important;
  object-fit: contain;
}

/* 테이블 셀 수직 정렬 */
td {
  vertical-align: middle;
}

@media (max-width: 600px) {
  .search-area {
    flex-direction: column;
  }
  
  .search-container {
    width: 100%;
    max-width: none;
  }

  .add-button {
    width: 100%;
  }
  
  .truncate-text {
    max-width: 5ch;
    margin: 0 auto;
  }
  
  .gap-2 {
    gap: 4px;
  }
  
  .v-btn {
    padding: 0 8px;
    min-width: 48px;
    height: 32px;
  }
  /* 다이얼로그 버튼 스타일 */
  :deep(.v-card-actions) {
    flex-direction: column;
    gap: 8px;
    padding: 16px;
  }

  :deep(.v-card-actions .v-btn) {
    width: 100%;
    margin: 0 !important;
  }

  .small-button {
    min-width: 40px !important;
    padding: 0 4px !important;
  }
}

/* 추가 스타일 */
.gap-2 {
  gap: 8px;
}

td {
  vertical-align: middle;
}

.project-row {
  height: 80px;
}

.empty-row {
  background-color: transparent !important;
}

.empty-img-placeholder {
  height: 50px;
}

:deep(.v-img) {
  height: 60px !important;
  object-fit: contain;
}
</style>