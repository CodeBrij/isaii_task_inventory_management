import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { axiosInstance } from '../axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/auth/login', formData);
      if (res.status === 200) {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-blue-950 p-4">
      <div className="bg-white/5 backdrop-blur-md border border-blue-800 shadow-xl rounded-xl p-8 w-full max-w-sm text-white">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-400">Inventory Login</h2>

        {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}

        <div className="mb-4 relative">
          <FiMail className="absolute left-3 top-3 text-blue-400" />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 pl-10 bg-black/50 border border-blue-800 rounded text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="mb-6 relative">
          <FiLock className="absolute left-3 top-3 text-blue-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 pl-10 bg-black/50 border border-blue-800 rounded text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-3 rounded font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}
