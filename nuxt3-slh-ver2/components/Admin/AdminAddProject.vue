<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()


const addProjectApi = "/api/project/add"
const fileUploadApi = "/api/upload/single"
const multiFileUploadApi = "/api/upload/multi"

// 상태 관리
const title = ref("")
const subTitle = ref("")
const stack = ref([])
const content = ref("")
const mainImage = ref(null)
const mainImagePreviewUrl = ref("")
const exampleImages = ref([])
const dialog = ref(false)
const dialogProps = reactive({
  title: '',
  message: '',
  mode: 'alert',
  action: null
})
const fileInputRef = ref(null)
const exampleImagesInputRef = ref(null)
const stackData = ref([])
const exampleImageFiles = ref([])
const exampleImageNames = ref([])

// 메인 이미지 업로드 처리
const handleMainImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && !file.type.startsWith("image/")) {
    showErrorDialog("오류", "이미지 파일만 선택할 수 있습니다.")
    event.target.value = ""
    return
  }
  mainImage.value = file
  const reader = new FileReader()
  reader.onloadend = () => {
    mainImagePreviewUrl.value = reader.result
  }
  reader.readAsDataURL(file)
}

// 메인 이미지 초기화
const clearMainImage = () => {
  mainImage.value = null
  mainImagePreviewUrl.value = ""
  if (fileInputRef.value) fileInputRef.value.value = ""
}

// 예시 이미지 업로드 처리
const handleExampleImagesUpload = (event) => {
  const files = Array.from(event.target.files)
  const newImageFiles = []
  const newImageNames = []

  files.forEach(file => {
    if (file && file.type.startsWith('image/')) {
      newImageFiles.push(file)
      newImageNames.push(file.name)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        exampleImages.value = [
          ...exampleImages.value,
          { file, preview: e.target.result }
        ]
      }
      reader.readAsDataURL(file)
    } else {
      showErrorDialog("오류", "이미지 파일만 선택할 수 있습니다.")
    }
  })

  exampleImageFiles.value = [...exampleImageFiles.value, ...newImageFiles]
  exampleImageNames.value = [...exampleImageNames.value, ...newImageNames]
}

// 예시 이미지 제거
const handleRemoveExampleImage = (index) => {
  exampleImageFiles.value = exampleImageFiles.value.filter((_, i) => i !== index)
  exampleImageNames.value = exampleImageNames.value.filter((_, i) => i !== index)
  exampleImages.value = exampleImages.value.filter((_, i) => i !== index)
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
const handleSubmit = (event) => {
  event.preventDefault()
  if (!title.value || !stack.value.length || !content.value || !mainImage.value || !exampleImages.value.length) {
    showErrorDialog("오류", "모든 필드를 입력해주세요.")
    return
  }

  showConfirmDialog("프로젝트 추가", "프로젝트를 추가하시겠습니까?", submitProject)
}

// 프로젝트 데이터 제출
const submitProject = async () => {
  try {
    // 대표 이미지 업로드
    const mainImageFormData = new FormData()
    mainImageFormData.append("file", mainImage.value)
    const mainImageResponse = await axios.post(fileUploadApi, mainImageFormData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    const mainImageUrl = mainImageResponse.data.url

    // 예시 이미지 업로드
    const exampleImagesFormData = new FormData()
    exampleImageFiles.value.forEach((file) => {
      exampleImagesFormData.append('files', file)
    })
    const exampleImagesResponse = await axios.post(multiFileUploadApi, exampleImagesFormData, {
      headers: { 
        'accept': 'application/json',
        "Content-Type": "multipart/form-data"
      }
    })

    let fileUrls = []
    if (exampleImagesResponse.data?.files) {
      fileUrls = exampleImagesResponse.data.files.map(file => file.url)
    }

    const projectData = {
      title: title.value,
      subTitle: subTitle.value,
      projectImg: mainImageUrl,
      stack: stack.value,
      projectInfo: content.value,
      files: fileUrls.map((url, index) => ({
        url: url,
        sort: index
      }))
    }

    await axios.post(addProjectApi, projectData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    showErrorDialog("성공", "프로젝트가 추가되었습니다.")
    resetForm()
    router.push("/admin/project")
  } catch (error) {
    console.error("Error adding project:", error)
    showErrorDialog("오류", "프로젝트 추가 실패")
  }
}

// 폼 초기화
const resetForm = () => {
  title.value = ""
  subTitle.value = ""
  stack.value = []
  content.value = ""
  clearMainImage()
  exampleImages.value = []
}

// 스택 데이터 로드
onMounted(async () => {
  try {
    const response = await axios.get('/api/stack')
    stackData.value = response.data
  } catch (error) {
    console.error('스택 데이터 로드 오류:', error)
  }
})
</script>

<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h5 font-weight-bold mb-4">프로젝트 추가</h2>
    
    <v-card class="pa-4">
      <form @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12" sm="2">
            <div class="text-subtitle-1">제목<span class="required">*</span></div>
          </v-col>
          <v-col cols="12" sm="10">
            <v-text-field
              v-model="title"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          
          <v-col cols="12" sm="2">
            <div class="text-subtitle-1">부제목</div>
          </v-col>
          <v-col cols="12" sm="10">
            <v-text-field
              v-model="subTitle"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          
          <v-col cols="12" sm="2">
            <div class="text-subtitle-1">내용<span class="required">*</span></div>
          </v-col>
          <v-col cols="12" sm="10">
            <v-textarea
              v-model="content"
              variant="outlined"
              rows="4"
              no-resize
            />
          </v-col>
          
          <v-col cols="12" sm="2">
            <div class="text-subtitle-1">기술 스택 <span class="required">*</span></div>
          </v-col>
          <v-col cols="12" sm="10" class="stack-container">
            <v-row dense>
              <v-col 
                v-for="item in stackData" 
                :key="item.ID"
                cols="auto"
              >
                <v-checkbox
                  v-model="stack"
                  :label="item.STACK_NM"
                  :value="item.STACK_NM"
                />
              </v-col>
            </v-row>
          </v-col>
          
          <v-col cols="12">
            <p class="text-subtitle-1 mb-2">메인 이미지 <span class='required'>*</span></p>
            <v-file-input
              ref="fileInputRef"
              accept="image/*"
              @change="handleMainImageUpload"
              variant="outlined"
              density="comfortable"
            />
            <v-img
              v-if="mainImagePreviewUrl"
              :src="mainImagePreviewUrl"
              max-height="200"
              contain
              class="mt-2"
            >
              <template v-slot:placeholder>
                <v-row align="center" justify="center">
                  <v-progress-circular indeterminate />
                </v-row>
              </template>
            </v-img>
          </v-col>
          
          <v-col cols="12">
            <p class="text-subtitle-1 mb-2">예시 이미지 <span class='required'>*</span></p>
            <v-file-input
              ref="exampleImagesInputRef"
              accept="image/*"
              multiple
              @change="handleExampleImagesUpload"
              variant="outlined"
              density="comfortable"
            />
            <v-row v-if="exampleImages.length > 0" class="mt-2">
              <v-col 
                v-for="(image, index) in exampleImages"
                :key="index"
                cols="12"
                sm="4"
              >
                <v-card>
                  <v-img
                    :src="image.preview"
                    height="300"
                    contain
                  >
                    <template v-slot:placeholder>
                      <v-row align="center" justify="center">
                        <v-progress-circular indeterminate />
                      </v-row>
                    </template>
                  </v-img>
                  <v-btn
                    icon
                    color="black"
                    class="position-absolute close-btn"
                    @click="handleRemoveExampleImage(index)"
                  >
                    <v-icon color="black">mdi-close</v-icon>
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
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

    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
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
.v-card {
  border-radius: 8px;
}

.v-btn {
  text-transform: none;
}

.required {
  color: red;
  margin-left: 2px;
}

.stack-container {
  border: 1px solid #ccc;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
.preview-container {
  position: relative;
  overflow: hidden;
}

.close-btn {
  position: absolute !important;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.8) !important;
  min-width: auto !important;  
  width: 36px !important;      
  height: 36px !important;     
  padding: 0 !important;   
}

.file-input {
  padding: 8px 0;
}

.stack-container :deep(.v-row) {
  margin: 0; /* v-row의 기본 마진 제거 */
  gap: 0;
}

.stack-container :deep(.v-col) {
  padding-top: 0px;    /* v-col의 패딩 조정 */
  padding-bottom: 0px;
}

/* checkbox 자체의 마진도 조정 */
.stack-container :deep(.v-checkbox) {
  margin: 0;
  padding: 0;
}
@media (max-width: 600px) {
  .v-btn:not(.close-btn) {
    width: 100%;
  }
  
  .preview-container {
    width: 100%;
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