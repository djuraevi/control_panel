<template>
  <input
      class="form-control"
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      @input="handleInput"
  >
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>
