"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Employee {
  id: number
  name: string
  email: string
  phone: string
  department: string
  position: string
  status: "Active" | "Inactive"
  joinDate: string
  salary: number
  leaveBalance: number
  address: string
}

interface EmployeesContextType {
  employees: Employee[]
  addEmployee: (employee: Omit<Employee, "id">) => void
  updateEmployee: (id: number, employee: Partial<Employee>) => void
  deleteEmployee: (id: number) => void
  getEmployeeById: (id: number) => Employee | undefined
  getEmployeeByName: (name: string) => Employee | undefined
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined)

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Gideon Zimano",
    email: "gideon.zimano@company.co.zw",
    phone: "+263 77 234 5678",
    department: "Human Resources",
    position: "HR Manager",
    status: "Active",
    joinDate: "2022-03-15",
    salary: 85000,
    leaveBalance: 18,
    address: "12 Borrowdale Road, Borrowdale, Harare, Zimbabwe",
  },
  {
    id: 2,
    name: "Leeroy Sibanda",
    email: "leeroy.sibanda@company.co.zw",
    phone: "+263 71 345 6789",
    department: "Engineering",
    position: "Senior Developer",
    status: "Active",
    joinDate: "2021-08-20",
    salary: 75000,
    leaveBalance: 22,
    address: "8 Avondale Drive, Avondale, Harare, Zimbabwe",
  },
  {
    id: 3,
    name: "Lucia Mukamba",
    email: "lucia.mukamba@company.co.zw",
    phone: "+263 78 456 7890",
    department: "Marketing",
    position: "Marketing Specialist",
    status: "Active",
    joinDate: "2023-01-10",
    salary: 65000,
    leaveBalance: 25,
    address: "15 Greendale Avenue, Greendale, Harare, Zimbabwe",
  },
  {
    id: 4,
    name: "Onias Zimano",
    email: "onias.zimano@company.co.zw",
    phone: "+263 77 567 8901",
    department: "Finance",
    position: "Financial Analyst",
    status: "Active",
    joinDate: "2022-11-05",
    salary: 70000,
    leaveBalance: 20,
    address: "24 4th Road, Warren Park 1, Harare, Zimbabwe",
  },
  {
    id: 5,
    name: "Glenda Zimano",
    email: "glenda.zimano@company.co.zw",
    phone: "+263 71 678 9012",
    department: "Operations",
    position: "Operations Manager",
    status: "Active",
    joinDate: "2020-06-12",
    salary: 80000,
    leaveBalance: 15,
    address: "7 Highlands Road, Highlands, Harare, Zimbabwe",
  },
  {
    id: 6,
    name: "Allen Njani",
    email: "allen.njani@company.co.zw",
    phone: "+263 78 789 0123",
    department: "Engineering",
    position: "Software Engineer",
    status: "Active",
    joinDate: "2023-04-18",
    salary: 68000,
    leaveBalance: 24,
    address: "3 Marlborough Drive, Marlborough, Harare, Zimbabwe",
  },
  {
    id: 7,
    name: "Tadiwa Mundanga",
    email: "tadiwa.mundanga@company.co.zw",
    phone: "+263 77 890 1234",
    department: "Sales",
    position: "Sales Representative",
    status: "Active",
    joinDate: "2022-09-03",
    salary: 62000,
    leaveBalance: 19,
    address: "11 Mount Pleasant Heights, Mount Pleasant, Harare, Zimbabwe",
  },
]

export function EmployeesProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    // Load employees from localStorage or use initial data
    const storedEmployees = localStorage.getItem("employees")
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees))
    } else {
      setEmployees(initialEmployees)
      localStorage.setItem("employees", JSON.stringify(initialEmployees))
    }
  }, [])

  const saveEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees)
    localStorage.setItem("employees", JSON.stringify(newEmployees))
  }

  const addEmployee = (employeeData: Omit<Employee, "id">) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Math.max(...employees.map((e) => e.id), 0) + 1,
    }
    const updatedEmployees = [...employees, newEmployee]
    saveEmployees(updatedEmployees)
  }

  const updateEmployee = (id: number, employeeData: Partial<Employee>) => {
    const updatedEmployees = employees.map((emp) => (emp.id === id ? { ...emp, ...employeeData } : emp))
    saveEmployees(updatedEmployees)
  }

  const deleteEmployee = (id: number) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id)
    saveEmployees(updatedEmployees)
  }

  const getEmployeeById = (id: number) => {
    return employees.find((emp) => emp.id === id)
  }

  const getEmployeeByName = (name: string) => {
    return employees.find((emp) => emp.name === name)
  }

  const value = {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeeByName,
  }

  return <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>
}

export function useEmployees() {
  const context = useContext(EmployeesContext)
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeesProvider")
  }
  return context
}
