"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Loader2, Calendar } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { attendanceApi, WeeklyAttendance } from "@/lib/api/attendance"
import { analyticsApi } from "@/lib/api/analytics"
import { useToast } from "@/hooks/use-toast"

export default function AttendancePage() {
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
      const data = await attendanceApi.getWeeklyAttendance(weekStartDate)
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
      const stats = await analyticsApi.getManagerDashboardStats()
      setWeeklyTrends(stats.weeklyTrends || [])
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
    const statusMap: Record<string, { label: string; className: string }> = {
      PRESENT: { label: "Present", className: "bg-green-100 text-green-800" },
      ABSENT: { label: "Absent", className: "bg-red-100 text-red-800" },
      ON_LEAVE: { label: "On Leave", className: "bg-yellow-100 text-yellow-800" },
      OFF: { label: "Off", className: "bg-gray-100 text-gray-800" },
    }
    const statusInfo = statusMap[status || "OFF"] || statusMap.OFF
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  const attendanceChartData = weeklyTrends.map((trend) => ({
    day: trend.day.substring(0, 3),
    present: trend.present,
    absent: trend.absent,
    onLeave: trend.onLeave,
  }))

  return (
    <AdminLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Attendance Management</h2>
          <p className="text-muted-foreground">
            View employee attendance details (Read-only)
          </p>
        </div>

        <Tabs defaultValue="table" className="space-y-4">
          <TabsList>
            <TabsTrigger value="table">Attendance Table</TabsTrigger>
            <TabsTrigger value="overview">Weekly Overview</TabsTrigger>
            <TabsTrigger value="trends">Attendance Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Employee Attendance Details</CardTitle>
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
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Mon</TableHead>
                          <TableHead>Tue</TableHead>
                          <TableHead>Wed</TableHead>
                          <TableHead>Thu</TableHead>
                          <TableHead>Fri</TableHead>
                          <TableHead>Sat</TableHead>
                          <TableHead>Sun</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceRecords.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                              No attendance records found for this week
                            </TableCell>
                          </TableRow>
                        ) : (
                          attendanceRecords.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">
                                {record.user?.id || "N/A"}
                              </TableCell>
                              <TableCell>{record.user?.name || "N/A"}</TableCell>
                              <TableCell>{record.user?.department || "N/A"}</TableCell>
                              <TableCell>{getStatusBadge(record.monday)}</TableCell>
                              <TableCell>{getStatusBadge(record.tuesday)}</TableCell>
                              <TableCell>{getStatusBadge(record.wednesday)}</TableCell>
                              <TableCell>{getStatusBadge(record.thursday)}</TableCell>
                              <TableCell>{getStatusBadge(record.friday)}</TableCell>
                              <TableCell>{getStatusBadge(record.saturday)}</TableCell>
                              <TableCell>{getStatusBadge(record.sunday)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {attendanceChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={attendanceChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#10b981" />
                      <Bar dataKey="absent" fill="#ef4444" />
                      <Bar dataKey="onLeave" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {attendanceChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={attendanceChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="present"
                        fill="#10b981"
                        stroke="#10b981"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

