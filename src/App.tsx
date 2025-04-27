import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import Dashboard from "@/pages/Dashboard"
import Screener from "@/pages/Screener"

import CreateScreener from "@/pages/CreateScreener"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/screener" element={<Screener />} />
        <Route path="/create-screener" element={<CreateScreener />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
