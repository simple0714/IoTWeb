<script setup>
import { ref, reactive } from 'vue'
import CryptoJS from 'crypto-js'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'

const URL = "http://localhost:3001/apis/admin/signUp"
const router = useRouter()
const display = useDisplay()
const form = ref(null)

// 유효성 검사 함수들
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePhone = (phone) => {
  const re = /^\d{10,11}$/
  return re.test(phone)
}

const validateId = (id) => {
  const re = /^[a-zA-Z0-9_]{4,20}$/
  return re.test(id)
}

const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[a-z\d@$!%*?&]{8,}$/
  return re.test(password)
}

const validateName = (name) => {
  const re = /^[가-힣a-zA-Z]{2,30}$/
  return re.test(name)
}

// 상태 관리
const formData = reactive({
  id: '',
  pw: '',
  name: '',
  email: '',
  phone: ''
})

const confirmPassword = ref('')
const error = ref('')
const dialog = ref(false)
const dialogProps = reactive({
  title: '',
  message: '',
  mode: 'alert'
})

const handleSubmit = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  
  if (!valid) {
    showErrorDialog('입력 정보를 확인해주세요.')
    return
  }

  showConfirmDialog()
}

const handleSignup = async () => {
  try {
    dialog.value = false
    const encryptedPassword = CryptoJS.SHA256(formData.pw).toString()
    const dataToSend = { ...formData, pw: encryptedPassword }
    
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })

    if (response.ok) {
      showSuccessDialog('회원가입이 완료되었습니다.')
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } else {
      showErrorDialog('회원가입에 실패했습니다.')
    }
  } catch (err) {
    showErrorDialog('서버 오류가 발생했습니다.')
  }
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
  dialogProps.title = '회원가입 확인'
  dialogProps.message = '회원가입을 진행하시겠습니까?'
  dialogProps.mode = 'confirm'
  dialog.value = true
}
</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">

      <v-col cols="12" lg="12" class="pa-4">
        <v-row justify="center">
          <v-col cols="12" lg="10" class="signup-container">

          <v-row class="justify-center ">
            <!-- 왼쪽 영역 -->
          <v-col cols="12" md="6" class="text-center left-container">
            <h1 :class="[
              'text-h2 mb-6',
              display.mdAndDown.value ? 'text-h3' : ''
            ]">회원가입</h1>
            <v-btn
              v-if="!display.mdAndDown.value"
              block
              x-large
              color="black"
              @click="handleSubmit"
              height="80"
              class="mt-10"
              style="border-radius: 15px; font-size: 18px"
            >
              가입하기
            </v-btn>
          </v-col>

        <!-- 구분선 -->
        <v-col v-if="display.mdAndDown.value" cols="12">
          <v-divider class="my-4"></v-divider>
        </v-col>
        <v-divider v-else vertical class="hidden-sm-and-down"></v-divider>

        <!-- 오른쪽 영역 -->
        <v-col cols="12" md="6">
          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="formData.id"
              label="아이디"
              placeholder="아이디를 입력해주세요"
              variant="outlined"
              class="mb-2"
              :rules="[
                v => !!v || '아이디를 입력해주세요',
                v => validateId(v) || '아이디는 4-20자의 영문, 숫자, 언더바만 사용 가능합니다',
                v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
              ]"
            ></v-text-field>

            <v-text-field
              v-model="formData.pw"
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              type="password"
              variant="outlined"
              class="mb-2"
              :rules="[
                v => !!v || '비밀번호를 입력해주세요',
                v => validatePassword(v) || '비밀번호는 8자 이상이며, 소문자, 숫자, 특수문자를 모두 포함해야 합니다',
                v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
              ]"
            ></v-text-field>  

            <v-text-field
              v-model="confirmPassword"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력해주세요"
              type="password"
              variant="outlined"
              class="mb-2"
              :rules="[
                v => !!v || '비밀번호 확인을 입력해주세요',
                v => v === formData.pw || '비밀번호가 일치하지 않습니다',
                v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
              ]"
            ></v-text-field>

            <v-text-field
              v-model="formData.name"
              label="성명"
              placeholder="이름을 입력해주세요"
              variant="outlined"
              class="mb-2"
              :rules="[
                v => !!v || '이름을 입력해주세요',
                v => validateName(v) || '이름은 2-30자의 한글 또는 영문만 사용 가능합니다',
                v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
              ]"
            ></v-text-field>

            <v-text-field
              v-model="formData.email"
              label="이메일"
              placeholder="이메일을 입력해주세요"
              variant="outlined"
              class="mb-2"
              :rules="[
                v => !!v || '이메일을 입력해주세요',
                v => validateEmail(v) || '이메일 형식이 올바르지 않습니다',
                v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
              ]"
            ></v-text-field>

            <v-text-field
              v-model="formData.phone"
              label="전화번호"
              placeholder="전화번호를 입력해주세요"
              variant="outlined"
              class="mb-2"
              :rules="[
                v => !!v || '전화번호를 입력해주세요',
                v => validatePhone(v) || '전화번호는 10-11자리의 숫자만 입력 가능합니다',
                v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
              ]"
            ></v-text-field>
            <!-- 작은 화면에서 생기는 버튼 -->
            <v-btn
                v-if="display.mdAndDown.value"
                block
                x-large
                color="black"
                @click="handleSubmit"
                height="80"
                class="mt-10"
                style="border-radius: 15px; font-size: 18px"
              >가입하기
            </v-btn>
          </v-form>
        </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- 다이얼로그 -->
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
          >확인
          </v-btn>
          <template v-else>
            <v-btn 
            color="primary" 
            @click="handleSignup"
            >확인
            </v-btn>
            <v-btn 
              color="error" 
              @click="dialog = false"
            >취소
            </v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-container {
  width: 100%;
  max-width: 100%;
}

.signup-container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .text-h2 {
    font-size: 2.5rem !important;
  }
}

@media (min-width: 960px) and (max-width: 1279px) {
  .signup-container {
    max-width: 900px;
  }
}

@media (min-width: 1280px) {
  .signup-container {
    max-width: 1200px;
  }
  .left-container {
  padding-top: 14rem;
}
}
</style>