<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import Modal from '../Modal.vue'

const props = defineProps({
  onSelect: {
    type: Function,
    required: true
  }
})

const URL = "http://localhost:3001/apis/about/addAbout"
const title = ref("")
const subTitle = ref("")
const image = ref(null)
const previewUrl = ref("")
const fileInput = ref(null)

// 다이얼로그
const dialog = ref(false)
const dialogProps = reactive({  // modalProps를 dialogProps로 변경하고 reactive 사용
  title: '',
  message: '',
  mode: 'alert'
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && !file.type.startsWith("image/")) {
    showErrorModal("오류", "이미지 파일만 선택할 수 있습니다.")
    event.target.value = ""
    return
  }
  image.value = file
  // FileReader를 사용하여 이미지 미리보기 생성
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const clearImage = () => {
  image.value = null
  previewUrl.value = ""
  if (fileInput.value) fileInput.value.value = ""
}

const showErrorDialog = (message) => {  // showErrorModal을 showErrorDialog로 변경
  dialogProps.title = '오류'
  dialogProps.message = message
  dialogProps.mode = 'alert'
  dialog.value = true
}

const showSuccessDialog = (message) => {  // 추가
  dialogProps.title = '성공'
  dialogProps.message = message
  dialogProps.mode = 'alert'
  dialog.value = true
}

const showConfirmDialog = () => {  // showConfirmModal을 showConfirmDialog로 변경
  dialogProps.title = '소개글 추가'
  dialogProps.message = '소개글을 추가하시겠습니까?'
  dialogProps.mode = 'confirm'
  dialog.value = true
}

const handleSubmit = async (event) => {
  event.preventDefault()
  if (!title.value || !subTitle.value || !image.value) {
    // showErrorModal("오류", "각 항목을 입력해주세요.")
    showErrorDialog("각 항목을 입력해주세요.")
    return
  }

  showConfirmDialog()
}

const submitAbout = async () => {
  try {
    dialog.value = false
    const formData = new FormData()
    formData.append("file", image.value)
    const imageResponse = await axios.post("http://localhost:3001/apis/fileUpload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })

    const aboutData = {
      title: title.value,
      subTitle: subTitle.value,
      icon: imageResponse.data.url,
    }

    const response = await axios.post(URL, aboutData)
    console.log(response.data)
    showSuccessDialog("소개글이 추가되었습니다.")

    title.value = ""
    subTitle.value = ""
    clearImage()
    props.onSelect("about")
  } catch (error) {
    console.error("Error adding about:", error)
    showErrorDialog("소개글 추가 실패")
  }
}
</script>

<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h5 font-weight-bold mb-4">소개글 추가</h2>
    
    <v-card class="pa-4">
      <v-form @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12" sm="2">
            <div class="text-subtitle-1">제목<span class="required">*</span></div>
          </v-col>
          <v-col cols="12" sm="10">
            <v-text-field
              v-model="title"
              variant="outlined"
              hide-details
              :rules="[v => v.trim().length > 0 || '공백은 입력할 수 없습니다']"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12" sm="2">
            <div class="text-subtitle-1">내용<span class="required">*</span></div>
          </v-col>
          <v-col cols="12" sm="10">
            <v-textarea
              v-model="subTitle"
              variant="outlined"
              rows="4"
              hide-details
              :rules="[v => v.trim().length > 0 || '공백은 입력할 수 없습니다']"
            ></v-textarea>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12" sm="2">
            <div class="text-subtitle-1">이미지<span class="required">*</span></div>
          </v-col>
          <v-col cols="12" sm="10">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
            />
          </v-col>
        </v-row>

        <v-row v-if="previewUrl" class="mt-4">
          <v-col cols="12" class="d-flex justify-center">
            <v-card class="preview-container" width="300">
              <v-img
                :src="previewUrl"
                height="200"
                contain
              ></v-img>
              <v-btn
                icon
                color="black"
                size="small"
                class="close-btn"
                @click="clearImage"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12">
            <v-btn
              type="submit"
              color="black"
              class="white--text"
            >
              추가
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

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
            @click="submitAbout"
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
.preview-container {
  position: relative;
  overflow: hidden;
}

.close-btn {
  position: absolute !important;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.8) !important;
}

.file-input {
  padding: 8px 0;
}
.required {
  color: red;
  margin-left: 2px;
}

@media (max-width: 600px) {
  .v-btn {
    width: 100%;
  }
  
  .preview-container {
    width: 100%;
  }
}
</style>