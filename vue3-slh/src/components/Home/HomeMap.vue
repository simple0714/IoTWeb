<script setup>
import { ref, watch } from 'vue'
import { useIntersectionObserver } from '../../plugins/useIntersectionObserver'

const { isVisible, target } = useIntersectionObserver()
const mapContainer = ref(null)
let scriptLoaded = false

function initializeMap() {
  if (!scriptLoaded) {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=b64dca9f82f63b262471bc27e36439ff&autoload=false`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      scriptLoaded = true
      loadMap()
    }
  } else {
    loadMap()
  }
}

function loadMap() {
  kakao.maps.load(() => {
    const mapOptions = {
      center: new kakao.maps.LatLng(35.877075, 128.723421),
      level: 3,
    }

    const map = new kakao.maps.Map(mapContainer.value, mapOptions)

    const markerPosition = new kakao.maps.LatLng(35.877075, 128.723421)
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    })
    marker.setMap(map)
  })
}

watch(isVisible, (newValue) => {
  if (newValue) {
    initializeMap()
  }
})
</script>

<template>
  <div ref="target">
    <section id="page05" class="section" :class="{ view: isVisible }">
      <div class="wrap">
        <div class="map">
          <div class="left" ref="mapContainer"></div>
          <div class="right">
            <div class="address">
              <div class="text">오시는 길</div>
              <div class="subtext">대구광역시 동구 신서로 21길 3-10 C호실 소프트랩 흄</div>
            </div>
          </div> 
        </div>
      </div>
      <br><br><br><br><br>
      <br><br><br><br><br>
    </section>
  </div>
</template>

<style scoped>
</style>

