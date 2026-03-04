<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    default: ''
  }
})

const finalUrl = computed(() => {
  // If url is provided, use it. Otherwise, use the global __DEMO_URL__.
  return props.url || __DEMO_URL__
})
</script>

<template>
  <div class="phone-simulator">
    <div class="phone-frame">
      <div class="phone-status-bar">
        <span class="time">9:41</span>
        <div class="status-icons">
          <span class="signal">📶</span>
          <span class="wifi">📶</span>
          <span class="battery">🔋</span>
        </div>
      </div>
      <div class="phone-content">
        <iframe :src="finalUrl" frameborder="0"></iframe>
      </div>
      <div class="phone-home-indicator"></div>
    </div>
  </div>
</template>

<style scoped>
.phone-simulator {
  position: fixed;
  right: 20px;
  top: 80px;
  width: 320px;
  height: 660px;
  z-index: 10;
}

@media (max-width: 1200px) {
  .phone-simulator {
    position: relative;
    right: 0;
    top: 0;
    margin: 40px auto;
    display: flex;
    justify-content: center;
    width: 310px;
    height: 640px;
  }
}

@media (max-width: 768px) {
  .phone-simulator {
    width: 280px;
    height: 580px;
    transform: scale(0.9);
  }
}

.phone-frame {
  width: 310px;
  height: 640px;
  border: 12px solid #1a1a1a;
  border-radius: 45px;
  position: relative;
  background: #1a1a1a;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
}

/* Safe Area: Notch */
.phone-frame::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 28px;
  background: #1a1a1a;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  z-index: 10;
}

.phone-status-bar {
  height: 35px;
  padding: 0 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  font-size: 12px;
  font-weight: bold;
  border-top-left-radius: 33px;
  border-top-right-radius: 33px;
  z-index: 5;
}

.phone-content {
  flex: 1;
  background: #fff;
  overflow: hidden;
  position: relative;
}

/* Safe Area: Home Indicator */
.phone-home-indicator {
  height: 25px;
  background: #fff;
  border-bottom-left-radius: 33px;
  border-bottom-right-radius: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.phone-home-indicator::after {
  content: "";
  width: 100px;
  height: 4px;
  background: #000;
  border-radius: 2px;
  opacity: 0.2;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>
