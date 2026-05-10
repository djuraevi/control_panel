<template>
  <BaseDrawer v-model="open">
    <template #title>
      {{ client?.company || 'Клиент' }}
    </template>

    <template #subtitle>
      ID: {{ client?.id ?? '—' }}
    </template>

    <div v-if="!client" class="text-secondary">
      Клиент не найден
    </div>

    <div v-else class="d-grid gap-4">
      <section class="card border-0 shadow-sm">
        <div class="card-body">
          <h6 class="mb-3">Основная информация</h6>

          <div class="row g-3">
            <div class="col-12 col-md-6">
              <div class="text-secondary small">Компания</div>
              <div>{{ client.company }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-secondary small">Директор</div>
              <div>{{ client.director }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-secondary small">Телефон</div>
              <div>{{ client.phone }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-secondary small">Email</div>
              <div>{{ client.email }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-secondary small">BIN</div>
              <div>{{ client.bin || '—' }}</div>
            </div>

            <div class="col-12">
              <div class="text-secondary small">Дополнительно</div>
              <div>{{ client.additionalInfo || '—' }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="card border-0 shadow-sm">
        <div class="card-body">
          <h6 class="mb-3">Договоры</h6>

          <div v-if="!client.contracts.length" class="text-secondary">
            Договоры отсутствуют
          </div>

          <div v-else class="list-group">
            <div
                v-for="contract in client.contracts"
                :key="contract.id"
                class="list-group-item"
            >
              <div class="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <div class="fw-semibold">{{ contract.contractNumber }}</div>
                  <div class="text-secondary small">
                    {{ contract.buildingName || '—' }} · объектов: {{ contract.objectCount }}
                  </div>
                  <div class="text-secondary small">
                    {{ contract.createdAt }}
                  </div>
                </div>

                <span class="badge" :class="contract.statusColor ? 'text-bg-secondary' : 'text-bg-secondary'">
                  {{ contract.statusName || '—' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="card border-0 shadow-sm">
        <div class="card-body">
          <h6 class="mb-3">Объекты</h6>

          <div v-if="!client.objects.length" class="text-secondary">
            Объекты отсутствуют
          </div>

          <div v-else class="table-responsive">
            <table class="table mb-0 align-middle">
              <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Здание</th>
                <th>Этаж</th>
                <th>Кабинет</th>
                <th>Площадь</th>
                <th>Статус</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in client.objects" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.objectType }}</td>
                <td>{{ item.buildingName || '—' }}</td>
                <td class="floor-cell">
                  <input
                      v-model.number="floorDrafts[item.id]"
                      class="form-control form-control-sm floor-input"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      :disabled="savingObjectId === item.id"
                  >
                  <small class="text-secondary">
                    из {{ item.buildingFloors.length || 1 }}
                  </small>
                </td>
                <td>{{ item.cabinetNumber }}</td>
                <td>{{ item.square }}</td>
                <td>{{ item.statusName || '—' }}</td>
                <td class="text-end">
                  <button
                      type="button"
                      class="btn btn-sm btn-outline-primary"
                      :disabled="!canSaveFloor(item) || savingObjectId === item.id"
                      @click="saveFloor(item)"
                  >
                    {{ savingObjectId === item.id ? 'Сохранение...' : 'Сохранить' }}
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="card border-0 shadow-sm">
        <div class="card-body">
          <h6 class="mb-3">Комментарии</h6>

          <div v-if="!client.comments.length" class="text-secondary">
            Комментарии отсутствуют
          </div>

          <div v-else class="d-grid gap-3">
            <div
                v-for="comment in client.comments"
                :key="comment.id"
                class="border rounded p-3"
            >
              <div class="d-flex justify-content-between gap-3 mb-2">
                <strong>{{ comment.createdAt }}</strong>
                <small class="text-secondary">{{ comment.targetDate || '—' }}</small>
              </div>

              <div class="mb-2">{{ comment.text }}</div>

              <small v-if="comment.fileName" class="text-secondary">
                Файл: {{ comment.fileName }}
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import { useObjectFloorEditor } from '@/composables/useObjectFloorEditor'
import type { ClientDetailsView, ObjectFloorUpdatePayload } from '@/domain/types'

const props = defineProps<{
  modelValue: boolean
  client: ClientDetailsView | null
  savingObjectId?: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update-object-floor', payload: ObjectFloorUpdatePayload): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const {
  floorDrafts,
  canSaveFloor,
  saveFloor,
} = useObjectFloorEditor(toRef(props, 'client'), (payload) => {
  emit('update-object-floor', payload)
})
</script>

<style scoped>
.floor-cell {
  min-width: 116px;
}

.floor-input {
  width: 86px;
}
</style>
