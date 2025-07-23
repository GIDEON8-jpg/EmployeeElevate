"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Calendar, Users, Clock, AlertTriangle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
// Removed the problematic import
// import { useLeaveManagement } from "@/hooks/use-leave-management"

interface Notification {
  id: string
  type:
      | "leave_approved"
      | "leave_reminder"
      | "leave_application"
      | "performance_review"
      | "task_completed"
      | "task_overdue"
      | "leave_approaching"
      | "leave_tomorrow"
      | "leave_today"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "high" | "medium" | "low"
  actionRequired?: boolean
}

// Mock leave data structure
interface Leave {
  id: string
  startDate: string
  endDate: string
  leaveType: string
  employeeName: string
  status: 'approved' | 'pending' | 'rejected'
}

// Mock function to get approaching leaves
const getApproachingLeaves = (userName: string): Leave[] => {
  // Mock data - replace with actual API call or hook
  const mockLeaves: Leave[] = [
    {
      id: "1",
      startDate: "2025-01-25",
      endDate: "2025-01-26",
      leaveType: "Personal Leave",
      employeeName: userName,
      status: "approved"
    },
    {
      id: "2",
      startDate: "2025-02-05",
      endDate: "2025-02-07",
      leaveType: "Vacation",
      employeeName: userName,
      status: "approved"
    }
  ]

  // Filter for leaves that are approaching (within next 7 days)
  const today = new Date()
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(today.getDate() + 7)

  return mockLeaves.filter(leave => {
    const leaveStart = new Date(leave.startDate)
    return leaveStart >= today && leaveStart <= sevenDaysFromNow && leave.status === 'approved'
  })
}

export function NotificationSystem() {
  const { user, isAdmin } = useAuth()
  // Removed the problematic hook usage
  // const { getApproachingLeaves, getEmployeeLeaves } = useLeaveManagement()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Generate leave approaching notifications
    const generateLeaveNotifications = () => {
      const leaveNotifications: Notification[] = []

      if (user?.name) {
        const approachingLeaves = getApproachingLeaves(user.name)

        approachingLeaves.forEach((leave) => {
          const startDate = new Date(leave.startDate)
          const today = new Date()
          const daysUntilLeave = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

          let notificationType: Notification["type"] = "leave_approaching"
          let priority: Notification["priority"] = "medium"
          let title = ""
          let message = ""

          if (daysUntilLeave === 0) {
            notificationType = "leave_today"
            priority = "high"
            title = "🌟 Your Leave Starts Today!"
            message = `Hey ${user.name.split(" ")[0]}! Your ${leave.leaveType.toLowerCase()} starts today. Have a great time off! 🎉`
          } else if (daysUntilLeave === 1) {
            notificationType = "leave_tomorrow"
            priority = "high"
            title = "📅 Leave Starts Tomorrow"
            message = `Hi ${user.name.split(" ")[0]}! Your ${leave.leaveType.toLowerCase()} starts tomorrow (${leave.startDate}). Don't forget to wrap up any pending tasks! ✅`
          } else if (daysUntilLeave <= 3) {
            title = "⏰ Leave Starting Soon"
            message = `Hey ${user.name.split(" ")[0]}! Your ${leave.leaveType.toLowerCase()} starts in ${daysUntilLeave} days (${leave.startDate}). Time to prepare! 📋`
            priority = "medium"
          } else if (daysUntilLeave <= 7) {
            title = "📝 Upcoming Leave Reminder"
            message = `Hi ${user.name.split(" ")[0]}! Just a heads up - your ${leave.leaveType.toLowerCase()} is scheduled for ${leave.startDate} to ${leave.endDate} (${daysUntilLeave} days away).`
            priority = "low"
          }

          if (title && message) {
            leaveNotifications.push({
              id: `leave-${leave.id}-${daysUntilLeave}`,
              type: notificationType,
              title,
              message,
              timestamp: new Date().toISOString(),
              read: false,
              priority,
            })
          }
        })
      }

      return leaveNotifications
    }

    // Load base notifications based on user role
    const baseNotifications: Notification[] = isAdmin
        ? [
          {
            id: "1",
            type: "leave_application",
            title: "New Leave Application",
            message: "Lucia Mukamba has applied for personal leave from Feb 10-12, 2025",
            timestamp: "2025-01-22T10:30:00Z",
            read: false,
            priority: "high",
            actionRequired: true,
          },
          {
            id: "2",
            type: "task_completed",
            title: "Task Completed",
            message: "Allen Njani completed the API Security Enhancement task",
            timestamp: "2025-01-22T14:20:00Z",
            read: false,
            priority: "medium",
          },
          {
            id: "3",
            type: "task_overdue",
            title: "Task Overdue",
            message: "Marketing Campaign Strategy task is overdue by 2 days",
            timestamp: "2025-01-22T09:00:00Z",
            read: false,
            priority: "high",
          },
          {
            id: "4",
            type: "performance_review",
            title: "Performance Review Due",
            message: "Q1 performance reviews are due by end of week",
            timestamp: "2025-01-20T14:00:00Z",
            read: true,
            priority: "medium",
          },
        ]
        : [
          {
            id: "5",
            type: "leave_approved",
            title: "New Task Assigned",
            message: `Hey ${user?.name?.split(" ")[0]}! You have a new task: "Employee Portal Dashboard" assigned by your manager`,
            timestamp: "2025-01-22T11:15:00Z",
            read: false,
            priority: "high",
          },
          {
            id: "6",
            type: "leave_approved",
            title: "Leave Approved",
            message: "Your personal leave request for Feb 5-7 has been approved",
            timestamp: "2025-01-21T11:15:00Z",
            read: false,
            priority: "high",
          },
          {
            id: "7",
            type: "leave_reminder",
            title: "Task Due Soon",
            message: "Your task 'API Security Enhancement' is due in 2 days",
            timestamp: "2025-01-22T08:00:00Z",
            read: false,
            priority: "medium",
          },
          {
            id: "8",
            type: "leave_reminder",
            title: "Colleague on Leave",
            message: "Allen Njani will be on leave from Jan 30-31, 2025",
            timestamp: "2025-01-22T08:00:00Z",
            read: true,
            priority: "low",
          },
        ]

    // Combine base notifications with leave notifications
    const leaveNotifications = generateLeaveNotifications()
    const allNotifications = [...leaveNotifications, ...baseNotifications]

    // Sort by priority and timestamp
    allNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    setNotifications(allNotifications)
  }, [isAdmin, user]) // Removed getApproachingLeaves from dependency array

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "leave_approved":
      case "leave_application":
      case "leave_reminder":
        return <Calendar className="h-4 w-4" />
      case "leave_approaching":
      case "leave_tomorrow":
      case "leave_today":
        return <AlertTriangle className="h-4 w-4" />
      case "performance_review":
        return <Users className="h-4 w-4" />
      case "task_completed":
      case "task_overdue":
        return <Clock className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
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
      <div className="relative">
        {/* Notification Bell */}
        <Button variant="ghost" size="sm" onClick={() => setShowNotifications(!showNotifications)} className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
              <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
          )}
        </Button>

        {/* Notifications Panel */}
        {showNotifications && (
            <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-y-auto shadow-lg z-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                          Mark all read
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No notifications</div>
                ) : (
                    <div className="space-y-1">
                      {notifications.map((notification) => (
                          <div
                              key={notification.id}
                              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                              onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className={`p-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                                  {getTypeIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className={`text-sm font-medium ${!notification.read ? "font-semibold" : ""}`}>
                                      {notification.title}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          deleteNotification(notification.id)
                                        }}
                                        className="h-6 w-6 p-0"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                  <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                                    {notification.actionRequired && (
                                        <Badge variant="outline" className="text-xs">
                                          Action Required
                                        </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
              </CardContent>
            </Card>
        )}
      </div>
  )
}