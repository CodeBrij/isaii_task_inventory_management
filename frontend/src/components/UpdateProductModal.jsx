import { useEffect, useState } from 'react'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import axios from 'axios'
import { FiX } from 'react-icons/fi'
import { axiosInstance } from '../axios.js'

export default function UpdateProductModal({ productId }) {
  const { closeModal, setProducts, products } = useInventoryStore()
  const [form, setForm] = useState({})

  useEffect(() => {
    axiosInstance.get(`/api/product/getById/${productId}`)
      .then(res => setForm(res.data.data))
  }, [productId, products])

  const handleSave = async () => {
    await axiosInstance.put(`/api/product/update/${productId}`, form)
    const res = await axiosInstance.get('/api/product/get/all')
    setProducts(res.data.data)
    closeModal('update')
  }

  return (
    <div className="fixed inset-0 bg-base-200/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded shadow-lg overflow-auto max-h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Update Product</h3>
          <button onClick={() => closeModal('update')}><FiX /></button>
        </div>
        <div className="space-y-3">
          {['sku','name','category','quantity','lowStockThreshold'].map(field => (
            <div key={field}>
              <label className="block mb-1 capitalize">{field}</label>
              <input
                type={field === 'quantity' || field === 'lowStockThreshold' ? 'number' : 'text'}
                className="w-full p-2 border rounded"
                value={form[field] || ''}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={JSON.stringify(form) === ''}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
