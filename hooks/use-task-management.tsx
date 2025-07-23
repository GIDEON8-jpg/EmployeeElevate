"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Task {
  id: number
  title: string
  description: string
  assignedTo: string
  assignedBy: string
  department: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Not Started" | "In Progress" | "Review" | "Completed" | "On Hold"
  dueDate: string
  assignedDate: string
  completedDate?: string
  estimatedHours: number
  actualHours?: number
  category: "Development" | "Marketing" | "HR" | "Finance" | "Operations" | "Sales" | "General"
  attachments?: string[]
  comments: TaskComment[]
  tags: string[]
}

export interface TaskComment {
  id: number
  taskId: number
  author: string
  content: string
  timestamp: string
  type: "comment" | "status_change" | "assignment"
}

interface TaskManagementContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "assignedDate" | "comments">) => void
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  addComment: (taskId: number, comment: Omit<TaskComment, "id" | "timestamp">) => void
  getTasksByEmployee: (employeeName: string) => Task[]
  getTasksByAssignee: (employeeName: string) => Task[] // Fixed: Added this method
  getTasksByAssigner: (assignerName: string) => Task[]
  getTasksByDepartment: (department: string) => Task[]
  getTasksByStatus: (status: Task["status"]) => Task[]
  getOverdueTasks: () => Task[]
  getTaskStats: () => {
    total: number
    completed: number
    inProgress: number
    overdue: number
    byPriority: Record<Task["priority"], number>
    byStatus: Record<Task["status"], number>
  }
  syncTasks: () => void
}

const TaskManagementContext = createContext<TaskManagementContextType | undefined>(undefined)

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Develop Employee Portal Dashboard",
    description:
      "Create a comprehensive dashboard for employees to view their personal information, leave balances, and recent activities. Include responsive design and dark mode support.",
    assignedTo: "Leeroy Sibanda",
    assignedBy: "Gideon Zimano",
    department: "Engineering",
    priority: "High",
    status: "In Progress",
    dueDate: "2025-02-15",
    assignedDate: "2025-01-10",
    estimatedHours: 40,
    actualHours: 25,
    category: "Development",
    tags: ["frontend", "dashboard", "react"],
    comments: [
      {
        id: 1,
        taskId: 1,
        author: "Leeroy Sibanda",
        content:
          "Started working on the wireframes and component structure. Should have initial version ready by end of week.",
        timestamp: "2025-01-12T10:30:00Z",
        type: "comment",
      },
    ],
  },
  {
    id: 2,
    title: "Q1 Marketing Campaign Strategy",
    description:
      "Develop comprehensive marketing strategy for Q1 2025 including social media campaigns, content calendar, and budget allocation. Focus on brand awareness and lead generation.",
    assignedTo: "Lucia Mukamba",
    assignedBy: "Gideon Zimano",
    department: "Marketing",
    priority: "High",
    status: "Review",
    dueDate: "2025-02-25",
    assignedDate: "2025-01-08",
    estimatedHours: 30,
    actualHours: 28,
    category: "Marketing",
    tags: ["strategy", "campaign", "social-media"],
    comments: [
      {
        id: 2,
        taskId: 2,
        author: "Lucia Mukamba",
        content: "Campaign strategy document is ready for review. Includes detailed timeline and budget breakdown.",
        timestamp: "2025-01-20T14:15:00Z",
        type: "status_change",
      },
    ],
  },
  {
    id: 3,
    title: "Financial Audit Preparation",
    description:
      "Prepare all necessary documentation and reports for the annual financial audit. Coordinate with external auditors and ensure compliance with all regulations.",
    assignedTo: "Onias Zimano",
    assignedBy: "Glenda Zimano",
    department: "Finance",
    priority: "Critical",
    status: "In Progress",
    dueDate: "2025-01-30",
    assignedDate: "2025-01-05",
    estimatedHours: 50,
    actualHours: 35,
    category: "Finance",
    tags: ["audit", "compliance", "documentation"],
    comments: [
      {
        id: 3,
        taskId: 3,
        author: "Onias Zimano",
        content: "70% of documentation completed. Working on final reconciliations.",
        timestamp: "2025-01-18T09:45:00Z",
        type: "comment",
      },
    ],
  },
  {
    id: 4,
    title: "Sales Process Optimization",
    description:
      "Analyze current sales processes and implement improvements to increase conversion rates. Create new sales templates and training materials.",
    assignedTo: "Tadiwa Mundanga",
    assignedBy: "Gideon Zimano",
    department: "Sales",
    priority: "Medium",
    status: "Completed",
    dueDate: "2025-01-20",
    assignedDate: "2025-01-02",
    completedDate: "2025-01-18",
    estimatedHours: 25,
    actualHours: 22,
    category: "Sales",
    tags: ["optimization", "process", "training"],
    comments: [
      {
        id: 4,
        taskId: 4,
        author: "Tadiwa Mundanga",
        content: "Task completed successfully. New process increased conversion rate by 15%.",
        timestamp: "2025-01-18T16:30:00Z",
        type: "status_change",
      },
    ],
  },
  {
    id: 5,
    title: "API Security Enhancement",
    description:
      "Implement additional security measures for all API endpoints including rate limiting, input validation, and authentication improvements.",
    assignedTo: "Allen Njani",
    assignedBy: "Leeroy Sibanda",
    department: "Engineering",
    priority: "High",
    status: "Not Started",
    dueDate: "2025-02-10",
    assignedDate: "2025-01-15",
    estimatedHours: 35,
    category: "Development",
    tags: ["security", "api", "backend"],
    comments: [],
  },
  {
    id: 6,
    title: "Supply Chain Vendor Evaluation",
    description:
      "Evaluate current suppliers and identify potential new vendors to improve cost efficiency and reliability. Prepare vendor comparison report.",
    assignedTo: "Glenda Zimano",
    assignedBy: "Gideon Zimano",
    department: "Operations",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2025-02-05",
    assignedDate: "2025-01-12",
    estimatedHours: 20,
    actualHours: 12,
    category: "Operations",
    tags: ["vendors", "evaluation", "cost-optimization"],
    comments: [
      {
        id: 5,
        taskId: 6,
        author: "Glenda Zimano",
        content: "Completed evaluation of 5 vendors. Working on final comparison report.",
        timestamp: "2025-01-19T11:20:00Z",
        type: "comment",
      },
    ],
  },
]

export function TaskManagementProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    } else {
      setTasks(initialTasks)
      localStorage.setItem("tasks", JSON.stringify(initialTasks))
    }

    // Set up storage event listener for real-time sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tasks" && e.newValue) {
        setTasks(JSON.parse(e.newValue))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
    localStorage.setItem("tasks", JSON.stringify(newTasks))

    // Trigger a custom event for same-tab updates
    window.dispatchEvent(new CustomEvent("tasksUpdated", { detail: newTasks }))
  }

  // Add listener for same-tab updates
  useEffect(() => {
    const handleTasksUpdated = (e: CustomEvent) => {
      setTasks(e.detail)
    }

    window.addEventListener("tasksUpdated", handleTasksUpdated as EventListener)
    return () => window.removeEventListener("tasksUpdated", handleTasksUpdated as EventListener)
  }, [])

  const addTask = (taskData: Omit<Task, "id" | "assignedDate" | "comments">) => {
    const newTask: Task = {
      ...taskData,
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
      assignedDate: new Date().toISOString().split("T")[0],
      comments: [
        {
          id: 1,
          taskId: Math.max(...tasks.map((t) => t.id), 0) + 1,
          author: taskData.assignedBy,
          content: `Task assigned to ${taskData.assignedTo}`,
          timestamp: new Date().toISOString(),
          type: "assignment",
        },
      ],
    }
    const updatedTasks = [...tasks, newTask]
    saveTasks(updatedTasks)
  }

  const syncTasks = () => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }

  const updateTask = (id: number, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    saveTasks(updatedTasks)
  }

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    saveTasks(updatedTasks)
  }

  const addComment = (taskId: number, comment: Omit<TaskComment, "id" | "timestamp">) => {
    const newComment: TaskComment = {
      ...comment,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, comments: [...task.comments, newComment] } : task,
    )
    saveTasks(updatedTasks)
  }

  const getTasksByEmployee = (employeeName: string) => {
    return tasks.filter((task) => task.assignedTo === employeeName)
  }

  // Fixed: Added the missing method
  const getTasksByAssignee = (employeeName: string) => {
    return tasks.filter((task) => task.assignedTo === employeeName)
  }

  const getTasksByAssigner = (assignerName: string) => {
    return tasks.filter((task) => task.assignedBy === assignerName)
  }

  const getTasksByDepartment = (department: string) => {
    return tasks.filter((task) => task.department === department)
  }

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  const getOverdueTasks = () => {
    const today = new Date()
    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate)
      return dueDate < today && task.status !== "Completed"
    })
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === "Completed").length
    const inProgress = tasks.filter((t) => t.status === "In Progress").length
    const overdue = getOverdueTasks().length

    const byPriority = tasks.reduce(
      (acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1
        return acc
      },
      {} as Record<Task["priority"], number>,
    )

    const byStatus = tasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      },
      {} as Record<Task["status"], number>,
    )

    return {
      total,
      completed,
      inProgress,
      overdue,
      byPriority,
      byStatus,
    }
  }

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    getTasksByEmployee,
    getTasksByAssignee, // Fixed: Added this to the context value
    getTasksByAssigner,
    getTasksByDepartment,
    getTasksByStatus,
    getOverdueTasks,
    getTaskStats,
    syncTasks,
  }

  return <TaskManagementContext.Provider value={value}>{children}</TaskManagementContext.Provider>
}

export function useTaskManagement() {
  const context = useContext(TaskManagementContext)
  if (context === undefined) {
    throw new Error("useTaskManagement must be used within a TaskManagementProvider")
  }
  return context
}
