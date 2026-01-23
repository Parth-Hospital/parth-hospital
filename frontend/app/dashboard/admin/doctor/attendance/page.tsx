"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { attendanceApi, DailyAttendance } from "@/lib/api/attendance"
import { useToast } from "@/hooks/use-toast"

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
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Format date as YYYY-MM-DD in local timezone
const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function AttendancePage() {
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
      const data = await attendanceApi.getAttendanceByDateRange({
        startDate,
        endDate,
      })
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
    const statusMap: Record<string, { label: string; className: string }> = {
      PRESENT: { label: "P", className: "bg-green-100 text-green-800" },
      ABSENT: { label: "A", className: "bg-red-100 text-red-800" },
      ON_LEAVE: { label: "L", className: "bg-yellow-100 text-yellow-800" },
      OFF: { label: "O", className: "bg-gray-100 text-gray-800" },
    }
    const statusInfo = statusMap[status || "OFF"] || statusMap.OFF
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  // Generate date range and group attendance by user
  const dateRange = startDate && endDate ? generateDateRange(new Date(startDate), new Date(endDate)) : []
  
  // Group attendance by userId and date
  const groupedAttendance = attendanceRecords.reduce((acc, record) => {
    const userId = record.userId
    const date = record.date // Already in YYYY-MM-DD format from backend
    
    if (!acc[userId]) {
      acc[userId] = {
        user: record.user,
        attendance: {} as Record<string, string>,
      }
    }
    
    acc[userId].attendance[date] = record.status
    return acc
  }, {} as Record<string, { user?: DailyAttendance["user"]; attendance: Record<string, string> }>)

  const groupedArray = Object.entries(groupedAttendance).map(([userId, data]) => ({
    userId,
    ...data,
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

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>Employee Attendance Details</CardTitle>
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
                      <TableHead className="sticky left-0 bg-background z-10">Employee ID</TableHead>
                      <TableHead className="sticky left-[120px] bg-background z-10">Name</TableHead>
                      <TableHead className="sticky left-[240px] bg-background z-10">Department</TableHead>
                      {dateRange.map((date) => (
                        <TableHead key={formatDateLocal(date)} className="min-w-[100px]">
                          {formatDateDisplay(date)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedArray.length === 0 ? (
                      <TableRow>
                        <TableCell 
                          colSpan={3 + dateRange.length} 
                          className="text-center py-8 text-muted-foreground"
                        >
                          No attendance records found for this date range
                        </TableCell>
                      </TableRow>
                    ) : (
                      groupedArray.map((group) => (
                        <TableRow key={group.userId}>
                          <TableCell className="font-medium sticky left-0 bg-background z-10">
                            {group.user?.employee?.employeeId || group.userId.substring(0, 8)}
                          </TableCell>
                          <TableCell className="sticky left-[120px] bg-background z-10">
                            {group.user?.name || "N/A"}
                          </TableCell>
                          <TableCell className="sticky left-[240px] bg-background z-10">
                            {group.user?.department || "N/A"}
                          </TableCell>
                          {dateRange.map((date) => {
                            const dateStr = formatDateLocal(date)
                            const status = group.attendance[dateStr]
                            return (
                              <TableCell key={dateStr}>
                                {getStatusBadge(status)}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

