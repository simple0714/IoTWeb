<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()

const partnerListApi = "/api/partner"
const updatePartnerApi = "/api/partner/update"
const fileUploadApi = "/api/upload/single"

// 상태 관리
const partnerNm = ref("")
const image = ref(null)
const previewUrl = ref("")
const originalImageUrl = ref("")
const dialog = ref(false)
const dialogProps = reactive({
  title: '',
  message: '',
  mode: 'alert',
  action: null
})
const fileInputRef = ref(null)

// 이미지 업로드 처리
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && !file.type.startsWith("image/")) {
    showErrorDialog("오류", "이미지 파일만 선택할 수 있습니다.")
    event.target.value = ""
    return
  }
  image.value = file
  const reader = new FileReader()
  reader.onloadend = () => {
    previewUrl.value = reader.result
  }
  reader.readAsDataURL(file)
}

// 이미지 초기화
const clearImage = () => {
  image.value = null
  previewUrl.value = originalImageUrl.value
  if (fileInputRef.value) fileInputRef.value.value = ""
}

// 데이터 로드
onMounted(async () => {
  try {
    const response = await axios.get(partnerListApi)
    const partnerData = response.data.dataInfo.find(
      partner => partner.ID === Number(props.id)
    )
    if (partnerData) {
      partnerNm.value = partnerData.PARTNER_NM
      previewUrl.value = partnerData.PARTNER_IMG
      originalImageUrl.value = partnerData.PARTNER_IMG
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    showErrorDialog("오류", "데이터를 불러오는 데 실패했습니다.")
  }
})

// 다이얼로그 표시 함수들
const showErrorDialog = (title, message) => {
  dialogProps.title = title
  dialogProps.message = message
  dialogProps.mode = 'alert'
  dialog.value = true
}

const showConfirmDialog = (title, message, confirmAction) => {
  dialogProps.title = title
  dialogProps.message = message
  dialogProps.mode = 'confirm'
  dialogProps.action = confirmAction
  dialog.value = true
}

// 폼 제출 처리
const handleSubmit = async (event) => {
  event.preventDefault()
  if (!partnerNm.value) {
    showErrorDialog("오류", "협력사명을 입력해주세요.")
    return
  }

  showConfirmDialog(
    "협력사 수정",
    "협력사 정보를 수정하시겠습니까?",
    submitPartner
  )
}

const submitPartner = async () => {
  try {
    let imageUrl = previewUrl.value

    if (image.value) {
      const formData = new FormData()
      formData.append("file", image.value)
      const imageResponse = await axios.post(fileUploadApi, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      imageUrl = imageResponse.data.url
    }

    // 데이터 구조 수정
    const partnerData = {
      id: router.currentRoute.value.params.id,  // partnerNb 대신 id 사용
      partnerNm: partnerNm.value,
      imgUrl: imageUrl  // imgUrl로 키 이름 변경
    }

    // headers 추가
    await axios.put(updatePartnerApi, partnerData, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    })
    
    showErrorDialog("성공", "협력사가 수정되었습니다.")
    router.push("/admin/partner")
  } catch (error) {
    console.error("Error updating partner:", error)
    showErrorDialog("오류", "협력사 수정 실패")
  }
}
</script>

<template>
  <v-container fluid>
    <v-card class="pa-4">
      <h2 class="text-h5 font-weight-bold mb-4">협력사 수정</h2>
      
      <form @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="partnerNm"
              label="협력사명"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12">
            <v-file-input
              ref="fileInputRef"
              accept="image/*"
              label="이미지"
              @change="handleImageUpload"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col v-if="previewUrl" cols="12">
            <v-card class="position-relative">
              <v-img
                :src="previewUrl"
                height="200"
                contain
              />
              <v-btn
                icon
                color="white"
                class="position-absolute"
                style="top: 8px; right: 8px"
                @click="clearImage"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-btn
              type="submit"
              color="black"
              block
            >
              수정
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ dialogProps.title }}</v-card-title>
        <v-card-text>{{ dialogProps.message }}</v-card-text>
        <v-card-actions>
          <v-spacer />
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
.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
</style>