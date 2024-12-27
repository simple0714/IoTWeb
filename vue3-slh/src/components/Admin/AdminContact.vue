<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useSelectedContactId } from '../../stores/admincontact'

const URL = 'http://localhost:3001/apis/contact/findList'
const data = ref([])
const loading = ref(false)
const error = ref(null)
const showError = ref(false)
const page = ref(1)
const itemsPerPage = 5
const router = useRouter()
const selectedContactId = useSelectedContactId()

// props 정의
const props = defineProps({
  onSelectContact: {
    type: Function,
    required: true
  }
})

const serviceCodeMapping = {
  SRC01: "IOT 솔루션",
  SRC02: "모바일웹",
  SRC03: "웹서비스",
  SRC04: "IT컨설팅",
  SRC06: "테스트서비스",
  SRC07: "UI / UX",
}

const pageCount = computed(() => {
  if (!data.value || data.value.length === 0) return 0
  return Math.ceil(data.value.length / itemsPerPage)
})

const displayedItems = computed(() => {
  if (!data.value || data.value.length === 0) return []
  
  // 최신순 정렬
  const sortedItems = [...data.value].sort((a, b) => 
    new Date(b.CREATE_AT) - new Date(a.CREATE_AT)
  )
  
  return sortedItems.slice(
    (page.value - 1) * itemsPerPage, 
    page.value * itemsPerPage
  )
})

const fetchData = async () => {
  try {
    loading.value = true
    const response = await axios.get(URL)
    data.value = response.data.dataInfo.rows
  } catch (e) {
    error.value = e
    showError.value = true
  } finally {
    loading.value = false
  }
}

const getServiceTypes = (serviceCD) => {
  const parsed = JSON.parse(serviceCD)
  return parsed.serviceCd
    .map(code => serviceCodeMapping[code] || code)
    .join(', ')
}
const handleRowClick = (item) => {
  props.onSelectContact(item.ID)
}

// 가로 스크롤 이벤트 핸들러
const handleWheel = (event) => {
  const tableWrapper = event.currentTarget;
  
  // Shift 키를 누른 상태이거나 가로 스크롤이 필요한 경우에만 동작
  if (event.deltaY !== 0 && tableWrapper.scrollWidth > tableWrapper.clientWidth) {
    event.preventDefault();
    tableWrapper.scrollLeft += event.deltaY;
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">프로젝트 요청 조회</h2>
        <div class="table-wrapper" @wheel.passive="handleWheel">
          <v-table>
            <thead>
            <tr>
              <th class="text-center">고객 정보</th>
              <th class="text-center">서비스 타입</th>
              <th class="text-center">문의 내용</th>
              <th class="text-center">예산</th>
              <th class="text-center">일정</th>
              <th class="text-center">문의 일자</th>
            </tr>
            </thead>
            <tbody>
              <tr 
                v-for="item in displayedItems" 
                :key="item.ID" 
                class="contact-row" 
                @click="handleRowClick(item)"
                style="cursor: pointer;"
              >
                <td class="text-center">{{ item.USER_NM }}</td>
                <td class="text-center">{{ getServiceTypes(item.SERVICE_CD) }}</td>
                <td class="text-center">
                  <div class="truncate-text">{{ item.PROJECT_INFO }}</div>
                </td>
                <td class="text-center">{{ Number(item.BUDGET).toLocaleString() }}</td>
                <td class="text-center">{{ item.SCHEDULE }}</td>
                <td class="text-center">{{ new Date(item.CREATE_AT).toLocaleDateString() }}</td>
              </tr>
              <!-- 빈 행 추가 -->
              <tr 
                v-for="index in (itemsPerPage - displayedItems.length)" 
              :key="`empty-${index}`"
                class="contact-row empty-row"
              >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
          </tbody>
          </v-table>
        </div>
        <div v-if="pageCount > 1" class="d-flex justify-center mt-4">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="7"
          />
        </div>
      </v-col>
    </v-row>

    <!-- 로딩 표시 -->
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <!-- 에러 표시 -->
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
    >
      {{ error?.message || '오류가 발생했습니다' }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
  margin: 0 auto;
}

.contact-row {
  height: 100px;
}

.empty-row {
  background-color: transparent !important;
}
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
/* 테이블 스타일링 */
:deep(.v-table) {
  background-color: transparent;
  min-width: 800px;
}

td {
  vertical-align: middle !important;
}

td, th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 특정 컬럼만 줄바꿈 허용 */
td:nth-child(3) {  /* 문의 내용 컬럼 */
  white-space: normal;
  min-width: 200px;
}

:deep(.v-table thead tr th) {
  background-color: black !important;
  color: white !important;
  font-weight: bold !important;
  text-align: center !important;
}

:deep(.v-table tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}

:deep(.v-table tbody td) {
  border-right: 1px solid rgba(224, 224, 224, 1);
}

:deep(.v-table tbody td:last-child) {
  border-right: none;
}

@media (max-width: 600px) {
  .truncate-text {
    max-width: 100px;
  }
  
  :deep(.v-table) {
    font-size: 0.75rem;
  }
  
  td, th {
    padding: 8px 4px !important;
  }
  td:nth-child(4) {
    white-space: nowrap;
  }
}
</style>