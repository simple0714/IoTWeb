<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isDarkTheme = ref(false)
const isMenuOpen = ref(false)

const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    document.documentElement.setAttribute("theme", isDarkTheme.value ? "black" : "white")
    localStorage.setItem("theme", isDarkTheme.value ? "black" : "white")
}

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
    isMenuOpen.value = false
}

onMounted(() => {
    const savedTheme = localStorage.getItem("theme")
    isDarkTheme.value = savedTheme === "black"
    document.documentElement.setAttribute("theme", isDarkTheme.value ? "black" : "white")
})
</script>

<template>
  <div>
    <header>
      <div class="top">
        <div class="wrap header">
          <ul>
            <li><router-link to="/admin">ADMIN</router-link></li>

            <li>
              <a href="#">
                <div class="mode">
                  <img class="light" src="/img/light_button.png" alt="">
                  <label :class="['toggle', 'theme', { view: isDarkTheme }]">
                    <input type="checkbox" :checked="isDarkTheme" @click="toggleTheme" hidden>
                  </label>
                  <img class="dark" src="/img/dark_button.png" alt="">
                </div>
              </a>
            </li>
          </ul>
        </div>
    </div>
    
    <div class="wrap">
        <div class="flex">
          <a href="#" id="logo">
            <h1>SOFT-LAB HUM</h1>
          </a>
          <nav id="menu" class="o1000">
            <ul>
              <li><a href="#page02">ABOUT</a></li>
              <li><a href="#page03">PROJECT</a></li>
              <li><a href="#page04">CONTACT</a></li>

              <!-- TODO : 검색 -->
              <form action="./search.html" method="get" id="search">
                <input type="text" name="query" class="query">
                <button type="submit" class="submit">
                  <img src="/img/search_ic.png" alt="">
                </button>
              </form>
            </ul>    
          </nav>
            
          <div class="mobile x1000" :class="{ view: isMenuOpen }">
            <div class="button" @click="toggleMenu">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div class="menuBox">
              <div class="logo">
                <img src="/img/logo_column.png" alt="">
              </div>
              
              <form action="./search.html" method="get" id="search_mb">
                <input type="text" name="query" class="query">
                <button type="submit" class="submit">
                  <img src="/img/search_ic.png" alt="">
                </button>
              </form>
              
              <ul class="list">
                <li><a href="#page02" @click="closeMenu">ABOUT</a></li>
                <li><a href="#page03" @click="closeMenu">PROJECT</a></li>
                <li><a href="#page04" @click="closeMenu">CONTACT</a></li>
                <li><a href="#" @click="closeMenu">ADMIN</a></li>
              </ul>
            </div>
              
              <div class="menuBg" @click="closeMenu"></div>
          </div>
        </div>
      </div>
    </header>
</div>
</template>

<style scoped>

</style>
