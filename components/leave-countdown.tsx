"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLeaveManagement } from "@/hooks/use-leave-management"

export function LeaveCountdown() {
  const { user } = useAuth()
  const { getUpcomingLeaves, getDaysUntilNextLeave } = useLeaveManagement()

  if (!user) return null

  const upcomingLeaves = getUpcomingLeaves(user.name)
  const daysUntilNextLeave = getDaysUntilNextLeave(user.name)

  if (upcomingLeaves.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Your Next Leave
          </CardTitle>
          <CardDescription>No upcoming approved leaves</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏖️</div>
            <p className="text-gray-500">No leaves scheduled</p>
            <p className="text-sm text-gray-400 mt-2">Apply for leave to see countdown here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const nextLeave = upcomingLeaves[0]
  const startDate = new Date(nextLeave.startDate)
  const endDate = new Date(nextLeave.endDate)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getCountdownColor = (days: number | null) => {
    if (days === null) return "text-gray-500"
    if (days === 0) return "text-green-600"
    if (days <= 3) return "text-orange-600"
    if (days <= 7) return "text-yellow-600"
    return "text-blue-600"
  }

  const getCountdownText = (days: number | null) => {
    if (days === null) return "No leave"
    if (days === 0) return "Today!"
    if (days === 1) return "Tomorrow!"
    return `${days} days`
  }

  const getEmoji = (days: number | null) => {
    if (days === null) return "📅"
    if (days === 0) return "🎉"
    if (days <= 3) return "⏰"
    if (days <= 7) return "📆"
    return "🗓️"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Your Next Leave
        </CardTitle>
        <CardDescription>
          {nextLeave.leaveType} leave • {nextLeave.daysRequested} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          {/* Countdown Display */}
          <div className="space-y-2">
            <div className="text-4xl">{getEmoji(daysUntilNextLeave)}</div>
            <div className={`text-4xl font-bold ${getCountdownColor(daysUntilNextLeave)}`}>
              {getCountdownText(daysUntilNextLeave)}
            </div>
            {daysUntilNextLeave !== null && daysUntilNextLeave > 0 && (
              <p className="text-sm text-gray-500">until your leave starts</p>
            )}
          </div>

          {/* Leave Details */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Start Date:</span>
              <Badge variant="outline" className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(startDate)}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">End Date:</span>
              <Badge variant="outline" className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(endDate)}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Duration:</span>
              <Badge variant="secondary" className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {nextLeave.daysRequested} days
              </Badge>
            </div>

            {nextLeave.reason && (
              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-1">Reason:</p>
                <p className="text-sm bg-gray-50 p-2 rounded text-center">{nextLeave.reason}</p>
              </div>
            )}
          </div>

          {/* Motivational Message */}
          <div className="pt-4 border-t">
            {daysUntilNextLeave === 0 && (
              <p className="text-sm text-green-600 font-medium">🎉 Your leave starts today! Have a great time!</p>
            )}
            {daysUntilNextLeave === 1 && (
              <p className="text-sm text-orange-600 font-medium">📋 Leave starts tomorrow! Wrap up your tasks.</p>
            )}
            {daysUntilNextLeave !== null && daysUntilNextLeave > 1 && daysUntilNextLeave <= 7 && (
              <p className="text-sm text-yellow-600 font-medium">⏰ Leave starting soon! Plan ahead.</p>
            )}
            {daysUntilNextLeave !== null && daysUntilNextLeave > 7 && (
              <p className="text-sm text-blue-600 font-medium">🗓️ Something to look forward to!</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
