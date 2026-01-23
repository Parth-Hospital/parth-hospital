"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Calendar } from "lucide-react"
import { appointmentApi, Appointment } from "@/lib/api/appointment"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    loadAppointments()
  }, [typeFilter, dateFilter])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      if (typeFilter !== "all") filters.appointmentType = typeFilter
      if (dateFilter) filters.date = dateFilter

      const data = await appointmentApi.getAppointments(filters)
      // Sort by date ascending, then by serial number ascending
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        if (dateA !== dateB) {
          return dateA - dateB
        }
        // If same date, sort by serial number
        const serialA = a.serialNumber || 0
        const serialB = b.serialNumber || 0
        return serialA - serialB
      })
      setAppointments(sorted)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load appointments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      apt.patientName.toLowerCase().includes(query) ||
      apt.patientPhone.includes(query) ||
      apt.patientEmail?.toLowerCase().includes(query)
    )
  })


  return (
    <AdminLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Appointments</h2>
          <p className="text-muted-foreground">View and manage patient appointments</p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="GENERAL">General</SelectItem>
              <SelectItem value="PRIORITY">Priority</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Filter by date"
            className="w-full sm:w-40"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Appointments ({filteredAppointments.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="p-3 sm:p-4 text-left font-semibold text-xs sm:text-sm">Patient</th>
                        <th className="p-3 sm:p-4 text-left font-semibold text-xs sm:text-sm hidden sm:table-cell">Phone</th>
                        <th className="p-3 sm:p-4 text-left font-semibold text-xs sm:text-sm">Date</th>
                        <th className="p-3 sm:p-4 text-left font-semibold text-xs sm:text-sm">Type</th>
                        <th className="p-3 sm:p-4 text-left font-semibold text-xs sm:text-sm">Serial/Time</th>
                        <th className="p-3 sm:p-4 text-left font-semibold text-xs sm:text-sm hidden md:table-cell">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            No appointments found
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <tr key={apt.id} className="border-b border-border hover:bg-muted/30">
                            <td className="p-3 sm:p-4 font-medium">
                              <div className="flex flex-col">
                                <span className="text-xs sm:text-sm">{apt.patientName}</span>
                                <span className="text-xs text-muted-foreground sm:hidden">{apt.patientPhone}</span>
                              </div>
                            </td>
                            <td className="p-3 sm:p-4 hidden sm:table-cell">{apt.patientPhone}</td>
                            <td className="p-3 sm:p-4 text-xs sm:text-sm">
                              {new Date(apt.date).toLocaleDateString("en-IN")}
                            </td>
                            <td className="p-3 sm:p-4">
                              <Badge
                                className={`text-xs ${
                                  apt.appointmentType === "PRIORITY"
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                              >
                                {apt.appointmentType === "PRIORITY" ? "Priority" : "General"}
                              </Badge>
                            </td>
                            <td className="p-3 sm:p-4 text-xs sm:text-sm">
                              {apt.appointmentType === "PRIORITY" ? (
                                <span className="text-muted-foreground">
                                  {apt.preferredTime || "Anytime"}
                                </span>
                              ) : (
                                <span className="font-semibold">#{apt.serialNumber || "-"}</span>
                              )}
                            </td>
                            <td className="p-3 sm:p-4 hidden md:table-cell">
                              <Badge variant={apt.paymentMethod === "ONLINE" ? "default" : "outline"}>
                                {apt.paymentMethod === "ONLINE" ? "Online" : "At Counter"}
                              </Badge>
                            </td>
                            <td className="p-3 sm:p-4 md:hidden">
                              <Badge variant={apt.paymentMethod === "ONLINE" ? "default" : "outline"} className="text-xs w-fit">
                                {apt.paymentMethod === "ONLINE" ? "Online" : "At Counter"}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

