import { useInventoryStore } from '../stores/useInventoryStore.js'
import { FiFilter, FiX, FiLogOut } from 'react-icons/fi'

export default function Sidebar() {
  const { filters, setFilters, clearFilters, openModal } = useInventoryStore()
  const handleLogout = () => {
    // call your logout API and redirect
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-4 space-y-4">
      <h2 className="text-xl font-semibold text-blue-400">Filters</h2>

      {/* Example filter: category */}
      <div>
        <label className="block mb-1">Category</label>
        <select
          className="w-full p-2 rounded bg-slate-800"
          value={filters.category || ''}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Apparel">Apparel</option>
          {/* add more */}
        </select>
      </div>

      <button
        onClick={() => clearFilters()}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        <FiX /> <span>Clear Filters</span>
      </button>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700 w-full"
        >
          <FiLogOut /> <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
