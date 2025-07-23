"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, Check, X, Clock } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { useLeaveManagement } from "@/hooks/use-leave-management"
import { useToast } from "@/hooks/use-toast"

export default function LeavesPage() {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const { isAdmin, user } = useAuth()
  const { toast } = useToast()
  const { leaveApplications, addLeaveApplication, approveLeave, rejectLeave, getPendingLeaves, getApprovedLeaves } =
    useLeaveManagement()

  const leaveTypes = ["Annual Leave", "Sick Leave", "Personal Leave", "Maternity Leave", "Emergency Leave"]
  const departments = ["Engineering", "Marketing", "Human Resources", "Finance", "Operations", "Sales"]

  // Filter applications - EVERYONE sees ALL applications, just filtered by status and department
  const filteredApplications = leaveApplications.filter((app) => {
    const statusMatch = selectedStatus === "all" || app.status === selectedStatus
    const departmentMatch = selectedDepartment === "all" || app.department === selectedDepartment
    return statusMatch && departmentMatch
  })

  const handleApprove = (id: number) => {
    approveLeave(id, user?.name || "Admin")
    const application = leaveApplications.find((app) => app.id === id)
    toast({
      title: "Leave Approved",
      description: `${application?.employeeName}'s leave application has been approved and will be visible across the system.`,
    })
  }

  const handleReject = (id: number) => {
    rejectLeave(id, user?.name || "Admin")
    const application = leaveApplications.find((app) => app.id === id)
    toast({
      title: "Leave Rejected",
      description: `${application?.employeeName}'s leave application has been rejected.`,
      variant: "destructive",
    })
  }

  const handleApplyLeave = (formData: FormData) => {
    const startDate = new Date(formData.get("startDate") as string)
    const endDate = new Date(formData.get("endDate") as string)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const newApplicationData = {
      employeeName: user?.name || (formData.get("employeeName") as string),
      department: user?.department || (formData.get("department") as string),
      leaveType: formData.get("leaveType") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      days,
      reason: formData.get("reason") as string,
      status: "Pending" as const,
      appliedDate: new Date().toISOString().split("T")[0],
    }

    addLeaveApplication(newApplicationData)
    setIsApplyDialogOpen(false)
    toast({
      title: "Leave Application Submitted",
      description: "Your leave application has been submitted and is visible to all team members for transparency.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <Check className="h-4 w-4" />
      case "Rejected":
        return <X className="h-4 w-4" />
      case "Pending":
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  // Calculate stats from ALL applications (everyone sees organization-wide stats)
  const totalApplications = leaveApplications.length
  const pendingApplications = getPendingLeaves().length
  const approvedApplications = getApprovedLeaves().length
  const rejectedApplications = leaveApplications.filter((app) => app.status === "Rejected").length

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Company Leave Schedule</h1>
            <p className="text-gray-600 mt-2">
              View all employee leave applications and schedules across the organization for full transparency
            </p>
          </div>

          {/* Stats Cards - Organization Wide */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalApplications}</div>
                <p className="text-xs text-muted-foreground">Organization-wide</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingApplications}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <Check className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedApplications}</div>
                <p className="text-xs text-muted-foreground">Approved leaves</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <X className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rejectedApplications}</div>
                <p className="text-xs text-muted-foreground">Rejected applications</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex flex-col md:flex-row gap-4">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Apply for Leave button - available to all users */}
                <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Apply for Leave
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Apply for Leave</DialogTitle>
                      <DialogDescription>Submit a new leave application</DialogDescription>
                    </DialogHeader>
                    <form action={handleApplyLeave} className="space-y-4">
                      {isAdmin && (
                        <>
                          <div>
                            <Label htmlFor="employeeName">Employee Name</Label>
                            <Input id="employeeName" name="employeeName" placeholder="Enter employee name" required />
                          </div>
                          <div>
                            <Label htmlFor="department">Department</Label>
                            <Select name="department" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      <div>
                        <Label htmlFor="leaveType">Leave Type</Label>
                        <Select name="leaveType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            {leaveTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" name="startDate" type="date" required />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" name="endDate" type="date" required />
                      </div>
                      <div>
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea id="reason" name="reason" placeholder="Briefly explain your leave request" required />
                      </div>
                      <Button type="submit" className="w-full">
                        Submit Application
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Current filter info */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredApplications.length} of {totalApplications} applications
              {selectedStatus !== "all" && ` (${selectedStatus} only)`}
              {selectedDepartment !== "all" && ` (${selectedDepartment} department only)`}
            </p>
          </div>

          {/* Leave Applications - Everyone sees all applications */}
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{application.employeeName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {application.department}
                        </Badge>
                        <Badge className={getStatusColor(application.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {application.status}
                          </div>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Leave Type:</span> {application.leaveType}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {application.startDate} to{" "}
                          {application.endDate}
                        </div>
                        <div>
                          <span className="font-medium">Days:</span> {application.days} days
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-sm">Reason:</span>
                        <p className="text-sm text-muted-foreground mt-1">{application.reason}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Applied on: {application.appliedDate}
                        {application.approvedBy && (
                          <span className="ml-4 text-green-600">
                            Approved by {application.approvedBy} on {application.approvedDate}
                          </span>
                        )}
                        {application.rejectedBy && (
                          <span className="ml-4 text-red-600">
                            Rejected by {application.rejectedBy} on {application.rejectedDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Only show approve/reject buttons for admins and only for pending applications */}
                    {isAdmin && application.status === "Pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(application.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(application.id)}>
                          <X className="mr-1 h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {selectedStatus === "all" && selectedDepartment === "all"
                    ? "No leave applications found."
                    : `No applications found matching the selected filters.`}
                </p>
                {(selectedStatus !== "all" || selectedDepartment !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedStatus("all")
                      setSelectedDepartment("all")
                    }}
                    className="mt-4"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        <ChatbotWidget />
      </div>
    </AuthGuard>
  )
}
