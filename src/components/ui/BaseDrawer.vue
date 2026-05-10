<template>
  <Teleport to="body">
    <div v-if="modelValue" class="drawer-backdrop" @click.self="$emit('update:modelValue', false)">
      <div class="drawer-panel bg-white shadow">
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
          <div>
            <h5 class="mb-0">
              <slot name="title" />
            </h5>
            <small class="text-secondary">
              <slot name="subtitle" />
            </small>
          </div>

          <button type="button" class="btn-close" @click="$emit('update:modelValue', false)"></button>
        </div>

        <div class="drawer-content p-3">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1050;
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: min(720px, 100%);
  height: 100%;
  overflow: auto;
}

.drawer-content {
  min-height: calc(100% - 64px);
}
</style>