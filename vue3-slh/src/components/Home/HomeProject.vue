<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../../stores/project'
import { useIntersectionObserver } from '../../plugins/useIntersectionObserver'
import HomePartner from './HomePartner.vue'

const router = useRouter()
const { isVisible, target } = useIntersectionObserver()
const store = useProjectStore()

onMounted(async () => {
  await Promise.all([
    store.fetchProjectData(),
    store.fetchStackData()
  ])
})

const formatStack = (stackString) => {
  if (!stackString) return []
  try {
    const stackObj = JSON.parse(stackString)
    return stackObj.stack || []
  } catch (e) {
    console.error('Failed to format stack:', e)
    return []
  }
}

const getStackIcons = (stackString) => {
  const stackArray = formatStack(stackString)
  const icons = []
  
  stackArray.forEach(stackName => {
    const stackDataItem = store.stackData.find(item => item.STACK_NM === stackName)
    if (stackDataItem) {
      icons.push(stackDataItem.ICON)
    }
  })
  
  return icons
}

const goToProjectDetail = (projectNb) => {
  router.push(`/projectdetail/${projectNb}`)
}
</script>

<template>
  <div ref="target">
    <section id="page03" class="section" :class="{ view: isVisible }">
      <div class="wrap">
        <div class="component">
          <div class="maintext">Project</div>
        </div>

        <ul class="list">
          <li v-for="item in store.projectData" :key="item.ID">
            <div class="project-item" @click="goToProjectDetail(item.PROJECT_NB)">
              <img :src="item.PROJECT_IMG" alt="">
              <div class="text">
                <div class="project">{{ item.TITLE }}</div>
                <ul class="img">
                  <li v-for="stackIcon in getStackIcons(item.STACK)" :key="stackIcon">
                    <img :src="stackIcon" alt="">
                  </li>
                </ul>
                <div class="stack">{{ formatStack(item.STACK).join(' / ') }}</div>
              </div>
            </div>
          </li>
        </ul>

        <div class="client">
          <div class="subtext">PARTNER</div>
          <div class="text">함께 자라고 성장하는 주요 고객사</div>
        </div>
      </div>
      <HomePartner /> 
    </section>
  </div>
</template>

<style scoped>
.list li {
  color: var(--main-text-color);
  text-align: left;
  width: 100%;
  padding-bottom: 2vw;
}

.list li a {
  display: block;
}

.list li .text .img li {
  padding: 5px;
  display: inline-block;
  width: auto;
}

.list li .text .img li img {
  width: 70px;
  height: 70px;
  transition: all .3s 0s;
  object-fit: contain;
}
.project-item {
  cursor: pointer;
  transition: all 0.3s ease;
}
@media only screen and (max-width:800px) {
  .list li .text .img li img {
    width: 40px;
    height: 40px;
  }
}
</style>
