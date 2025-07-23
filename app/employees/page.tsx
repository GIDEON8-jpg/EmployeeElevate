"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useEmployees } from "@/hooks/use-employees"

interface Employee {
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

export default function EmployeesPage() {
  const { isAdmin } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)

  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees()

  const departments = ["Engineering", "Marketing", "Human Resources", "Finance", "Operations", "Sales"]

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const handleAddEmployee = (formData: FormData) => {
    const newEmployeeData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      department: formData.get("department") as string,
      position: formData.get("position") as string,
      status: "Active" as const,
      joinDate: formData.get("joinDate") as string,
      salary: Number.parseInt(formData.get("salary") as string),
      leaveBalance: 25,
      address: formData.get("address") as string,
    }
    addEmployee(newEmployeeData)
    setIsAddDialogOpen(false)
    toast({
      title: "Employee Added",
      description: `${newEmployeeData.name} has been successfully added to the system.`,
    })
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsEditDialogOpen(true)
  }

  const handleUpdateEmployee = (formData: FormData) => {
    if (!editingEmployee) return

    const updatedData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      department: formData.get("department") as string,
      position: formData.get("position") as string,
      salary: Number.parseInt(formData.get("salary") as string),
      address: formData.get("address") as string,
      status: formData.get("status") as "Active" | "Inactive",
    }

    updateEmployee(editingEmployee.id, updatedData)
    setIsEditDialogOpen(false)
    setEditingEmployee(null)
    toast({
      title: "Employee Updated",
      description: `${updatedData.name}'s information has been successfully updated.`,
    })
  }

  const handleDeleteEmployee = (employee: Employee) => {
    setDeletingEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteEmployee = () => {
    if (!deletingEmployee) return

    deleteEmployee(deletingEmployee.id)
    setIsDeleteDialogOpen(false)
    toast({
      title: "Employee Deleted",
      description: `${deletingEmployee.name} has been removed from the system.`,
      variant: "destructive",
    })
    setDeletingEmployee(null)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600 mt-2">Manage your team members and their information</p>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
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
                {isAdmin && (
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                        <DialogDescription>Enter the details for the new employee</DialogDescription>
                      </DialogHeader>
                      <form action={handleAddEmployee} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" placeholder="e.g. Tendai Mukamuri" required />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="e.g. tendai.mukamuri@company.co.zw"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" name="phone" placeholder="e.g. +263 77 123 4567" required />
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
                        <div>
                          <Label htmlFor="position">Position</Label>
                          <Input id="position" name="position" required />
                        </div>
                        <div>
                          <Label htmlFor="joinDate">Join Date</Label>
                          <Input id="joinDate" name="joinDate" type="date" required />
                        </div>
                        <div>
                          <Label htmlFor="salary">Salary (USD)</Label>
                          <Input id="salary" name="salary" type="number" required />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            placeholder="e.g. 24 4th Road, Warren Park 1, Harare, Zimbabwe"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Add Employee
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <CardDescription>{employee.position}</CardDescription>
                    </div>
                    <Badge variant={employee.status === "Active" ? "default" : "secondary"}>{employee.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-2 h-4 w-4" />
                      {employee.email}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-4 w-4" />
                      {employee.phone}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Department:</span> {employee.department}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Leave Balance:</span> {employee.leaveBalance} days
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Join Date:</span> {employee.joinDate}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Salary:</span> ${employee.salary.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Address:</span> {employee.address}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditEmployee(employee)}>
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteEmployee(employee)}>
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No employees found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>Update employee information</DialogDescription>
            </DialogHeader>
            {editingEmployee && (
              <form action={handleUpdateEmployee} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" name="name" defaultValue={editingEmployee.name} required />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={editingEmployee.email} required />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" name="phone" defaultValue={editingEmployee.phone} required />
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select name="department" defaultValue={editingEmployee.department}>
                    <SelectTrigger>
                      <SelectValue />
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
                <div>
                  <Label htmlFor="edit-position">Position</Label>
                  <Input id="edit-position" name="position" defaultValue={editingEmployee.position} required />
                </div>
                <div>
                  <Label htmlFor="edit-salary">Salary (USD)</Label>
                  <Input id="edit-salary" name="salary" type="number" defaultValue={editingEmployee.salary} required />
                </div>
                <div>
                  <Label htmlFor="edit-address">Address</Label>
                  <Input id="edit-address" name="address" defaultValue={editingEmployee.address} required />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={editingEmployee.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Update Employee
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete {deletingEmployee?.name}'s record from the
                system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingEmployee(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteEmployee} className="bg-red-600 hover:bg-red-700">
                Delete Employee
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ChatbotWidget />
      </div>
    </AuthGuard>
  )
}
