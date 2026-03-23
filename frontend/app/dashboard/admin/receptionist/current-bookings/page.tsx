"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, Plus, Calendar, Clock, Hash, Loader2, RefreshCw, CheckCircle } from "lucide-react"
import { calculateSerialNumberAndTime } from "@/lib/utils/appointment"
import { appointmentApi, Appointment } from "@/lib/api/appointment"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CurrentBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showOfflineModal, setShowOfflineModal] = useState(false)
  const [bookings, setBookings] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [addingOffline, setAddingOffline] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [completingAll, setCompletingAll] = useState(false)
  const { toast } = useToast()

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const response = await appointmentApi.getCurrentBookings(today)
      setBookings(response.appointments || [])
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

  const handleAddOfflineBooking = async () => {
    try {
      setAddingOffline(true)
      const newBooking = await appointmentApi.createOfflineAppointment(today)
      toast({
        title: "Success",
        description: "Offline booking added successfully",
      })
      setShowOfflineModal(false)
      await loadBookings()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add offline booking",
        variant: "destructive",
      })
    } finally {
      setAddingOffline(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: Appointment["status"]) => {
    try {
      setUpdatingStatus(id)
      await appointmentApi.updateAppointmentStatus(id, status)
      toast({
        title: "Success",
        description: "Appointment status updated",
      })
      await loadBookings()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleCompleteAll = async () => {
    try {
      setCompletingAll(true)
      const response = await appointmentApi.markDailyAppointmentsAsCompleted(today)
      toast({
        title: "Success",
        description: `Successfully marked ${response.count} appointments as completed`,
      })
      await loadBookings()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete all appointments",
        variant: "destructive",
      })
    } finally {
      setCompletingAll(false)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      booking.serialNumber?.toString().includes(query) ||
      booking.patientName?.toLowerCase().includes(query) ||
      booking.patientPhone?.includes(query)
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

  const summary = {
    total: bookings.length,
    online: bookings.filter((b) => b.bookingType === "ONLINE").length,
    offline: bookings.filter((b) => b.bookingType === "OFFLINE").length,
    priority: bookings.filter((b) => b.appointmentType === "PRIORITY").length,
    general: bookings.filter((b) => b.appointmentType === "GENERAL").length,
  }

  return (
    <AdminLayout role="receptionist">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Current Bookings</h2>
            <p className="text-muted-foreground">
              Manage today's appointments - Online and Offline bookings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={loadBookings} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              onClick={handleCompleteAll}
              disabled={completingAll || loading || bookings.length === 0}
            >
              {completingAll ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Complete All
            </Button>
            <Button onClick={() => setShowOfflineModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Offline Booking
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Online</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{summary.online}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Offline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{summary.offline}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{summary.priority}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by serial, name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="p-4 text-left font-semibold">Serial #</th>
                    <th className="p-4 text-left font-semibold">Patient Name</th>
                    <th className="p-4 text-left font-semibold">Phone</th>
                    <th className="p-4 text-left font-semibold">Type</th>
                    <th className="p-4 text-left font-semibold">Arrival Time</th>
                    <th className="p-4 text-left font-semibold">Payment</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Booking</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">
                        No bookings found for today
                      </td>
                    </tr>
                  ) : (
                    filteredBookings
                      .sort((a, b) => {
                        // Sort priority appointments first, then by serial number
                        if (a.appointmentType === "PRIORITY" && b.appointmentType !== "PRIORITY") return -1
                        if (a.appointmentType !== "PRIORITY" && b.appointmentType === "PRIORITY") return 1
                        return (a.serialNumber || 0) - (b.serialNumber || 0)
                      })
                      .map((booking) => (
                        <tr key={booking.id} className="border-b border-border hover:bg-muted/30">
                          <td className="p-4">
                            {booking.appointmentType === "PRIORITY" ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Priority
                              </Badge>
                            ) : (
                              <span className="font-semibold text-lg text-primary">
                                #{booking.serialNumber || "-"}
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-medium">
                            {booking.patientName || (
                              <span className="text-muted-foreground italic">Offline Booking</span>
                            )}
                          </td>
                          <td className="p-4">
                            {booking.patientPhone || <span className="text-muted-foreground">-</span>}
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                booking.appointmentType === "PRIORITY"
                                  ? "bg-red-500 text-white hover:bg-red-600"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }
                            >
                              {booking.appointmentType === "PRIORITY" ? "Priority" : "General"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{booking.arrivalTime || booking.preferredTime || "Anytime"}</span>
                              {booking.preferredTime && booking.appointmentType === "PRIORITY" && (
                                <span className="text-xs text-muted-foreground">
                                  (Pref: {booking.preferredTime})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={booking.paymentMethod === "ONLINE" ? "default" : "outline"}
                            >
                              {booking.paymentMethod === "ONLINE" ? "Online" : "At Counter"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Select
                              value={booking.status}
                              onValueChange={(value) =>
                                handleStatusUpdate(booking.id, value as Appointment["status"])
                              }
                              disabled={updatingStatus === booking.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue>
                                  {updatingStatus === booking.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    getStatusBadge(booking.status)
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="ARRIVED">Arrived</SelectItem>
                                <SelectItem value="CONSULTING">Consulting</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4">
                            <Badge variant={booking.bookingType === "ONLINE" ? "default" : "secondary"}>
                              {booking.bookingType === "ONLINE" ? "Online" : "Offline"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Offline Booking Modal */}
        <Dialog open={showOfflineModal} onOpenChange={setShowOfflineModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Offline Booking</DialogTitle>
              <DialogDescription>
                Add an offline booking to the system. This will increment the total booking count and assign
                the next available serial number and arrival time.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Next Serial Number:</span>
                  <span className="font-semibold">
                    #{calculateSerialNumberAndTime(summary.general).serialNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Arrival Time:</span>
                  <span className="font-semibold">
                    {calculateSerialNumberAndTime(summary.general).arrivalTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-semibold">
                    {new Date().toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: This booking will be added without patient details. It's for tracking purposes only to
                properly allocate timings.
              </p>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleAddOfflineBooking}
                  className="flex-1"
                  disabled={addingOffline}
                >
                  {addingOffline ? (
                    <>
                      <Loader2 className="w-4 h-4  animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Confirm Add Booking"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowOfflineModal(false)}
                  className="flex-1"
                  disabled={addingOffline}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

