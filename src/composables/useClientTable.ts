import type { ClientTableColumn } from '@/domain/types'

export function useClientTable() {
    const columns: ClientTableColumn[] = [
        { key: 'id', label: '№' },
        { key: 'company', label: 'Компания' },
        { key: 'director', label: 'Директор' },
        { key: 'phone', label: 'Телефон' },
        { key: 'building', label: 'Здание' },
        { key: 'contract_number', label: '№ договора' },
        { key: 'created_at', label: 'Дата создания' },
        { key: 'objects', label: 'Объекты' },
        { key: 'contract_status', label: 'Статус договора' },
    ]

    function getStatusStyle(color: string | null) {
        return color
            ? { backgroundColor: color, color: '#fff' }
            : {}
    }

    return {
        columns,
        getStatusStyle,
    }
}
