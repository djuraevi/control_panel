export interface Status {
    id: number
    name: string
    color?: string
}

export interface Building {
    id: number
    name: string
    address: string
    floors: string[]
}

export interface Client {
    id: number
    trade_name_company: string
    arendator_company_name: string
    arendator_director_name: string
    arendator_main_phone_number: string
    arendator_phone_number: string
    email: string
    notification_phone?: string
    notification_telagram?: string
    arendator_bin?: string
    additional_info?: string
}

export interface ObjectItem {
    id: number
    client_id: number
    building_id: number
    status_id: number
    name: string
    object_type: string
    floor: number
    cabinet_number: number
    square: number
}

export interface Contract {
    id: number
    client_id: number
    building_id: number
    status_id: number
    contract_number: string
    created_at: string
    object_ids: number[]
}

export interface Comment {
    id: number
    client_id: number
    comment_text: string
    created_at: string
    target_date?: string
    file_name?: string | null
    file_path?: string | null
}

export interface Analytics {
    contract_statuses: Array<{ status_id: number; count: number }>
    kpis: Array<{ key: string; label: string; value: string; delta: string }>
    revenue_by_month: Array<{ month: string; revenue: number }>
}

export interface MockData {
    statuses: Status[]
    buildings: Building[]
    clients: Client[]
    objects: ObjectItem[]
    contracts: Contract[]
    comments: Comment[]
    analytics: Analytics
}

export type SortDirection = 'asc' | 'desc'
export type ClientSortKey =
    | 'id'
    | 'company'
    | 'director'
    | 'phone'
    | 'contract_status'
    | 'building'
    | 'objects'
    | 'contract_number'
    | 'created_at'

export interface ClientTableRow {
    id: number
    company: string
    director: string
    phone: string
    buildingName: string | null
    contractNumber: string | null
    contractDate: string | null
    objectsCount: number
    statusId: number | null
    statusName: string | null
    statusColor: string | null
}

export interface ClientContractView {
    id: number
    contractNumber: string
    createdAt: string
    buildingName: string | null
    statusName: string | null
    statusColor: string | null
    objectCount: number
}

export interface ClientObjectView {
    id: number
    name: string
    objectType: string
    floor: number
    cabinetNumber: number
    square: number
    buildingId: number
    buildingName: string | null
    buildingFloors: string[]
    statusName: string | null
    statusColor: string | null
}

export interface ClientCommentView {
    id: number
    text: string
    createdAt: string
    targetDate: string | null
    fileName: string | null
    filePath: string | null
}

export interface ClientDetailsView {
    id: number
    company: string
    director: string
    phone: string
    email: string
    bin: string | null
    additionalInfo: string | null
    contracts: ClientContractView[]
    objects: ClientObjectView[]
    comments: ClientCommentView[]
}

export interface ClientTableColumn {
    key: ClientSortKey
    label: string
}

export interface ObjectFloorUpdatePayload {
    objectId: number
    floor: number
}
