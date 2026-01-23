"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, Upload, Loader2, Calendar } from "lucide-react";
import {
  attendanceApi,
  DailyAttendance,
  CreateDailyAttendanceData,
} from "@/lib/api/attendance";
import { employeeApi } from "@/lib/api/employee";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Helper function to parse date string (YYYY-MM-DD) to local Date
const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  // Create date in local timezone (month is 0-indexed in Date constructor)
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

// Helper function to generate date range
const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Format date as DD-MM-YYYY for Excel column headers
const formatDateAsColumn = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Format date as DD-MM-YYYY for display
const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Parse date string from Excel (handles DD-MM-YYYY, DD/MM/YYYY, etc.)
const parseDateFromColumn = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== "string") return null;

  // Try different date formats
  const formats = [
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
    /^(\d{1,2})-(\d{1,2})-(\d{2})$/, // DD-MM-YY (assumes 20XX)
  ];

  for (const format of formats) {
    const match = dateStr.trim().match(format);
    if (match) {
      let day: number, month: number, year: number;

      if (format === formats[2]) {
        // YYYY-MM-DD format
        year = parseInt(match[1], 10);
        month = parseInt(match[2], 10) - 1;
        day = parseInt(match[3], 10);
      } else if (format === formats[3]) {
        // DD-MM-YY format
        day = parseInt(match[1], 10);
        month = parseInt(match[2], 10) - 1;
        year = 2000 + parseInt(match[3], 10);
      } else {
        // DD-MM-YYYY or DD/MM/YYYY format
        day = parseInt(match[1], 10);
        month = parseInt(match[2], 10) - 1;
        year = parseInt(match[3], 10);
      }

      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return null;
};

export default function ReceptionistAttendancePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<DailyAttendance[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { toast } = useToast();

  // Initialize with current date range (today to 7 days ahead)
  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    setStartDate(today.toISOString().split("T")[0]);
    setEndDate(nextWeek.toISOString().split("T")[0]);
  }, []);

  // Load attendance when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      loadAttendance();
    }
  }, [startDate, endDate]);

  const loadAttendance = async () => {
    if (!startDate || !endDate) return;

    try {
      setLoading(true);
      // Parse dates in local timezone to avoid timezone shifts
      const startDateObj = parseLocalDate(startDate);
      const endDateObj = parseLocalDate(endDate);

      // Validate date range (max 31 days)
      const diffTime = endDateObj.getTime() - startDateObj.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        toast({
          title: "Error",
          description: "Start date must be before or equal to end date",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (diffDays > 30) {
        toast({
          title: "Error",
          description:
            "Date range cannot exceed 31 days. Please select a smaller range.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Format as YYYY-MM-DD for API
      const formatDateForAPI = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      const data = await attendanceApi.getAttendanceByDateRange({
        startDate: formatDateForAPI(startDateObj),
        endDate: formatDateForAPI(endDateObj),
      });
      setAttendanceRecords(data);
    } catch (error: any) {
      // Check if it's a validation error from backend
      if (error.details && Array.isArray(error.details)) {
        const validationError = error.details.find(
          (e: any) =>
            e.message?.includes("Date range") || e.message?.includes("31 days"),
        );
        if (validationError) {
          toast({
            title: "Error",
            description:
              "Date range cannot exceed 31 days. Please select a smaller range.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to load attendance",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to load attendance",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Map status text to API status enum (only P and A for new format)
  const mapStatusToEnum = (status: string): "PRESENT" | "ABSENT" => {
    const normalized = status.trim().toUpperCase();
    if (normalized === "P" || normalized === "PRESENT") return "PRESENT";
    if (normalized === "A" || normalized === "ABSENT") return "ABSENT";
    // Default to ABSENT if unknown
    return "ABSENT";
  };

  const parseFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error("Failed to read file"));
            return;
          }

          let workbook: XLSX.WorkBook;

          if (file.name.endsWith(".csv")) {
            const text =
              typeof data === "string"
                ? data
                : new TextDecoder().decode(data as ArrayBuffer);
            workbook = XLSX.read(text, { type: "string" });
          } else {
            workbook = XLSX.read(data, { type: "array" });
          }

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Parse with raw: false to convert values to strings
          // This ensures numeric headers like "14" are preserved as strings
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false, // Convert all values to strings
            defval: "", // Default value for empty cells
          });

          if (jsonData.length === 0) {
            reject(new Error("File is empty or has no data rows"));
            return;
          }

          resolve(jsonData);
        } catch (error: any) {
          reject(new Error(`Failed to parse file: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select a file and date range",
        variant: "destructive",
      });
      return;
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) {
      toast({
        title: "Error",
        description: "Start date must be before or equal to end date",
        variant: "destructive",
      });
      return;
    }

    if (diffDays > 30) {
      toast({
        title: "Error",
        description: "Date range cannot exceed 31 days",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Step 1: Parse the file
      const parsedData = await parseFile(selectedFile);

      if (parsedData.length === 0) {
        toast({
          title: "Error",
          description: "No data found in file",
          variant: "destructive",
        });
        return;
      }

      // Debug: Log first row to see column structure
      if (process.env.NODE_ENV === "development") {
        console.log("First row columns:", Object.keys(parsedData[0]));
        console.log("First row data:", parsedData[0]);
      }

      // Step 2: Generate expected date columns (full dates: DD-MM-YYYY)
      // Parse dates in local timezone to avoid timezone shifts
      const startDateObj = parseLocalDate(startDate);
      const endDateObj = parseLocalDate(endDate);
      const dateRange = generateDateRange(startDateObj, endDateObj);
      const expectedDateColumns = dateRange.map((date) =>
        formatDateAsColumn(date),
      );

      // Also create alternative formats for matching
      const expectedDateColumnsAlt = dateRange.map((date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return {
          dash: `${day}-${month}-${year}`, // DD-MM-YYYY
          slash: `${day}/${month}/${year}`, // DD/MM/YYYY
          dayOnly: String(date.getDate()), // Just day number (fallback)
        };
      });

      if (process.env.NODE_ENV === "development") {
        console.log("Expected date columns:", expectedDateColumns);
        console.log("Alternative formats:", expectedDateColumnsAlt);
        console.log(
          "Date range:",
          dateRange.map((d) => d.toISOString().split("T")[0]),
        );
      }

      // Step 3: Fetch employees to map employeeId to userId
      const employees = await employeeApi.getEmployees();
      const employeeMap = new Map<string, string>();
      employees.forEach((emp) => {
        employeeMap.set(emp.employeeId.toUpperCase(), emp.id);
      });

      // Step 4: Transform parsed data to attendance records
      const attendanceRecords: CreateDailyAttendanceData[] = [];
      const errors: string[] = [];

      // Debug: Log all available columns from first row
      if (parsedData.length > 0 && process.env.NODE_ENV === "development") {
        console.log("=== EXCEL PARSING DEBUG ===");
        console.log("All columns in first row:", Object.keys(parsedData[0]));
        console.log("First row data:", parsedData[0]);
        console.log("Expected date columns:", expectedDateColumns);
        console.log(
          "Date range:",
          dateRange.map((d) => ({
            date: d.toISOString().split("T")[0],
            display: formatDateDisplay(d),
            formatted: formatDateAsColumn(d),
            day: d.getDate(),
          })),
        );
        console.log("Alternative formats:", expectedDateColumnsAlt);
      }

      for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i] as any;

        // Get employee ID (case-insensitive column matching)
        const employeeIdKey = Object.keys(row).find(
          (key) =>
            key.toLowerCase().includes("employee") &&
            key.toLowerCase().includes("id"),
        );
        const employeeNameKey = Object.keys(row).find(
          (key) =>
            key.toLowerCase().includes("employee") &&
            key.toLowerCase().includes("name"),
        );
        const employeeId = employeeIdKey
          ? String(row[employeeIdKey] || "").trim()
          : "";

        if (!employeeId) {
          errors.push(`Row ${i + 2}: Missing Employee ID`);
          continue;
        }

        // Find user ID
        const userId = employeeMap.get(employeeId.toUpperCase());
        if (!userId) {
          errors.push(
            `Row ${i + 2}: Employee ID "${employeeId}" not found in system`,
          );
          continue;
        }

        // Step 1: Identify all date columns from Excel and create a map
        const dateColumnMap = new Map<string, string>(); // Map: dateLocal -> columnKey

        // Get all columns excluding employee ID and name
        const allColumns = Object.keys(row).filter((key) => {
          return key !== employeeIdKey && key !== employeeNameKey;
        });

        // Parse each column to see if it's a date column
        for (const columnKey of allColumns) {
          const columnHeader = String(columnKey).trim();

          // Try to parse as date
          const parsedDate = parseDateFromColumn(columnHeader);
          if (parsedDate) {
            const dateLocal = formatDateLocal(parsedDate);
            dateColumnMap.set(dateLocal, columnKey);
          }

          // Also try exact string match with expected formats
          for (let k = 0; k < expectedDateColumns.length; k++) {
            const expectedDateStr = expectedDateColumns[k];
            const altFormats = expectedDateColumnsAlt[k];
            const expectedDateLocal = formatDateLocal(dateRange[k]);

            if (
              columnHeader === expectedDateStr ||
              columnHeader === altFormats.dash ||
              columnHeader === altFormats.slash
            ) {
              dateColumnMap.set(expectedDateLocal, columnKey);
              break;
            }
          }
        }

        if (process.env.NODE_ENV === "development" && i === 0) {
          console.log("\n=== PROCESSING ROW", i + 2, "===");
          console.log("Employee ID key:", employeeIdKey);
          console.log("Employee Name key:", employeeNameKey);
          console.log("All columns found:", allColumns);
          console.log(
            "Date column map (dateISO -> columnKey):",
            Array.from(dateColumnMap.entries()),
          );
          console.log(
            "Expected dates:",
            dateRange.map((d) => d.toISOString().split("T")[0]),
          );
        }

        // Step 2: Process each expected date and get value from mapped column
        for (let j = 0; j < dateRange.length; j++) {
          const date = dateRange[j];
          const expectedDateLocal = formatDateLocal(date);
          const expectedDateStr = expectedDateColumns[j];

          // Find the column key for this date
          const dateColumnKey = dateColumnMap.get(expectedDateLocal);

          if (!dateColumnKey) {
            if (i === 0 && process.env.NODE_ENV === "development") {
              console.error(
                `❌ FAILED: No column found for date ${formatDateDisplay(date)} (${expectedDateLocal})`,
              );
              console.error("  Expected column:", expectedDateStr);
              console.error(
                "  Available date columns:",
                Array.from(dateColumnMap.entries()),
              );
            }
            if (i === 0) {
              errors.push(
                `Row ${i + 2}: Date column not found for ${formatDateDisplay(date)} (expected: ${expectedDateStr})`,
              );
            }
            continue;
          }

          // Get the status value from the column
          const statusValue = String(row[dateColumnKey] || "")
            .trim()
            .toUpperCase();

          if (process.env.NODE_ENV === "development" && i === 0) {
            console.log(
              `\n--- Date ${j + 1}/${dateRange.length}: ${formatDateDisplay(date)} (${expectedDateLocal}) ---`,
            );
            console.log(`  Column key: "${dateColumnKey}"`);
            console.log(`  Raw value: "${row[dateColumnKey]}"`);
            console.log(`  Processed value: "${statusValue}"`);
          }

          // Process the status value
          if (statusValue === "P" || statusValue === "A") {
            const status = mapStatusToEnum(statusValue);
            attendanceRecords.push({
              userId,
              date: expectedDateLocal,
              status,
            });

            if (process.env.NODE_ENV === "development" && i === 0) {
              console.log(`  ✅ RECORDED: ${statusValue} -> ${status}`);
            }
          } else {
            if (i === 0 && process.env.NODE_ENV === "development") {
              console.warn(
                `  ⚠️ Invalid status value: "${statusValue}" (expected P or A)`,
              );
            }
            if (i === 0) {
              errors.push(
                `Row ${i + 2}: Invalid status value "${statusValue}" for ${formatDateDisplay(date)} (expected P or A)`,
              );
            }
          }
        }
      }

      if (errors.length > 0) {
        toast({
          title: "Warning",
          description: `Found ${errors.length} error(s). Some records may not be uploaded.`,
          variant: "default",
        });
        if (process.env.NODE_ENV === "development") {
          console.error("Upload errors:", errors);
        }
      }

      if (attendanceRecords.length === 0) {
        toast({
          title: "Error",
          description: `No valid attendance records found in file. Expected date columns: ${expectedDateColumns.join(", ")}. Check if Excel columns match the selected date range.`,
          variant: "destructive",
        });
        if (process.env.NODE_ENV === "development") {
          console.error("No records created. Errors:", errors);
          console.error(
            "Available columns in first row:",
            Object.keys(parsedData[0] || {}),
          );
        }
        return;
      }

      // Step 5: Upload to backend
      const result =
        await attendanceApi.bulkCreateOrUpdateAttendance(attendanceRecords);

      toast({
        title: "Success",
        description: `Successfully uploaded ${result.success} attendance record(s)${result.failed > 0 ? `. ${result.failed} failed.` : ""}`,
      });

      // Step 6: Reload attendance data
      setSelectedFile(null);
      await loadAttendance();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload attendance file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string | null | undefined) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PRESENT: { label: "P", className: "bg-green-100 text-green-800" },
      ABSENT: { label: "A", className: "bg-red-100 text-red-800" },
      ON_LEAVE: { label: "L", className: "bg-yellow-100 text-yellow-800" },
      OFF: { label: "O", className: "bg-gray-100 text-gray-800" },
    };
    const statusInfo = statusMap[status || "OFF"] || statusMap.OFF;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  // Group attendance records by user and date
  const groupedAttendance = attendanceRecords.reduce(
    (acc, record) => {
      const userId = record.userId;
      if (!acc[userId]) {
        acc[userId] = {
          user: record.user,
          records: {} as Record<string, DailyAttendance>,
        };
      }
      acc[userId].records[record.date] = record;
      return acc;
    },
    {} as Record<
      string,
      {
        user?: DailyAttendance["user"];
        records: Record<string, DailyAttendance>;
      }
    >,
  );

  // Parse dates in local timezone to avoid timezone shifts
  const dateRange =
    startDate && endDate
      ? (() => {
          const startDateObj = parseLocalDate(startDate);
          const endDateObj = parseLocalDate(endDate);
          return generateDateRange(startDateObj, endDateObj);
        })()
      : [];

  return (
    <AdminLayout role="receptionist">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Attendance Management</h2>
          <p className="text-muted-foreground">
            Upload attendance by date range and view employee attendance details
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Date Range Picker */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Start Date:</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">End Date:</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                {startDate && endDate && (
                  <span className="text-sm text-muted-foreground">
                    ({dateRange.length} day{dateRange.length !== 1 ? "s" : ""})
                  </span>
                )}
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileUp
                  size={32}
                  className="mx-auto text-muted-foreground mb-3"
                />
                <p className="text-sm font-medium mb-1">
                  Upload Attendance Excel/CSV File
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Select a file to upload attendance records for the selected
                  date range
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="max-w-xs"
                  />
                  {selectedFile && (
                    <Button
                      onClick={handleUpload}
                      disabled={uploading || !startDate || !endDate}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
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
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">
                Excel/CSV Format Requirements:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  Columns: Employee ID, Employee Name, and date columns with
                  full dates (e.g., 14-01-2026, 15-01-2026, 16-01-2026)
                </li>
                <li>
                  Date columns should match the selected date range in
                  DD-MM-YYYY format (e.g., 14-01-2026) or DD/MM/YYYY format
                  (e.g., 14/01/2026)
                </li>
                <li>Status values: P (Present) or A (Absent)</li>
                <li>First row should contain column headers</li>
                <li>
                  Example: If range is 14-01-2026 to 16-01-2026, columns should
                  be: Employee ID, Employee Name, 14-01-2026, 15-01-2026,
                  16-01-2026
                </li>
                <li>
                  Note: Date format can be DD-MM-YYYY (14-01-2026) or DD/MM/YYYY
                  (14/01/2026)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
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
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      {dateRange.map((date) => (
                        <TableHead
                          key={date.toISOString()}
                          className="text-center min-w-[60px]"
                        >
                          {formatDateDisplay(date)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(groupedAttendance).length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3 + dateRange.length}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No attendance records found for this date range
                        </TableCell>
                      </TableRow>
                    ) : (
                      Object.entries(groupedAttendance).map(
                        ([userId, data]) => (
                          <TableRow key={userId}>
                            <TableCell className="font-medium">
                              {data.user?.employee?.employeeId || "N/A"}
                            </TableCell>
                            <TableCell>{data.user?.name || "N/A"}</TableCell>
                            <TableCell>
                              {data.user?.department || "N/A"}
                            </TableCell>
                            {dateRange.map((date) => {
                              const dateStr = date.toISOString().split("T")[0];
                              const record = data.records[dateStr];
                              return (
                                <TableCell
                                  key={dateStr}
                                  className="text-center"
                                >
                                  {record ? getStatusBadge(record.status) : "-"}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ),
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
