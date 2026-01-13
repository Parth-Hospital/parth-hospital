"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, AlertCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { appointmentApi, Appointment } from "@/lib/api/appointment"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined)
  const [filterType, setFilterType] = useState<string | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => {
    loadBookings()
  }, [filterStatus, filterType])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const filters: { status?: string; appointmentType?: string } = {}
      if (filterStatus) filters.status = filterStatus
      if (filterType) filters.appointmentType = filterType

      const data = await appointmentApi.getAppointments(filters)
      setBookings(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load bookings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline">Pending</Badge>
      case "ARRIVED":
        return <Badge variant="secondary">Arrived</Badge>
      case "CONSULTING":
        return <Badge>Consulting</Badge>
      case "COMPLETED":
        return <Badge variant="secondary">Completed</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.patientPhone?.includes(searchQuery) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serialNumber?.toString().includes(searchQuery)
  )

  return (
    <AdminLayout role="receptionist">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Patient Bookings</h2>
          <p className="text-muted-foreground">Manage online and offline patient bookings</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, phone, token, or ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            onValueChange={(value) => setFilterStatus(value === "ALL" ? undefined : value)}
            value={filterStatus || "ALL"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ARRIVED">Arrived</SelectItem>
              <SelectItem value="CONSULTING">Consulting</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setFilterType(value === "ALL" ? undefined : value)}
            value={filterType || "ALL"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="GENERAL">General</SelectItem>
              <SelectItem value="PRIORITY">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                No bookings found matching your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-background">
                    <tr>
                      <th className="p-4 text-left font-semibold">Token</th>
                      <th className="p-4 text-left font-semibold">Patient Name</th>
                      <th className="p-4 text-left font-semibold">Date</th>
                      <th className="p-4 text-left font-semibold">Time</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-left font-semibold">Type</th>
                      <th className="p-4 text-left font-semibold">Booking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border hover:bg-background/50">
                        <td className="p-4 font-semibold text-lg text-primary">
                          {booking.serialNumber ? `#${booking.serialNumber}` : "N/A"}
                        </td>
                        <td className="p-4 font-medium">
                          {booking.patientName || "Offline Booking"}
                        </td>
                        <td className="p-4">{format(new Date(booking.date), "PPP")}</td>
                        <td className="p-4">{booking.arrivalTime || booking.preferredTime || "N/A"}</td>
                        <td className="p-4">{getStatusBadge(booking.status)}</td>
                        <td className="p-4">
                          <Badge
                            variant={booking.appointmentType === "PRIORITY" ? "default" : "secondary"}
                          >
                            {booking.appointmentType}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">
                            {booking.bookingType === "ONLINE" ? "Online" : "Offline"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
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

