<script setup>
import { ref, watchEffect, reactive } from 'vue'
import axios from 'axios'
import Modal from '../Modal.vue'
import { useSelectedAboutId } from '../../stores/about'  // Pinia store 사용

const props = defineProps({
  onSelect: {
    type: Function,
    required: true
  }
})

const URL = "http://localhost:3001/apis/about/findOne"
const URL_UPDATE = "http://localhost:3001/apis/about/updateAbout"

const title = ref("")
const subTitle = ref("")
const image = ref(null)
const previewUrl = ref("")
const originalImageUrl = ref("")
const dialog = ref(false) 
const dialogProps = reactive({ 
  title: '',
  message: '',
  mode: 'alert'
})
const fileInput = ref(null)
const selectedAboutId = useSelectedAboutId()
console.log(selectedAboutId.value)


const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && !file.type.startsWith("image/")) {
    showErrorModal("오류", "이미지 파일만 선택할 수 있습니다.")
    event.target.value = ""
    return
  }
  image.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  image.value = null
  previewUrl.value = originalImageUrl.value
  if (fileInput.value) fileInput.value.value = ""
}

const showErrorDialog = (message) => {
  dialogProps.title = '오류'
  dialogProps.message = message
  dialogProps.mode = 'alert'
  dialog.value = true
}

const showSuccessDialog = (message) => {
  dialogProps.title = '성공'
  dialogProps.message = message
  dialogProps.mode = 'alert'
  dialog.value = true
}

const showConfirmDialog = () => {
  dialogProps.title = '소개글 수정'
  dialogProps.message = '소개글을 수정하시겠습니까?'
  dialogProps.mode = 'confirm'
  dialog.value = true
}

const handleSubmit = async (event) => {
  event.preventDefault()
  if (!title.value || !subTitle.value) {
    showErrorDialog("제목과 내용을 입력해주세요.")
    return
  }

  showConfirmDialog()
}

watchEffect(async () => {
  if (selectedAboutId.selectedAboutId) {
    try {
      const response = await axios.get(`${URL}?id=${selectedAboutId.selectedAboutId}`)
      const data = response.data.dataInfo
      console.log('Fetched data:', data)
      
      title.value = data.TITLE
      subTitle.value = data.SUB_TITLE
      previewUrl.value = data.ICON
      originalImageUrl.value = data.ICON
    } catch (error) {
      console.error("Error fetching data:", error)
      showErrorModal("오류", "데이터를 불러오는 데 실패했습니다.")
    }
  }
})


const submitAbout = async () => {
  try {
    let iconUrl = originalImageUrl.value
    dialog.value = false
    if (image.value) {
      const formData = new FormData()
      formData.append("file", image.value)
      const imageResponse = await axios.post("http://localhost:3001/apis/fileUpload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      iconUrl = imageResponse.data.url
    }

    const updateData = {
      id: selectedAboutId.selectedAboutId,
      title: title.value,
      subTitle: subTitle.value,
      icon: iconUrl
    }

    const response = await axios.put(URL_UPDATE, updateData, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    })

    console.log(response.data)
    showSuccessDialog("소개글이 수정되었습니다.")
    originalImageUrl.value = iconUrl
    props.onSelect("about")
  } catch (error) {
    console.error("Error updating about:", error)
    showErrorDialog("소개글 수정 실패")
  }
}
</script>

<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h5 font-weight-bold mb-4">소개글 수정</h2>
    
    <v-card class="pa-4">
      <v-form @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12" sm="2">
            <div class="text-subtitle-1">제목</div>
          </v-col>
          <v-col cols="12" sm="10">
            <v-text-field
              v-model="title"
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12" sm="2">
            <div class="text-subtitle-1">내용</div>
          </v-col>
          <v-col cols="12" sm="10">
            <v-textarea
              v-model="subTitle"
              variant="outlined"
              rows="4"
              hide-details
            ></v-textarea>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12" sm="2">
            <div class="text-subtitle-1">이미지</div>
          </v-col>
          <v-col cols="12" sm="10">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="file-input"
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
              수정
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

@media (max-width: 600px) {
  .v-btn {
    width: 100%;
  }
  
  .preview-container {
    width: 100%;
  }
}
</style>