<script setup>
import { ref, computed, h } from 'vue'
import { useDisplay } from 'vuetify'
import AdminHeader from '../components/Admin/AdminHeader.vue'
import AdminNav from '../components/Admin/AdminNav.vue'
import AdminDashBoard from '../components/Admin/AdminDashBoard.vue'
// 소개글 관리
import AdminAbout from '../components/Admin/AdminAbout.vue'
import AdminAddAbout from '../components/Admin/AdminAddAbout.vue'
import AdminUpdateAbout from '../components/Admin/AdminUpdateAbout.vue'
// 프로젝트 관리
import AdminProjectList from '../components/Admin/AdminProjectList.vue'
import AdminAddProject from '../components/Admin/AdminAddProject.vue'
import AdminUpdateProject from '../components/Admin/AdminUpdateProject.vue'
// 협력사 관리
import AdminPartner from '../components/Admin/AdminPartner.vue'
import AdminAddPartner from '../components/Admin/AdminAddPartner.vue'
import AdminUpdatePartner from '../components/Admin/AdminUpdatePartner.vue'
// 프로젝트 요청 조회
import AdminContact from '../components/Admin/AdminContact.vue'
import AdminContactDetail from '../components/Admin/AdminContactDetail.vue'

const display = useDisplay()
const drawerWidth = 240
const drawer = ref(!display.mdAndDown.value)
const selectedNav = ref('dashboard')
const selectedContactId = ref(null)

// computed를 사용한 renderContent
const currentComponent = computed(() => {
  switch (selectedNav.value) {
    case 'dashboard':
      return h(AdminDashBoard, { onSelect: handleNavSelect })
    // 소개글 관리
    case 'about':
      return h(AdminAbout, { onSelect: handleNavSelect })
    case 'addabout':
      return h(AdminAddAbout, { onSelect: handleNavSelect })
    case 'updateabout':
      return h(AdminUpdateAbout, { onSelect: handleNavSelect })
    // 프로젝트 관리
    case 'project':
      return h(AdminProjectList, { onSelect: handleNavSelect })
    case 'addproject':
      return h(AdminAddProject, { onSelect: handleNavSelect })
    case 'updateproject':
      return h(AdminUpdateProject, { onSelect: handleNavSelect })
    // 협력사 관리
    case 'partner':
      return h(AdminPartner, { onSelect: handleNavSelect })
    case 'addpartner':
      return h(AdminAddPartner, { onSelect: handleNavSelect })
    case 'updatepartner':
      return h(AdminUpdatePartner, { onSelect: handleNavSelect })
    // 프로젝트 요청 조회
    case 'contact':
      return selectedContactId.value 
        ? h(AdminContactDetail, { 
            contactId: selectedContactId.value,
            onBack: () => {
              selectedContactId.value = null
            }
          })
        : h(AdminContact, { 
            onSelectContact: (id) => {
              selectedContactId.value = id
            }
          })
    default:
      return h(AdminDashBoard, { onSelect: handleNavSelect })
  }
})


const handleDrawerToggle = () => {
  drawer.value = !drawer.value
}

const handleNavSelect = (nav) => {
  selectedNav.value = nav
  selectedContactId.value = null 
  if (display.mdAndDown.value) {
    drawer.value = false
  }
}
</script>

<template>
  <v-app>
    <v-app-bar
      :elevation="0"
      color="black"
      :class="{ 'pl-0': !display.mdAndDown.value }"
    >
      <v-app-bar-nav-icon
        v-if="display.mdAndDown.value"
        @click="handleDrawerToggle"
      ></v-app-bar-nav-icon>
      <AdminHeader />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :permanent="!display.mdAndDown.value"
      :temporary="display.mdAndDown.value"
      :width="drawerWidth"
      app
      color="white"
      location="left"
      elevation="1"
    >
      <AdminNav 
        :onSelect="handleNavSelect" 
        :drawer="drawer"
      />
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <!-- 동적 컴포넌트 렌더링 -->
        <component 
          :is="currentComponent"
          @update-nav="handleNavSelect"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  padding-top: 64px;
}

.v-navigation-drawer {
  top: 64px !important;
  height: calc(100% - 64px) !important;
}

@media (max-width: 960px) {
  .v-navigation-drawer {
    top: 0 !important;
    height: 100% !important;
  }
}
</style>

