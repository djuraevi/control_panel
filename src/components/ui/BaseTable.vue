<template>
  <table class="table align-middle mb-0 clients-table">
    <thead>
    <tr>
      <th v-for="column in columns" :key="column.key" scope="col">
        <button
            type="button"
            class="btn btn-link p-0 text-decoration-none text-body fw-semibold"
            @click="$emit('sort', column.key)"
        >
          {{ column.label }}
          <span v-if="sortKey === column.key" class="text-secondary">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </button>
      </th>
    </tr>
    </thead>

    <tbody>
    <tr v-if="!rows.length">
      <td :colspan="columns.length" class="py-5 text-center text-secondary">
        Клиенты не найдены
      </td>
    </tr>

    <tr
        v-for="row in rows"
        :key="row.id"
        role="button"
        style="cursor: pointer;"
        @click="$emit('row-click', row.id)"
    >
      <td>{{ row.id }}</td>
      <td>{{ row.company }}</td>
      <td>{{ row.director }}</td>
      <td>{{ row.phone }}</td>
      <td>{{ row.buildingName || '—' }}</td>
      <td>{{ row.contractNumber || '—' }}</td>
      <td>{{ row.contractDate || '—' }}</td>
      <td>{{ row.objectsCount }}</td>
      <td>
          <span
              class="badge"
              :class="{ 'text-bg-secondary': !row.statusColor }"
              :style="getStatusStyle(row.statusColor)"
          >
            {{ row.statusName || '—' }}
          </span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { ClientSortKey, ClientTableColumn, ClientTableRow, SortDirection } from '@/domain/types'

defineProps<{
  rows: ClientTableRow[]
  columns: ClientTableColumn[]
  sortKey: ClientSortKey
  sortDirection: SortDirection
  getStatusStyle: (color: string | null) => Partial<Record<string, string>>
}>()

defineEmits<{
  (e: 'row-click', id: number): void
  (e: 'sort', key: ClientSortKey): void
}>()

</script>

<style scoped>
.clients-table {
  min-width: 980px;
}
</style>
