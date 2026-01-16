"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ticket, Loader2, AlertCircle } from "lucide-react"
import { appointmentApi, Appointment } from "@/lib/api/appointment"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function TokensPage() {
  const [bookings, setBookings] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
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

  const handleStatusUpdate = async (id: string, status: Appointment["status"]) => {
    try {
      setUpdatingStatus(id)
      await appointmentApi.updateAppointmentStatus(id, status)
      toast({
        title: "Success",
        description: "Appointment status updated successfully",
      })
      await loadBookings()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment status",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline">Waiting</Badge>
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

  // Calculate statistics
  const currentToken = bookings.find((b) => b.status === "CONSULTING")?.serialNumber || null
  const waitingCount = bookings.filter((b) => b.status === "PENDING" || b.status === "ARRIVED").length
  const totalToday = bookings.length

  // Get next appointment to call
  const nextAppointment = bookings
    .filter((b) => b.status === "PENDING" || b.status === "ARRIVED")
    .sort((a, b) => {
      if (a.serialNumber && b.serialNumber) {
        return a.serialNumber - b.serialNumber
      }
      return 0
    })[0]

  const handleNext = () => {
    if (nextAppointment) {
      if (nextAppointment.status === "PENDING") {
        handleStatusUpdate(nextAppointment.id, "ARRIVED")
      } else if (nextAppointment.status === "ARRIVED") {
        handleStatusUpdate(nextAppointment.id, "CONSULTING")
      }
    }
  }

  return (
    <AdminLayout role="receptionist">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Token Management</h2>
          <p className="text-muted-foreground">Manage ticket numbers and patient queue</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Ticket size={32} className="mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">
                {currentToken ? `#${currentToken}` : "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">Current Token</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-green-600">{waitingCount}</p>
              <p className="text-sm text-muted-foreground">Waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-blue-600">{totalToday}</p>
              <p className="text-sm text-muted-foreground">Total Today</p>
            </CardContent>
          </Card>
        </div>

        {nextAppointment && (
          <Card className="border-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Next to Call</p>
                  <p className="text-lg font-semibold">
                    Token #{nextAppointment.serialNumber || "N/A"} - {nextAppointment.patientName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {nextAppointment.arrivalTime || "N/A"}
                  </p>
                </div>
                <Button onClick={handleNext} disabled={updatingStatus === nextAppointment.id}>
                  {updatingStatus === nextAppointment.id ? (
                    <Loader2 className=" h-4 w-4 animate-spin" />
                  ) : null}
                  {nextAppointment.status === "PENDING" ? "Mark Arrived" : "Start Consulting"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                No bookings for today
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-background">
                    <tr>
                      <th className="p-4 text-left font-semibold">Token</th>
                      <th className="p-4 text-left font-semibold">Patient Name</th>
                      <th className="p-4 text-left font-semibold">Time</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings
                      .sort((a, b) => {
                        if (a.serialNumber && b.serialNumber) {
                          return a.serialNumber - b.serialNumber
                        }
                        return 0
                      })
                      .map((booking) => (
                        <tr key={booking.id} className="border-b border-border hover:bg-background/50">
                          <td className="p-4 font-semibold text-lg text-primary">
                            {booking.serialNumber ? `#${booking.serialNumber}` : "N/A"}
                          </td>
                          <td className="p-4 font-medium">
                            {booking.patientName || "Offline Booking"}
                          </td>
                          <td className="p-4">{booking.arrivalTime || "N/A"}</td>
                          <td className="p-4">{getStatusBadge(booking.status)}</td>
                          <td className="p-4">
                            {booking.status === "PENDING" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(booking.id, "ARRIVED")}
                                disabled={updatingStatus === booking.id}
                              >
                                {updatingStatus === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Mark Arrived"
                                )}
                              </Button>
                            )}
                            {booking.status === "ARRIVED" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(booking.id, "CONSULTING")}
                                disabled={updatingStatus === booking.id}
                              >
                                {updatingStatus === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Start"
                                )}
                              </Button>
                            )}
                            {booking.status === "CONSULTING" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                                disabled={updatingStatus === booking.id}
                              >
                                {updatingStatus === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Complete"
                                )}
                              </Button>
                            )}
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

