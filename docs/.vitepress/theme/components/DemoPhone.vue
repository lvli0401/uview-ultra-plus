<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    default: ''
  }
})

const finalUrl = computed(() => {
  // If url is provided, use it. Otherwise, show a placeholder.
  return props.url || 'https://lvli0401.github.io/uview-ultra-plus/h5/'
})
</script>

<template>
  <div class="phone-simulator">
    <div class="phone-frame">
      <div class="phone-content">
        <iframe :src="finalUrl" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone-simulator {
  position: fixed;
  right: calc(50% - 700px); /* Center relative to content */
  top: 100px;
  width: 320px;
  height: 640px;
  z-index: 10;
  display: block;
}

@media (max-width: 1400px) {
  .phone-simulator {
    position: relative;
    right: 0;
    top: 0;
    margin: 40px auto;
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .phone-simulator {
    width: 280px;
    height: 560px;
    transform: scale(0.9);
  }
}

.phone-frame {
  width: 310px;
  height: 620px;
  border: 12px solid #333;
  border-radius: 40px;
  position: relative;
  background: #000;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.phone-frame::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 25px;
  background: #333;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  z-index: 2;
}

.phone-content {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>
