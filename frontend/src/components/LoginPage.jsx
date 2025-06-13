import { useState } from 'react';
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
        <h2 className="text-2xl font-bold text-center mb-3 text-blue-400">Inventory Login</h2>

        {/* 🛈 Info Section */}
        <div className="text-sm text-blue-200 bg-blue-900/30 border border-blue-800 rounded-md p-3 mb-6">
          <p className="mb-2 font-semibold text-blue-300">Note:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Only <span className="font-semibold text-blue-100">Admins</span> can add new users to the system.</li>
            <li>Use the following credentials for testing:</li>
            <li><span className="text-blue-100">Admin</span>: <code>admin@example.com</code> / <code>admin123</code></li>
            <li><span className="text-blue-100">User</span>: <code>user@example.com</code> / <code>user123</code></li>
          </ul>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}

        {/* Email Input */}
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

        {/* Password Input */}
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

        {/* Login Button */}
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
