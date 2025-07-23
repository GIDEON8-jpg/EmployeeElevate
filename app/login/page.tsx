"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Users, Shield, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"employee" | "admin">("employee")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check registered users first
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const foundUser = registeredUsers.find(
        (user: any) => user.email === email && user.password === password && user.role === role,
      )

      if (foundUser) {
        // Login with registered user
        login({
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          department: foundUser.department,
        })
        router.push("/")
        return
      }

      // Fallback to demo credentials with Zimbabwean names
      const validCredentials = {
        admin: { email: "gideon.zimano@company.co.zw", password: "admin123" },
        employee: { email: "leeroy.sibanda@company.co.zw", password: "emp123" },
      }

      if (email === validCredentials[role].email && password === validCredentials[role].password) {
        // Set user session
        login({
          id: role === "admin" ? "1" : "2",
          name: role === "admin" ? "Gideon Zimano" : "Leeroy Sibanda",
          email: email,
          role: role,
          department: role === "admin" ? "Human Resources" : "Engineering",
        })

        router.push("/")
      } else {
        setError("Invalid credentials. Please check your email, password, and role selection.")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">EmployeeElevate</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="role">Login as</Label>
              <Select value={role} onValueChange={(value: "employee" | "admin") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Employee
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Administrator
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Demo Credentials:</h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>Admin:</strong> gideon.zimano@company.co.zw / admin123
              </p>
              <p>
                <strong>Employee:</strong> leeroy.sibanda@company.co.zw / emp123
              </p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
