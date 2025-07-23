"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertTriangle, Users, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useEmployees } from "@/hooks/use-employees"
import { useLeaveManagement } from "@/hooks/use-leave-management"

interface LeaveReminder {
  id: string
  employeeName: string
  leaveType: string
  startDate: string
  endDate: string
  daysUntilStart: number
  department: string
  isMyLeave: boolean
  urgency: "today" | "tomorrow" | "soon" | "upcoming"
}

export function LeaveReminders() {
  const { user, isAdmin } = useAuth()
  const [reminders, setReminders] = useState<LeaveReminder[]>([])
  const { employees } = useEmployees()
  const { getUpcomingLeaves, getApproachingLeaves } = useLeaveManagement()

  useEffect(() => {
    const upcomingLeaves = getUpcomingLeaves()

    const mockReminders: LeaveReminder[] = upcomingLeaves
      .map((leave, index) => {
        const daysUntilStart = Math.ceil(
          (new Date(leave.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        )

        let urgency: LeaveReminder["urgency"] = "upcoming"
        if (daysUntilStart === 0) urgency = "today"
        else if (daysUntilStart === 1) urgency = "tomorrow"
        else if (daysUntilStart <= 3) urgency = "soon"

        return {
          id: leave.id.toString(),
          employeeName: leave.employeeName,
          leaveType: leave.leaveType,
          startDate: leave.startDate,
          endDate: leave.endDate,
          daysUntilStart,
          department: leave.department,
          isMyLeave: user?.name === leave.employeeName,
          urgency,
        }
      })
      .filter((reminder) => reminder.daysUntilStart >= 0 && reminder.daysUntilStart <= 14) // Show reminders for next 2 weeks

    // Filter based on user role
    if (isAdmin) {
      setReminders(mockReminders)
    } else {
      // Employees see their own leaves and team leaves
      setReminders(mockReminders.filter((r) => r.isMyLeave || r.department === user?.department))
    }
  }, [user, isAdmin, getUpcomingLeaves])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "today":
        return "bg-red-100 text-red-800 border-red-200"
      case "tomorrow":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getUrgencyText = (days: number, urgency: string) => {
    if (days === 0) return "🌟 Today!"
    if (days === 1) return "📅 Tomorrow"
    if (urgency === "soon") return `⏰ ${days} days`
    return `📝 ${days} days`
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "today":
        return <CheckCircle className="h-4 w-4" />
      case "tomorrow":
        return <AlertTriangle className="h-4 w-4" />
      case "soon":
        return <Clock className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getPersonalizedMessage = (reminder: LeaveReminder) => {
    const firstName = reminder.employeeName.split(" ")[0]

    if (reminder.isMyLeave) {
      switch (reminder.urgency) {
        case "today":
          return `🎉 Your ${reminder.leaveType.toLowerCase()} starts today! Have a wonderful time off!`
        case "tomorrow":
          return `📋 Your ${reminder.leaveType.toLowerCase()} starts tomorrow. Don't forget to wrap up pending tasks!`
        case "soon":
          return `⏰ Your ${reminder.leaveType.toLowerCase()} is coming up soon. Time to prepare!`
        default:
          return `📅 Your upcoming ${reminder.leaveType.toLowerCase()} is scheduled.`
      }
    } else {
      switch (reminder.urgency) {
        case "today":
          return `${firstName} is starting their ${reminder.leaveType.toLowerCase()} today.`
        case "tomorrow":
          return `${firstName} will be on ${reminder.leaveType.toLowerCase()} starting tomorrow.`
        case "soon":
          return `${firstName} will be on ${reminder.leaveType.toLowerCase()} soon.`
        default:
          return `${firstName} has upcoming ${reminder.leaveType.toLowerCase()}.`
      }
    }
  }

  // Sort reminders by urgency and days
  const sortedReminders = reminders.sort((a, b) => {
    const urgencyOrder = { today: 4, tomorrow: 3, soon: 2, upcoming: 1 }
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
    }
    return a.daysUntilStart - b.daysUntilStart
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Leave Reminders & Notifications
        </CardTitle>
        <CardDescription>
          {isAdmin ? "Upcoming leaves across all departments" : "Your upcoming leaves and team notifications"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedReminders.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No upcoming leaves to remind</p>
            <p className="text-sm text-muted-foreground mt-2">
              All employees will be notified automatically when their leave approaches
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  reminder.isMyLeave
                    ? reminder.urgency === "today"
                      ? "bg-green-50 border-green-200"
                      : "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {reminder.isMyLeave ? `Your Leave (${reminder.employeeName})` : reminder.employeeName}
                    </span>
                    {!isAdmin && !reminder.isMyLeave && (
                      <Badge variant="outline" className="text-xs">
                        Team Member
                      </Badge>
                    )}
                  </div>
                  <Badge className={getUrgencyColor(reminder.urgency)}>
                    {getUrgencyIcon(reminder.urgency)}
                    <span className="ml-1">{getUrgencyText(reminder.daysUntilStart, reminder.urgency)}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                  <div>
                    <span className="font-medium">Type:</span> {reminder.leaveType}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {reminder.startDate} to {reminder.endDate}
                  </div>
                  <div>
                    <span className="font-medium">Department:</span> {reminder.department}
                  </div>
                </div>

                <div
                  className={`p-3 rounded text-sm ${
                    reminder.isMyLeave
                      ? reminder.urgency === "today"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <strong>{reminder.isMyLeave ? "Personal Reminder:" : "Team Update:"}</strong>{" "}
                  {getPersonalizedMessage(reminder)}
                </div>

                {reminder.isMyLeave && reminder.urgency !== "today" && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    💡 You'll receive automatic notifications as your leave date approaches
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Information footer */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Automatic Notifications:</strong>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• 📅 7 days before: Initial reminder</li>
                <li>• ⏰ 3 days before: Preparation reminder</li>
                <li>• 📋 1 day before: Final preparation notice</li>
                <li>• 🌟 Day of leave: Welcome message</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
