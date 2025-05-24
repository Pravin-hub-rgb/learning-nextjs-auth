'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { isAuthenticated as checkAuth, login as doLogin, logout as doLogout, getCurrentUser } from '@/lib/auth-local'

// 👇 Define the shape of the context
type AuthContextType = {
    loggedIn: boolean
    user: { name: string; email: string } | null
    login: (email: string, password: string) => boolean
    logout: () => void
}

// 👇 Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 👇 Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState<{ name: string; email: string } | null>(null)

    useEffect(() => {
        // Check auth status once on mount
        setLoggedIn(checkAuth())
        setUser(getCurrentUser())
    }, [])

    const login = (email: string, password: string): boolean => {
        const success = doLogin(email, password)
        if (success) {
            setLoggedIn(true)
            setUser(getCurrentUser())
        }
        return success
    }

    const logout = () => {
        doLogout()
        setLoggedIn(false)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ loggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// 👇 Hook to use the context
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
