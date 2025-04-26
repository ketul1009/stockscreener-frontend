import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import Dashboard from "@/pages/Dashboard"
import Screener from "@/pages/Screener"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/screener" element={<Screener />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
