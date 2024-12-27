<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const props = defineProps({
  onSelect: {
    type: Function,
    required: true
  }
})

const URL = "http://localhost:3001/apis/partner/add"
const FILE_UPLOAD_URL = "http://localhost:3001/apis/fileUpload"

// 상태 관리
const partnerNm = ref("")
const image = ref(null)
const previewUrl = ref("")
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
  previewUrl.value = ""
  if (fileInputRef.value) fileInputRef.value.value = ""
}

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
  if (!partnerNm.value || !image.value) {
    showErrorDialog("오류", "협력사명과 이미지를 입력해주세요.")
    return
  }

  showConfirmDialog(
    "협력사 추가",
    "협력사를 추가하시겠습니까?",
    submitPartner
  )
}

const submitPartner = async () => {
  try {
    const formData = new FormData()
    formData.append("file", image.value)
    const imageResponse = await axios.post(FILE_UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })

    const partnerData = {
      partnerNm: partnerNm.value,
      imgUrl: imageResponse.data.url,
    }

    await axios.post(URL, partnerData)
    showErrorDialog("성공", "협력사가 추가되었습니다.")
    props.onSelect('partner')
  } catch (error) {
    console.error("Error adding partner:", error)
    showErrorDialog("오류", "협력사 추가 실패")
  }
}
</script>

<template>
  <v-container fluid>
    <v-card class="pa-4">
      <h2 class="text-h5 font-weight-bold mb-4">협력사 추가</h2>
      
      <form @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="partnerNm"
              label="협력사명"
              variant="outlined"
              density="comfortable"
              :rules="[v => v.trim().length > 0 || '공백은 입력할 수 없습니다']"
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
              추가
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