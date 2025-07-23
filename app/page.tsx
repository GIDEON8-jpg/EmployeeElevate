"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { AuthGuard } from "@/components/auth-guard"
import { LeaveReminders } from "@/components/leave-reminders"
import { LeaveCountdown } from "@/components/leave-countdown"
import { useAuth } from "@/hooks/use-auth"
import { useEmployees } from "@/hooks/use-employees"
import { useLeaveManagement } from "@/hooks/use-leave-management"
import { useTaskManagement } from "@/hooks/use-task-management"

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const { employees } = useEmployees()
  const { leaveApplications, getPendingLeaves, getApprovedLeaves } = useLeaveManagement()
  const { tasks, getTasksByAssignee, getTasksByStatus } = useTaskManagement()

  // Calculate stats
  const totalEmployees = employees.length
  const pendingLeaves = getPendingLeaves().length
  const approvedLeaves = getApprovedLeaves().length
  const totalTasks = tasks.length

  // User-specific stats
  const userTasks = user ? getTasksByAssignee(user.name) : []
  const userCompletedTasks = userTasks.filter((task) => task.status === "Completed").length
  const userPendingTasks = userTasks.filter(
    (task) => task.status === "In Progress" || task.status === "Not Started",
  ).length

  // Recent activities with current 2025 dates
  const recentActivities = [
    {
      id: 1,
      type: "leave_approved",
      message: "Leeroy Sibanda's annual leave approved for Feb 15-19, 2025",
      timestamp: "2025-01-21T14:30:00Z",
      user: "Gideon Zimano",
    },
    {
      id: 2,
      type: "task_completed",
      message: "Allen Njani completed Employee Portal Dashboard task",
      timestamp: "2025-01-22T11:15:00Z",
      user: "Allen Njani",
    },
    {
      id: 3,
      type: "employee_added",
      message: "New employee Tadiwa Mundanga added to Sales department",
      timestamp: "2025-01-21T09:45:00Z",
      user: "Gideon Zimano",
    },
    {
      id: 4,
      type: "leave_applied",
      message: "Lucia Mukamba applied for personal leave Feb 10-12, 2025",
      timestamp: "2025-01-20T16:20:00Z",
      user: "Lucia Mukamba",
    },
    {
      id: 5,
      type: "task_assigned",
      message: "New task 'API Security Enhancement' assigned to Allen Njani",
      timestamp: "2025-01-22T08:30:00Z",
      user: "Leeroy Sibanda",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "leave_approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "leave_applied":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "task_assigned":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "employee_added":
        return <Users className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              {isAdmin
                ? "Here's what's happening in your organization today"
                : "Here's your personal dashboard overview"}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isAdmin ? (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalEmployees}</div>
                    <p className="text-xs text-muted-foreground">Active employees</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingLeaves}</div>
                    <p className="text-xs text-muted-foreground">Awaiting approval</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{approvedLeaves}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalTasks}</div>
                    <p className="text-xs text-muted-foreground">Organization-wide</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userTasks.length}</div>
                    <p className="text-xs text-muted-foreground">Total assigned</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userCompletedTasks}</div>
                    <p className="text-xs text-muted-foreground">Tasks finished</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userPendingTasks}</div>
                    <p className="text-xs text-muted-foreground">Active tasks</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Department</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user?.department || "N/A"}</div>
                    <p className="text-xs text-muted-foreground">Your team</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Leave Countdown - Show for all users */}
            <div className="lg:col-span-1">
              <LeaveCountdown />
            </div>

            {/* Leave Reminders */}
            <div className="lg:col-span-2">
              <LeaveReminders />
            </div>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest updates from across the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500">by {activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <ChatbotWidget />
      </div>
    </AuthGuard>
  )
}
