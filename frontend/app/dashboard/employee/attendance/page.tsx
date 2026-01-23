"use client"

import { useState, useEffect } from "react"
import { EmployeeLayout } from "@/components/layouts/employee-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { attendanceApi, DailyAttendance } from "@/lib/api/attendance"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

// Helper function to generate date range
const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = []
  const current = new Date(startDate)
  current.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  while (current <= end) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

// Format date as DD-MM-YYYY for display
const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function EmployeeAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<DailyAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const { toast } = useToast()

  // Initialize with current date range (today to 7 days ahead)
  useEffect(() => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    setStartDate(today.toISOString().split("T")[0])
    setEndDate(nextWeek.toISOString().split("T")[0])
  }, [])

  // Load attendance when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      loadAttendance()
    }
  }, [startDate, endDate])

  const loadAttendance = async () => {
    if (!startDate || !endDate) return

    try {
      setLoading(true)
      // Get current user ID from localStorage
      const userStr = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id

      if (!userId) {
        throw new Error("User not authenticated")
      }

      // Use employee-specific attendance endpoint with date range
      const data = await attendanceApi.getEmployeeAttendance(userId, startDate, endDate)
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


  const getStatusBadge = (status: string | null | undefined) => {
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

  // Calculate summary statistics
  const dateRange = startDate && endDate ? generateDateRange(new Date(startDate), new Date(endDate)) : []
  const attendanceMap = new Map<string, DailyAttendance>()
  attendanceRecords.forEach((record) => {
    attendanceMap.set(record.date, record)
  })

  const presentCount = attendanceRecords.filter((r) => r.status === "PRESENT").length
  const absentCount = attendanceRecords.filter((r) => r.status === "ABSENT").length
  const totalDays = dateRange.length
  const attendanceRate = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Attendance Report</h2>
          <p className="text-muted-foreground">View your attendance for the selected date range</p>
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
              <p className="text-xs text-muted-foreground mt-1">Selected range</p>
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
              <p className="text-xs text-muted-foreground mt-1">Selected range</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock size={16} /> Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{attendanceRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Selected range</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendance Details</CardTitle>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
                      <th className="p-4 text-left font-semibold">Date</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateRange.length > 0 ? (
                      dateRange.map((date) => {
                        const dateStr = date.toISOString().split("T")[0]
                        const record = attendanceMap.get(dateStr)
                        return (
                          <tr key={dateStr} className="border-b border-border hover:bg-muted/30">
                            <td className="p-4 font-medium">{formatDateDisplay(date)}</td>
                            <td className="p-4">{getStatusBadge(record?.status)}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-muted-foreground">
                          No attendance data available for this date range
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </EmployeeLayout>
  )
}
