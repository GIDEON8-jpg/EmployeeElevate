import { Providers } from "@/components/providers"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import { Navigation } from "@/components/navigation"
import { EmployeesProvider } from "@/hooks/use-employees"
import { LeaveManagementProvider } from "@/hooks/use-leave-management"
import { TaskManagementProvider } from "@/hooks/use-task-management"

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
})

export const metadata: Metadata = {
    title: "EmployeeElevate - Employee Management System",
    description: "Comprehensive employee management with performance tracking, leave management, and HR assistance",
    generator: 'v0.dev'
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter?.className || ''} suppressHydrationWarning>
        <AuthProvider>
            <EmployeesProvider>
                <LeaveManagementProvider>
                    <TaskManagementProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="light"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <div className="min-h-screen bg-background">
                                <Navigation />
                                {children}
                            </div>
                            <Toaster />
                        </ThemeProvider>
                    </TaskManagementProvider>
                </LeaveManagementProvider>
            </EmployeesProvider>
        </AuthProvider>
        </body>
        </html>
    )
}
