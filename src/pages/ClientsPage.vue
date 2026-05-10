<template>
  <div class="container py-4">
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="h3 mb-1">Клиенты</h1>
        <p class="text-secondary mb-0">
          Всего клиентов: {{ clientsStore.totalItems }}
        </p>
      </div>

    </div>

    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-12 col-lg-4">
            <BaseInput
                :model-value="uiStore.search"
                placeholder="Поиск по клиентам"
                @update:modelValue="uiStore.setSearch"
            />
          </div>

          <div class="col-12 col-md-6 col-lg-3">
            <BaseSelect
                :model-value="uiStore.activeStatusId"
                :options="statusOptions"
                @update:modelValue="handleStatusChange"
            />
          </div>

          <div class="col-12 col-md-6 col-lg-3">
            <BaseSelect
                :model-value="uiStore.sortKey"
                :options="sortOptions"
                @update:modelValue="handleSortChange"
            />
          </div>

          <div class="col-12 col-lg-2 d-flex align-items-end">
            <BaseButton
                variant="outline-secondary"
                class="w-100"
                @click="uiStore.resetFilters"
            >
              Сбросить
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="clientsStore.loading" class="card shadow-sm border-0">
      <div class="card-body">
        <div class="placeholder-glow d-grid gap-3">
          <span class="placeholder col-12 py-3"></span>
          <span class="placeholder col-10 py-3"></span>
          <span class="placeholder col-11 py-3"></span>
          <span class="placeholder col-8 py-3"></span>
        </div>
      </div>
    </div>

    <div v-else-if="clientsStore.error" class="alert alert-danger">
      {{ clientsStore.error }}
    </div>

    <div v-else class="card shadow-sm border-0">
      <div class="card-body">
        <div class="table-responsive">
          <BaseTable
              :rows="clientsStore.visibleRows"
              :columns="columns"
              :sort-key="uiStore.sortKey"
              :sort-direction="uiStore.sortDirection"
              :get-status-style="getStatusStyle"
              @row-click="openClientDetails"
              @sort="uiStore.setSort"
          />
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-3">
      <small class="text-secondary">
        Показано {{ clientsStore.visibleRows.length }} из {{ clientsStore.totalItems }}
      </small>

      <div class="d-flex gap-2">
        <BaseButton
            variant="outline-secondary"
            size="sm"
            :disabled="uiStore.currentPage <= 1"
            @click="uiStore.setPage(uiStore.currentPage - 1)"
        >
          Назад
        </BaseButton>

        <BaseButton
            variant="outline-secondary"
            size="sm"
            :disabled="uiStore.currentPage >= clientsStore.totalPages"
            @click="uiStore.setPage(uiStore.currentPage + 1)"
        >
          Вперёд
        </BaseButton>
      </div>
    </div>

    <ClientDetailsDrawer
        v-model="isDrawerOpen"
        :client="clientsStore.selectedClientDetails"
        :saving-object-id="clientsStore.objectSavingId"
        @update-object-floor="handleObjectFloorUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import ClientDetailsDrawer from '@/components/clients/ClientDetailsDrawer.vue'
import { useClientTable } from '@/composables/useClientTable'
import { useClientsQuerySync } from '@/composables/useClientsQuerySync'
import { useClientsStore } from '@/stores/clients.store'
import { useUiStore } from '@/stores/ui.store'

const clientsStore = useClientsStore()
const uiStore = useUiStore()
const { columns, getStatusStyle } = useClientTable()

const isDrawerOpen = ref(false)

useClientsQuerySync(uiStore)

const statusOptions = computed(() => [
  { label: 'Все статусы', value: '' },
  ...Array.from(
      new Map(
          clientsStore.tableRows
              .filter((row) => row.statusId !== null)
              .map((row) => [row.statusId as number, row.statusName]),
      ).entries(),
  ).map(([value, label]) => ({
    value,
    label: label || 'Без статуса',
  })),
])

const sortOptions = [
  { label: 'Сортировка: ID', value: 'id' },
  { label: 'Компания', value: 'company' },
  { label: 'Директор', value: 'director' },
  { label: 'Телефон', value: 'phone' },
  { label: 'Здание', value: 'building' },
  { label: 'Договор', value: 'contract_number' },
  { label: 'Объекты', value: 'objects' },
  { label: 'Дата договора', value: 'created_at' },
]

function handleStatusChange(value: string | number) {
  if (value === '') {
    uiStore.setStatusFilter('')
    return
  }

  uiStore.setStatusFilter(Number(value))
}

function handleSortChange(value: string | number) {
  uiStore.setSort(value as any)
}

function handleObjectFloorUpdate(payload: { objectId: number; floor: number }) {
  clientsStore.updateObjectFloor(payload.objectId, payload.floor)
}

async function openClientDetails(id: number) {
  await clientsStore.fetchClientById(id)
  isDrawerOpen.value = true
}

onMounted(() => {
  if (!clientsStore.items.length) {
    clientsStore.fetchClients()
  }
})
</script>
