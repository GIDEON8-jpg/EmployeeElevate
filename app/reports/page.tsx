"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Download, TrendingUp, Clock, Target, CheckCircle } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"

interface ReportData {
  employeePerformance: {
    name: string
    department: string
    rating: number
    hoursWorked: number
    projectsAssigned: number
    projectsCompleted: number
    tasksAssigned: number
    tasksCompleted: number
    efficiency: number
    tasksCompletedList: string[]
  }[]
  leaveAnalytics: {
    totalLeavesTaken: number
    averageLeaveDays: number
    mostCommonLeaveType: string
    departmentLeaveStats: { department: string; days: number }[]
  }
  departmentStats: {
    department: string
    employeeCount: number
    avgPerformance: number
    totalHours: number
    projectsAssigned: number
    projectsCompleted: number
    tasksAssigned: number
    tasksCompleted: number
    departmentEfficiency: number
  }[]
  overallEfficiency: {
    totalProjectsAssigned: number
    totalProjectsCompleted: number
    totalTasksAssigned: number
    totalTasksCompleted: number
    overallProjectEfficiency: number
    overallTaskEfficiency: number
    combinedEfficiency: number
  }
}

export default function ReportsPage() {
  const { user, isAdmin } = useAuth()
  const [selectedReportType, setSelectedReportType] = useState("performance")
  const [selectedPeriod, setSelectedPeriod] = useState("Q1-2025")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const reportData: ReportData = {
    employeePerformance: [
      {
        name: "Gideon Zimano",
        department: "Human Resources",
        rating: 4.6,
        hoursWorked: 480,
        projectsAssigned: 8,
        projectsCompleted: 6,
        tasksAssigned: 24,
        tasksCompleted: 22,
        efficiency: 87.5,
        tasksCompletedList: [
          "Q1 Recruitment Drive",
          "Employee Wellness Program",
          "Policy Updates",
          "Training Coordination",
          "Performance Reviews",
          "Team Building Events",
        ],
      },
      {
        name: "Leeroy Sibanda",
        department: "Engineering",
        rating: 4.8,
        hoursWorked: 520,
        projectsAssigned: 10,
        projectsCompleted: 9,
        tasksAssigned: 32,
        tasksCompleted: 30,
        efficiency: 92.2,
        tasksCompletedList: [
          "Mobile App Development",
          "API Optimization",
          "Database Migration",
          "Code Reviews",
          "Mentoring Junior Devs",
          "Security Enhancements",
        ],
      },
      {
        name: "Lucia Mukamba",
        department: "Marketing",
        rating: 4.4,
        hoursWorked: 465,
        projectsAssigned: 9,
        projectsCompleted: 7,
        tasksAssigned: 28,
        tasksCompleted: 24,
        efficiency: 82.1,
        tasksCompletedList: [
          "Q1 Campaign Launch",
          "Social Media Strategy",
          "Content Creation",
          "Market Research",
          "Brand Partnerships",
          "Analytics Reporting",
        ],
      },
      {
        name: "Onias Zimano",
        department: "Finance",
        rating: 4.5,
        hoursWorked: 490,
        projectsAssigned: 10,
        projectsCompleted: 8,
        tasksAssigned: 30,
        tasksCompleted: 26,
        efficiency: 85.0,
        tasksCompletedList: [
          "Q1 Budget Analysis",
          "Financial Forecasting",
          "Expense Management",
          "Audit Preparation",
          "Investment Analysis",
          "Cost Optimization",
        ],
      },
      {
        name: "Glenda Zimano",
        department: "Operations",
        rating: 4.3,
        hoursWorked: 475,
        projectsAssigned: 8,
        projectsCompleted: 6,
        tasksAssigned: 26,
        tasksCompleted: 21,
        efficiency: 78.8,
        tasksCompletedList: [
          "Process Optimization",
          "Vendor Management",
          "Quality Assurance",
          "Supply Chain Management",
          "Operational Efficiency",
          "Team Coordination",
        ],
      },
      {
        name: "Allen Njani",
        department: "Engineering",
        rating: 4.2,
        hoursWorked: 510,
        projectsAssigned: 10,
        projectsCompleted: 8,
        tasksAssigned: 35,
        tasksCompleted: 28,
        efficiency: 82.9,
        tasksCompletedList: [
          "Frontend Development",
          "UI/UX Implementation",
          "Testing Automation",
          "Bug Fixes",
          "Feature Development",
          "Documentation",
        ],
      },
      {
        name: "Tadiwa Mundanga",
        department: "Sales",
        rating: 4.7,
        hoursWorked: 495,
        projectsAssigned: 12,
        projectsCompleted: 10,
        tasksAssigned: 38,
        tasksCompleted: 35,
        efficiency: 89.5,
        tasksCompletedList: [
          "Client Acquisition",
          "Sales Presentations",
          "Contract Negotiations",
          "Market Expansion",
          "Customer Relations",
          "Revenue Growth",
        ],
      },
    ],
    leaveAnalytics: {
      totalLeavesTaken: 52,
      averageLeaveDays: 7.4,
      mostCommonLeaveType: "Annual Leave",
      departmentLeaveStats: [
        { department: "Engineering", days: 18 },
        { department: "Marketing", days: 12 },
        { department: "Human Resources", days: 8 },
        { department: "Finance", days: 6 },
        { department: "Operations", days: 5 },
        { department: "Sales", days: 3 },
      ],
    },
    departmentStats: [
      {
        department: "Engineering",
        employeeCount: 28,
        avgPerformance: 4.5,
        totalHours: 3680,
        projectsAssigned: 84,
        projectsCompleted: 72,
        tasksAssigned: 280,
        tasksCompleted: 245,
        departmentEfficiency: 87.5,
      },
      {
        department: "Marketing",
        employeeCount: 15,
        avgPerformance: 4.4,
        totalHours: 2325,
        projectsAssigned: 45,
        projectsCompleted: 38,
        tasksAssigned: 150,
        tasksCompleted: 128,
        departmentEfficiency: 84.4,
      },
      {
        department: "Human Resources",
        employeeCount: 8,
        avgPerformance: 4.6,
        totalHours: 1440,
        projectsAssigned: 24,
        projectsCompleted: 20,
        tasksAssigned: 80,
        tasksCompleted: 72,
        departmentEfficiency: 85.0,
      },
      {
        department: "Finance",
        employeeCount: 12,
        avgPerformance: 4.5,
        totalHours: 2160,
        projectsAssigned: 36,
        projectsCompleted: 30,
        tasksAssigned: 120,
        tasksCompleted: 105,
        departmentEfficiency: 86.1,
      },
      {
        department: "Operations",
        employeeCount: 10,
        avgPerformance: 4.3,
        totalHours: 1900,
        projectsAssigned: 30,
        projectsCompleted: 24,
        tasksAssigned: 100,
        tasksCompleted: 82,
        departmentEfficiency: 82.0,
      },
      {
        department: "Sales",
        employeeCount: 18,
        avgPerformance: 4.7,
        totalHours: 2970,
        projectsAssigned: 54,
        projectsCompleted: 48,
        tasksAssigned: 180,
        tasksCompleted: 165,
        departmentEfficiency: 88.9,
      },
    ],
    overallEfficiency: {
      totalProjectsAssigned: 273,
      totalProjectsCompleted: 232,
      totalTasksAssigned: 910,
      totalTasksCompleted: 797,
      overallProjectEfficiency: 85.0,
      overallTaskEfficiency: 87.6,
      combinedEfficiency: 86.3,
    },
  }

  const filteredPerformanceData = isAdmin
    ? selectedDepartment === "all"
      ? reportData.employeePerformance
      : reportData.employeePerformance.filter((emp) => emp.department === selectedDepartment)
    : reportData.employeePerformance.filter((emp) => emp.name === user?.name)

  const generateReport = () => {
    alert(`Generating ${selectedReportType} report for ${selectedPeriod}...`)
  }

  const exportData = () => {
    alert("Exporting data to CSV...")
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600"
    if (efficiency >= 80) return "text-blue-600"
    if (efficiency >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 90) return { text: "Excellent", variant: "default" as const }
    if (efficiency >= 80) return { text: "Good", variant: "secondary" as const }
    if (efficiency >= 70) return { text: "Average", variant: "outline" as const }
    return { text: "Needs Improvement", variant: "destructive" as const }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? "Reports & Analytics" : "My Performance Reports"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAdmin
                ? "Generate comprehensive reports on employee performance and activities"
                : "View your personal performance metrics and analytics"}
            </p>
          </div>

          {/* Overall Efficiency Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Overall Efficiency Overview - {selectedPeriod}
              </CardTitle>
              <CardDescription>Organization-wide productivity and completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {reportData.overallEfficiency.combinedEfficiency}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Combined Efficiency</p>
                  <Progress value={reportData.overallEfficiency.combinedEfficiency} className="mt-2" />
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {reportData.overallEfficiency.overallProjectEfficiency}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Project Completion</p>
                  <p className="text-xs text-muted-foreground">
                    {reportData.overallEfficiency.totalProjectsCompleted}/
                    {reportData.overallEfficiency.totalProjectsAssigned}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {reportData.overallEfficiency.overallTaskEfficiency}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Task Completion</p>
                  <p className="text-xs text-muted-foreground">
                    {reportData.overallEfficiency.totalTasksCompleted}/{reportData.overallEfficiency.totalTasksAssigned}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">
                    {reportData.overallEfficiency.totalProjectsAssigned +
                      reportData.overallEfficiency.totalTasksAssigned}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Total Assignments</p>
                  <p className="text-xs text-muted-foreground">Projects + Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Controls */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Select report type and filters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Report Type</label>
                  <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance Report</SelectItem>
                      <SelectItem value="efficiency">Efficiency Analysis</SelectItem>
                      <SelectItem value="leave">Leave Analytics</SelectItem>
                      {isAdmin && <SelectItem value="department">Department Summary</SelectItem>}
                      <SelectItem value="hours">Hours Worked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Period</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1-2025">Q1 2025</SelectItem>
                      <SelectItem value="Q4-2024">Q4 2024</SelectItem>
                      <SelectItem value="Q3-2024">Q3 2024</SelectItem>
                      <SelectItem value="Q2-2024">Q2 2024</SelectItem>
                      <SelectItem value="Q1-2024">Q1 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isAdmin && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Department</label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <Button onClick={generateReport} className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                  <Button onClick={exportData} variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Report */}
          {selectedReportType === "performance" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Performance Report - {selectedPeriod}</CardTitle>
                  <CardDescription>
                    Detailed performance metrics and task completion for {selectedPeriod}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredPerformanceData.map((employee, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{employee.name}</h3>
                            <p className="text-muted-foreground">{employee.department}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                employee.rating >= 4.5 ? "default" : employee.rating >= 4.0 ? "secondary" : "outline"
                              }
                            >
                              {employee.rating}/5.0
                            </Badge>
                            <Badge variant={getEfficiencyBadge(employee.efficiency).variant}>
                              {employee.efficiency}% Efficiency
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <Clock className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                            <p className="text-2xl font-bold text-blue-600">{employee.hoursWorked}</p>
                            <p className="text-sm text-muted-foreground">Hours Worked</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded">
                            <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-600" />
                            <p className="text-2xl font-bold text-green-600">
                              {employee.projectsCompleted}/{employee.projectsAssigned}
                            </p>
                            <p className="text-sm text-muted-foreground">Projects</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded">
                            <Target className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                            <p className="text-2xl font-bold text-purple-600">
                              {employee.tasksCompleted}/{employee.tasksAssigned}
                            </p>
                            <p className="text-sm text-muted-foreground">Tasks</p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded">
                            <TrendingUp className="h-6 w-6 mx-auto mb-1 text-orange-600" />
                            <p className={`text-2xl font-bold ${getEfficiencyColor(employee.efficiency)}`}>
                              {employee.efficiency}%
                            </p>
                            <p className="text-sm text-muted-foreground">Efficiency</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Overall Completion Rate</span>
                            <span className="text-sm text-muted-foreground">{employee.efficiency}%</span>
                          </div>
                          <Progress value={employee.efficiency} className="h-2" />
                        </div>
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Key Tasks & Projects Completed:</h4>
                          <div className="flex flex-wrap gap-2">
                            {employee.tasksCompletedList.map((task, taskIndex) => (
                              <Badge key={taskIndex} variant="outline">
                                {task}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Efficiency Analysis Report */}
          {selectedReportType === "efficiency" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Efficiency Analysis - {selectedPeriod}</CardTitle>
                  <CardDescription>Detailed breakdown of completion rates and productivity metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredPerformanceData
                      .sort((a, b) => b.efficiency - a.efficiency)
                      .map((employee, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{employee.name}</h3>
                              <p className="text-muted-foreground">{employee.department}</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-3xl font-bold ${getEfficiencyColor(employee.efficiency)}`}>
                                {employee.efficiency}%
                              </div>
                              <Badge variant={getEfficiencyBadge(employee.efficiency).variant}>
                                {getEfficiencyBadge(employee.efficiency).text}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Project Completion</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Assigned:</span>
                                  <span className="font-medium">{employee.projectsAssigned}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Completed:</span>
                                  <span className="font-medium text-green-600">{employee.projectsCompleted}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Pending:</span>
                                  <span className="font-medium text-orange-600">
                                    {employee.projectsAssigned - employee.projectsCompleted}
                                  </span>
                                </div>
                                <Progress
                                  value={(employee.projectsCompleted / employee.projectsAssigned) * 100}
                                  className="mt-2"
                                />
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3">Task Completion</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Assigned:</span>
                                  <span className="font-medium">{employee.tasksAssigned}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Completed:</span>
                                  <span className="font-medium text-green-600">{employee.tasksCompleted}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Pending:</span>
                                  <span className="font-medium text-orange-600">
                                    {employee.tasksAssigned - employee.tasksCompleted}
                                  </span>
                                </div>
                                <Progress
                                  value={(employee.tasksCompleted / employee.tasksAssigned) * 100}
                                  className="mt-2"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Department Summary Report */}
          {selectedReportType === "department" && (
            <Card>
              <CardHeader>
                <CardTitle>Department Summary - {selectedPeriod}</CardTitle>
                <CardDescription>
                  {isAdmin
                    ? "Overview of all departments with efficiency metrics"
                    : `${user?.department} department overview`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(isAdmin
                    ? reportData.departmentStats
                    : reportData.departmentStats.filter((dept) => dept.department === user?.department)
                  )
                    .sort((a, b) => b.departmentEfficiency - a.departmentEfficiency)
                    .map((dept, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{dept.department}</h3>
                            <Badge variant="outline">{dept.employeeCount} employees</Badge>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getEfficiencyColor(dept.departmentEfficiency)}`}>
                              {dept.departmentEfficiency}%
                            </div>
                            <p className="text-sm text-muted-foreground">Department Efficiency</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-blue-600">{dept.avgPerformance}</p>
                            <p className="text-sm text-muted-foreground">Avg Performance</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-green-600">
                              {dept.projectsCompleted}/{dept.projectsAssigned}
                            </p>
                            <p className="text-sm text-muted-foreground">Projects</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-purple-600">
                              {dept.tasksCompleted}/{dept.tasksAssigned}
                            </p>
                            <p className="text-sm text-muted-foreground">Tasks</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-orange-600">{dept.totalHours}</p>
                            <p className="text-sm text-muted-foreground">Total Hours</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-gray-600">
                              {Math.round(dept.totalHours / dept.employeeCount)}
                            </p>
                            <p className="text-sm text-muted-foreground">Avg Hours/Employee</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Department Efficiency</span>
                            <span className="text-sm text-muted-foreground">{dept.departmentEfficiency}%</span>
                          </div>
                          <Progress value={dept.departmentEfficiency} className="h-2" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedReportType === "leave" && !isAdmin && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Leave Analytics - {selectedPeriod}</CardTitle>
                  <CardDescription>Your personal leave statistics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">My Leaves Taken</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">5</div>
                        <p className="text-muted-foreground">Days in {selectedPeriod}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Leave Balance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">20</div>
                        <p className="text-muted-foreground">Days remaining</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Most Used Type</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-bold text-purple-600">Annual Leave</div>
                        <p className="text-muted-foreground">Your preference</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedReportType === "leave" && isAdmin && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Leaves Taken</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{reportData.leaveAnalytics.totalLeavesTaken}</div>
                    <p className="text-muted-foreground">Days in {selectedPeriod}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Average Leave Days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {reportData.leaveAnalytics.averageLeaveDays}
                    </div>
                    <p className="text-muted-foreground">Per employee</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Most Common Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-purple-600">
                      {reportData.leaveAnalytics.mostCommonLeaveType}
                    </div>
                    <p className="text-muted-foreground">Leave type</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Leave Days by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.leaveAnalytics.departmentLeaveStats.map((dept, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded">
                        <span className="font-medium">{dept.department}</span>
                        <Badge>{dept.days} days</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hours Worked Report */}
          {selectedReportType === "hours" && (
            <Card>
              <CardHeader>
                <CardTitle>Hours Worked Report - {selectedPeriod}</CardTitle>
                <CardDescription>Detailed breakdown of hours worked by employees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPerformanceData.map((employee, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{employee.hoursWorked}</p>
                        <p className="text-sm text-muted-foreground">hours</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total Hours ({selectedDepartment === "all" ? "All Departments" : selectedDepartment})</span>
                      <span className="text-2xl">
                        {filteredPerformanceData.reduce((sum, emp) => sum + emp.hoursWorked, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <ChatbotWidget />
      </div>
    </AuthGuard>
  )
}
