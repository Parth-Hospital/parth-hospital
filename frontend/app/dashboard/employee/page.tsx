"use client"

import { useState, useEffect } from "react"
import { EmployeeLayout } from "@/components/layouts/employee-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, TrendingUp, BarChart3, DollarSign, FileText, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { analyticsApi } from "@/lib/api/analytics"
import { leaveApi } from "@/lib/api/leave"
import { useToast } from "@/hooks/use-toast"

export default function EmployeeOverview() {
  const [stats, setStats] = useState<any>(null)
  const [leaves, setLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
    loadLeaves()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      // Backend gets userId from JWT token
      const data = await analyticsApi.getEmployeeDashboardStats()
      setStats(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard stats",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadLeaves = async () => {
    try {
      const data = await leaveApi.getMyLeaveRequests()
      setLeaves(data.slice(0, 3)) // Show only recent 3
    } catch (error: any) {
      console.error("Failed to load leaves:", error)
    }
  }

  const employeeData = stats?.employee
  const attendanceSummary = stats?.attendanceSummary
  const leaveSummary = stats?.leaveSummary
  const weeklyAttendanceData = stats?.weeklyAttendance || []
  const attendanceStatus = attendanceSummary
    ? [
        { name: "Present", value: attendanceSummary.presentDays, color: "#10b981" },
        { name: "Absent", value: attendanceSummary.absentDays, color: "#ef4444" },
      ]
    : []

  return (
    <EmployeeLayout>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Employee Details Card */}
          {employeeData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Employee Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold text-lg">{employeeData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold text-lg">{employeeData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-semibold text-lg">{employeeData.department || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-semibold text-lg">{employeeData.position || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

      {/* Summary Cards */}
      <section>
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock size={16} /> Present Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {attendanceSummary?.presentDays || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
              <Link href="/dashboard/employee/attendance">
                <Button variant="link" className="p-0 h-auto mt-2 text-xs">
                  View Details →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar size={16} /> Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">
                {leaveSummary?.pending || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
              <Link href="/dashboard/employee/leave">
                <Button variant="link" className="p-0 h-auto mt-2 text-xs">
                  View Details →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText size={16} /> Approved Leaves
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">
                {leaveSummary?.approved || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
              <Link href="/dashboard/employee/leave">
                <Button variant="link" className="p-0 h-auto mt-2 text-xs">
                  View Details →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 size={16} /> Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">
                {attendanceSummary?.attendanceRate || 0}%
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={14} className="text-green-600" />
                <span className="text-xs text-green-600">
                  {attendanceSummary?.attendanceRate && attendanceSummary.attendanceRate >= 90
                    ? "Excellent"
                    : attendanceSummary?.attendanceRate && attendanceSummary.attendanceRate >= 75
                    ? "Good"
                    : "Needs Improvement"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts Section */}
      <section>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyAttendanceData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyAttendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <Link href="/dashboard/employee/attendance">
                    <Button variant="outline" className="w-full mt-4">
                      View Full Attendance Report
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  No attendance data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Status</CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attendanceStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  No attendance data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/dashboard/employee/leave">
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-semibold">Apply for Leave</p>
                        <p className="text-sm text-muted-foreground">
                          {leaveSummary?.pending > 0 && `${leaveSummary.pending} pending request`}
                          {(!leaveSummary?.pending || leaveSummary.pending === 0) && "Submit new leave request"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/employee/attendance">
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-8 h-8 text-secondary" />
                      <div>
                        <p className="font-semibold">View Attendance</p>
                        <p className="text-sm text-muted-foreground">Check weekly attendance report</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/employee/salary">
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-accent" />
                      <div>
                        <p className="font-semibold">Salary Details</p>
                        <p className="text-sm text-muted-foreground">View salary breakdown and history</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Leave Requests */}
      <section>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Recent Leave Requests
            </CardTitle>
            <Link href="/dashboard/employee/leave">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaves.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leave requests yet
                </div>
              ) : (
                leaves.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Leave Request</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.startDate).toLocaleDateString("en-IN")} to{" "}
                        {new Date(request.endDate).toLocaleDateString("en-IN")} ({request.days} days)
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : request.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>
        </>
      )}
    </EmployeeLayout>
  )
}
