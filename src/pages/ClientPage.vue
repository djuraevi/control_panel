<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="container py-4">
    <h1 class="h3">Client details page</h1>

    <p class="mb-0">
      ID: {{ route.params.id }}
    </p>
  </div>
</template>