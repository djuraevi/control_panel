import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ClientSortKey, SortDirection } from '@/domain/types'

export const useUiStore = defineStore('ui', () => {
    const search = ref('')
    const sortKey = ref<ClientSortKey>('id')
    const sortDirection = ref<SortDirection>('asc')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const activeStatusId = ref<number | ''>('')

    function setSearch(value: string) {
        search.value = value
        currentPage.value = 1
    }

    function setSort(key: ClientSortKey) {
        if (sortKey.value === key) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
            return
        }

        sortKey.value = key
        sortDirection.value = 'asc'
    }

    function setSortFromRoute(key: string, direction: SortDirection) {
        const allowedKeys: ClientSortKey[] = [
            'id',
            'company',
            'director',
            'phone',
            'contract_status',
            'building',
            'objects',
            'contract_number',
            'created_at',
        ]

        sortKey.value = allowedKeys.includes(key as ClientSortKey) ? key as ClientSortKey : 'id'
        sortDirection.value = direction
    }

    function setPage(page: number) {
        currentPage.value = page
    }

    function setStatusFilter(value: number | '') {
        activeStatusId.value = value
        currentPage.value = 1
    }

    function resetFilters() {
        search.value = ''
        sortKey.value = 'id'
        sortDirection.value = 'asc'
        currentPage.value = 1
        activeStatusId.value = ''
    }

    return {
        search,
        sortKey,
        sortDirection,
        currentPage,
        pageSize,
        activeStatusId,
        setSearch,
        setSort,
        setSortFromRoute,
        setPage,
        setStatusFilter,
        resetFilters,
    }
})
