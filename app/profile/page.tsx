"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Edit, Save, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { LeaveReminders } from "@/components/leave-reminders"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+263 77 234 5678",
    department: user?.department || "",
    position: "Senior Developer",
    bio: "Passionate software developer with 5+ years of experience in web development and system architecture.",
    emergencyContact: "Tendai Mukamuri - +263 78 345 6789",
    address: "24 4th Road, Warren Park 1, Harare, Zimbabwe",
  })

  const handleSave = () => {
    // In a real app, this would update the user profile
    setIsEditing(false)
    // Show success message
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "+263 77 234 5678",
      department: user?.department || "",
      position: "Senior Developer",
      bio: "Passionate software developer with 5+ years of experience in web development and system architecture.",
      emergencyContact: "Tendai Mukamuri - +263 78 345 6789",
      address: "24 4th Road, Warren Park 1, Harare, Zimbabwe",
    })
    setIsEditing(false)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>Your basic profile details</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm">
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium">{formData.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium">{formData.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium">{formData.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <p className="mt-1 text-sm font-medium">{formData.department}</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="position">Position</Label>
                    <p className="mt-1 text-sm font-medium">{formData.position}</p>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{formData.bio}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{formData.address}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    {isEditing ? (
                      <Input
                        id="emergency"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{formData.emergencyContact}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Leave Balance</span>
                    <Badge variant="default">18 days</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Performance Rating</span>
                    <Badge variant="secondary">4.2/5</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Years with Company</span>
                    <Badge variant="outline">2.5 years</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Projects Completed</span>
                    <Badge variant="outline">24</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Leave approved</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Profile updated</p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Performance review completed</p>
                        <p className="text-xs text-muted-foreground">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Leave Reminders */}
          <div className="mt-8">
            <LeaveReminders />
          </div>
        </div>

        <ChatbotWidget />
      </div>
    </AuthGuard>
  )
}
