import { useEffect } from 'react';
import { useInventoryStore } from '../stores/useInventoryStore.js';
import Sidebar from './Sidebar';
import MailModal from './MailModal';
import DeleteModal from './DeleteModal';
import UpdateProductModal from './UpdateProductModal';
import { FiMail, FiTrash2, FiEdit } from 'react-icons/fi';
import axios from 'axios';

export default function HomePage() {
  const {
    filteredProducts = [], // Default to empty array
    searchQuery,
    setProducts,
    setSearch,
    openModal,
    modals
  } = useInventoryStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/product/get/all');
        if (res.data?.data) {
          setProducts(res.data.data);
        } else {
          console.warn('No data received from API');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // fallback to empty list
      }
    };

    fetchProducts();
  }, [setProducts]);

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* Search */}
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search products…"
            className="flex-1 p-2 border rounded focus:outline-blue-400"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => openModal('mail', true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FiMail /> Mail
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded overflow-auto">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <tr key={prod._id} className="border-b hover:bg-slate-50">
                    <td className="p-3">{prod.sku}</td>
                    <td className="p-3">{prod.name}</td>
                    <td className="p-3">{prod.category}</td>
                    <td className="p-3">{prod.quantity}</td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => openModal('update', prod._id)}>
                        <FiEdit className="inline text-blue-600 hover:text-blue-800" />
                      </button>
                      <button onClick={() => openModal('delete', prod._id)}>
                        <FiTrash2 className="inline text-red-600 hover:text-red-800" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-slate-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modals */}
      {modals.mail && <MailModal />}
      {modals.delete && <DeleteModal productId={modals.delete} />}
      {modals.update && <UpdateProductModal productId={modals.update} />}
    </div>
  );
}
