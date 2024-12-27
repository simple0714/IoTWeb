<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const updateApi = "/api/project/update"
const fileUploadApi = "/api/upload/single"
const multiFileUploadApi = "/api/upload/multi"

const router = useRouter()

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
    // 스택 데이터 로드
    const stackResponse = await axios.get('/api/stack')
    stackData.value = stackResponse.data

    // 프로젝트 데이터 로드
    // console.log('selectedProjectId:', selectedProjectId.value)
    // console.log('프로젝트NB:', router.currentRoute.value.params.id)
    const response = await axios.get(`/api/project/findOne`, {
      params: { projectNb: router.currentRoute.value.params.id }  
    })
    const projectData = response.data.dataInfo.projectInfo
    // console.log('projectData:', projectData)
    
    title.value = projectData.TITLE
    subTitle.value = projectData.SUB_TITLE
    stack.value = JSON.parse(projectData.STACK).stack
    content.value = projectData.PROJECT_INFO
    mainImagePreviewUrl.value = projectData.PROJECT_IMG
    
     // 예시 이미지 설정 부분에 정렬 추가
     const projectFiles = response.data.dataInfo.projectFiles
    // sort 필드를 기준으로 정렬
    projectFiles.sort((a, b) => a.SORT - b.SORT)

    // 예시 이미지 설정
    exampleImages.value = projectFiles.map(file => ({
      preview: file.PROJECT_IMG,
      file: null,
      isExisting: true
    }))
    // console.log('불러온 예시 이미지들:', projectFiles.map(file => ({
    //   sort: file.SORT,
    //   url: file.PROJECT_IMG
    // })))
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
const handleExampleImagesUpload = async (event) => {
  const files = Array.from(event.target.files)
  
  // 선택된 파일들의 이름과 순서 출력
  // console.log('선택된 파일들:', files.map((file, index) => ({
  //   index: index,
  //   name: file.name
  // })))
  
  // Promise.all을 사용하여 모든 파일 처리가 완료될 때까지 대기
  const imagePromises = files.map((file, index) => {
    return new Promise((resolve) => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            preview: e.target.result,
            file: file,
            isExisting: false,
            sort: index + 1
          })
        }
        reader.readAsDataURL(file)
      } else {
        showErrorDialog("오류", "이미지 파일만 선택할 수 있습니다.")
        resolve(null)
      }
    })
  })

  // 모든 이미지 처리가 완료된 후 순서대로 추가
  const results = await Promise.all(imagePromises)
  const validResults = results.filter(result => result !== null)
  // sortOrder를 기준으로 정렬하여 순서 보장
  validResults.sort((a, b) => a.sort - b.sort)
  exampleImages.value.push(...validResults)
  
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
  if (title === "성공") {
    setTimeout(() => {
      router.push('/admin/project')
    }, 2000)  // 다이얼로그가 보이고 0.5초 후 이동
  }
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
          const mainImageResponse = await axios.post(fileUploadApi, mainImageFormData, {
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

          const response = await axios.post(multiFileUploadApi, formData, {
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
          // console.log('새로운 URL:', fileUrls)
        }

        // 프로젝트 데이터 구성
        const projectData = {
          projectNb: router.currentRoute.value.params.id,
          title: title.value,
          subTitle: subTitle.value,
          projectImg: mainImageUrl,
          stack: stack.value,
          projectInfo: content.value,
          files: fileUrls.map((url, index) => ({
            url: url,
            sort: index + 1
          }))
        }

        // console.log('전송할 프로젝트 데이터:', projectData)

        // 프로젝트 업데이트 요청
        const updateResponse = await axios.put(updateApi, projectData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

       // console.log('업데이트 응답:', updateResponse.data)

        dialog.value = false
        showErrorDialog("성공", "프로젝트가 수정되었습니다.")
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
            <div class="text-subtitle-1">기술 스택<span class="required">*</span></div>
          </v-col>
          <v-col cols="12" sm="10" class="stack-container">
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
            to="/admin/project"
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