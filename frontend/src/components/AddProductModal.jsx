import { useState } from 'react';
import axios from 'axios';
import { useInventoryStore } from '../stores/useInventoryStore';
import toast from 'react-hot-toast';
import { axiosInstance } from '../axios';

export default function AddProductModal() {
  const { openModal, setProducts } = useInventoryStore();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: '',
    lowStockThreshold: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddProduct = async () => {
    setLoading(true);

    const { name, sku, category, quantity, lowStockThreshold } = formData;

    if (!name || !sku || !category || !quantity || !lowStockThreshold) {
      toast.error('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post('/api/product/addProduct', {
        name,
        sku,
        category,
        quantity: parseInt(quantity),
        lowStockThreshold: parseInt(lowStockThreshold)
      });

      if (res.status === 201) {
        const fetchRes = await axiosInstance.get('/api/product/get/all');
        setProducts(fetchRes.data.data);
        openModal('add', false);
      } else {
        toast.error('Failed to add product.');
      }
    } catch (err) {
      console.error('Add product error:', err);
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-base-200/60 backdrop-blur-sm  z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Add New Product</h2>

        <div className="space-y-3">
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            className="w-full p-2 border rounded"
            value={formData.sku}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="w-full p-2 border rounded"
            value={formData.category}
            onChange={handleChange}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            className="w-full p-2 border rounded"
            value={formData.quantity}
            onChange={handleChange}
          />
          <input
            type="number"
            name="lowStockThreshold"
            placeholder="Low Stock Threshold"
            className="w-full p-2 border rounded"
            value={formData.lowStockThreshold}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => openModal('add', false)}
            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Adding…' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
