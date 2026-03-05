<template>
  <svg 
    viewBox="0 0 24 24" 
    :width="size" 
    :height="size" 
    :fill="multi ? 'none' : color"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
  >
    <path d="m739.84 476.16-384-384c-20.48-20.48-51.2-20.48-71.68 0s-20.48 51.2 0 71.68L632.32 512 284.16 860.16c-20.48 20.48-20.48 51.2 0 71.68C294.4 942.08 307.2 947.2 320 947.2s25.6-5.12 35.84-15.36l384-384c20.48-20.48 20.48-51.2 0-71.68"/>
  </svg>
</template>

<script setup>
defineProps({
  size: { type: [String, Number], default: '1em' },
  color: { type: String, default: 'currentColor' },
  multi: { type: Boolean, default: false }
});
</script>