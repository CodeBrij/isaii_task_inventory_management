import {create} from 'zustand'

export const useInventoryStore = create((set) => ({
  products: [],
  filteredProducts: [],
  searchQuery: '',
  filters: {},
  modals: {
    mail: false,
    delete: null,      // product id to delete
    update: null,      // product id to update
  },
  setProducts: (prods) => set({ products: prods, filteredProducts: prods }),
  setSearch: (q) =>
    set((state) => {
      const filtered = state.products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase())
      )
      return { searchQuery: q, filteredProducts: filtered }
    }),
  setFilters: (filters) =>
    set((state) => {
      const filtered = state.products.filter(p => {
        return Object.entries(filters).every(([key, val]) => !val || p[key] === val)
      })
      return { filters, filteredProducts: filtered }
    }),
  clearFilters: () => set((state) => ({
    filters: {},
    filteredProducts: state.products,
  })),
  openModal: (type, payload = null) =>
    set((state) => ({ modals: { ...state.modals, [type]: payload } })),
  closeModal: (type) =>
    set((state) => ({ modals: { ...state.modals, [type]: false } })),
}))
