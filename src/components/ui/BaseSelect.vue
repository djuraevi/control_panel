<template>
  <select
      class="form-select"
      :value="modelValue"
      @change="handleChange"
  >
    <option
        v-for="option in options"
        :key="String(option.value)"
        :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
interface SelectOption {
  label: string
  value: string | number
}

withDefaults(defineProps<{
  modelValue?: string | number
  options?: SelectOption[]
}>(), {
  modelValue: '',
  options: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

function parseValue(value: string) {
  return value === '' || Number.isNaN(Number(value)) ? value : Number(value)
}

function handleChange(event: Event) {
  emit('update:modelValue', parseValue((event.target as HTMLSelectElement).value))
}
</script>
