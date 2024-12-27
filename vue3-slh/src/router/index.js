import { createRouter, createWebHistory } from 'vue-router'
import { usePwFindStore } from '../stores/findpw'

// 사용자 페이지
import HomeView from '../views/HomeView.vue'
import HomeProjectDetail from '../views/HomeProjectDetail.vue'
import HomeContactDetail from '../views/HomeContactDetail.vue'

// 관리자 페이지
import Admin from '../views/Admin.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import FindID from '../views/FindID.vue'
import FindPW from '../views/FindPW.vue'
import UpdatePw from '../views/UpdatePw.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 메인 페이지
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // 프로젝트 상세 페이지
    {
      path: '/projectdetail/:projectNb',
      name: 'projectdetail',
      component: HomeProjectDetail
    },
    {
      path: '/contactdetail',
      name: 'contactdetail',
      component: HomeContactDetail
    },
    // 관리자 페이지
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/findid',
      name: 'findid',
      component: FindID
    },
    {
      path: '/findpw',
      name: 'findpw',
      component: FindPW
    },
    {
      path: '/updatepw',
      name: 'UpdatePW',
      component: () => import('../views/UpdatePw.vue'),
      beforeEnter: (to, from, next) => {
        const pwFindStore = usePwFindStore()
        if (!pwFindStore.isAuthenticated) {
          next('/findpw')
        } else {
          next()
        }
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  }
})
// 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
  // 인증이 필요한 페이지인지 확인
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 로그인 상태 확인
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
