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
/* 기본 헤더 스타일 */
header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
    background-color: #0000004f;
    backdrop-filter: blur(3px);
    box-shadow: -1px 2px 5px #00000014;
    transition: padding .5s 0s;
    color: white;
}

/* 로고 스타일 */
#logo h1 {
    font-size: 0;
    background-image: url(/img/logo_row.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 200px;
    width: 200px;
    height: 40px;
    transition: all .3s 0s;
}

/* 모바일 메뉴 스타일 */
.mobile .button {
    position: relative;
    width: 40px;
    height: 40px;
    cursor: pointer;
}

.mobile .button span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 25px;
    height: 2px;
    background-color: white;
}

.mobile .button span:nth-child(1) {
    transform: translate(-50%,-50%) translateY(-8px);
}

.mobile .button span:nth-child(2) {
    width: 17px;
    transform: translate(-25%,-50%) translateY(0px);
}

.mobile .button span:nth-child(3) {
    transform: translate(-50%,-50%) translateY(8px);
}

/* 모바일 메뉴박스 스타일 */
.mobile .menuBox {
    width: 380px;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    background-color: #222;
    transform: translateX(100%);
    transition: transform .5s 0s;
    z-index: 99999;
}

.mobile.view .menuBox {
    transform: translateX(0%);
    transition: transform .5s .5s;
}

/* 반응형 스타일 */
@media only screen and (max-width: 1000px) {
    header {
        padding: 0;
    }

    #menu ul li {
        font-size: 15px;
    }

    .o1000 {
        display: none;
    }

    .x1000 {
        display: block;
    }
}

@media only screen and (max-width: 700px) {
    #logo h1 {
        background-size: 165px;
        width: 165px;
    }
}

@media only screen and (max-width: 500px) {
    .mobile .menuBox {
        width: 300px;
    }
}

@media only screen and (max-width: 400px) {
    header > .wrap {
        padding: 0 8px;
    }

    #logo h1 {
        height: 50px;
    }

    .mobile .menuBox {
        width: 250px;
    }
}

/* 데스크톱에서 모바일 메뉴 숨기기 */
@media only screen and (min-width: 1001px) {
    .x1000 {
        display: none;
    }
}
</style>