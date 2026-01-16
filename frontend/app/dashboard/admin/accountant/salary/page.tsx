"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUp, Upload, Search, Calendar } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Sample salary data
const sampleSalaryData = [
  {
    employeeId: "EMP001",
    name: "Rajesh Kumar",
    department: "Orthopedics",
    position: "Doctor",
    basicSalary: 80000,
    allowances: 20000,
    deductions: 5000,
    netSalary: 95000,
    status: "Paid",
    paymentDate: "2024-01-05",
  },
  {
    employeeId: "EMP002",
    name: "Priya Sharma",
    department: "Nursing",
    position: "Senior Nurse",
    basicSalary: 45000,
    allowances: 10000,
    deductions: 3000,
    netSalary: 52000,
    status: "Paid",
    paymentDate: "2024-01-05",
  },
  {
    employeeId: "EMP003",
    name: "Amit Singh",
    department: "Admin",
    position: "Administrator",
    basicSalary: 35000,
    allowances: 8000,
    deductions: 2000,
    netSalary: 41000,
    status: "Paid",
    paymentDate: "2024-01-05",
  },
  {
    employeeId: "EMP004",
    name: "Sneha Patel",
    department: "Pharmacy",
    position: "Pharmacist",
    basicSalary: 30000,
    allowances: 7000,
    deductions: 2000,
    netSalary: 35000,
    status: "Pending",
    paymentDate: "-",
  },
  {
    employeeId: "EMP005",
    name: "Vikram Mehta",
    department: "Reception",
    position: "Receptionist",
    basicSalary: 25000,
    allowances: 5000,
    deductions: 1500,
    netSalary: 28500,
    status: "Paid",
    paymentDate: "2024-01-05",
  },
]

export default function SalaryPage() {
  const [salaryData, setSalaryData] = useState(sampleSalaryData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Get current month info
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  const lastMonthName = lastMonth.toLocaleString("default", { month: "long", year: "numeric" })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // TODO: Implement CSV/Excel parsing and API call
      console.log("File selected:", file.name)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      // TODO: Implement upload logic
      console.log("Uploading salary file for:", lastMonthName)
      setSelectedFile(null)
      // After successful upload, refresh salary data
    }
  }

  const filteredSalaryData = salaryData.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPayroll = salaryData.reduce((sum, emp) => sum + emp.netSalary, 0)
  const paidCount = salaryData.filter((emp) => emp.status === "Paid").length
  const pendingCount = salaryData.filter((emp) => emp.status === "Pending").length

  return (
    <AdminLayout role="accountant">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Salary Management</h2>
            <p className="text-muted-foreground">
              Manage employee salaries and upload monthly salary data
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upload Salary for {lastMonthName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Upload Deadline: 2nd or 3rd of each month
                </p>
                <p className="text-xs text-blue-700">
                  Upload salary data for the previous month. Current month: {currentMonth}
                </p>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileUp size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium mb-1">
                  Upload Salary Excel/CSV File for {lastMonthName}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Select a file to upload salary records
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="max-w-xs"
                  />
                  {selectedFile && (
                    <Button onClick={handleUpload}>
                      <Upload className=" h-4 w-4" />
                      Upload
                    </Button>
                  )}
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-semibold mb-2">Excel/CSV Format Requirements:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>
                    Columns: Employee ID, Name, Basic Salary, Allowances, Deductions, Net Salary
                  </li>
                  <li>First row should contain column headers</li>
                  <li>Amounts should be in numeric format (no currency symbols)</li>
                  <li>Upload should be done on 2nd or 3rd of each month for previous month's salary</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Payroll
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                ₹{totalPayroll.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {salaryData.length} employees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{paidCount}</p>
              <p className="text-xs text-muted-foreground mt-2">employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{pendingCount}</p>
              <p className="text-xs text-muted-foreground mt-2">employees</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, employee ID, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Salary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Salary Details ({filteredSalaryData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalaryData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No salary records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSalaryData.map((employee) => (
                      <TableRow key={employee.employeeId}>
                        <TableCell className="font-medium">{employee.employeeId}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>₹{employee.basicSalary.toLocaleString("en-IN")}</TableCell>
                        <TableCell>₹{employee.allowances.toLocaleString("en-IN")}</TableCell>
                        <TableCell>₹{employee.deductions.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{employee.netSalary.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              employee.status === "Paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {employee.paymentDate}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

