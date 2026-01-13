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
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    loadAppointments()
  }, [statusFilter, typeFilter, dateFilter])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      if (statusFilter !== "all") filters.status = statusFilter
      if (typeFilter !== "all") filters.appointmentType = typeFilter
      if (dateFilter) filters.date = dateFilter

      const data = await appointmentApi.getAppointments(filters)
      setAppointments(data)
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      PENDING: "outline",
      ARRIVED: "secondary",
      CONSULTING: "default",
      COMPLETED: "outline",
      CANCELLED: "destructive",
    }
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    )
  }

  return (
    <AdminLayout role="owner">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Appointments</h2>
          <p className="text-muted-foreground">View and manage patient appointments</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ARRIVED">Arrived</SelectItem>
              <SelectItem value="CONSULTING">Consulting</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
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
            className="w-40"
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
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Patient</th>
                      <th className="p-4 text-left font-semibold">Phone</th>
                      <th className="p-4 text-left font-semibold">Date</th>
                      <th className="p-4 text-left font-semibold">Type</th>
                      <th className="p-4 text-left font-semibold">Serial/Time</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-left font-semibold">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                          No appointments found
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="border-b border-border hover:bg-muted/30">
                          <td className="p-4 font-medium">{apt.patientName}</td>
                          <td className="p-4">{apt.patientPhone}</td>
                          <td className="p-4">
                            {new Date(apt.date).toLocaleDateString("en-IN")}
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">
                              {apt.appointmentType === "PRIORITY" ? "Priority" : "General"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {apt.appointmentType === "PRIORITY" ? (
                              <span className="text-sm text-muted-foreground">
                                {apt.preferredTime || "Anytime"}
                              </span>
                            ) : (
                              <span className="font-semibold">#{apt.serialNumber || "-"}</span>
                            )}
                          </td>
                          <td className="p-4">{getStatusBadge(apt.status)}</td>
                          <td className="p-4">
                            <Badge variant={apt.paymentMethod === "ONLINE" ? "default" : "outline"}>
                              {apt.paymentMethod === "ONLINE" ? "Online" : "At Counter"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

