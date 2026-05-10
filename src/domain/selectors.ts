import type {
    Building,
    ClientDetailsView,
    ClientTableRow,
    Contract,
    MockData,
    ObjectItem,
    Status,
} from './types'

function getClientObjects(clientId: number, objects: ObjectItem[]) {
    return objects.filter((object) => object.client_id === clientId)
}

function getClientContracts(clientId: number, contracts: Contract[]) {
    return contracts.filter((contract) => contract.client_id === clientId)
}

function getBuildingById(id: number, buildings: Building[]) {
    return buildings.find((building) => building.id === id)
}

function getStatusById(id: number, statuses: Status[]) {
    return statuses.find((status) => status.id === id)
}

export function buildClientsTableRows(data: MockData): ClientTableRow[] {
    return data.clients.map((client) => {
        const clientObjects = getClientObjects(client.id, data.objects)
        const contracts = getClientContracts(client.id, data.contracts)
        const firstContract = contracts[0]

        const building = firstContract
            ? getBuildingById(firstContract.building_id, data.buildings)
            : null

        const status = firstContract
            ? getStatusById(firstContract.status_id, data.statuses)
            : null

        return {
            id: client.id,
            company: client.trade_name_company || client.arendator_company_name,
            director: client.arendator_director_name,
            phone: client.arendator_main_phone_number || client.arendator_phone_number,
            buildingName: building?.name ?? null,
            contractNumber: firstContract?.contract_number ?? null,
            contractDate: firstContract?.created_at ?? null,
            objectsCount: clientObjects.length,
            statusId: status?.id ?? null,
            statusName: status?.name ?? null,
            statusColor: status?.color ?? null,
        }
    })
}

export function buildClientDetailsView(
    data: MockData,
    clientId: number,
): ClientDetailsView | null {
    const client = data.clients.find((item) => item.id === clientId)

    if (!client) {
        return null
    }

    const clientContracts = data.contracts.filter((contract) => contract.client_id === clientId)
    const clientObjects = data.objects.filter((object) => object.client_id === clientId)
    const clientComments = data.comments.filter((comment) => comment.client_id === clientId)

    const contracts = clientContracts.map((contract) => {
        const building = data.buildings.find((item) => item.id === contract.building_id)
        const status = data.statuses.find((item) => item.id === contract.status_id)

        return {
            id: contract.id,
            contractNumber: contract.contract_number,
            createdAt: contract.created_at,
            buildingName: building?.name ?? null,
            statusName: status?.name ?? null,
            statusColor: status?.color ?? null,
            objectCount: contract.object_ids.length,
        }
    })

    const objects = clientObjects.map((object) => {
        const building = data.buildings.find((item) => item.id === object.building_id)
        const status = data.statuses.find((item) => item.id === object.status_id)

        return {
            id: object.id,
            name: object.name,
            objectType: object.object_type,
            floor: object.floor,
            cabinetNumber: object.cabinet_number,
            square: object.square,
            buildingId: object.building_id,
            buildingName: building?.name ?? null,
            buildingFloors: building?.floors ?? [],
            statusName: status?.name ?? null,
            statusColor: status?.color ?? null,
        }
    })

    const comments = clientComments.map((comment) => ({
        id: comment.id,
        text: comment.comment_text,
        createdAt: comment.created_at,
        targetDate: comment.target_date ?? null,
        fileName: comment.file_name ?? null,
        filePath: comment.file_path ?? null,
    }))

    return {
        id: client.id,
        company: client.trade_name_company || client.arendator_company_name,
        director: client.arendator_director_name,
        phone: client.arendator_main_phone_number || client.arendator_phone_number,
        email: client.email,
        bin: client.arendator_bin ?? null,
        additionalInfo: client.additional_info ?? null,
        contracts,
        objects,
        comments,
    }
}
