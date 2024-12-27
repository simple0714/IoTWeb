<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  onSelect: {
    type: Function,
    required: true
  }
})

const aboutAPI = "/api/about"
const deleteAboutAPI = "/api/about/delete"

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

const fetchData = async () => {
  try {
    error.value = null
    loading.value = true
    const response = await axios.get(aboutAPI)
    data.value = response.data.dataInfo
  } catch (e) {
    error.value = e
  }
  loading.value = false
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
    "소개글 삭제",
    "정말로 이 소개글을 삭제하시겠습니까?",
    async () => {
      try {
        dialog.value = false  // 모달 닫기
        const response = await axios.delete(`${deleteAboutAPI}?id=${id}`, {
          headers: {
            'accept': 'application/json'
          }
        })
        
        if (!response.data.error) {
          await fetchData()
          showAlertDialog("성공", "소개글이 성공적으로 삭제되었습니다.")
        } else {
          showAlertDialog("오류", `소개글 삭제에 실패했습니다: ${response.data.error}`)
        }
      } catch (error) {
        console.error("Error deleting about:", error)
        showAlertDialog("오류", "소개글 삭제 중 오류가 발생했습니다.")
      }
    }
  )
}

const handleUpdate = (id) => {
  router.push(`/admin/about/edit/${id}`)
}

</script>

<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">소개글 조회</h2>
        
        <div class="d-flex justify-end mb-4">
          <v-btn
            color="black"
            to="/admin/about/create"
            class="white--text"
          >
            추가
          </v-btn>
        </div>

        <v-table>
          <thead>
            <tr>
              <th class="text-center black white--text">제목</th>
              <th class="text-center black white--text">내용</th>
              <th class="text-center black white--text"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data" :key="row.ID">
              <td>{{ row.TITLE }}</td>
              <td>{{ row.SUB_TITLE }}</td>
              <td>
                <div class="d-flex justify-center gap-2">
                  <v-btn
                    color="grey-darken-3"
                    class="white--text mr-2"
                    @click="handleUpdate(row.ID)"
                  >
                    수정
                  </v-btn>
                  <v-btn
                    color="grey-darken-3"
                    class="white--text"
                    @click="handleDelete(row.ID)"
                  >
                    삭제
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
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
.v-table {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.gap-2 {
  gap: 8px;
}

@media (max-width: 600px) {
  .d-flex {
    flex-direction: column;
  }
  
  .gap-2 {
    gap: 4px;
  }
  
  .v-btn {
    width: 100%;
    margin-right: 0 !important;
    margin-bottom: 4px;
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
}
</style>