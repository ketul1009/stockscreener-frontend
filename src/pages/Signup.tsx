import { SignupForm } from "@/components/signup-form"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "@/constants/constants"
import { useApp } from "@/contexts/AppContext"
import axios from "axios"
export default function Signup() {
    const navigate = useNavigate()
    const context = useApp()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const validateSignup = () => {
        if (!username || !email || !password || !confirmPassword) {
            context.showToast("Please enter all fields", "error")
            return false
        }
        return true
    }

    const handleSignup = async () => {
        if (!validateSignup()) return
        await axios.post(`${API_URL}/register`, {
            username,
            email,
            password,
            confirmPassword
        }).then(() => {
            context.showToast("Signup successful", "success")
            navigate("/dashboard")
        }).catch((err) => {
            if (err.response.data.error) {
                context.showToast("Username or email already in use", "error")
            } else {
                context.showToast("Signup failed", "error")
            }
        })
    }
    return (
        <SignupForm 
            onSignupClick={handleSignup}
            onLoginClick={() => {
                navigate("/")
            }}  
            onUsernameChange={(e) => {
                setUsername(e.target.value)
            }}
            onEmailChange={(e) => {
                setEmail(e.target.value)
            }}
            onPasswordChange={(e) => {
                setPassword(e.target.value)
            }}
            onConfirmPasswordChange={(e) => {
                setConfirmPassword(e.target.value)
            }}
        />
    )
}
