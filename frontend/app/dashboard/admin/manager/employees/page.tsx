"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, FileUp, UserPlus, Upload, Key, X, Loader2, Edit, Trash2, Lock } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { employeeApi, Employee } from "@/lib/api/employee"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addMethod, setAddMethod] = useState<"manual" | "upload">("manual")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const data = await employeeApi.getEmployees()
      setEmployees(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load employees",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Manual form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
  })
  // State for credential generation
  const [generatingCredsFor, setGeneratingCredsFor] = useState<string | null>(null)
  const [tempCredentials, setTempCredentials] = useState<{
    employeeId: string
    adminEmail: string
    password: string
  } | null>(null)
  
  // State for editing password
  const [editingPasswordFor, setEditingPasswordFor] = useState<string | null>(null)
  const [editPassword, setEditPassword] = useState("")
  
  // State for editing employee
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  })
  
  // State for delete confirmation
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)

  // Helper function to generate email from name
  const generateEmailFromName = (name: string): string => {
    if (!name) return ""
    // Convert name to lowercase, replace spaces with dots, remove special characters
    const emailName = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ".")
      .replace(/[^a-z0-9.]/g, "")
    return `${emailName}@parthhospital.co.in`
  }

  // Handle generating credentials for an employee
  const handleGenerateCreds = (employeeId: string, employeeName: string) => {
    // Auto-generate email immediately
    const adminEmail = generateEmailFromName(employeeName)
    
    // Store temporary credentials without modifying employees array
    setTempCredentials({
      employeeId,
      adminEmail,
      password: "",
    })
    
    setGeneratingCredsFor(employeeId)
  }

  // Handle password change
  const handlePasswordChange = (value: string) => {
    if (tempCredentials) {
      setTempCredentials({
        ...tempCredentials,
        password: value,
      })
    }
  }

  // Handle credential generation submission
  const handleCredsSubmit = async () => {
    if (!tempCredentials || !tempCredentials.password) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const result = await employeeApi.generateAdminCredentials(
        tempCredentials.employeeId,
        tempCredentials.password
      )
      
      toast({
        title: "Success",
        description: `Credentials generated! Admin Email: ${result.adminEmail}`,
      })

      // Update the employee in local state immediately
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === tempCredentials.employeeId
            ? {
                ...emp,
                hasAdminCredentials: true,
                adminEmail: result.adminEmail,
              }
            : emp
        )
      )

      // Reload employees to get updated data
      await loadEmployees()

      // Clear temporary state
      setGeneratingCredsFor(null)
      setTempCredentials(null)
    } catch (error: any) {
      // Handle specific error cases
      const errorMessage = error.message || "Failed to generate credentials"
      
      if (errorMessage.includes("already generated")) {
        toast({
          title: "Credentials Already Exist",
          description: "This employee already has admin credentials. Refreshing the list...",
          variant: "default",
        })
        // Reload employees to refresh the UI state
        await loadEmployees()
        // Clear temporary state
        setGeneratingCredsFor(null)
        setTempCredentials(null)
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
      
      // Clear temporary state on error
      setGeneratingCredsFor(null)
      setTempCredentials(null)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle cancel credential generation
  const handleCancelCreds = () => {
    setGeneratingCredsFor(null)
    setTempCredentials(null)
  }

  // Handle edit password
  const handleEditPassword = (employee: Employee) => {
    setEditingPasswordFor(employee.id)
    setEditPassword("")
  }

  const handleUpdatePassword = async () => {
    if (!editingPasswordFor || !editPassword || editPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await employeeApi.updateAdminPassword(editingPasswordFor, editPassword)
      toast({
        title: "Success",
        description: "Password updated successfully",
      })
      setEditingPasswordFor(null)
      setEditPassword("")
      await loadEmployees()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle edit employee
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setEditFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      department: employee.department || "",
      position: employee.position || "",
      status: employee.status,
    })
  }

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEmployee) return

    try {
      setSubmitting(true)
      await employeeApi.updateEmployee(editingEmployee.id, editFormData)
      toast({
        title: "Success",
        description: "Employee updated successfully",
      })
      setEditingEmployee(null)
      await loadEmployees()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update employee",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete employee
  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return

    try {
      setSubmitting(true)
      await employeeApi.deleteEmployee(deletingEmployee.id)
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      })
      setDeletingEmployee(null)
      await loadEmployees()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await employeeApi.createEmployee({
        ...formData,
        role: "EMPLOYEE", // Set default role for manually added employees
      })
      toast({
        title: "Success",
        description: "Employee added successfully",
      })
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
      })
      setIsModalOpen(false)
      await loadEmployees()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add employee",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Parse Excel/CSV file
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

  // Normalize column names (case-insensitive, handle variations)
  const normalizeColumnName = (name: string): string => {
    const normalized = name.trim().toLowerCase()
    if (normalized.includes("name")) return "name"
    if (normalized.includes("email")) return "email"
    if (normalized.includes("phone")) return "phone"
    if (normalized.includes("department")) return "department"
    if (normalized.includes("position")) return "position"
    return normalized
  }

  // Validate email (must be a valid email address - personal email from Excel)
  const validateEmail = (email: string): string | null => {
    if (!email || !email.trim()) {
      return null // Email is required
    }
    
    const emailStr = email.trim()
    // Basic email validation - must contain @
    if (!emailStr.includes("@")) {
      return null // Invalid email format
    }
    
    return emailStr
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSubmitting(true)

      // Parse the file
      const parsedData = await parseFile(file)

      if (parsedData.length === 0) {
        toast({
          title: "Error",
          description: "No data found in the file",
          variant: "destructive",
        })
        return
      }

      // Normalize column names from first row
      const firstRow = parsedData[0]
      const columnMap: Record<string, string> = {}
      Object.keys(firstRow).forEach((key) => {
        const normalized = normalizeColumnName(key)
        columnMap[normalized] = key
      })

      // Validate required columns
      const requiredColumns = ["name", "email"]
      const missingColumns = requiredColumns.filter((col) => !columnMap[col])
      if (missingColumns.length > 0) {
        toast({
          title: "Error",
          description: `Missing required columns: ${missingColumns.join(", ")}. Please ensure your file has "Name" and "Email" columns.`,
          variant: "destructive",
        })
        return
      }

      // Process each row
      const errors: string[] = []
      let successCount = 0
      let skipCount = 0

      for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i]
        const rowNum = i + 2 // +2 because row 1 is header, and arrays are 0-indexed

        try {
          // Extract data with normalized column names
          const name = String(row[columnMap.name] || "").trim()
          if (!name) {
            errors.push(`Row ${rowNum}: Name is required`)
            skipCount++
            continue
          }

          // Email from Excel is the employee's personal email (Gmail, etc.)
          const emailRaw = String(row[columnMap.email] || "").trim()
          const email = validateEmail(emailRaw)
          
          if (!email) {
            errors.push(`Row ${rowNum}: Valid email is required (personal email like Gmail)`)
            skipCount++
            continue
          }
          
          // Clean and validate phone number (remove non-digits, must be at least 10 digits)
          const phoneRaw = String(row[columnMap.phone] || "").trim()
          const phoneDigits = phoneRaw.replace(/\D/g, "") // Remove non-digit characters
          const phone = phoneDigits.length >= 10 ? phoneDigits : undefined
          
          // Validate phone if provided
          if (phoneRaw && phoneDigits.length < 10) {
            errors.push(`Row ${rowNum}: Phone number must be at least 10 digits`)
            skipCount++
            continue
          }
          
          const department = String(row[columnMap.department] || "").trim() || undefined
          const position = String(row[columnMap.position] || "").trim() || undefined

          // Create employee with EMPLOYEE role
          // Note: email here is personal email, admin credentials email is separate and auto-generated
          await employeeApi.createEmployee({
            name,
            email, // Personal email from Excel (Gmail, etc.)
            phone,
            department,
            position,
            role: "EMPLOYEE", // Required field
          })

          successCount++
        } catch (error: any) {
          let errorMsg = error.message || "Unknown error"
          
          // Include validation error details if available
          if (error.details && Array.isArray(error.details)) {
            const validationErrors = error.details
              .map((err: any) => {
                const field = err.path?.join(".") || "unknown"
                return `${field}: ${err.message || err.msg || "Invalid"}`
              })
              .join("; ")
            errorMsg = `${errorMsg} (${validationErrors})`
          } else if (error.details && typeof error.details === "object") {
            // Handle object format validation errors
            const validationErrors = Object.entries(error.details)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join("; ")
            errorMsg = `${errorMsg} (${validationErrors})`
          }
          
          if (errorMsg.includes("already exists") || errorMsg.includes("duplicate")) {
            errors.push(`Row ${rowNum}: ${errorMsg}`)
            skipCount++
          } else {
            errors.push(`Row ${rowNum}: ${errorMsg}`)
          }
        }
      }

      // Show results
      if (successCount > 0) {
        toast({
          title: "Success",
          description: `Successfully imported ${successCount} employee(s)${skipCount > 0 ? `. ${skipCount} skipped.` : ""}`,
        })
      }

      if (errors.length > 0) {
        toast({
          title: "Import completed with errors",
          description: errors.slice(0, 5).join("; ") + (errors.length > 5 ? ` and ${errors.length - 5} more...` : ""),
          variant: "destructive",
        })
      }

      // Reload employees
      await loadEmployees()

      // Close modal and reset file input
      setIsModalOpen(false)
      e.target.value = ""
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process file",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Helper function to check if user is admin (not regular employee)
  const isAdminUser = (employee: Employee) => {
    return employee.role && ["OWNER", "MANAGER", "ACCOUNTANT", "RECEPTIONIST"].includes(employee.role)
  }

  // Helper function to check if user is owner
  const isOwner = (employee: Employee) => {
    return employee.role === "OWNER"
  }

  const filteredEmployees = employees
    .filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Owner always first
      if (isOwner(a) && !isOwner(b)) return -1
      if (!isOwner(a) && isOwner(b)) return 1
      // Then sort by name
      return a.name.localeCompare(b.name)
    })

  return (
    <AdminLayout role="manager">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Employee Management</h2>
            <p className="text-muted-foreground">
              Manage all hospital employees and their details
            </p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className=" h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Choose how you want to add the employee
                </DialogDescription>
              </DialogHeader>
              <Tabs
                value={addMethod}
                onValueChange={(value) => setAddMethod(value as "manual" | "upload")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">
                    <UserPlus className=" h-4 w-4" />
                    Manual Entry
                  </TabsTrigger>
                  <TabsTrigger value="upload">
                    <Upload className=" h-4 w-4" />
                    CSV/Excel Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4 mt-4">
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Full Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Department *
                      </label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          setFormData({ ...formData, department: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="Nursing">Nursing</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="Reception">Reception</SelectItem>
                          <SelectItem value="Accountant">Accountant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Position *
                      </label>
                      <Input
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                        placeholder="Enter position/designation"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4  animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Employee"
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4 mt-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    {submitting ? (
                      <>
                        <Loader2 size={32} className="mx-auto text-primary mb-3 animate-spin" />
                        <p className="text-sm font-medium mb-1">Processing file...</p>
                        <p className="text-xs text-muted-foreground">
                          Please wait while we import employees
                        </p>
                      </>
                    ) : (
                      <>
                        <FileUp size={32} className="mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm font-medium mb-1">
                          Upload Employee Excel/CSV File
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Select a file to bulk import employees
                        </p>
                        <Input
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleFileUpload}
                          className="max-w-xs mx-auto"
                          disabled={submitting}
                        />
                      </>
                    )}
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-2">
                      Excel/CSV Format Requirements:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Columns: Name, Email (personal email like Gmail), Phone, Department, Position</li>
                      <li>Email column should contain employee's personal email address (e.g., name@gmail.com)</li>
                      <li>System will auto-generate Employee ID</li>
                      <li>Admin credentials (dummy email: employeename@parthhospital.co.in) are separate and can be generated later</li>
                      <li>First row should contain column headers</li>
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, ID, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Employees ({filteredEmployees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Admin Creds</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.employeeId}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.phone}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              employee.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {/* Show credentials if they exist, allow generation for non-owner admins */}
                          {employee.hasAdminCredentials ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-muted-foreground">
                                {employee.adminEmail || employee.email}
                              </span>
                              {/* Owner cannot edit password in manager dashboard */}
                              {!isOwner(employee) && editingPasswordFor === employee.id ? (
                                <div className="flex items-center gap-2 mt-2">
                                  <Input
                                    type="password"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)}
                                    placeholder="New password"
                                    className="h-7 text-xs w-32"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={handleUpdatePassword}
                                    className="h-7 text-xs"
                                    disabled={!editPassword || editPassword.length < 6 || submitting}
                                  >
                                    {submitting ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      "Save"
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setEditingPasswordFor(null)
                                      setEditPassword("")
                                    }}
                                    className="h-7 w-7 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : !isOwner(employee) ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditPassword(employee)}
                                  className="h-7 text-xs mt-1"
                                >
                                  <Lock className="mr-1 h-3 w-3" />
                                  Edit Password
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground mt-1">
                                  Owner credentials
                                </span>
                              )}
                            </div>
                          ) : !isOwner(employee) && !employee.hasAdminCredentials && generatingCredsFor === employee.id && tempCredentials && !submitting ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleCredsSubmit()
                              }}
                              className="space-y-2 min-w-[300px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                  Email:
                                </span>
                                <span className="text-sm text-primary font-mono">
                                  {tempCredentials.adminEmail}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="password"
                                  value={tempCredentials.password}
                                  onChange={(e) => handlePasswordChange(e.target.value)}
                                  placeholder="Enter password manually"
                                  className="h-8 flex-1 text-xs"
                                  autoFocus
                                  required
                                />
                                <Button
                                  size="sm"
                                  variant="default"
                                  type="submit"
                                  className="h-8 text-xs"
                                  disabled={!tempCredentials.password || submitting}
                                >
                                  {submitting ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleCancelCreds()
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </form>
                          ) : !isOwner(employee) && !employee.hasAdminCredentials ? (
                            <Button
                              size="sm"
                              variant="outline"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleGenerateCreds(employee.id, employee.name)
                              }}
                              className="h-8 text-xs"
                            >
                              <Key className="mr-1 h-3 w-3" />
                              Generate
                            </Button>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {/* Owner cannot be edited or deleted by manager */}
                          {!isOwner(employee) ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditEmployee(employee)}
                                className="h-8"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setDeletingEmployee(employee)}
                                className="h-8"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Owner</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Employee Dialog */}
        <Dialog open={!!editingEmployee} onOpenChange={(open) => !open && setEditingEmployee(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update employee information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateEmployee} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Full Name *
                </label>
                <Input
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email *
                </label>
                <Input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Department
                </label>
                <Select
                  value={editFormData.department}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Nursing">Nursing</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Reception">Reception</SelectItem>
                    <SelectItem value="Accountant">Accountant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Position
                </label>
                <Input
                  value={editFormData.position}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, position: e.target.value })
                  }
                  placeholder="Enter position/designation"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Status *
                </label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                    setEditFormData({ ...editFormData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingEmployee(null)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4  animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Employee"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingEmployee} onOpenChange={(open) => !open && setDeletingEmployee(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Employee</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deletingEmployee?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteEmployee}
                disabled={submitting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4  animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}

