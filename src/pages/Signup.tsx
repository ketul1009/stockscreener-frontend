import { SignupForm } from "@/components/signup-form"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export default function Signup() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSignup = () => {
        console.log(username, email, password, confirmPassword)
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
