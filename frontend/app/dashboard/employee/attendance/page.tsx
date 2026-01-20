"use client"

import { useState, useEffect } from "react"
import { EmployeeLayout } from "@/components/layouts/employee-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { attendanceApi, WeeklyAttendance } from "@/lib/api/attendance"
import { analyticsApi } from "@/lib/api/analytics"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

export default function EmployeeAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<WeeklyAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState<string>("")
  const [weeklyTrends, setWeeklyTrends] = useState<any[]>([])
  const { toast } = useToast()

  const getWeekStart = (date: Date = new Date()): Date => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  useEffect(() => {
    const weekStart = getWeekStart()
    const weekStartStr = weekStart.toISOString()
    setSelectedWeek(weekStartStr)
    loadAttendance(weekStartStr)
    loadAnalytics()
  }, [])

  const loadAttendance = async (weekStartDate: string) => {
    try {
      setLoading(true)
      // Get current user ID from localStorage
      const userStr = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id

      if (!userId) {
        throw new Error("User not authenticated")
      }

      // Use employee-specific attendance endpoint
      const data = await attendanceApi.getEmployeeAttendance(userId, weekStartDate)
      setAttendanceRecords(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load attendance",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      const stats = await analyticsApi.getEmployeeDashboardStats()
      setWeeklyTrends(stats.weeklyAttendance || [])
    } catch (error: any) {
      // Only log in development
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to load analytics:", error)
      }
    }
  }

  const handleWeekChange = (weekStartDate: string) => {
    setSelectedWeek(weekStartDate)
    loadAttendance(weekStartDate)
  }

  const getStatusBadge = (status: string | null) => {
    if (status === "PRESENT") {
      return <Badge className="bg-green-600">Present</Badge>
    } else if (status === "ABSENT") {
      return <Badge variant="destructive">Absent</Badge>
    } else if (status === "ON_LEAVE") {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">On Leave</Badge>
    } else {
      return <Badge variant="outline">Off</Badge>
    }
  }

  // Get current week's attendance for the employee
  const currentWeekAttendance = attendanceRecords.length > 0 ? attendanceRecords[0] : null
  const presentCount = currentWeekAttendance
    ? [
        currentWeekAttendance.monday,
        currentWeekAttendance.tuesday,
        currentWeekAttendance.wednesday,
        currentWeekAttendance.thursday,
        currentWeekAttendance.friday,
        currentWeekAttendance.saturday,
        currentWeekAttendance.sunday,
      ].filter((s) => s === "PRESENT").length
    : 0
  const absentCount = currentWeekAttendance
    ? [
        currentWeekAttendance.monday,
        currentWeekAttendance.tuesday,
        currentWeekAttendance.wednesday,
        currentWeekAttendance.thursday,
        currentWeekAttendance.friday,
        currentWeekAttendance.saturday,
        currentWeekAttendance.sunday,
      ].filter((s) => s === "ABSENT").length
    : 0

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Weekly Attendance Report</h2>
          <p className="text-muted-foreground">View your attendance for the current week</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 size={16} /> Present Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{presentCount}</p>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle size={16} /> Absent Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">{absentCount}</p>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock size={16} /> Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">
                {Math.round((presentCount / (presentCount + absentCount)) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Attendance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>This Week's Attendance</CardTitle>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedWeek ? new Date(selectedWeek).toISOString().split("T")[0] : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      const date = new Date(e.target.value)
                      const weekStart = getWeekStart(date)
                      handleWeekChange(weekStart.toISOString())
                    }
                  }}
                  className="w-40"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Day</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentWeekAttendance ? (
                      [
                        { day: "Monday", status: currentWeekAttendance.monday },
                        { day: "Tuesday", status: currentWeekAttendance.tuesday },
                        { day: "Wednesday", status: currentWeekAttendance.wednesday },
                        { day: "Thursday", status: currentWeekAttendance.thursday },
                        { day: "Friday", status: currentWeekAttendance.friday },
                        { day: "Saturday", status: currentWeekAttendance.saturday },
                        { day: "Sunday", status: currentWeekAttendance.sunday },
                      ].map((dayData, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/30">
                          <td className="p-4 font-medium">{dayData.day}</td>
                          <td className="p-4">{getStatusBadge(dayData.status)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-muted-foreground">
                          No attendance data available for this week
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#10b981" name="Present" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  )
}

