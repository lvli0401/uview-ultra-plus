# Calendar 日历

<DemoPhone />

此组件用于显示日期，支持单选、多选、日期范围选择等。

## 基本使用

```vue
<template>
  <up-calendar :show="show" @confirm="confirm"></up-calendar>
  <up-button @click="show = true">打开日历</up-button>
</template>

<script setup>
  import { ref } from 'vue'
  const show = ref(false)
  const confirm = e => {
    console.log(e)
    show.value = false
  }
</script>
```

## API

### Props

| 参数  | 说明                                   | 类型    | 默认值 |
| ----- | -------------------------------------- | ------- | ------ |
| show  | 是否显示日历                           | boolean | false  |
| mode  | 选择模式，可选 single, multiple, range | string  | single |
| title | 标题                                   | string  | 日历   |

### Events

| 事件名  | 说明               | 回调参数       |
| ------- | ------------------ | -------------- |
| confirm | 点击确认按钮时触发 | 选择的日期信息 |
| close   | 关闭时触发         | -              |
| change  | 选择日期改变时触发 | 选择的日期信息 |
