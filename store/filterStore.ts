import { create } from 'zustand'

type FilterState = {
    filterType: 'CATEGORY' | 'DATE' | null
    filterValue: string
    setFilter: (type: 'CATEGORY' | 'DATE', value: string) => void
    clearFilter: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
    filterType: null,

    filterValue: '',

    setFilter: (type, value) => set({ filterType: type, filterValue: value }),

    clearFilter: () => set({ filterType: null, filterValue: '' })
}))
