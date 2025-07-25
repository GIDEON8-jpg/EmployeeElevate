"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string | number
  name: string
  email: string
  role: "employee" | "admin"
  department: string
  fullName?: string // Optional for backward compatibility
}

interface AuthContextType {
  user: User | null
  login: (user: User) => boolean
  logout: () => void
  isAdmin: boolean
  isEmployee: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log('Auth useEffect: checking stored user session')
    
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    
    console.log('Stored data:', { 
      hasStoredUser: !!storedUser, 
      isAuthenticated,
      rawUserData: storedUser 
    })
    
    if (storedUser && isAuthenticated === "true") {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log('Parsed user data:', parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        // Clear corrupted data
        localStorage.removeItem("user")
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("authToken")
      }
    } else {
      console.log('No valid stored session found')
    }
    
    console.log('Setting auth loading to false')
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    console.log('Login called with userData:', userData)
    
    // Since we're now getting user data from the backend API,
    // we can directly store and use it without checking local registered users
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("isAuthenticated", "true")
    
    console.log('User logged in and stored:', userData)
    return true
  }

  const logout = () => {
    console.log('Logout called')
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("authToken")
    console.log('User logged out, redirecting to login')
    router.push("/login")
  }

  const value = {
    user,
    login,
    logout,
    isAdmin: user?.role === "admin",
    isEmployee: user?.role === "employee",
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
