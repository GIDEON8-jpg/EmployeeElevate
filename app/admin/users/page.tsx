import { AuthGuard } from "@/components/auth-guard"
import { UserManagement } from "@/components/user-management"
import { ChatbotWidget } from "@/components/chatbot-widget"

export default function UsersManagementPage() {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage registered users and their permissions</p>
          </div>

          <UserManagement />
        </div>
        <ChatbotWidget />
      </div>
    </AuthGuard>
  )
}
