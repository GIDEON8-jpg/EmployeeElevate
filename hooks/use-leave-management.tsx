"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

export interface LeaveApplication {
  id: number
  employeeName: string
  department: string
  leaveType: "Annual" | "Sick" | "Personal" | "Maternity" | "Paternity" | "Emergency"
  startDate: string
  endDate: string
  reason: string
  status: "Pending" | "Approved" | "Rejected"
  appliedDate: string
  approvedBy?: string
  approvedDate?: string
  rejectedBy?: string
  rejectedDate?: string
  rejectionReason?: string
  daysRequested: number
}

interface LeaveManagementContextType {
  leaveApplications: LeaveApplication[]
  addLeaveApplication: (application: Omit<LeaveApplication, "id" | "appliedDate" | "status">) => void
  updateLeaveStatus: (
    id: number,
    status: "Approved" | "Rejected",
    approverName: string,
    rejectionReason?: string,
  ) => void
  deleteLeaveApplication: (id: number) => void
  getPendingLeaves: () => LeaveApplication[]
  getApprovedLeaves: () => LeaveApplication[]
  getRejectedLeaves: () => LeaveApplication[]
  getLeavesByEmployee: (employeeName: string) => LeaveApplication[]
  getUpcomingLeaves: (employeeName?: string) => LeaveApplication[]
  getDaysUntilNextLeave: (employeeName: string) => number | null
}

const LeaveManagementContext = createContext<LeaveManagementContextType | undefined>(undefined)

const initialLeaveApplications: LeaveApplication[] = [
  {
    id: 1,
    employeeName: "Leeroy Sibanda",
    department: "Engineering",
    leaveType: "Annual",
    startDate: "2025-02-15",
    endDate: "2025-02-19",
    reason: "Family vacation to Victoria Falls",
    status: "Approved",
    appliedDate: "2025-01-10",
    approvedBy: "Gideon Zimano",
    approvedDate: "2025-01-12",
    daysRequested: 5,
  },
  {
    id: 2,
    employeeName: "Lucia Mukamba",
    department: "Marketing",
    leaveType: "Personal",
    startDate: "2025-02-10",
    endDate: "2025-02-12",
    reason: "Personal matters",
    status: "Pending",
    appliedDate: "2025-01-20",
    daysRequested: 3,
  },
  {
    id: 3,
    employeeName: "Allen Njani",
    department: "Engineering",
    leaveType: "Annual",
    startDate: "2025-03-01",
    endDate: "2025-03-07",
    reason: "Annual leave - rest and relaxation",
    status: "Approved",
    appliedDate: "2025-01-15",
    approvedBy: "Gideon Zimano",
    approvedDate: "2025-01-18",
    daysRequested: 7,
  },
  {
    id: 4,
    employeeName: "Onias Zimano",
    department: "Finance",
    leaveType: "Sick",
    startDate: "2025-01-25",
    endDate: "2025-01-26",
    reason: "Medical appointment and recovery",
    status: "Approved",
    appliedDate: "2025-01-22",
    approvedBy: "Glenda Zimano",
    approvedDate: "2025-01-22",
    daysRequested: 2,
  },
  {
    id: 5,
    employeeName: "Tadiwa Mundanga",
    department: "Sales",
    leaveType: "Personal",
    startDate: "2025-02-28",
    endDate: "2025-03-02",
    reason: "Wedding preparations",
    status: "Pending",
    appliedDate: "2025-01-21",
    daysRequested: 3,
  },
]

export function LeaveManagementProvider({ children }: { children: ReactNode }) {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([])

  useEffect(() => {
    const storedLeaves = localStorage.getItem("leaveApplications")
    if (storedLeaves) {
      setLeaveApplications(JSON.parse(storedLeaves))
    } else {
      setLeaveApplications(initialLeaveApplications)
      localStorage.setItem("leaveApplications", JSON.stringify(initialLeaveApplications))
    }

    // Set up storage event listener for real-time sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "leaveApplications" && e.newValue) {
        setLeaveApplications(JSON.parse(e.newValue))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const saveLeaves = (newLeaves: LeaveApplication[]) => {
    setLeaveApplications(newLeaves)
    localStorage.setItem("leaveApplications", JSON.stringify(newLeaves))

    // Trigger a custom event for same-tab updates
    window.dispatchEvent(new CustomEvent("leavesUpdated", { detail: newLeaves }))
  }

  // Add listener for same-tab updates
  useEffect(() => {
    const handleLeavesUpdated = (e: CustomEvent) => {
      setLeaveApplications(e.detail)
    }

    window.addEventListener("leavesUpdated", handleLeavesUpdated as EventListener)
    return () => window.removeEventListener("leavesUpdated", handleLeavesUpdated as EventListener)
  }, [])

  const addLeaveApplication = (applicationData: Omit<LeaveApplication, "id" | "appliedDate" | "status">) => {
    const newApplication: LeaveApplication = {
      ...applicationData,
      id: Math.max(...leaveApplications.map((l) => l.id), 0) + 1,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Pending",
    }
    const updatedLeaves = [...leaveApplications, newApplication]
    saveLeaves(updatedLeaves)
    toast.success("Leave application submitted successfully!")
  }

  const updateLeaveStatus = (
    id: number,
    status: "Approved" | "Rejected",
    approverName: string,
    rejectionReason?: string,
  ) => {
    const updatedLeaves = leaveApplications.map((leave) => {
      if (leave.id === id) {
        const updatedLeave = { ...leave, status }
        if (status === "Approved") {
          updatedLeave.approvedBy = approverName
          updatedLeave.approvedDate = new Date().toISOString().split("T")[0]
        } else if (status === "Rejected") {
          updatedLeave.rejectedBy = approverName
          updatedLeave.rejectedDate = new Date().toISOString().split("T")[0]
          updatedLeave.rejectionReason = rejectionReason
        }
        return updatedLeave
      }
      return leave
    })
    saveLeaves(updatedLeaves)

    const leave = leaveApplications.find((l) => l.id === id)
    if (leave) {
      toast.success(
        `Leave application for ${leave.employeeName} has been ${status.toLowerCase()}! ✅ Synced across system.`,
      )
    }
  }

  const deleteLeaveApplication = (id: number) => {
    const updatedLeaves = leaveApplications.filter((leave) => leave.id !== id)
    saveLeaves(updatedLeaves)
    toast.success("Leave application deleted successfully!")
  }

  const getPendingLeaves = () => {
    return leaveApplications.filter((leave) => leave.status === "Pending")
  }

  const getApprovedLeaves = () => {
    return leaveApplications.filter((leave) => leave.status === "Approved")
  }

  const getRejectedLeaves = () => {
    return leaveApplications.filter((leave) => leave.status === "Rejected")
  }

  const getLeavesByEmployee = (employeeName: string) => {
    return leaveApplications.filter((leave) => leave.employeeName === employeeName)
  }

  const getUpcomingLeaves = (employeeName?: string) => {
    const today = new Date()
    let upcomingLeaves = leaveApplications.filter((leave) => {
      const startDate = new Date(leave.startDate)
      return startDate >= today && leave.status === "Approved"
    })

    if (employeeName) {
      upcomingLeaves = upcomingLeaves.filter((leave) => leave.employeeName === employeeName)
    }

    return upcomingLeaves.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }

  const getDaysUntilNextLeave = (employeeName: string) => {
    const upcomingLeaves = getUpcomingLeaves(employeeName)
    if (upcomingLeaves.length === 0) return null

    const nextLeave = upcomingLeaves[0]
    const today = new Date()
    const startDate = new Date(nextLeave.startDate)
    const diffTime = startDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const value = {
    leaveApplications,
    addLeaveApplication,
    updateLeaveStatus,
    deleteLeaveApplication,
    getPendingLeaves,
    getApprovedLeaves,
    getRejectedLeaves,
    getLeavesByEmployee,
    getUpcomingLeaves,
    getDaysUntilNextLeave,
  }

  return <LeaveManagementContext.Provider value={value}>{children}</LeaveManagementContext.Provider>
}

export function useLeaveManagement() {
  const context = useContext(LeaveManagementContext)
  if (context === undefined) {
    throw new Error("useLeaveManagement must be used within a LeaveManagementProvider")
  }
  return context
}
