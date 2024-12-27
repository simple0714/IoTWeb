<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useSelectedProjectId } from '../../stores/adminproject'

const selectedProjectId = useSelectedProjectId()
const URL = "http://localhost:3001/apis/project/updateProject"
const MULTI_UPLOAD_URL = "http://localhost:3001/apis/multiFileUpload"

const props = defineProps({
  onSelect: {
    type: Function,
    required: true
  }
})

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

// 프로젝트 데이터 불러오기
onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3001/apis/project/findOne?projectNb=${selectedProjectId.value}`)
    const projectData = response.data.dataInfo.projectInfo
    
    title.value = projectData.TITLE
    subTitle.value = projectData.SUB_TITLE
    stack.value = JSON.parse(projectData.STACK).stack
    content.value = projectData.PROJECT_INFO
    mainImagePreviewUrl.value = projectData.PROJECT_IMG
    
    // 예시 이미지 설정 수정
    exampleImages.value = response.data.dataInfo.projectFiles.map(file => ({
      preview: file.PROJECT_IMG,
      file: null,
      isExisting: true  // 기존 이미지 표시
    }))
  } catch (error) {
    console.error("프로젝트 데이터 로드 오류:", error)
    showErrorDialog("오류", "프로젝트 데이터를 불러오는데 실패했습니다.")
  }
})

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

// 예시 이미지 업로드 처리 수정
const handleExampleImagesUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        exampleImages.value.push({
          preview: e.target.result,
          file: file,
          isExisting: false  // 새로 추가된 이미지 표시
        })
      }
      reader.readAsDataURL(file)
    } else {
      showErrorDialog("오류", "이미지 파일만 선택할 수 있습니다.")
    }
  })
  event.target.value = ''  // 입력 초기화
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
const handleSubmit = async (event) => {
  event.preventDefault()
  
  showConfirmDialog(
    "프로젝트 수정", 
    "프로젝트를 수정하시겠습니까?", 
    async () => {
      try {
        let mainImageUrl = mainImagePreviewUrl.value
        let fileUrls = []

        // 메인 이미지 업로드 처리
        if (mainImage.value) {
          const mainImageFormData = new FormData()
          mainImageFormData.append("file", mainImage.value)
          const mainImageResponse = await axios.post("http://localhost:3001/apis/fileUpload", mainImageFormData, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          mainImageUrl = mainImageResponse.data.url
        }

        // 새로운 예시 이미지만 필터링
        const newExampleImages = exampleImages.value.filter(img => 
          img.file instanceof File || (img.preview && img.preview.startsWith('data:image'))
        )
        
        // 기존 이미지 URL 유지
        fileUrls = exampleImages.value
          .filter(img => img.preview && !img.preview.startsWith('data:image'))
          .map(img => img.preview)

        // 새로운 이미지가 있는 경우 업로드
        if (newExampleImages.length > 0) {
          const formData = new FormData()
          
          newExampleImages.forEach((img, index) => {
            if (img.file instanceof File) {
              formData.append('files', img.file)
            } else {
              // Base64 데이터를 Blob으로 변환
              const byteString = atob(img.preview.split(',')[1])
              const mimeString = img.preview.split(',')[0].split(':')[1].split(';')[0]
              const ab = new ArrayBuffer(byteString.length)
              const ia = new Uint8Array(ab)
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i)
              }
              const blob = new Blob([ab], { type: mimeString })
              formData.append('files', blob, `image${index}.png`)
            }
          })

          const response = await axios.post(MULTI_UPLOAD_URL, formData, {
            headers: { 
              'accept': 'application/json',
              "Content-Type": "multipart/form-data"
            }
          })

          // 새로운 URL 추가
          if (response.data && response.data.files) {
            const newUrls = response.data.files.map(file => file.url)
            fileUrls = [...fileUrls, ...newUrls]
          }
        }

        // 프로젝트 데이터 구성
        const projectData = {
          projectNb: selectedProjectId.value,
          title: title.value,
          subTitle: subTitle.value,
          projectImg: mainImageUrl,
          stack: stack.value,
          projectInfo: content.value,
          files: fileUrls.map((url, index) => ({
            PROJECT_IMG: url,
            sort: index + 1
          }))
        }

        console.log('전송할 프로젝트 데이터:', projectData)

        // 프로젝트 업데이트 요청
        const updateResponse = await axios.put(URL, projectData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log('업데이트 응답:', updateResponse.data)

        showErrorDialog("성공", "프로젝트가 수정되었습니다.")
        dialog.value = false
        props.onSelect('project')
      } catch (error) {
        console.error("Error updating project:", error)
        showErrorDialog("오류", "프로젝트 수정 실패")
      }
    }
  )
}
</script>

<template>
  <v-container fluid class="pa-4">
    <v-card class="pa-4">
      <h2 class="text-h5 font-weight-bold mb-4">프로젝트 수정</h2>
      
      <form @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="title"
              label="프로젝트명"
              required
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="subTitle"
              label="부제목"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="content"
              label="프로젝트 설명"
              required
              variant="outlined"
              density="comfortable"
              rows="4"
            />
          </v-col>

          <v-col cols="12">
            <p class="text-subtitle-1 mb-2">기술 스택</p>
            <v-row>
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
            <p class="text-subtitle-1 mb-2">메인 이미지</p>
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
            <p class="text-subtitle-1 mb-2">예시 이미지</p>
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
                  <v-card-actions>
                    <v-btn
                      icon
                      @click="handleRemoveExampleImage(index)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-actions>
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
              수정
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
</style>