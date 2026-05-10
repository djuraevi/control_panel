import type { ClientSortKey, ClientTableRow, SortDirection } from '@/domain/types'

function normalize(value: string | number | null | undefined): string {
    return String(value ?? '').trim().toLowerCase()
}

function compareValues(a: unknown, b: unknown): number {
    if (a === null || a === undefined) return 1
    if (b === null || b === undefined) return -1

    if (typeof a === 'number' && typeof b === 'number') {
        return a - b
    }

    const aValue = String(a).toLowerCase()
    const bValue = String(b).toLowerCase()

    return aValue.localeCompare(bValue, 'ru', {
        numeric: true,
        sensitivity: 'base',
    })
}

export function filterClientRows(
    rows: ClientTableRow[],
    search: string,
    statusId: number | '',
): ClientTableRow[] {
    const query = normalize(search)

    return rows.filter((row) => {
        const matchesStatus = statusId === '' || row.statusId === statusId

        const matchesSearch =
            query === '' ||
            [
                row.id,
                row.company,
                row.director,
                row.phone,
                row.buildingName,
                row.contractNumber,
                row.statusName,
            ]
                .map(normalize)
                .some((value) => value.includes(query))

        return matchesStatus && matchesSearch
    })
}

export function sortClientRows(
    rows: ClientTableRow[],
    sortKey: ClientSortKey,
    sortDirection: SortDirection,
): ClientTableRow[] {
    const sorted = [...rows].sort((a, b) => {
        let aValue: unknown
        let bValue: unknown

        switch (sortKey) {
            case 'id':
                aValue = a.id
                bValue = b.id
                break
            case 'company':
                aValue = a.company
                bValue = b.company
                break
            case 'director':
                aValue = a.director
                bValue = b.director
                break
            case 'phone':
                aValue = a.phone
                bValue = b.phone
                break
            case 'contract_status':
                aValue = a.statusName
                bValue = b.statusName
                break
            case 'building':
                aValue = a.buildingName
                bValue = b.buildingName
                break
            case 'objects':
                aValue = a.objectsCount
                bValue = b.objectsCount
                break
            case 'contract_number':
                aValue = a.contractNumber
                bValue = b.contractNumber
                break
            case 'created_at':
                aValue = a.contractDate
                bValue = b.contractDate
                break
            default:
                aValue = a.id
                bValue = b.id
        }

        const result = compareValues(aValue, bValue)
        return sortDirection === 'asc' ? result : -result
    })

    return sorted
}

export function paginateRows<T>(
    rows: T[],
    page: number,
    pageSize: number,
): T[] {
    const start = (page - 1) * pageSize
    return rows.slice(start, start + pageSize)
}
