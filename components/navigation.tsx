"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Users, Calendar, TrendingUp, FileText, User, LogOut, Shield, CheckSquare } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation"
import { NotificationSystem } from "@/components/notification-system"

export function Navigation() {
  const { user, logout, isAdmin } = useAuth()
  const pathname = usePathname()

  if (!user || pathname === "/login") {
    return null
  }

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            EmployeeElevate
          </Link>

          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <div className="flex space-x-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>

              <Link href="/employees">
                <Button variant="ghost" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Employees
                </Button>
              </Link>

              <Link href="/tasks">
                <Button variant="ghost" size="sm">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Tasks
                </Button>
              </Link>

              <Link href="/leaves">
                <Button variant="ghost" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Leaves
                </Button>
              </Link>

              <Link href="/performance">
                <Button variant="ghost" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Performance
                </Button>
              </Link>

              {/* Add this new Profile link for employees */}
              {!isAdmin && (
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              )}

              <Link href="/reports">
                <Button variant="ghost" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
                </Button>
              </Link>

              {/* Add this after the Reports link and before the User Menu */}
              {isAdmin && (
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    User Management
                  </Button>
                </Link>
              )}
            </div>

            {/* Add this before the User Menu */}
            <NotificationSystem />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                  <Badge variant={isAdmin ? "default" : "secondary"}>
                    {isAdmin ? (
                      <>
                        <Shield className="mr-1 h-3 w-3" />
                        Admin
                      </>
                    ) : (
                      "Employee"
                    )}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.department}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
