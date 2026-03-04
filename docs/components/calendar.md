# Calendar 日历

<DemoPhone />

此组件用于显示日期，支持单选、多选、日期范围选择等。

## 平台差异说明

| App(vue) | App(nvue) | H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ小程序 |
| :------- | :-------- | :-- | :--------- | :----------- | :--------- | :--------- | :------- |
| √        | √         | √   | √          | √            | √          | √          | √        |

## 基本使用

- 通过`show`绑定一个布尔变量用于打开或收起日历弹窗。
- 通过`mode`参数指定选择日期模式，包含单选/多选/范围选择。

```vue
<template>
  <up-calendar
    :show="show"
    @confirm="confirm"
    @close="show = false"
  ></up-calendar>
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

## 日历模式

### 单个日期模式

`mode` 为 `single` 只能选择单个日期。

```vue
<template>
  <up-calendar :show="show" mode="single" @confirm="confirm"></up-calendar>
</template>
```

### 多个日期模式

`mode` 为 `multiple` 可以选择多个日期。

```vue
<template>
  <up-calendar :show="show" mode="multiple" @confirm="confirm"></up-calendar>
</template>
```

### 日期范围模式

`mode` 为 `range` 可以选择日期范围。

```vue
<template>
  <up-calendar :show="show" mode="range" @confirm="confirm"></up-calendar>
</template>
```

## 自定义主题颜色

通过 `color` 参数自定义主题颜色。

```vue
<template>
  <up-calendar :show="show" color="#f56c6c" @confirm="confirm"></up-calendar>
</template>
```

## 自定义文案

可以通过 `startText`、`endText`、`confirmText` 等属性自定义文案。

```vue
<template>
  <up-calendar
    :show="show"
    mode="range"
    startText="住店"
    endText="离店"
    confirmDisabledText="请请选择日期"
    @confirm="confirm"
  ></up-calendar>
</template>
```

## 是否显示农历

通过 `showLunar` 参数控制是否显示农历。

```vue
<template>
  <up-calendar :show="show" showLunar @confirm="confirm"></up-calendar>
</template>
```

## 默认日期

可以通过 `defaultDate` 定义默认日期。

```vue
<template>
  <up-calendar
    :show="show"
    :defaultDate="defaultDate"
    @confirm="confirm"
  ></up-calendar>
</template>

<script setup>
  const defaultDate = '2023-12-25'
</script>
```

## API

### Props

| 参数                | 说明                                                 | 类型                        | 默认值                  |
| :------------------ | :--------------------------------------------------- | :-------------------------- | :---------------------- |
| title               | 标题内容                                             | String                      | 日期选择                |
| showTitle           | 是否显示标题                                         | Boolean                     | true                    |
| showSubtitle        | 是否显示副标题                                       | Boolean                     | true                    |
| mode                | 选择模式，single-单选，multiple-多选，range-范围选择 | String                      | single                  |
| startText           | mode=range时，第一个日期底部的提示文字               | String                      | 开始                    |
| endText             | mode=range时，最后一个日期底部的提示文字             | String                      | 结束                    |
| customList          | 自定义列表                                           | Array                       | []                      |
| color               | 主题色，对底部按钮和选中日期有效                     | String                      | #3c9cff                 |
| minDate             | 最小的可选日期                                       | String \| Number            | 0                       |
| maxDate             | 最大可选日期                                         | String \| Number            | 0                       |
| defaultDate         | 默认选中的日期                                       | Array \| String \| Date     | null                    |
| maxCount            | mode=multiple时，最多可选多少个日期                  | String \| Number            | Number.MAX_SAFE_INTEGER |
| rowHeight           | 日期行高                                             | String \| Number            | 56                      |
| formatter           | 日期格式化函数                                       | Function                    | null                    |
| showLunar           | 是否显示农历                                         | Boolean                     | false                   |
| showMark            | 是否显示月份背景色                                   | Boolean                     | true                    |
| confirmText         | 确定按钮的文字                                       | String                      | 确定                    |
| confirmDisabledText | 确认按钮处于禁用状态时的文字                         | String                      | 确定                    |
| show                | 是否显示日历弹窗                                     | Boolean                     | false                   |
| closeOnClickOverlay | 是否允许点击遮罩关闭日历                             | Boolean                     | false                   |
| readonly            | 是否为只读状态，只读状态下禁止选择日期               | Boolean                     | false                   |
| showConfirm         | 是否展示确认按钮                                     | Boolean                     | true                    |
| maxRange            | 日期区间最多可选天数，mode = range时有效             | Number \| String            | 无                      |
| rangePrompt         | 范围选择超过最多可选天数时的提示文案                 | String                      | 无                      |
| showRangePrompt     | 超过最多可选天数时，是否展示提示文案                 | Boolean                     | true                    |
| allowSameDay        | 是否允许日期范围的起止时间为同一天                   | Boolean                     | false                   |
| round               | 圆角值                                               | Boolean \| String \| Number | 0                       |
| monthNum            | 最多展示月份数量                                     | Number \| String            | 3                       |

### Events

| 事件名  | 说明               | 回调参数       |
| :------ | :----------------- | :------------- |
| confirm | 点击确认按钮时触发 | 选择的日期信息 |
| close   | 关闭时触发         | -              |

### Methods

| 方法名       | 说明                                     | 参数        |
| :----------- | :--------------------------------------- | :---------- |
| setFormatter | 在微信小程序中，通过此方法设置格式化函数 | (formatter) |
