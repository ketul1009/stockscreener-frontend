import { LoginForm } from "@/components/login-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { API_URL } from "@/constants/constants"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const handleLogin = async () => {
    console.log(JSON.stringify({ email, password}))
    const response = await fetch(`${API_URL}/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    console.log(response)
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