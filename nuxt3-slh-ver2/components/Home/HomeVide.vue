<script setup>

</script>

<template>
  <div>
    <section id="page01" class="section">
      <div class="video">
        <video muted autoplay loop playsinline src="/img/main_video.mp4" type="video/mp4"></video>
      </div>

      <div class="wrap">
        <div class="title">
          <div class="text">사람을 위한 <br> 실용적인 어플리케이션 메이커</div>
          <div class="subtext">소프트랩 흄</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.video {
    width: 100%;
    overflow: hidden;
}

.video video {
    width: 100%;
    height: auto;
    object-fit: cover;
}

@media only screen and (max-width: 800px) {
    .video {
        height: auto;
    }
}
</style>
