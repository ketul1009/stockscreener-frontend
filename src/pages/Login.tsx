import { LoginForm } from "@/components/login-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { API_URL } from "@/constants/constants"
import { useAuth } from "@/hooks/useAuth"
import { useApp } from "@/contexts/AppContext"
import axios from "axios"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const context = useApp()

  const validateLogin = () => {
    if (!email || !password) {
      context.showToast("Please enter email and password", "error")
      return false
    }
    return true
  }
  
  const handleLogin = async () => {
    if (!validateLogin()) return
    try {
      await axios.post(`${API_URL}/login`, {
        email,
        password
      }).then(res => {
        const data = res.data
        login({ id: data.user.id, email: data.user.email, username: data.user.username }, data.token)
        navigate('/dashboard')
      }).catch(err => {
        context.showToast(`Login failed: ${err.response.data.error}`, "error")
      })
    } catch (error) {
      console.error('Login error:', error)
      context.showToast("Login failed", "error")
    }
  }
  
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm 
          onLoginClick={handleLogin}
          onSignupClick={() => {
            navigate("/signup")
          }}
          onEmailChange={(e) => {
            setEmail(e.target.value)
          }}
          onPasswordChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </div>
    </div>
  )
}