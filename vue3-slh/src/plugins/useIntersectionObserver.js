import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useIntersectionObserver() {
  const isVisible = ref(false)
  const target = ref(null)
  let observer = null

  const setupIntersectionObserver = () => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (typeof onVisible === 'function') {
            onVisible()
          }
          observer.unobserve(entry.target)
        }
      })
    }, {
      threshold: 0.1
    })

    if (target.value) {
      observer.observe(target.value)
    }
  }

  onMounted(() => {
    setupIntersectionObserver()
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    isVisible,
    target
  }
}