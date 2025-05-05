import { LoginForm } from "@/components/login-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { API_URL } from "@/constants/constants"
import { useAuth } from "@/hooks/useAuth"
export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      login({ id: data.userId, email }, data.token)
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
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