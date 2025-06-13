import { useInventoryStore } from '../stores/useInventoryStore.js'
import axios from 'axios'

export default function DeleteModal({ productId }) {
  const { closeModal, setProducts } = useInventoryStore()

  const handleDelete = async () => {
    await axios.delete(`/api/product/delete/${productId}`)
    // refresh list
    const res = await axios.get('/api/product/get/all')
    setProducts(res.data.data)
    closeModal('delete')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-80 p-6 rounded shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete?</h3>
        <div className="flex justify-end space-x-2">
          <button onClick={() => closeModal('delete')} className="px-4 py-2 rounded border">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
