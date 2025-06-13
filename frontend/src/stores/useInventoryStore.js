import {create} from 'zustand'
import { axiosInstance } from '../axios'

export const useInventoryStore = create((set) => ({
  products: [],
  filteredProducts: [],
  searchQuery: '',
  filters: {},
  authUser: null,
  isCheckingAuth: false,
  modals: {
    add:false,
    mail: false,
    delete: null,      // product id to delete
    update: null,      // product id to update
  },
  user: null,
  setUser: (user) => set({ user }),

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

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      // checks for the user is logged in or not
      console.log("Checking auth...");
      
      const res = await axiosInstance.get("api/auth/check");
      set({ authUser: res.data }); // gets the response from backend - stores it in authUser            
    } catch (error) {
      console.log("Error in checkAuth:", error.response?.data || error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}))
