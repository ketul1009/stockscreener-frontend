import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import Dashboard from "@/pages/Dashboard"
import Screener from "@/pages/Screener"
import CreateScreener from "@/pages/CreateScreener"
import Watchlist from "@/pages/Watchlist"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AppProvider } from "@/contexts/AppContext"

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/screener" 
            element={
              <ProtectedRoute>
                <Screener />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-screener" 
            element={
              <ProtectedRoute>
                <CreateScreener />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/watchlist" 
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AppProvider>
  )
}

export default App
