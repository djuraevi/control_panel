import { nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ClientSortKey, SortDirection } from '@/domain/types'
import type { useUiStore } from '@/stores/ui.store'

type UiStore = ReturnType<typeof useUiStore>

function parsePositiveInteger(value: unknown, fallback: number) {
    const parsed = typeof value === 'string' ? Number(value) : fallback
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function parseStatus(value: unknown) {
    const parsed = typeof value === 'string' ? Number(value) : NaN
    return Number.isInteger(parsed) ? parsed : ''
}

function parseDirection(value: unknown): SortDirection {
    return value === 'desc' ? 'desc' : 'asc'
}

export function useClientsQuerySync(uiStore: UiStore) {
    const route = useRoute()
    const router = useRouter()
    const isApplyingRoute = ref(false)

    function applyRouteState() {
        isApplyingRoute.value = true

        uiStore.setSearch(typeof route.query.q === 'string' ? route.query.q : '')
        uiStore.setStatusFilter(parseStatus(route.query.status))

        const sort = typeof route.query.sort === 'string' ? route.query.sort : 'id'
        uiStore.setSortFromRoute(sort as ClientSortKey, parseDirection(route.query.dir))

        uiStore.setPage(parsePositiveInteger(route.query.page, 1))

        nextTick(() => {
            isApplyingRoute.value = false
        })
    }

    watch(
        () => route.query,
        () => {
            applyRouteState()
        },
        { immediate: true },
    )

    watch(
        [
            () => uiStore.search,
            () => uiStore.activeStatusId,
            () => uiStore.sortKey,
            () => uiStore.sortDirection,
            () => uiStore.currentPage,
        ],
        () => {
            if (isApplyingRoute.value) {
                return
            }

            router.replace({
                query: {
                    ...route.query,
                    q: uiStore.search || undefined,
                    status: uiStore.activeStatusId === '' ? undefined : String(uiStore.activeStatusId),
                    sort: uiStore.sortKey === 'id' ? undefined : uiStore.sortKey,
                    dir: uiStore.sortDirection === 'asc' ? undefined : uiStore.sortDirection,
                    page: uiStore.currentPage === 1 ? undefined : String(uiStore.currentPage),
                },
            })
        },
    )
}
