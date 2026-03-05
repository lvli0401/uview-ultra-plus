<template>
  <svg 
    viewBox="0 0 24 24" 
    :width="size" 
    :height="size" 
    :fill="multi ? 'none' : color"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
</template>

<script setup>
defineProps({
  size: { type: [String, Number], default: '1em' },
  color: { type: String, default: 'currentColor' },
  multi: { type: Boolean, default: false }
});
</script>