import { LoginForm } from "@/components/login-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const handleLogin = () => {
    console.log(email, password)
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