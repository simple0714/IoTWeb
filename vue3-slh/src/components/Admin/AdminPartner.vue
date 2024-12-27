<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import axios from 'axios'
import { useSelectedPartnerId } from '../../stores/adminpartner'

const selectedPartnerId = useSelectedPartnerId()
const props = defineProps({
  onSelect: {
    type: Function,
    required: true
  }
})

const URL = "http://localhost:3001/apis/partner/list"
const URL_DELETE = "http://localhost:3001/apis/partner/delete"

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

// 페이지네이션 관련 상태
const page = ref(1)
const itemsPerPage = 5
const searchTerm = ref("")
const filteredResults = ref([])
const isSearchClicked = ref(false)

const pageCount = computed(() => {
  const partners = isSearchClicked.value ? filteredResults.value : data.value
  if (!partners || partners.length === 0) return 0
  return Math.ceil(partners.length / itemsPerPage)
})

const displayedPartners = computed(() => {
  const partners = isSearchClicked.value ? filteredResults.value : data.value
  if (!partners || partners.length === 0) return []
  
  const sortedPartners = [...partners].sort((a, b) => 
    new Date(b.CREATE_AT) - new Date(a.CREATE_AT)
  )
  
  return sortedPartners.slice(
    (page.value - 1) * itemsPerPage, 
    page.value * itemsPerPage
  )
})

const fetchData = async () => {
  try {
    loading.value = true
    const response = await axios.get(URL)
    data.value = response.data.dataInfo
    filteredResults.value = response.data.dataInfo
  } catch (e) {
    console.error('Error fetching data:', e)
    error.value = e
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (!data.value) return
  
  const results = data.value.filter(partner =>
    partner.PARTNER_NM?.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
  filteredResults.value = results
  isSearchClicked.value = true
  page.value = 1
}

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
  dialog.value = true
}

const handleDelete = async (id) => {
  showConfirmDialog(
    "협력사 삭제",
    "정말로 이 협력사를 삭제하시겠습니까?",
    async () => {
      try {
        dialog.value = false
        await axios.delete(`${URL_DELETE}?id=${id}`)
        await fetchData()
        showAlertDialog("성공", "협력사가 성공적으로 삭제되었습니다.")
      } catch (error) {
        console.error("Error deleting partner:", error)
        showAlertDialog("오류", "협력사 삭제 중 오류가 발생했습니다.")
      }
    }
  )
}
const handleUpdate = (id) => {
  selectedPartnerId.value = id  // store에 ID 저장
  props.onSelect('updatepartner')
}
const handleClearSearch = (value) => {
  if (!value) {
    isSearchClicked.value = false
    filteredResults.value = data.value
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
        <h2 class="text-h5 font-weight-bold mb-4">협력사 조회</h2>
        
        <div class="search-area mb-4">
          <div class="search-container">
            <v-text-field
              v-model="searchTerm"
              placeholder="협력사명 검색"
              density="compact"
              class="search-field"
              @keyup.enter="handleSearch"
              clearable
              @update:model-value="handleClearSearch"
            />
            <v-btn
              color="black"
              @click="handleSearch"
              class="search-button"
            >
              검색
            </v-btn>
          </div>
        </div>

        <v-table>
          <thead>
            <tr>
              <th class="text-center">이미지</th>
              <th class="text-center">협력사명</th>
              <th class="text-center">
                <v-btn
                  color="black"
                  @click="props.onSelect('addpartner')"
                >
                  추가
                </v-btn>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="partner in displayedPartners" :key="partner.PARTNER_NB" class="partner-row">
              <td class="text-center">
                <v-img
                  :src="partner.PARTNER_IMG"
                  max-width="100"
                  height="60"
                  class="mx-auto"
                  contain
                />
              </td>
              <td class="text-center">
                <div class="truncate-text">{{ partner.PARTNER_NM }}</div>
              </td>
              <td>
                <div class="d-flex justify-center gap-2">
                  <v-btn
                    color="grey-darken-3"
                    class="white--text"
                    @click="handleUpdate(partner.ID)"
                  >
                    수정
                  </v-btn>
                  <v-btn
                    color="grey-darken-3"
                    class="white--text"
                    @click="handleDelete(partner.ID)"
                  >
                    삭제
                  </v-btn>
                </div>
              </td>
            </tr>
            <tr 
              v-for="index in (itemsPerPage - displayedPartners.length)" 
              :key="`empty-${index}`"
              class="partner-row empty-row"
            >
              <td class="text-center">
                <div class="empty-img-placeholder"></div>
              </td>
              <td></td>
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
}

.search-container {
  display: flex;
  flex: 1;
  gap: 8px;
  max-width: 600px;
}

.search-field {
  flex: 1;
}

.search-button {
  white-space: nowrap;
}

.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.partner-row {
  height: 100px;
}

.gap-2 {
  gap: 8px;
}

td {
  vertical-align: middle;
}
.partner-row {
  height: 80px; /* 모든 행의 높이를 고정 */
}

.empty-row {
  background-color: transparent !important;
}

.empty-img-placeholder {
  height: 50px; /* v-img와 동일한 높이 */
}

/* v-img 스타일 조정 */
:deep(.v-img) {
  height: 60px !important;
  object-fit: contain;
}


@media (max-width: 600px) {
  .search-area {
    flex-direction: column;
  }
  
  .search-container {
    width: 100%;
    max-width: none;
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
  }
}
</style>