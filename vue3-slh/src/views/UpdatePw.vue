<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePwFindStore } from '../stores/findpw'
import { useDisplay } from 'vuetify'
import axios from 'axios'
import logo from '../assets/logo.png'
import CryptoJS from 'crypto-js'

const router = useRouter()
const pwFindStore = usePwFindStore()
const URL = 'http://localhost:3001/apis/admin/changePw'

const id = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const showModal = ref(false)
const modalMessage = ref('')

// 반응형 설정을 위한 computed 속성
const { mdAndUp, smAndDown } = useDisplay()

onMounted(() => {
  // 인증되지 않은 접근 차단
  if (!pwFindStore.isAuthenticated) {
    router.push('/findpw')
  }
})

// 비밀번호 유효성 검사
const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[a-z\d@$!%*?&]{8,}$/
  return re.test(password)
}

const handleUpdatePassword = async (e) => {
  e.preventDefault()

  try {
    const response = await axios.put(URL, null, {
      params: {
        id: pwFindStore.userId,
        pw: CryptoJS.SHA256(password.value).toString()
      },
      headers: {
        'accept': 'application/json',
      }
    })
    if (response.status === 200) {
      modalMessage.value = '비밀번호가 변경되었습니다.'
      showModal.value = true
    }
  } catch (error) {
    console.error('비밀번호 변경 실패:', error)
    modalMessage.value = '비밀번호 변경에 실패하였습니다.'
    showModal.value = true
  }
}






// 컴포넌트가 언마운트될 때 인증 상태 초기화
onUnmounted(() => {
  pwFindStore.clearAuth()
})
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
                  <!-- <v-text-field
                    v-model="id"
                    label="아이디"
                    placeholder="비밀번호를 변경할 아이디를 입력해주세요"
                    variant="outlined"
                    class="mb-2"
                    :rules="[
                      v => !!v || '아이디를 입력해주세요'
                    ]"
                  /> -->
                  
                  <v-text-field
                    v-model="password"
                    label="비밀번호"
                    placeholder="비밀번호를 입력해주세요"
                    variant="outlined"
                    class="mb-4"
                    type="password"
                    :rules="[
                      v => !!v || '비밀번호를 입력해주세요',
                      v => validatePassword(v) || '비밀번호는 8자 이상이1며, 소문자, 숫자, 특수문자를 모두 포함해야 합니다',
                      v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
                    ]"
                  />
                  <v-text-field
                    v-model="confirmPassword"
                    label="비밀번호 확인"
                    placeholder="비밀번호를 다시 입력해주세요"
                    variant="outlined"
                    class="mb-4"
                    type="password"
                    :rules="[
                      v => !!v || '비밀번호를 입력해주세요',
                      v => v === password || '비밀번호가 일치하지 않습니다',
                      v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
                    ]"
                  />

                  <v-btn
                    block
                    color="black"
                    size="large"
                    class="mb-4"
                    height="56"
                    @click="handleUpdatePassword"
                  >
                    비밀번호 변경
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
                      >
                        
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
                  </v-row>
                </v-form>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 모달 -->
    <v-dialog v-model="showModal" max-width="400" >
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
