<template>
  <svg 
    viewBox="0 0 24 24" 
    :width="size" 
    :height="size" 
    :fill="multi ? 'none' : color"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
  >
    <path fill="currentColor" d="M512 74.667c241.536 0 437.333 195.797 437.333 437.333S753.536 949.333 512 949.333a436.1 436.1 0 0 1-242.987-73.685 32 32 0 1 1 35.584-53.163A372.1 372.1 0 0 0 512 885.333c206.187 0 373.333-167.146 373.333-373.333S718.187 138.667 512 138.667 138.667 305.813 138.667 512a372.1 372.1 0 0 0 62.848 207.403 32 32 0 0 1-53.163 35.605A436.1 436.1 0 0 1 74.667 512C74.667 270.443 270.464 74.645 512 74.645z"/><path fill="currentColor" d="M694.315 419.072a32 32 0 0 1 43.221 47.21L540.8 646.38a117.333 117.333 0 0 1-161.344-2.731l-83.093-81.43a32 32 0 1 1 44.8-45.717l83.093 81.43a53.333 53.333 0 0 0 73.344 1.237z"/>
  </svg>
</template>

<script setup>
defineProps({
  size: { type: [String, Number], default: '1em' },
  color: { type: String, default: 'currentColor' },
  multi: { type: Boolean, default: false }
});
</script>