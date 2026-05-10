import mockData from '@/data/mock-data.json'
import type { MockData } from '@/domain/types'

const LATENCY = 250

function delay(ms = LATENCY) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function clone<T>(value: T): T {
    return structuredClone(value)
}

let state: MockData = clone(mockData as MockData)

export async function getMockData(): Promise<MockData> {
    await delay()
    return clone(state)
}

export async function getMockDataSection<K extends keyof MockData>(key: K): Promise<MockData[K]> {
    await delay()
    return clone(state[key])
}

export async function updateMockData<K extends keyof MockData>(
    key: K,
    value: MockData[K],
): Promise<MockData[K]> {
    await delay()
    state = {
        ...state,
        [key]: clone(value),
    }
    return clone(state[key])
}

export async function resetMockData(): Promise<MockData> {
    await delay()
    state = clone(mockData as MockData)
    return clone(state)
}