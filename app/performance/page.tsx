"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { TrendingUp, Star, Plus, Eye, Edit } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"

interface PerformanceRecord {
  id: number
  employeeName: string
  department: string
  reviewPeriod: string
  overallRating: number
  goals: string[]
  achievements: string[]
  areasForImprovement: string[]
  hoursWorked: number
  projectsCompleted: number
  reviewDate: string
  reviewer: string
}

export default function PerformancePage() {
  const { isAdmin, user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<PerformanceRecord | null>(null)

  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([
    {
      id: 1,
      employeeName: "Gideon Zimano",
      department: "Human Resources",
      reviewPeriod: "Q4 2023",
      overallRating: 4.6,
      goals: ["Complete HR system upgrade", "Implement wellness program", "Improve recruitment process"],
      achievements: [
        "Successfully upgraded HRIS",
        "Launched employee wellness initiative",
        "Reduced hiring time by 25%",
      ],
      areasForImprovement: ["Strategic planning", "Cross-department collaboration"],
      hoursWorked: 480,
      projectsCompleted: 6,
      reviewDate: "2024-01-05",
      reviewer: "Lucia Mukamba",
    },
    {
      id: 2,
      employeeName: "Leeroy Sibanda",
      department: "Engineering",
      reviewPeriod: "Q4 2023",
      overallRating: 4.8,
      goals: ["Complete mobile app development", "Mentor junior developers", "Improve system performance"],
      achievements: [
        "Delivered mobile app ahead of schedule",
        "Mentored 3 junior developers successfully",
        "Improved system performance by 40%",
      ],
      areasForImprovement: ["Documentation", "Time management"],
      hoursWorked: 520,
      projectsCompleted: 9,
      reviewDate: "2024-01-08",
      reviewer: "Allen Njani",
    },
    {
      id: 3,
      employeeName: "Lucia Mukamba",
      department: "Marketing",
      reviewPeriod: "Q4 2023",
      overallRating: 4.4,
      goals: ["Launch Q4 campaign", "Increase social media engagement", "Develop brand partnerships"],
      achievements: [
        "Q4 campaign exceeded targets by 30%",
        "Grew social media following by 45%",
        "Secured 5 new brand partnerships",
      ],
      areasForImprovement: ["Analytics interpretation", "Budget management"],
      hoursWorked: 465,
      projectsCompleted: 7,
      reviewDate: "2024-01-10",
      reviewer: "Tadiwa Mundanga",
    },
    {
      id: 4,
      employeeName: "Onias Zimano",
      department: "Finance",
      reviewPeriod: "Q4 2023",
      overallRating: 4.5,
      goals: ["Complete annual audit preparation", "Implement cost reduction measures", "Improve financial reporting"],
      achievements: [
        "Audit completed without issues",
        "Reduced operational costs by 15%",
        "Streamlined monthly reporting process",
      ],
      areasForImprovement: ["Technology adoption", "Team leadership"],
      hoursWorked: 490,
      projectsCompleted: 8,
      reviewDate: "2024-01-12",
      reviewer: "Glenda Zimano",
    },
    {
      id: 5,
      employeeName: "Glenda Zimano",
      department: "Operations",
      reviewPeriod: "Q4 2023",
      overallRating: 4.3,
      goals: ["Optimize supply chain processes", "Improve quality control", "Reduce operational delays"],
      achievements: [
        "Reduced supply chain delays by 20%",
        "Implemented new quality control system",
        "Improved customer satisfaction scores",
      ],
      areasForImprovement: ["Digital transformation", "Vendor relationship management"],
      hoursWorked: 475,
      projectsCompleted: 6,
      reviewDate: "2024-01-15",
      reviewer: "Onias Zimano",
    },
    {
      id: 6,
      employeeName: "Allen Njani",
      department: "Engineering",
      reviewPeriod: "Q4 2023",
      overallRating: 4.2,
      goals: ["Develop new features", "Improve code quality", "Support system maintenance"],
      achievements: [
        "Delivered 8 new features successfully",
        "Reduced bug reports by 35%",
        "Maintained 99.9% system uptime",
      ],
      areasForImprovement: ["Leadership skills", "Project planning"],
      hoursWorked: 510,
      projectsCompleted: 8,
      reviewDate: "2024-01-18",
      reviewer: "Leeroy Sibanda",
    },
    {
      id: 7,
      employeeName: "Tadiwa Mundanga",
      department: "Sales",
      reviewPeriod: "Q4 2023",
      overallRating: 4.7,
      goals: ["Exceed sales targets", "Expand client base", "Improve customer retention"],
      achievements: [
        "Exceeded sales targets by 25%",
        "Acquired 15 new major clients",
        "Achieved 95% customer retention rate",
      ],
      areasForImprovement: ["CRM system utilization", "Market analysis"],
      hoursWorked: 495,
      projectsCompleted: 10,
      reviewDate: "2024-01-20",
      reviewer: "Gideon Zimano",
    },
  ])

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    if (rating >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return { text: "Excellent", variant: "default" as const }
    if (rating >= 4.0) return { text: "Good", variant: "secondary" as const }
    if (rating >= 3.5) return { text: "Satisfactory", variant: "outline" as const }
    return { text: "Needs Improvement", variant: "destructive" as const }
  }

  const handleAddReview = (formData: FormData) => {
    const newRecord: PerformanceRecord = {
      id: performanceRecords.length + 1,
      employeeName: formData.get("employeeName") as string,
      department: formData.get("department") as string,
      reviewPeriod: formData.get("reviewPeriod") as string,
      overallRating: Number.parseFloat(formData.get("overallRating") as string),
      goals: (formData.get("goals") as string).split("\n").filter((g) => g.trim()),
      achievements: (formData.get("achievements") as string).split("\n").filter((a) => a.trim()),
      areasForImprovement: (formData.get("areasForImprovement") as string).split("\n").filter((a) => a.trim()),
      hoursWorked: Number.parseInt(formData.get("hoursWorked") as string),
      projectsCompleted: Number.parseInt(formData.get("projectsCompleted") as string),
      reviewDate: formData.get("reviewDate") as string,
      reviewer: formData.get("reviewer") as string,
    }

    setPerformanceRecords([...performanceRecords, newRecord])
    setIsAddDialogOpen(false)
  }

  // Filter performance records based on user role
  const visiblePerformanceRecords = isAdmin
    ? performanceRecords
    : performanceRecords.filter((record) => record.employeeName === user?.name)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
            <p className="text-gray-600 mt-2">Track and manage employee performance reviews</p>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    performanceRecords.reduce((sum, record) => sum + record.overallRating, 0) /
                    performanceRecords.length
                  ).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Out of 5.0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviews Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceRecords.length}</div>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Hours/Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    performanceRecords.reduce((sum, record) => sum + record.hoursWorked, 0) /
                      performanceRecords.length /
                      3,
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Per employee</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceRecords.reduce((sum, record) => sum + record.projectsCompleted, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total this quarter</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Review Button - Only for admins */}
          {isAdmin && (
            <div className="mb-6">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Performance Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Performance Review</DialogTitle>
                    <DialogDescription>Create a new performance review for an employee</DialogDescription>
                  </DialogHeader>
                  <form action={handleAddReview} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="employeeName">Employee Name</Label>
                        <Input id="employeeName" name="employeeName" required />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" name="department" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reviewPeriod">Review Period</Label>
                        <Input id="reviewPeriod" name="reviewPeriod" placeholder="Q1 2024" required />
                      </div>
                      <div>
                        <Label htmlFor="overallRating">Overall Rating (1-5)</Label>
                        <Input
                          id="overallRating"
                          name="overallRating"
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="goals">Goals (one per line)</Label>
                      <Textarea id="goals" name="goals" rows={3} required />
                    </div>
                    <div>
                      <Label htmlFor="achievements">Achievements (one per line)</Label>
                      <Textarea id="achievements" name="achievements" rows={3} required />
                    </div>
                    <div>
                      <Label htmlFor="areasForImprovement">Areas for Improvement (one per line)</Label>
                      <Textarea id="areasForImprovement" name="areasForImprovement" rows={3} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="hoursWorked">Hours Worked</Label>
                        <Input id="hoursWorked" name="hoursWorked" type="number" required />
                      </div>
                      <div>
                        <Label htmlFor="projectsCompleted">Projects Completed</Label>
                        <Input id="projectsCompleted" name="projectsCompleted" type="number" required />
                      </div>
                      <div>
                        <Label htmlFor="reviewDate">Review Date</Label>
                        <Input id="reviewDate" name="reviewDate" type="date" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reviewer">Reviewer</Label>
                      <Input id="reviewer" name="reviewer" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Review
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Performance Records */}
          <div className="space-y-6">
            {visiblePerformanceRecords.map((record) => {
              const ratingBadge = getRatingBadge(record.overallRating)
              return (
                <Card key={record.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{record.employeeName}</CardTitle>
                        <CardDescription>
                          {record.department} • {record.reviewPeriod}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={ratingBadge.variant}>{ratingBadge.text}</Badge>
                        <div className={`text-2xl font-bold ${getRatingColor(record.overallRating)}`}>
                          {record.overallRating}/5
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Goals</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {record.goals.map((goal, index) => (
                              <li key={index}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Achievements</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                            {record.achievements.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
                            {record.areasForImprovement.map((area, index) => (
                              <li key={index}>{area}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm">Hours Worked</h4>
                            <p className="text-2xl font-bold">{record.hoursWorked}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Projects</h4>
                            <p className="text-2xl font-bold">{record.projectsCompleted}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Reviewed by {record.reviewer} on {record.reviewDate}
                      </div>
                      {/* Only show edit button for admins */}
                      {isAdmin && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-1 h-3 w-3" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
        <ChatbotWidget />
      </div>
    </AuthGuard>
  )
}
