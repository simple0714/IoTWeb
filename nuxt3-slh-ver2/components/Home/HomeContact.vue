<script setup>
import { ref, computed } from 'vue'
import { useContactStore } from '~/stores/contact'
import { useIntersectionObserver } from '@vueuse/core'
import { useDisplay } from 'vuetify'

const contactStore = useContactStore()
const isVisible = ref(false)
const target = ref(null)
const form = ref(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  isVisible.value = isIntersecting
})

const dialog = ref(false)
const dialogType = ref('alert')
const dialogTitle = ref('')
const dialogMessage = ref('')

const serviceData = computed(() => contactStore.serviceData || [])

const submitForm = async () => {
  // 각 필수 입력 필드 검사
  if (!contactStore.orgNm || !contactStore.name || !contactStore.phone || !contactStore.email || !contactStore.selectedServices || !contactStore.budget || !contactStore.schedule || !contactStore.description) {
    showErrorModal('모든 칸을 입력해주세요.');
    return;
  }
  if (!contactStore.orgNm) {
    showErrorModal('회사 또는 기관명을 입력해주세요.');
    return;
  }
  if (!contactStore.name) {
    showErrorModal('담당자명을 입력해주세요.');
    return;
  }
  if (!contactStore.phone) {
    showErrorModal('연락처를 입력해주세요.');
    return;
  }
  if (!contactStore.email) {
    showErrorModal('이메일을 입력해주세요.');
    return;
  }
  if (contactStore.selectedServices.length === 0) {
    showErrorModal('서비스를 선택해주세요.');
    return;
  }
  if (!contactStore.budget) {
    showErrorModal('예산을 입력해주세요.');
    return;
  }
  if (!contactStore.schedule) {
    showErrorModal('일정을 입력해주세요.');
    return;
  }
  if (!contactStore.description) {
    showErrorModal('프로젝트 설명을 입력해주세요.');
    return;
  }

  const responseData = await contactStore.submitContactForm()

  dialog.value = true
  if (responseData) {
    dialogType.value = 'alert';
    dialogTitle.value = '제출 완료';
    dialogMessage.value = '제출이 완료되었습니다.';

    contactStore.$patch({
      orgNm: '',
      name: '',
      phone: '',
      email: '',
      selectedServices: [],
      budget: '',
      schedule: '',
      description: '',
    })
    form.value.reset()
  }
}

const showErrorModal = (message) => {
  dialog.value = true;
  dialogType.value = 'alert';
  dialogTitle.value = '입력 확인';
  dialogMessage.value = message;
}
const closeDialog = () => {
  dialog.value = false
  dialogType.value = 'alert'
  dialogTitle.value = ''
  dialogMessage.value = ''
}

const confirmDialog = () => {
  dialog.value = false
  dialogType.value = 'alert'
  dialogTitle.value = ''
  dialogMessage.value = ''
}

const clearServiceError = () => {
  contactStore.serviceError = null
}

contactStore.$patch({ serviceData: [] }) // 초기화
</script>

<template>
    <div ref="target">
    <section id="page04" class="section" :class="{ view: isVisible }">
      <div class="wrap">
        <div class="component">
          <div class="maintext">CONTACT</div>
          <span>아이디어만 있어도 좋아요, <br> 소프트랩 흄과 함께 할 당신을 소개해주세요.</span>
        </div>

        <div class="o1000">
          <v-form @submit.prevent="submitForm" ref="form">
            <div class="board">
              <div class="left">
                <ul id="question">
                  <li class="number">01</li>
                  <li class="text">고객 정보</li>
                  <li class="memo">* 기재하신 연락처로 담당자가 연락 또는 이메일을 드립니다.</li>
                </ul>

                <ul id="answer">
                  <div class="grid">
                    <v-text-field 
                      v-model="contactStore.orgNm"
                      label="회사 또는 기관명"
                      type="text"
                      variant="outlined"
                      :rules="[v => !!v || '회사 또는 기관명을 입력해주세요', v => v.trim().length > 0 || '공백은 입력할 수 없습니다']"
                    ></v-text-field>
                    <v-text-field 
                      v-model="contactStore.name" 
                      label="담당자명" 
                      type="text"
                      variant="outlined"
                      :rules="[v => !!v || '담당자명을 입력해주세요', v => v.trim().length > 0 || '공백은 입력할 수 없습니다']"
                    ></v-text-field>
                    <v-text-field 
                      v-model="contactStore.phone" 
                      label="연락처(-제외)"
                      type="tel"
                      variant="outlined"
                      :rules="[
                        v => !!v || '연락처를 입력해주세요',
                        v => (v.length === 10 || v.length === 11) || '연락처는 10~11자리를 입력해주세요',
                        v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
                      ]"
                    ></v-text-field>
                    <v-text-field 
                      v-model="contactStore.email" 
                      type="email" 
                      label="이메일"
                      variant="outlined"
                      :rules="[
                        v => !!v || '이메일을 입력해주세요',
                        v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || '유효한 이메일 주소를 입력해주세요',
                        v => v.trim().length > 0 || '공백은 입력할 수 없습니다',
                      ]"
                    ></v-text-field>
                  </div>
                </ul>

                <ul id="question">
                  <li class="number">02</li>
                  <li class="text">함께 하고 싶은 서비스는 무엇인가요?</li>
                  <li class="memo">* 중복선택가능</li>
                </ul>

                <div id="select">
                  <label v-for="service in serviceData" :key="service.ID" class="checkbox button">
                    {{ service.SERVICE_NM }}
                    <input 
                      type="checkbox" 
                      name="tag" 
                      :value="service.SERVICE_CD" 
                      v-model="contactStore.selectedServices"
                      @change="clearServiceError" 
                      hidden
                    >
                  </label>
                  <div v-if="contactStore.serviceError" style="color: red;">
                    {{ contactStore.serviceError }}
                  </div>
                </div>
              </div>

              <div class="right">
                <ul id="question">
                  <li class="number">03</li>
                  <li class="text">프로젝트 예산 / 일정을 알려주세요.</li>
                </ul>

                <ul id="answer">
                  <div class="grid">
                    <div class="inlineWrapper">
                      <v-text-field
                        label="예산 입력"
                        v-model="contactStore.budget"
                        type="text"
                        variant="outlined"
                        :rules="[
                          v => !!v || '예산을 입력해주세요',
                          v => v.trim().length > 0 || '공백은 입력할 수 없습니다',
                          v => /^\d+$/.test(v) || '숫자만 입력해주세요'
                        ]"
                      ></v-text-field>
                      <div class="inlineDiv"></div>
                    </div>
                    <div class="inlineWrapper">
                      <v-text-field
                        label="일정 입력"
                        v-model="contactStore.schedule"
                        type="text"
                        variant="outlined"
                        :rules="[
                          v => !!v || '일정을 입력해주세요',
                          v => v.trim().length > 0 || '공백은 입력할 수 없습니다'
                        ]"
                      ></v-text-field>
                      <div class="inlineDiv"></div>
                    </div>
                  </div>
                </ul>  

                <ul id="question">
                  <li class="number">04</li>
                  <li class="text">구상 중이신 프로젝트에 대해 자세히 설명해 주세요.</li>
                </ul>

                <ul id="answer">
                  <div>
                    <span class="ex">
                      예시) <br>
                      프로젝트 제목 : 소프트랩 흄 모바일 앱 리뉴얼<br>
                      프로젝트 목적 : 기존 앱을 트렌드에 맞게 리뉴얼하고 싶습니다.<br>
                      선호하는 컨셉 : 홈페이지 주소 또는 텍스트로 입력해주세요.<br>
                      문의 내용 : 프로젝트에 대해 강조하고 싶은 내용을 입력해주세요.
                    </span>
                    <v-textarea
                      type="text"
                      variant="outlined"
                      v-model="contactStore.description" 
                      :rules="[v => !!v || '내용을 입력해주세요', v => v.trim().length > 0 || '공백은 입력할 수 없습니다']"
                    ></v-textarea>
                  </div>
                </ul>
              </div>
            </div>
            <input type="submit" name="제출">
          </v-form>
        </div>

        <router-link to="/contact" class="mob_btn x1000">문의하기</router-link>
        <br>
        <br>
        <br>
        <br>
        <br>
      </div>
    </section>

    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h5 pa-4">
          {{ dialogTitle }}
        </v-card-title>

        <v-card-text class="pa-4">
          {{ dialogMessage }}
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            @click="confirmDialog"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.inlineWrapper {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

:deep(.v-text-field__details) {
  overflow: visible !important;
}

:deep(.v-messages__wrapper) {
  white-space: normal !important;
}

:deep(.v-messages__message) {
  word-wrap: break-word !important;
  color: red !important;
  font-size: 12px !important;  
  margin-top: -4px !important; 
  /* line-height: 1.2 !important;  */
}
</style>
