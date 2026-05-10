import type { Client, ObjectItem } from '@/domain/types'
import { getMockData, getMockDataSection, updateMockData } from './mockApi'

export async function listClients(): Promise<Client[]> {
    return getMockDataSection('clients')
}

export async function getClientById(id: number): Promise<Client | undefined> {
    const clients = await listClients()
    return clients.find((client) => client.id === id)
}

export async function updateObjectFloor(objectId: number, floor: number): Promise<ObjectItem> {
    const data = await getMockData()
    const targetObject = data.objects.find((object) => object.id === objectId)

    if (!targetObject) {
        throw new Error('Объект не найден')
    }

    const updatedObjects = data.objects.map((object) => {
        if (object.id !== objectId) {
            return object
        }

        return {
            ...object,
            floor,
        }
    })

    const updatedBuildings = data.buildings.map((building) => {
        const buildingFloors = updatedObjects
            .filter((object) => object.building_id === building.id)
            .map((object) => object.floor)

        const maxFloor = Math.max(
            building.floors.length,
            ...buildingFloors,
        )

        return {
            ...building,
            floors: Array.from({ length: maxFloor }, (_, index) => `${index + 1} этаж`),
        }
    })

    await updateMockData('objects', updatedObjects)
    await updateMockData('buildings', updatedBuildings)

    return updatedObjects.find((object) => object.id === objectId)!
}
