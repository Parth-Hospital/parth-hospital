"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { doctorAvailabilityApi } from "@/lib/api/doctorAvailability"
import { useToast } from "@/hooks/use-toast"

export default function DoctorAvailabilityPage() {
  const [tomorrowAvailable, setTomorrowAvailable] = useState(true) // Default to available
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDateStr = tomorrow.toISOString().split("T")[0]

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadAvailability()
  }, [])

  const loadAvailability = async () => {
    try {
      setLoading(true)
      const availability = await doctorAvailabilityApi.getAvailability(tomorrowDateStr)
      // Default to true (available) if no record exists - doctor is always available by default
      setTomorrowAvailable(availability?.available !== false)
    } catch (error: any) {
      // Default to available if error occurs
      setTomorrowAvailable(true)
    } finally {
      setLoading(false)
    }
  }

  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()
  const currentTimeInMinutes = currentHour * 60 + currentMinute
  const windowOpenTime = 17 * 60 // 5 PM = 1020 minutes
  const canUpdateTomorrow = currentTimeInMinutes < windowOpenTime

  const handleToggleAvailability = async (checked: boolean) => {
    if (!canUpdateTomorrow) {
      toast({
        title: "Update Window Closed",
        description: "You can only update tomorrow's availability before 5:00 PM today.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      await doctorAvailabilityApi.setAvailability(tomorrowDateStr, checked)
      setTomorrowAvailable(checked)
      toast({
        title: "Success",
        description: checked
          ? "Doctor marked as available for tomorrow"
          : "Doctor marked as not available for tomorrow",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update availability",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout role="owner">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Doctor Availability</h2>
          <p className="text-muted-foreground">Manage doctor availability for tomorrow</p>
        </div>

        {/* Standard Timings */}
        <Card>
          <CardHeader>
            <CardTitle>Standard Timings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Consultation</p>
                  <p className="text-lg font-semibold">11 AM - 5 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Operations</p>
                  <p className="text-lg font-semibold">5 AM - 10 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>
              Tomorrow's Availability ({tomorrow.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {!canUpdateTomorrow && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Update window closed:</strong> You can only update tomorrow's availability before 5:00 PM today.
                        The appointment booking window is now open until 8:15 AM tomorrow.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-6 bg-background rounded-lg border-2 border-border">
                    <div className="flex-1">
                      <Label 
                        htmlFor="availability-toggle" 
                        className={`text-lg font-semibold ${canUpdateTomorrow ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
                      >
                        Mark as Available
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tomorrowAvailable
                          ? "Doctor is available for consultations tomorrow. Patients can book appointments."
                          : "Doctor is not available tomorrow. Booking will be disabled."}
                      </p>
                      {canUpdateTomorrow && (
                        <p className="text-xs text-muted-foreground mt-2">
                          You can update this until 5:00 PM today. After 5 PM, the booking window opens.
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {tomorrowAvailable ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div className="relative">
                        <Switch
                          id="availability-toggle"
                          checked={tomorrowAvailable}
                          onCheckedChange={handleToggleAvailability}
                          disabled={!canUpdateTomorrow || saving}
                        />
                        {!canUpdateTomorrow && (
                          <div className="absolute inset-0 cursor-not-allowed rounded-full" title="Cannot update after 5 PM" />
                        )}
                      </div>
                    </div>
                  </div>

                  {saving && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

