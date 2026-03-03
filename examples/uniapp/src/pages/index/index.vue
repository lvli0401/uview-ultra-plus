<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <up-calendar 
      :show="show"
      :closeOnClickOverlay="true" 
      closeable                         
      @close="show = false"
      @confirm="show = false"></up-calendar>
    <up-button @click="show = !show" class="button" type="primary">{{ show ? '关闭日历' : '打开日历' }}</up-button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Hello')
const show = ref(false);
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.button {
  margin: 50rpx auto;
  width: 50% !important;
}
</style>
