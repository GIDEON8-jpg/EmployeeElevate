"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Clock, Plus, Search, Calendar, User, AlertTriangle, FileText, MessageSquare } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { AuthGuard } from "@/components/auth-guard"
import { useToast } from "@/hooks/use-toast"
import { getAuthHeaders } from "@/lib/auth-utils"

// Backend Task interface matching C# model
interface BackendTask {
  id: number
  title: string
  description: string
  status: "Not Started" | "In Progress" | "Review" | "Completed" | "On Hold"
  priority: "Low" | "Medium" | "High" | "Critical"
  dueDate: string
  assignedDate: string
  employeeId: number
  // Add other properties from your C# model as needed
}

// Keep the existing Task interface for compatibility with admin features
interface Task {
  id: number
  title: string
  description: string
  assignedTo: string
  assignedBy: string
  department: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Not Started" | "In Progress" | "Review" | "Completed" | "On Hold"
  dueDate: string
  estimatedHours: number
  actualHours?: number
  category: "Development" | "Marketing" | "HR" | "Finance" | "Operations" | "Sales" | "General"
  tags: string[]
  comments: Comment[]
  completedDate?: string
}

interface Comment {
  id: number
  taskId: number
  author: string
  content: string
  timestamp: string
  type: "comment" | "status_change"
}

const base_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const TasksPage = () => {
  // Get user from localStorage (using the nested structure we discovered)
  const userData = typeof window !== 'undefined' && localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null
  const user = userData?.user
  const isAdmin = user?.role === "admin" || user?.role === "Admin"
  
  const { toast } = useToast()

  // State for backend tasks
  const [backendTasks, setBackendTasks] = useState<BackendTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // State for admin mock data (keep existing functionality)
  const [adminTasks, setAdminTasks] = useState<Task[]>([])
  
  // UI state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [newComment, setNewComment] = useState("")

  // Load tasks from backend
  useEffect(() => {
    if (user?.id && !isAdmin) {
      fetchUserTasks()
    } else if (isAdmin) {
      // For admin, keep existing mock data functionality
      loadMockTasks()
    }
  }, [user?.id, isAdmin])

  const fetchUserTasks = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      console.log('Fetching tasks for employee ID:', user.id)
      
      const response = await fetch(`${base_url}/task/employee/${user.id}`, {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const tasks = await response.json()
        console.log('Tasks received from backend:', tasks)
        setBackendTasks(tasks)
        console.log('Setting backend tasks state:', tasks)
        setError("")
      } else {
        console.error('Failed to fetch tasks:', response.status)
        setError(`Failed to load tasks: ${response.status}`)
        setBackendTasks([])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError(`Error loading tasks: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setBackendTasks([])
    } finally {
      setLoading(false)
    }
  }

  const loadMockTasks = () => {
    // Keep existing mock data for admin functionality
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "Update Employee Portal Dashboard",
        description: "Redesign and update the main dashboard interface with new metrics and improved user experience",
        assignedTo: "Allen Njani",
        assignedBy: "Leeroy Sibanda",
        department: "Engineering",
        priority: "High",
        status: "In Progress",
        dueDate: "2025-02-15",
        estimatedHours: 40,
        actualHours: 25,
        category: "Development",
        tags: ["frontend", "react", "dashboard"],
        comments: [
          {
            id: 1,
            taskId: 1,
            author: "Allen Njani",
            content: "Started working on the new dashboard layout. Making good progress.",
            timestamp: "2025-01-22T10:30:00Z",
            type: "comment"
          }
        ]
      }
      // Add more mock tasks as needed for admin
    ]
    setAdminTasks(mockTasks)
    setLoading(false)
  }

  // Update task status (for backend tasks)
  const handleBackendStatusUpdate = async (taskId: number, newStatus: BackendTask["status"]) => {
    try {
      const response = await fetch(`${base_url}/task/update/${taskId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
          // Add other required fields for TaskAssignmentDto
        })
      })

      if (response.ok) {
        // Update local state
        setBackendTasks(prev => 
          prev.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        )
        
        toast({
          title: "🔄 Task Status Updated",
          description: `Task status changed to ${newStatus}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update task status",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      })
    }
  }

  // For admin, keep existing mock functionality
  const handleAddTask = (formData: FormData) => {
    if (!isAdmin) return // Only admin can add tasks in this UI
    
    const assignedTo = formData.get("assignedTo") as string
    const taskData = {
      id: Date.now(), // Simple ID generation for mock
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      assignedTo,
      assignedBy: user?.fullName || "Admin",
      department: formData.get("department") as string,
      priority: formData.get("priority") as Task["priority"],
      status: "Not Started" as const,
      dueDate: formData.get("dueDate") as string,
      estimatedHours: Number.parseInt(formData.get("estimatedHours") as string),
      category: formData.get("category") as Task["category"],
      tags: (formData.get("tags") as string)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      comments: []
    }

    setAdminTasks(prev => [...prev, taskData])
    setIsAddTaskOpen(false)
    toast({
      title: "✅ Task Successfully Assigned!",
      description: `Task "${taskData.title}" has been assigned to ${assignedTo}. They will see it immediately in their task dashboard.`,
    })
  }

  // Admin task status update (for mock data)
  const handleAdminStatusUpdate = (taskId: number, newStatus: Task["status"]) => {
    const task = adminTasks.find((t) => t.id === taskId)
    setAdminTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { 
              ...t, 
              status: newStatus,
              completedDate: newStatus === "Completed" ? new Date().toISOString().split("T")[0] : t.completedDate
            }
          : t
      )
    )

    toast({
      title: "🔄 Task Status Updated",
      description: `"${task?.title}" status changed to ${newStatus}.`,
    })
  }

  const handleAddComment = (taskId: number) => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      taskId,
      author: user?.fullName || "User",
      content: newComment,
      timestamp: new Date().toISOString(),
      type: "comment"
    }

    setAdminTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, comment] }
          : task
      )
    )

    setNewComment("")
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the task",
    })
  }

  // Get the appropriate tasks based on user role
  const currentTasks = isAdmin ? adminTasks : backendTasks
  
  // Filter tasks based on search and filters
  const filteredTasks = currentTasks.filter((task) => {
    const title = 'title' in task ? task.title : ''
    const description = 'description' in task ? task.description : ''
    const assignedTo = 'assignedTo' in task ? task.assignedTo : user?.fullName || ''
    
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    // For backend tasks, we don't have department info, so skip department filter for non-admin
    const matchesDepartment = !isAdmin || departmentFilter === "all" || ('department' in task && task.department === departmentFilter)

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment
  })

  // Calculate stats
  const totalTasks = currentTasks.length
  const inProgressTasks = currentTasks.filter(task => task.status === "In Progress").length
  const completedTasks = currentTasks.filter(task => task.status === "Completed").length
  const overdueTasks = currentTasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    return dueDate < today && task.status !== "Completed"
  }).length

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Review":
        return "bg-purple-100 text-purple-800"
      case "On Hold":
        return "bg-gray-100 text-gray-800"
      case "Not Started":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressPercentage = (status: Task["status"]) => {
    switch (status) {
      case "Not Started":
        return 0
      case "In Progress":
        return 50
      case "Review":
        return 80
      case "Completed":
        return 100
      case "On Hold":
        return 25
      default:
        return 0
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{isAdmin ? "Task Management" : "My Tasks"}</h1>
            <p className="text-gray-600 mt-2">
              {isAdmin ? "Assign and manage tasks across your organization" : "View and manage your assigned tasks"}
            </p>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-xs text-muted-foreground">{isAdmin ? "Organization-wide" : "Assigned to you"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressTasks}</div>
                <p className="text-xs text-muted-foreground">Active tasks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckSquare className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks}</div>
                <p className="text-xs text-muted-foreground">Finished tasks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overdueTasks}</div>
                <p className="text-xs text-muted-foreground">Past due date</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="tasks" className="space-y-6">
            <TabsList>
              <TabsTrigger value="tasks">All Tasks</TabsTrigger>
              {isAdmin && <TabsTrigger value="assign">Assign Task</TabsTrigger>}
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-6">
              {/* Filters and Search */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search tasks..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    {isAdmin && (
                      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by department" />
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
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tasks List */}
              <div className="space-y-4">
                {loading && !isAdmin ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading your tasks...</p>
                    </CardContent>
                  </Card>
                ) : error && !isAdmin ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button onClick={fetchUserTasks}>Try Again</Button>
                    </CardContent>
                  </Card>
                ) : filteredTasks.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No tasks found matching your criteria.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredTasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{task.title}</h3>
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            </div>

                            <p className="text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                              {isAdmin && 'assignedTo' in task && (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    Assigned to: <strong>{task.assignedTo}</strong>
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  Due: <strong>{task.dueDate}</strong>
                                </span>
                              </div>
                              {isAdmin && 'estimatedHours' in task && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    Est: <strong>{task.estimatedHours}h</strong>
                                  </span>
                                </div>
                              )}
                              {isAdmin && 'category' in task && (
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    Category: <strong>{task.category}</strong>
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Progress</span>
                                <span className="text-sm text-muted-foreground">
                                  {getProgressPercentage(task.status)}%
                                </span>
                              </div>
                              <Progress value={getProgressPercentage(task.status)} className="h-2" />
                            </div>

                            {isAdmin && 'tags' in task && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {task.tags.map((tag: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if ('assignedTo' in task) {
                                    setSelectedTask(task as Task)
                                    setIsTaskDetailOpen(true)
                                  }
                                }}
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                View Details
                              </Button>
                            )}

                            {((!isAdmin) || (isAdmin && 'assignedTo' in task && task.assignedTo === user?.fullName)) && (
                              <Select
                                value={task.status}
                                onValueChange={(value) => {
                                  if (isAdmin) {
                                    handleAdminStatusUpdate(task.id, value as Task["status"])
                                  } else {
                                    handleBackendStatusUpdate(task.id, value as BackendTask["status"])
                                  }
                                }}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Not Started">Not Started</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Review">Review</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                  <SelectItem value="On Hold">On Hold</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="assign" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assign New Task</CardTitle>
                    <CardDescription>Create and assign a new task to an employee</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form action={handleAddTask} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Task Title</Label>
                          <Input id="title" name="title" placeholder="Enter task title" required />
                        </div>
                        <div>
                          <Label htmlFor="assignedTo">Assign To</Label>
                          <Select name="assignedTo" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Allen Njani">Allen Njani - Engineering</SelectItem>
                              <SelectItem value="Lucia Mukamba">Lucia Mukamba - Engineering</SelectItem>
                              <SelectItem value="Leeroy Sibanda">Leeroy Sibanda - Marketing</SelectItem>
                              <SelectItem value="Tadiwa Mundanga">Tadiwa Mundanga - Sales</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Detailed task description..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select name="priority" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select name="category" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Development">Development</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input id="dueDate" name="dueDate" type="date" required />
                        </div>
                        <div>
                          <Label htmlFor="estimatedHours">Estimated Hours</Label>
                          <Input id="estimatedHours" name="estimatedHours" type="number" placeholder="Hours" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select name="department" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Engineering">Engineering</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Human Resources">Human Resources</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input id="tags" name="tags" placeholder="e.g. urgent, frontend, api" />
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Assign Task
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="analytics" className="space-y-6">
              {isAdmin ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tasks by Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["Critical", "High", "Medium", "Low"].map((priority) => {
                          const count = adminTasks.filter(task => task.priority === priority).length
                          return (
                            <div key={priority} className="flex justify-between items-center">
                              <Badge className={getPriorityColor(priority as Task["priority"])}>{priority}</Badge>
                              <span className="font-semibold">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tasks by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["Not Started", "In Progress", "Review", "Completed", "On Hold"].map((status) => {
                          const count = adminTasks.filter(task => task.status === status).length
                          return (
                            <div key={status} className="flex justify-between items-center">
                              <Badge className={getStatusColor(status as Task["status"])}>{status}</Badge>
                              <span className="font-semibold">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Tasks by Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["Critical", "High", "Medium", "Low"].map((priority) => {
                          const count = backendTasks.filter(task => task.priority === priority).length
                          return (
                            <div key={priority} className="flex justify-between items-center">
                              <Badge className={getPriorityColor(priority as BackendTask["priority"])}>{priority}</Badge>
                              <span className="font-semibold">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>My Tasks by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["Not Started", "In Progress", "Review", "Completed", "On Hold"].map((status) => {
                          const count = backendTasks.filter(task => task.status === status).length
                          return (
                            <div key={status} className="flex justify-between items-center">
                              <Badge className={getStatusColor(status as BackendTask["status"])}>{status}</Badge>
                              <span className="font-semibold">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Task Detail Dialog */}
          <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedTask?.title}
                </DialogTitle>
                <DialogDescription>
                  Task assigned to {selectedTask?.assignedTo} by {selectedTask?.assignedBy}
                </DialogDescription>
              </DialogHeader>

              {selectedTask && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Task Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className={getStatusColor(selectedTask.status)}>{selectedTask.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Priority:</span>
                          <Badge className={getPriorityColor(selectedTask.priority)}>{selectedTask.priority}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Due Date:</span>
                          <span>{selectedTask.dueDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Hours:</span>
                          <span>{selectedTask.estimatedHours}h</span>
                        </div>
                        {selectedTask.actualHours && (
                          <div className="flex justify-between">
                            <span>Actual Hours:</span>
                            <span>{selectedTask.actualHours}h</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Progress</h4>
                      <Progress value={getProgressPercentage(selectedTask.status)} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {getProgressPercentage(selectedTask.status)}% Complete
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                  </div>

                  {selectedTask.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-4">Comments & Updates</h4>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {selectedTask.comments.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                          {comment.type === "status_change" && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              Status Change
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>

                    {(selectedTask.assignedTo === user?.name || isAdmin) && (
                      <div className="mt-4 flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={() => handleAddComment(selectedTask.id)}>
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <ChatbotWidget />
      </div>
    </AuthGuard>
  )
}

export default TasksPage
