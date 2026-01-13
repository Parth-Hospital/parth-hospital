"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, Upload, Loader2, Calendar } from "lucide-react"
import { attendanceApi, WeeklyAttendance, CreateWeeklyAttendanceData } from "@/lib/api/attendance"
import { analyticsApi } from "@/lib/api/analytics"
import { employeeApi, Employee } from "@/lib/api/employee"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

export default function AttendancePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<WeeklyAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState<string>("")
  const [weeklyTrends, setWeeklyTrends] = useState<any[]>([])
  const { toast } = useToast()

  // Get current week start (Monday)
  const getWeekStart = (date: Date = new Date()): Date => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
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
      console.error("Failed to load analytics:", error)
    }
  }

  const handleWeekChange = (weekStartDate: string) => {
    setSelectedWeek(weekStartDate)
    loadAttendance(weekStartDate)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Map status text to API status enum
  const mapStatusToEnum = (status: string): "PRESENT" | "ABSENT" | "ON_LEAVE" | "OFF" => {
    const normalized = status.trim().toLowerCase()
    if (normalized === "present" || normalized === "p") return "PRESENT"
    if (normalized === "absent" || normalized === "a") return "ABSENT"
    if (normalized === "on leave" || normalized === "on_leave" || normalized === "leave" || normalized === "l") return "ON_LEAVE"
    if (normalized === "off" || normalized === "o") return "OFF"
    // Default to ABSENT if unknown
    return "ABSENT"
  }

  // Normalize column names (handle variations)
  const normalizeColumnName = (name: string): string => {
    const normalized = name.trim().toLowerCase()
    if (normalized.includes("employee") && normalized.includes("id")) return "employeeId"
    if (normalized === "name" || normalized.includes("employee name")) return "name"
    if (normalized === "monday" || normalized === "mon") return "monday"
    if (normalized === "tuesday" || normalized === "tue") return "tuesday"
    if (normalized === "wednesday" || normalized === "wed") return "wednesday"
    if (normalized === "thursday" || normalized === "thu") return "thursday"
    if (normalized === "friday" || normalized === "fri") return "friday"
    if (normalized === "saturday" || normalized === "sat") return "saturday"
    if (normalized === "sunday" || normalized === "sun") return "sunday"
    return normalized
  }

  const parseFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          if (!data) {
            reject(new Error("Failed to read file"))
            return
          }

          let workbook: XLSX.WorkBook
          
          if (file.name.endsWith(".csv")) {
            // Parse CSV
            const text = typeof data === "string" ? data : new TextDecoder().decode(data as ArrayBuffer)
            workbook = XLSX.read(text, { type: "string" })
          } else {
            // Parse Excel
            workbook = XLSX.read(data, { type: "array" })
          }

          // Get first sheet
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false })
          
          if (jsonData.length === 0) {
            reject(new Error("File is empty or has no data rows"))
            return
          }

          resolve(jsonData)
        } catch (error: any) {
          reject(new Error(`Failed to parse file: ${error.message}`))
        }
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file)
      } else {
        reader.readAsArrayBuffer(file)
      }
    })
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedWeek) {
      toast({
        title: "Error",
        description: "Please select a file and ensure a week is selected",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)

      // Step 1: Parse the file
      const parsedData = await parseFile(selectedFile)

      // Step 2: Fetch employees to map employeeId to userId
      const employees = await employeeApi.getEmployees()
      const employeeMap = new Map<string, string>()
      employees.forEach((emp) => {
        employeeMap.set(emp.employeeId.toUpperCase(), emp.id)
      })

      // Step 3: Transform parsed data to attendance records
      const attendanceRecords: CreateWeeklyAttendanceData[] = []
      const errors: string[] = []

      for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i] as any
        const normalizedRow: Record<string, string> = {}
        
        // Normalize column names
        Object.keys(row).forEach((key) => {
          const normalizedKey = normalizeColumnName(key)
          normalizedRow[normalizedKey] = String(row[key] || "").trim()
        })

        // Get employee ID
        const employeeId = normalizedRow.employeeId || normalizedRow["employee id"] || ""
        if (!employeeId) {
          errors.push(`Row ${i + 2}: Missing Employee ID`)
          continue
        }

        // Find user ID
        const userId = employeeMap.get(employeeId.toUpperCase())
        if (!userId) {
          errors.push(`Row ${i + 2}: Employee ID "${employeeId}" not found in system`)
          continue
        }

        // Map status values
        const monday = mapStatusToEnum(normalizedRow.monday || "")
        const tuesday = mapStatusToEnum(normalizedRow.tuesday || "")
        const wednesday = mapStatusToEnum(normalizedRow.wednesday || "")
        const thursday = mapStatusToEnum(normalizedRow.thursday || "")
        const friday = mapStatusToEnum(normalizedRow.friday || "")
        const saturday = mapStatusToEnum(normalizedRow.saturday || "")
        const sunday = mapStatusToEnum(normalizedRow.sunday || "")

        attendanceRecords.push({
          userId,
          weekStartDate: selectedWeek,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
        })
      }

      if (errors.length > 0) {
        toast({
          title: "Warning",
          description: `Found ${errors.length} error(s). Some records may not be uploaded. Check console for details.`,
          variant: "default",
        })
        console.error("Upload errors:", errors)
      }

      if (attendanceRecords.length === 0) {
        toast({
          title: "Error",
          description: "No valid attendance records found in file",
          variant: "destructive",
        })
        return
      }

      // Step 4: Upload to backend
      const result = await attendanceApi.bulkCreateOrUpdateAttendance(attendanceRecords)

      toast({
        title: "Success",
        description: `Successfully uploaded ${result.success} attendance record(s)${result.failed > 0 ? `. ${result.failed} failed.` : ""}`,
      })

      // Step 5: Reload attendance data
      setSelectedFile(null)
      await loadAttendance(selectedWeek)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload attendance file",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
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
    <AdminLayout role="manager">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Attendance Management</h2>
          <p className="text-muted-foreground">
            Upload weekly attendance and view employee attendance details
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Weekly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileUp size={32} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">
                Upload Weekly Attendance Excel/CSV File
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Select a file to upload weekly attendance records
              </p>
              <div className="flex items-center justify-center gap-4">
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="max-w-xs"
                />
                {selectedFile && (
                  <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                )}
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-4">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">
                Excel/CSV Format Requirements:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Columns: Employee ID, Name, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday</li>
                <li>Status values: Present, Absent, On Leave, Off</li>
                <li>First row should contain column headers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

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

