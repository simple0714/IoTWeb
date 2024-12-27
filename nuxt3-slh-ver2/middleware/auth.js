export default defineNuxtRouteMiddleware((to, from) => {
  // 클라이언트 사이드에서만 localStorage를 사용
  if (process.client) {
    if (to.meta.requiresAuth) {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      if (!isLoggedIn) {
        return navigateTo({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    }
  }
})