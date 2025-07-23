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
import { useAuth } from "@/hooks/use-auth"
import { useEmployees } from "@/hooks/use-employees"
import { useTaskManagement, type Task } from "@/hooks/use-task-management"
import { useToast } from "@/hooks/use-toast"

const TasksPage = () => {
  const { user, isAdmin } = useAuth()
  const { employees } = useEmployees()
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    getTaskStats,
    getTasksByEmployee,
    getOverdueTasks,
    syncTasks,
  } = useTaskManagement()
  const { toast } = useToast()

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [newComment, setNewComment] = useState("")

  const taskStats = getTaskStats()
  const myTasks = getTasksByEmployee(user?.name || "")
  const overdueTasks = getOverdueTasks()

  // Filter tasks based on user role and filters
  const filteredTasks = (isAdmin ? tasks : myTasks).filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesDepartment = departmentFilter === "all" || task.department === departmentFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment
  })

  // Add this useEffect to sync tasks when the component mounts
  useEffect(() => {
    // Sync tasks when component mounts to ensure latest data
    syncTasks()
  }, [])

  // Update the handleAddTask function to show better feedback
  const handleAddTask = (formData: FormData) => {
    const assignedTo = formData.get("assignedTo") as string
    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      assignedTo,
      assignedBy: user?.name || "Admin",
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
    }

    addTask(taskData)
    setIsAddTaskOpen(false)
    toast({
      title: "✅ Task Successfully Assigned!",
      description: `Task "${taskData.title}" has been assigned to ${assignedTo}. They will see it immediately in their task dashboard.`,
    })
  }

  // Update the handleStatusUpdate function for better feedback
  const handleStatusUpdate = (taskId: number, newStatus: Task["status"]) => {
    const task = tasks.find((t) => t.id === taskId)
    const updates: Partial<Task> = { status: newStatus }
    if (newStatus === "Completed") {
      updates.completedDate = new Date().toISOString().split("T")[0]
    }

    updateTask(taskId, updates)

    // Add status change comment
    addComment(taskId, {
      taskId,
      author: user?.name || "User",
      content: `Status changed to ${newStatus}`,
      type: "status_change",
    })

    toast({
      title: "🔄 Task Status Updated",
      description: `"${task?.title}" status changed to ${newStatus}. ${task?.assignedBy !== user?.name ? "Your manager will be notified." : "The assignee will see this update immediately."}`,
    })
  }

  const handleAddComment = (taskId: number) => {
    if (!newComment.trim()) return

    addComment(taskId, {
      taskId,
      author: user?.name || "User",
      content: newComment,
      type: "comment",
    })

    setNewComment("")
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the task",
    })
  }

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
                <div className="text-2xl font-bold">{isAdmin ? taskStats.total : myTasks.length}</div>
                <p className="text-xs text-muted-foreground">{isAdmin ? "Organization-wide" : "Assigned to you"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAdmin ? taskStats.inProgress : myTasks.filter((t) => t.status === "In Progress").length}
                </div>
                <p className="text-xs text-muted-foreground">Active tasks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckSquare className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAdmin ? taskStats.completed : myTasks.filter((t) => t.status === "Completed").length}
                </div>
                <p className="text-xs text-muted-foreground">Finished tasks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAdmin ? overdueTasks.length : overdueTasks.filter((t) => t.assignedTo === user?.name).length}
                </div>
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
                {filteredTasks.map((task) => (
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

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>
                                Assigned to: <strong>{task.assignedTo}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                Due: <strong>{task.dueDate}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                Est: <strong>{task.estimatedHours}h</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>
                                Category: <strong>{task.category}</strong>
                              </span>
                            </div>
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

                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {task.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTask(task)
                              setIsTaskDetailOpen(true)
                            }}
                          >
                            <FileText className="mr-1 h-3 w-3" />
                            View Details
                          </Button>

                          {(task.assignedTo === user?.name || isAdmin) && (
                            <Select
                              value={task.status}
                              onValueChange={(value) => handleStatusUpdate(task.id, value as Task["status"])}
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
                ))}
              </div>

              {filteredTasks.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No tasks found matching your criteria.</p>
                  </CardContent>
                </Card>
              )}
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
                              {employees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.name}>
                                  {employee.name} - {employee.department}
                                </SelectItem>
                              ))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tasks by Priority</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(taskStats.byPriority).map(([priority, count]) => (
                        <div key={priority} className="flex justify-between items-center">
                          <Badge className={getPriorityColor(priority as Task["priority"])}>{priority}</Badge>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tasks by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(taskStats.byStatus).map(([status, count]) => (
                        <div key={status} className="flex justify-between items-center">
                          <Badge className={getStatusColor(status as Task["status"])}>{status}</Badge>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
