"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "employee" | "admin"
  department: string
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
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    // Check against registered users first
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const foundUser = registeredUsers.find(
      (user: any) => user.email === userData.email && user.password === userData.password,
    )

    if (foundUser) {
      const userToStore = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        department: foundUser.department,
      }
      setUser(userToStore)
      localStorage.setItem("user", JSON.stringify(userToStore))
      return true
    }

    // Fallback to original demo credentials
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
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
