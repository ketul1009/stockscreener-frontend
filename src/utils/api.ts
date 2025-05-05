import { API_URL } from "@/constants/constants"

export async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')
    
    if (!token) {
        throw new Error('No authentication token found')
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token')
        window.location.href = '/login'
        throw new Error('Authentication failed')
    }

    return response
} 