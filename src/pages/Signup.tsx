import { SignupForm } from "@/components/signup-form"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "@/constants/constants"
export default function Signup() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSignup = async () => {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            body: JSON.stringify({ username, email, password, confirmPassword }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        console.log(response)
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
