<template>
  <button :class="classes" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: '',
  },
})

const classes = computed(() => [
  'btn',
  `btn-${props.variant}`,
  props.size ? `btn-${props.size}` : '',
])
</script>
