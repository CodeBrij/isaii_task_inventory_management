import { useState, useEffect } from 'react';
import axios from 'axios';
import { useInventoryStore } from '../stores/useInventoryStore';
import { axiosInstance } from '../axios';
import toast from 'react-hot-toast';

export default function AddUserModal() {
  const { openModal } = useInventoryStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddUser = async () => {
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error('All fields are required');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/auth/addUser', formData);
      if (res.status === 201) {
        setSuccess('User added successfully!');
        openModal('addUser', false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div className="fixed inset-0 bg-base-200/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>

        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 mb-2 border rounded"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded"
          value={formData.password}
          onChange={handleChange}
        />
        <select
          name="role"
          className="w-full p-2 mb-4 border rounded"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => openModal('addUser', false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUser}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
