import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Client, ClientDetailsView, ClientTableRow } from '@/domain/types'
import { buildClientsTableRows } from '@/domain/selectors'
import { getMockData } from '@/repository/mockApi'
import { updateObjectFloor as updateObjectFloorRepository } from '@/repository/clients.repository'
import { filterClientRows, paginateRows, sortClientRows } from '@/utils/filtering'
import { useUiStore } from './ui.store'
import { buildClientDetailsView } from '@/domain/selectors'

export const useClientsStore = defineStore('clients', () => {
    const items = ref<Client[]>([])
    const tableRows = ref<ClientTableRow[]>([])
    const selectedClient = ref<Client | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const selectedClientDetails = ref<ClientDetailsView | null>(null)
    const detailsLoading = ref(false)
    const objectSavingId = ref<number | null>(null)

    const uiStore = useUiStore()

    const clientsCount = computed(() => items.value.length)

    const filteredRows = computed(() => {
        return filterClientRows(
            tableRows.value,
            uiStore.search,
            uiStore.activeStatusId,
        )
    })

    const sortedRows = computed(() => {
        return sortClientRows(
            filteredRows.value,
            uiStore.sortKey,
            uiStore.sortDirection,
        )
    })

    const totalItems = computed(() => sortedRows.value.length)

    const totalPages = computed(() => {
        return Math.max(1, Math.ceil(totalItems.value / uiStore.pageSize))
    })

    const visibleRows = computed(() => {
        const safePage = Math.min(uiStore.currentPage, totalPages.value)
        return paginateRows(sortedRows.value, safePage, uiStore.pageSize)
    })

    async function fetchClients() {
        loading.value = true
        error.value = null

        try {
            const data = await getMockData()
            items.value = data.clients
            tableRows.value = buildClientsTableRows(data)
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Не удалось загрузить клиентов'
        } finally {
            loading.value = false
        }
    }

    async function fetchClientById(id: number) {
        detailsLoading.value = true
        error.value = null

        try {
            const data = await getMockData()
            selectedClient.value = data.clients.find((client) => client.id === id) ?? null
            selectedClientDetails.value = buildClientDetailsView(data, id)
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Не удалось загрузить клиента'
            selectedClient.value = null
            selectedClientDetails.value = null
        } finally {
            detailsLoading.value = false
        }
    }

    async function updateObjectFloor(objectId: number, floor: number) {
        if (!selectedClientDetails.value) {
            return
        }

        objectSavingId.value = objectId
        error.value = null

        try {
            await updateObjectFloorRepository(objectId, floor)
            const data = await getMockData()
            tableRows.value = buildClientsTableRows(data)
            selectedClientDetails.value = buildClientDetailsView(data, selectedClientDetails.value.id)
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Не удалось сохранить этаж объекта'
        } finally {
            objectSavingId.value = null
        }
    }

    function closeClientDetails() {
        selectedClient.value = null
        selectedClientDetails.value = null
    }

    function clearSelectedClient() {
        selectedClient.value = null
    }

    return {
        items,
        tableRows,
        selectedClient,
        loading,
        error,
        clientsCount,
        filteredRows,
        sortedRows,
        visibleRows,
        totalItems,
        totalPages,
        fetchClients,
        fetchClientById,
        clearSelectedClient,
        selectedClientDetails,
        detailsLoading,
        objectSavingId,
        closeClientDetails,
        updateObjectFloor,
    }
})
