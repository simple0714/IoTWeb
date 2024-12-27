<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { useDisplay } from 'vuetify'
import logo from '../assets/Logo.png'

const router = useRouter()
const route = useRoute()
const URL = "http://localhost:3001/apis/admin/login"
const username = ref('')
const password = ref('')
const error = ref('')
const showModal = ref(false)
const modalMessage = ref('')

// 반응형 설정을 위한 computed 속성
const { mdAndUp, smAndDown } = useDisplay()

onMounted(() => {
  // 로그인 상태 체크
  if (localStorage.getItem('isLoggedIn') === 'true') {
    router.push('/admin')
  }
})

const handleLogin = async (e) => {
  e.preventDefault()
  
  // 유효성 검사
  if (!username.value && !password.value) {
    modalMessage.value = '아이디와 비밀번호를 입력해주세요.'
    showModal.value = true
    return
  } else if (!username.value) {
    modalMessage.value = '아이디를 입력해주세요.'
    showModal.value = true
    return
  } else if (!password.value) {
    modalMessage.value = '비밀번호를 입력해주세요.'
    showModal.value = true
    return
  }

  try {
    const encryptedPassword = CryptoJS.SHA256(password.value).toString()
    
    const response = await axios.get(URL, {
      params: { 
        id: username.value, 
        pw: encryptedPassword 
      },
      withCredentials: true
    })

    if (response.status === 200) {
      const { ADMIN_ID, ADMIN_NM } = response.data.dataInfo
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('adminId', ADMIN_ID)
      localStorage.setItem('adminName', ADMIN_NM)

      const redirectPath = route.query.redirect || '/admin'
      router.push(redirectPath)
    }
  } catch (err) {
    error.value = '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
}
</script>

<template>
  <v-container class="fill-height login-container">
    <v-row justify="center" align="center">
      <v-col cols="12" md="10">
        <v-card flat class="login-card">
          <v-row class="fill-height">
            <!-- 로고 영역 -->
            <v-col cols="12" md="6" class="text-center">
              <v-img
                :src="logo"
                :max-width="$vuetify.display.mdAndUp ? '350' : $vuetify.display.smAndDown ? '200' : '250'"
                class="mx-auto topPadding"
                style="cursor: pointer"
                @click="router.push('/')"
                @load="() => console.log('로고 이미지 로드 완료')"
              />
            </v-col>

            <!-- 로그인 폼 영역 -->
            <v-col cols="12" md="6">
              <v-card-text class="topPadding">
                <v-form @submit.prevent="handleLogin" @keydown.enter="handleLogin">
                  <v-text-field
                    v-model="username"
                    label="아이디"
                    placeholder="아이디를 입력해주세요"
                    variant="outlined"
                    class="mb-2"
                    :rules="[
                      v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
                    ]"
                  />
                  
                  <v-text-field
                    v-model="password"
                    label="비밀번호"
                    placeholder="비밀번호를 입력해주세요"
                    type="password"
                    variant="outlined"
                    class="mb-4"
                    :rules="[
                      v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
                    ]"
                  />

                  <v-btn
                    block
                    color="black"
                    size="large"
                    class="mb-4"
                    height="56"
                    @click="handleLogin"
                  >
                    로그인
                  </v-btn>

                  <v-alert
                    v-if="error"
                    type="error"
                    class="mb-4"
                  >
                    {{ error }}
                  </v-alert>

                  <v-row justify="space-between" no-gutters>
                    <v-col cols="auto">
                      <v-btn
                        variant="text"
                        density="compact"
                        @click="router.push('/signup')"
                      >
                        회원가입
                      </v-btn>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        variant="text"
                        density="compact"
                        @click="router.push('/findid')"
                      >
                        ID찾기
                      </v-btn>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        variant="text"
                        density="compact"
                        @click="router.push('/findpw')"
                      >
                        P/W 찾기
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 모달 -->
    <v-dialog v-model="showModal" max-width="400" @keydown.enter="showModal = false">
      <v-card>
        <v-card-text class="text-center pa-4">
          {{ modalMessage }}
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="black"
            @click="showModal = false"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}

/* 컨테이너 높이 설정 */
.login-container {
  min-height: 80vh !important; /* 뷰포트 높이의 80% */
}

/* 카드 높이 설정 */
.login-card {
  min-height: 600px; 
  padding: 3rem;
}

/* 카드 영역 탑 패딩*/
.topPadding {
  padding-top: 4rem;
}
</style> 