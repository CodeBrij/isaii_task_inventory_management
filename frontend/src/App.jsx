import HomePage from './components/Homepage'
import LoginPage from './components/LoginPage'
import './App.css'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router'
import { useInventoryStore } from './stores/useInventoryStore'
import { useEffect } from 'react'

function App() {

  const { authUser, checkAuth, isCheckingAuth } = useInventoryStore();
  useEffect(() => {
    checkAuth();
  }, []);

  console.log("Authentication User" + JSON.stringify(authUser));

  return (
    <div>
    <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/home" element={<HomePage />} />
    </Routes>
    <Toaster/>
    </div>

  )
}

export default App
