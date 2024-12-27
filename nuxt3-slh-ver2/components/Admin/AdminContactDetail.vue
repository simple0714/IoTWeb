<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const contactData = ref(null)
const loading = ref(false)
const error = ref(null)
const contactDetailApi = "/api/contact/detail"
const findListApi = "/api/contact/findList"

// const props = defineProps({
//   contactId: {
//     type: Number,
//     required: true
//   },
//   onBack: {
//     type: Function,
//     required: true
//   }
// })


const serviceCodeMapping = {
  SRC01: "IOT 솔루션",
  SRC02: "모바일웹",
  SRC03: "웹서비스",
  SRC04: "IT컨설팅",
  SRC06: "테스트서비스",
  SRC07: "UI / UX",
}

const fetchContactDetail = async () => {
  if (!router.currentRoute.value.params.id) {
    router.push(`/admin/contact`)
    return
  }

  try {
    loading.value = true
    const response = await axios.get(`${contactDetailApi}?id=${router.currentRoute.value.params.id}`)
    // const contact = response.data.dataInfo.rows.find(
    //   item => item.ID === props.contactId
    // )
    const contact = response.data.dataInfo

    if (!contact) {
      router.push(`/admin/contact`)
      return
    }

    contactData.value = contact
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // console.log('DetailComponent mounted, contactId:', router.currentRoute.value.params.id)
  fetchContactDetail()
})

watch(() => router.currentRoute.value.params.id, (newId) => {
  // console.log('DetailComponent - ID 변경됨:', newId)
  fetchContactDetail()
})

const goBack = () => {
  router.push(`/admin/contact`)
}
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row v-if="contactData">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold cursor-pointer mb-4" @click="router.push(`/admin/contact`)">
          프로젝트 요청 조회
        </h2>
        <v-divider class="mb-4"></v-divider>

        <div class="overflow-y-auto max-height-700">
          <h3 class="text-h6 font-weight-bold mb-4">고객정보</h3>
          <v-row no-gutters class="mb-6">
            <v-col cols="4" sm="3" md="2">
              <div class="info-box">회사 또는<br>기관명</div>
              <div class="info-box">담당자명</div>
              <div class="info-box">연락처</div>
              <div class="info-box">이메일</div>
            </v-col>
            <v-col cols="8" sm="9" md="10">
              <div class="item-box">{{ contactData.ORG_NM }}</div>
              <div class="item-box">{{ contactData.USER_NM }}</div>
              <div class="item-box">{{ contactData.PHONE }}</div>
              <div class="item-box">{{ contactData.EMAIL }}</div>
            </v-col>
          </v-row>

          <h3 class="text-h6 font-weight-bold mb-4">서비스타입</h3>
          <div class="d-flex flex-wrap mb-6">
            <div
              v-for="code in JSON.parse(contactData.SERVICE_CD).serviceCd"
              :key="code"
              class="service-code-box"
            >
              {{ serviceCodeMapping[code] || code }}
            </div>
          </div>

          <h3 class="text-h6 font-weight-bold mb-4">프로젝트 예산/일정</h3>
          <v-row no-gutters class="mb-6">
            <v-col cols="2" sm="3" md="2">
              <div class="info-box">예산</div>
              <div class="info-box">일정</div>
            </v-col>
            <v-col cols="10" sm="9" md="10">
              <div class="item-box">{{ Number(contactData.BUDGET).toLocaleString() }}</div>
              <div class="item-box">{{ contactData.SCHEDULE }}</div>
            </v-col>
          </v-row>

          <h3 class="text-h6 font-weight-bold mb-4">프로젝트 내용</h3>
          <v-card
            outlined
            class="pa-4 mb-6"
            min-height="300"
          >
            <v-card-text>
              {{ contactData.PROJECT_INFO }}
            </v-card-text>
          </v-card>

          <div class="d-flex justify-center">
            <v-btn
              variant="outlined"
              @click="goBack"
              height="30"
              width="70"
            >
              목록
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-overlay :model-value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.max-height-700 {
  max-height: 700px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.max-height-700::-webkit-scrollbar {
  display: none;
}

.info-box {
  height: 70px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: none;
  text-align: center;
  padding: 8px;
}

.item-box {
  border: 1px solid black;
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 16px;
  margin-left: -1px;
}

.service-code-box {
  min-width: 80px;
  height: 50px;
  border: 1px solid black;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 0 16px;
}

@media (max-width: 600px) {
  .info-box, .item-box {
    height: 50px;
    font-size: 0.875rem;
  }

  .service-code-box {
    min-width: 60px;
    height: 40px;
    font-size: 0.875rem;
  }
}
</style>