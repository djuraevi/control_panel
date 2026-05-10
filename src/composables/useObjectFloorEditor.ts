import { reactive, watch, type Ref } from 'vue'
import type {
    ClientDetailsView,
    ClientObjectView,
    ObjectFloorUpdatePayload,
} from '@/domain/types'

export function useObjectFloorEditor(
    client: Readonly<Ref<ClientDetailsView | null>>,
    onSave: (payload: ObjectFloorUpdatePayload) => void,
) {
    const floorDrafts = reactive<Record<number, number>>({})

    watch(
        () => client.value?.objects,
        (objects) => {
            Object.keys(floorDrafts).forEach((key) => {
                delete floorDrafts[Number(key)]
            })

            objects?.forEach((object) => {
                floorDrafts[object.id] = object.floor
            })
        },
        { immediate: true },
    )

    function canSaveFloor(item: ClientObjectView) {
        const draft = Number(floorDrafts[item.id])
        return Number.isInteger(draft) && draft >= 1 && draft !== item.floor
    }

    function saveFloor(item: ClientObjectView) {
        if (!canSaveFloor(item)) {
            return
        }

        onSave({
            objectId: item.id,
            floor: Number(floorDrafts[item.id]),
        })
    }

    return {
        floorDrafts,
        canSaveFloor,
        saveFloor,
    }
}
