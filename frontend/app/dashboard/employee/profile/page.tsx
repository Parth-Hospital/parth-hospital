"use client"

import { useState, useEffect } from "react"
import { EmployeeLayout } from "@/components/layouts/employee-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, MapPin, Building, Briefcase, Edit2, Save, X, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  department: string | null
  position: string | null
  status: string
  employeeId: string | null
  createdAt: string
  updatedAt: string
}

export default function EmployeeProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    phone: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<UserProfile>("/auth/me")
      if (response.success && response.data) {
        setProfile(response.data)
        setFormData({
          phone: response.data.phone || "",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Note: Profile updates may need to go through admin or a separate endpoint
    // For now, we'll just show a message
    toast({
      title: "Info",
      description: "Profile updates need to be done through the administrator. Please contact HR.",
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        phone: profile.phone || "",
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </EmployeeLayout>
    )
  }

  if (!profile) {
    return (
      <EmployeeLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load profile</p>
        </div>
      </EmployeeLayout>
    )
  }

  const joinDate = new Date(profile.createdAt)
  const daysOfService = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Employee Profile</h2>
            <p className="text-muted-foreground">View and update your personal information</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 " />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 " />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 " />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <p className="font-semibold text-lg">{profile.name}</p>
                <p className="text-xs text-muted-foreground">Cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <p className="font-semibold text-lg">{profile.employeeId || "N/A"}</p>
                <p className="text-xs text-muted-foreground">Cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <p className="font-semibold">{profile.email}</p>
                <p className="text-xs text-muted-foreground">Cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                ) : (
                  <p className="font-semibold">{profile.phone || "Not provided"}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Department
                </Label>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{profile.department || "Not assigned"}</p>
                  {profile.position && <Badge variant="outline">{profile.position}</Badge>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Join Date
                </Label>
                <p className="font-semibold">
                  {joinDate.toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {daysOfService} days of service
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note about additional fields */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              For updates to address, date of birth, emergency contact, or other personal information, 
              please contact the HR department or your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  )
}

