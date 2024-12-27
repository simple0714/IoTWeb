<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useDisplay } from 'vuetify'
import logo from '../assets/Logo.png'

const router = useRouter()
const route = useRoute()
const URL = "http://localhost:3001/apis/admin/findId"
const username = ref('')
const email = ref('')
const error = ref('')
const showModal = ref(false)
const modalMessage = ref('')

// 반응형 설정을 위한 computed 속성
const { mdAndUp, smAndDown } = useDisplay()

const handleFindId = async (e) => {
  e.preventDefault()

  // 유효성 검사
  if (!username.value && !email.value) {
    error.value = '이름과 이메일을 입력해주세요.'
    return
  } else if (!username.value) {
    error.value = '이름을 입력해주세요.'
    return
  } else if (!email.value) {
    error.value = '이메일을 입력해주세요.'
    return
  }

  try {
    // console.log(username.value, email.value)
    const response = await axios.get(URL, {
      params: {  // params 추가
        name: username.value,
        email: email.value
      },
      headers: {  // headers 추가
        'accept': 'application/json'
      }
    })

    if (response.status === 200) {
      const foundId = response.data.ADMIN_ID
      modalMessage.value = `찾으시는 아이디는 ${foundId} 입니다.`
      showModal.value = true
      
      // 입력 필드 초기화
      username.value = ''
      email.value = ''
      error.value = ''
    }
  } catch (error) {
    console.error('아이디 찾기 실패:', error)
    modalMessage.value = '아이디를 찾을 수 없습니다. 입력하신 정보를 확인해주세요.'
    showModal.value = true
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

            <v-col cols="12" md="6">
              <v-card-text class="topPadding">
                <v-form @submit.prevent="">
                  <v-text-field
                    v-model="username"
                    label="이름"
                    placeholder="이름을 입력해주세요"
                    variant="outlined"
                    class="mb-2"
                    :rules="[
                      v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
                    ]"
                  />
                  
                  <v-text-field
                    v-model="email"
                    label="이메일"
                    placeholder="이메일을 입력해주세요"
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
                    @click="handleFindId"
                  >
                    아이디 찾기
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
                        @click="router.push('/login')"
                      >
                        로그인
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
    <v-dialog v-model="showModal" max-width="400">
      <v-card>
        <v-card-text class="text-center pa-4">
          {{ modalMessage }}
        </v-card-text>
        <v-card-actions class="justify-center gap-2">
          <v-btn
            color="black"
            @click="() => {
              showModal = false
              router.push('/login')
            }"
          >
            로그인
          </v-btn>
          <v-btn
            color="black"
            @click="() => {
              showModal = false
              router.push('/findpw')  // 비밀번호 찾기 페이지로 이동
            }"
          >
            비밀번호 찾기
          </v-btn>
          <v-btn
            color="black"
            @click="showModal = false"
          >
            닫기
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

.gap-2 {
  gap: 8px;
}
</style>