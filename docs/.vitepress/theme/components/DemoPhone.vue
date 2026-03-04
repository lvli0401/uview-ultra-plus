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
          <svg class="icon signal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M12 20v-4M17 20v-8M22 20V4M7 20v-2" />
          </svg>
          <svg class="icon wifi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
          <svg class="icon battery" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
            <rect x="4" y="9" width="10" height="6" fill="currentColor" stroke="none" />
            <line x1="22" y1="11" x2="22" y2="13" />
          </svg>
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
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  border-top-left-radius: 33px;
  border-top-right-radius: 33px;
  z-index: 5;
  color: #000;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  width: 14px;
  height: 14px;
  opacity: 0.8;
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
