"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Clock, User, Phone, MapPin, CreditCard, CheckCircle2, AlertCircle, CalendarCheck } from "lucide-react"
import { AppointmentTicket } from "@/components/appointment-ticket"
import { PaymentModal } from "@/components/payment-modal"
import {
  calculateSerialNumberAndTime,
  formatDate,
  isBookingWindowOpen,
  getNextAppointmentDate,
  validateAppointmentForm,
  type AppointmentFormData,
  type AppointmentType,
} from "@/lib/utils/appointment"
import { appointmentApi } from "@/lib/api/appointment"

export default function AppointmentPage() {
  const [appointmentType, setAppointmentType] = useState<AppointmentType | null>(null)
  const [formData, setFormData] = useState<Partial<AppointmentFormData>>({
    paymentMethod: undefined,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [serialNumber, setSerialNumber] = useState<number | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pendingAppointmentData, setPendingAppointmentData] = useState<AppointmentFormData | null>(null)
  const [bookingWindow, setBookingWindow] = useState<{
    isOpen: boolean
    message: string
    nextDate: Date | null
    doctorAvailable: boolean
    doctorAvailabilityMessage: string
    isBefore5PM: boolean
  }>({
    isOpen: false,
    message: "",
    nextDate: null,
    doctorAvailable: false,
    doctorAvailabilityMessage: "",
    isBefore5PM: false,
  })
  const [loadingAvailability, setLoadingAvailability] = useState(true)

  useEffect(() => {
    const checkAvailability = async () => {
      setLoadingAvailability(true)
      const windowStatus = await isBookingWindowOpen()
      setBookingWindow(windowStatus)
      setLoadingAvailability(false)
    }
    checkAvailability()
  }, [])

  const handleAppointmentTypeSelect = (type: AppointmentType) => {
    setAppointmentType(type)
    setFormData({
      appointmentType: type,
      paymentMethod: type === "priority" ? "online" : undefined,
    })
    setErrors({})
  }

  const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!bookingWindow.nextDate) {
      setErrors({ date: "Booking window is closed. Please try again after 5 PM." })
      return
    }

    const completeFormData = {
      ...formData,
      date: bookingWindow.nextDate.toISOString().split("T")[0],
      appointmentType: appointmentType!,
    } as AppointmentFormData

    const validation = validateAppointmentForm(completeFormData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    // If payment method is online, show payment modal first
    if (completeFormData.paymentMethod === "online") {
      setPendingAppointmentData(completeFormData)
      setShowPaymentModal(true)
      return
    }

    // For pay at counter, proceed directly
    await submitAppointment(completeFormData)
  }

  const submitAppointment = async (completeFormData: AppointmentFormData) => {
    setIsSubmitting(true)

    try {
      // Format date as datetime string at start of day (00:00:00)
      const appointmentDate = new Date(bookingWindow.nextDate!)
      appointmentDate.setHours(0, 0, 0, 0)
      const dateString = appointmentDate.toISOString()

      // Call real API
      const appointment = await appointmentApi.createAppointment({
        patientName: completeFormData.patientName!,
        patientAge: parseInt(completeFormData.patientAge!),
        patientPhone: completeFormData.phoneNumber!,
        patientCity: completeFormData.patientCity!,
        date: dateString,
        appointmentType: completeFormData.appointmentType.toUpperCase() as "GENERAL" | "PRIORITY",
        preferredTime: completeFormData.preferredTime,
        paymentMethod: completeFormData.paymentMethod.toUpperCase().replace(/-/g, "_") as "ONLINE" | "PAY_AT_COUNTER",
        reason: completeFormData.reason,
      })

      // Set serial number if it's a general appointment
      if (appointment.serialNumber) {
        setSerialNumber(appointment.serialNumber)
      }

      setIsSubmitting(false)
      setIsSubmitted(true)
      setShowPaymentModal(false)
      setPendingAppointmentData(null)
    } catch (error: any) {
      console.error("Appointment booking error:", error)
      // Handle validation errors from backend
      if (error.details && Array.isArray(error.details)) {
        const validationErrors: Record<string, string> = {}
        error.details.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            const field = err.path[0]
            validationErrors[field] = err.message || "Invalid value"
          }
        })
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors)
        } else {
          setErrors({ submit: error.message || "Failed to book appointment. Please try again." })
        }
      } else {
        setErrors({ submit: error.message || "Failed to book appointment. Please try again." })
      }
      setIsSubmitting(false)
      setShowPaymentModal(false)
    }
  }

  const handlePaymentComplete = async () => {
    if (pendingAppointmentData) {
      await submitAppointment(pendingAppointmentData)
    }
  }

  const getPaymentAmount = () => {
    if (!appointmentType) return 0
    return appointmentType === "general" ? 500 : 1000
  }

  if (isSubmitted) {
    const isGeneral = appointmentType === "general"
    // Calculate serial info from serial number if available
    const serialInfo = isGeneral && serialNumber
      ? {
          serialNumber,
          arrivalTime: serialNumber <= 30 ? "11:00" : 
                      serialNumber <= 60 ? "11:30" :
                      serialNumber <= 90 ? "12:00" :
                      serialNumber <= 120 ? "12:30" :
                      serialNumber <= 150 ? "13:00" :
                      serialNumber <= 180 ? "13:30" :
                      serialNumber <= 210 ? "14:00" :
                      serialNumber <= 240 ? "14:30" :
                      serialNumber <= 270 ? "15:00" :
                      serialNumber <= 300 ? "15:30" :
                      serialNumber <= 330 ? "16:00" :
                      serialNumber <= 360 ? "16:30" : "17:00",
          slotTime: serialNumber <= 30 ? "11:00" : 
                    serialNumber <= 60 ? "11:30" :
                    serialNumber <= 90 ? "12:00" :
                    serialNumber <= 120 ? "12:30" :
                    serialNumber <= 150 ? "13:00" :
                    serialNumber <= 180 ? "13:30" :
                    serialNumber <= 210 ? "14:00" :
                    serialNumber <= 240 ? "14:30" :
                    serialNumber <= 270 ? "15:00" :
                    serialNumber <= 300 ? "15:30" :
                    serialNumber <= 330 ? "16:00" :
                    serialNumber <= 360 ? "16:30" : "17:00",
        }
      : null

    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <FloatingActions />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Appointment Booked Successfully!</h2>
                <p className="text-muted-foreground mb-8">
                  Your appointment has been confirmed. You will receive a confirmation message shortly.
                </p>
                <div className="bg-muted rounded-lg p-6 mb-6 text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Patient Name</p>
                      <p className="font-semibold">{formData.patientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Appointment Date</p>
                      <p className="font-semibold">
                        {bookingWindow.nextDate ? formatDate(bookingWindow.nextDate) : "N/A"}
                      </p>
                    </div>
                  </div>
                  {isGeneral && serialInfo && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center text-primary font-bold">#</div>
                        <div>
                          <p className="text-sm text-muted-foreground">Serial Number</p>
                          <p className="font-semibold text-lg">#{serialInfo.serialNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Please Arrive By</p>
                          <p className="font-semibold">{serialInfo.arrivalTime}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your consultation time slot: {serialInfo.slotTime}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {!isGeneral && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Appointment Type</p>
                        <p className="font-semibold">Priority - Come at any time</p>
                        {formData.preferredTime && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Preferred time: {formData.preferredTime}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Payment</p>
                      <p className="font-semibold capitalize">
                        {formData.paymentMethod === "online" ? "Online Payment (Razorpay)" : "Pay at Counter"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Download Ticket */}
                {appointmentType && (
                  <div className="mb-6">
                    <AppointmentTicket
                      patientName={formData.patientName || ""}
                      appointmentDate={bookingWindow.nextDate}
                      serialNumber={serialInfo?.serialNumber}
                      arrivalTime={serialInfo?.arrivalTime}
                      slotTime={serialInfo?.slotTime}
                      appointmentType={appointmentType}
                      preferredTime={formData.preferredTime}
                      paymentMethod={formData.paymentMethod || ""}
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => window.location.reload()}>
                    Book Another
                  </Button>
                  <Button className="flex-1" onClick={() => (window.location.href = "/")}>
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Show appointment type selection cards first
  if (!appointmentType) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <FloatingActions />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Book Your Appointment</h1>
              <p className="text-lg text-muted-foreground">
                Schedule a consultation with Dr. Subash Singh at Parth Hospital
              </p>
            </div>

            {/* Doctor Availability & Booking Window Status */}
            {loadingAvailability ? (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                    <p className="text-muted-foreground">Checking booking status...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Before 5 PM: Booking window not opened yet */}
                {bookingWindow.isBefore5PM && (
                  <Card className="mb-8 border-blue-500/50 bg-blue-50/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-900">Booking Window Not Opened</p>
                          <p className="text-sm text-blue-700">{bookingWindow.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* After 5 PM: Show doctor availability and booking status */}
                {!bookingWindow.isBefore5PM && (
                  <>
                    {/* Doctor Not Available (After 5 PM) */}
                    {!bookingWindow.doctorAvailable && !bookingWindow.isOpen && (
                      <Card className="mb-8 border-red-500/50 bg-red-50/50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="font-semibold text-red-900">Doctor Not Attending Tomorrow</p>
                              <p className="text-sm text-red-700">
                                {bookingWindow.doctorAvailabilityMessage || bookingWindow.message}
                              </p>
                              <p className="text-sm text-red-700 mt-1">
                                Booking window is closed. Please check back later for future appointments.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Booking Window Open (After 5 PM, Doctor Available) */}
                    {bookingWindow.isOpen && bookingWindow.nextDate && bookingWindow.doctorAvailable && (
                      <Card className="mb-8 border-primary/50 bg-primary/5">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <CalendarCheck className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-semibold text-primary">Booking Available</p>
                              <p className="text-sm text-muted-foreground">
                                Dr. Subash Singh is available for consultations tomorrow ({formatDate(bookingWindow.nextDate)}).
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Booking window is open from 5 PM{" "}
                                {new Date(bookingWindow.nextDate.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString(
                                  "en-IN",
                                  { weekday: "long", day: "numeric", month: "long" }
                                )}{" "}
                                to 8:15 AM {formatDate(bookingWindow.nextDate)}.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Booking Window Closed (After 5 PM, but window closed for other reasons) */}
                    {!bookingWindow.isOpen && bookingWindow.doctorAvailable && (
                      <Card className="mb-8 border-yellow-500/50 bg-yellow-50/50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            <div>
                              <p className="font-semibold text-yellow-900">Booking Window Closed</p>
                              <p className="text-sm text-yellow-700">{bookingWindow.message}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* General Appointment Card */}
              <Card
                className={`transition-all duration-300 ${
                  bookingWindow.isOpen && bookingWindow.doctorAvailable && !bookingWindow.isBefore5PM
                    ? "cursor-pointer hover:shadow-lg"
                    : "opacity-60 cursor-not-allowed"
                } ${appointmentType === "general" ? "border-primary border-2" : ""}`}
                onClick={() =>
                  bookingWindow.isOpen &&
                  bookingWindow.doctorAvailable &&
                  !bookingWindow.isBefore5PM &&
                  handleAppointmentTypeSelect("general")
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    General Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    You will receive a serial number and specific arrival time. Payment can be made online or at counter.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span>Serial number assigned (first come, first serve)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span>Specific arrival time provided</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span>Pay online or at counter</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-secondary" />
                      <span>Fee: ₹500</span>
                    </div>
                  </div>
                  {(!bookingWindow.isOpen || !bookingWindow.doctorAvailable || bookingWindow.isBefore5PM) && (
                    <Badge variant="outline" className="w-full justify-center">
                      {bookingWindow.isBefore5PM
                        ? "Booking window not opened yet"
                        : !bookingWindow.doctorAvailable
                          ? "Doctor not attending tomorrow"
                          : "Booking window closed"}
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Priority Appointment Card */}
              <Card
                className={`transition-all duration-300 ${
                  bookingWindow.isOpen && bookingWindow.doctorAvailable && !bookingWindow.isBefore5PM
                    ? "cursor-pointer hover:shadow-lg"
                    : "opacity-60 cursor-not-allowed"
                } ${appointmentType === "priority" ? "border-primary border-2" : ""}`}
                onClick={() =>
                  bookingWindow.isOpen &&
                  bookingWindow.doctorAvailable &&
                  !bookingWindow.isBefore5PM &&
                  handleAppointmentTypeSelect("priority")
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Priority Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Come at any time. Online payment is mandatory. You can specify a preferred time.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span>Come at any time during consultation hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span>Optional preferred time</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span>Online payment required (Razorpay)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-secondary" />
                      <span>Fee: ₹1,000</span>
                    </div>
                  </div>
                  {(!bookingWindow.isOpen || !bookingWindow.doctorAvailable || bookingWindow.isBefore5PM) && (
                    <Badge variant="outline" className="w-full justify-center">
                      {bookingWindow.isBefore5PM
                        ? "Booking window not opened yet"
                        : !bookingWindow.doctorAvailable
                          ? "Doctor not attending tomorrow"
                          : "Booking window closed"}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Show form after appointment type is selected
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <FloatingActions />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <Button variant="ghost" onClick={() => setAppointmentType(null)} className="mb-4">
              ← Change Appointment Type
            </Button>
            <h1 className="text-4xl font-bold mb-4">Book Your Appointment</h1>
            <p className="text-lg text-muted-foreground">
              {appointmentType === "general" ? "General Appointment" : "Priority Appointment"}
            </p>
          </div>

          {/* Appointment Date Info */}
          {bookingWindow.nextDate && (
            <Card className="mb-6 border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Appointment Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(bookingWindow.nextDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Full Name *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName || ""}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                      placeholder="Enter your full name"
                      className={errors.patientName ? "border-red-500" : ""}
                    />
                    {errors.patientName && <p className="text-sm text-red-500">{errors.patientName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Age *</Label>
                    <Input
                      id="patientAge"
                      type="number"
                      value={formData.patientAge || ""}
                      onChange={(e) => handleInputChange("patientAge", e.target.value)}
                      placeholder="Enter age"
                      min="1"
                      max="120"
                      className={errors.patientAge ? "border-red-500" : ""}
                    />
                    {errors.patientAge && <p className="text-sm text-red-500">{errors.patientAge}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber || ""}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        placeholder="10-digit mobile number"
                        className={`pl-10 ${errors.phoneNumber ? "border-red-500" : ""}`}
                        maxLength={10}
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientCity">City *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="patientCity"
                        type="text"
                        value={formData.patientCity || ""}
                        onChange={(e) => handleInputChange("patientCity", e.target.value)}
                        placeholder="Enter your city"
                        className={`pl-10 ${errors.patientCity ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.patientCity && <p className="text-sm text-red-500">{errors.patientCity}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit (Optional)</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason || ""}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    placeholder="Brief description of your concern..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferred Time - Only for Priority Appointments */}
            {appointmentType === "priority" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Preferred Time (Optional)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    You can come at any time. Specify a preferred time if you have one (11 AM - 5 PM).
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time</Label>
                    <Select
                      value={formData.preferredTime || ""}
                      onValueChange={(value) => handleInputChange("preferredTime", value)}
                    >
                      <SelectTrigger className="max-w-xs">
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="11:30">11:30 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="12:30">12:30 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="13:30">1:30 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="14:30">2:30 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="15:30">3:30 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This is optional. You can arrive at any time during consultation hours (11 AM - 5 PM).
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {appointmentType === "priority"
                    ? "Priority appointments require online payment through Razorpay."
                    : "Choose how you would like to pay for your consultation"}
                </p>
              </CardHeader>
              <CardContent>
                {appointmentType === "priority" ? (
                  <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <div className="font-semibold">Online Payment (Razorpay)</div>
                        <div className="text-sm text-muted-foreground">
                          Required for priority appointments. Fee: ₹1,000
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary">₹1,000</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer ${
                        formData.paymentMethod === "online" ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleInputChange("paymentMethod", "online")}
                    >
                      <input
                        type="radio"
                        id="online"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === "online"}
                        onChange={() => handleInputChange("paymentMethod", "online")}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="online" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Online Payment (Razorpay)</div>
                        <div className="text-sm text-muted-foreground">Pay securely online. Fee: ₹500</div>
                      </Label>
                      <div className="text-xl font-bold text-primary">₹500</div>
                    </div>
                    <div
                      className={`flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer ${
                        formData.paymentMethod === "pay-at-counter" ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleInputChange("paymentMethod", "pay-at-counter")}
                    >
                      <input
                        type="radio"
                        id="pay-at-counter"
                        name="paymentMethod"
                        value="pay-at-counter"
                        checked={formData.paymentMethod === "pay-at-counter"}
                        onChange={() => handleInputChange("paymentMethod", "pay-at-counter")}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="pay-at-counter" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Pay at Counter</div>
                        <div className="text-sm text-muted-foreground">Pay at the reception counter during your visit</div>
                      </Label>
                    </div>
                  </div>
                )}
                {errors.paymentMethod && <p className="text-sm text-red-500 mt-2">{errors.paymentMethod}</p>}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={
                  isSubmitting ||
                  !bookingWindow.isOpen ||
                  !bookingWindow.doctorAvailable ||
                  bookingWindow.isBefore5PM
                }
              >
                {isSubmitting ? "Booking..." : "Confirm Appointment"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => window.history.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      
      {/* Payment Modal */}
      {appointmentType && (
        <PaymentModal
          open={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            setPendingAppointmentData(null)
          }}
          onPaymentComplete={handlePaymentComplete}
          appointmentType={appointmentType}
          amount={getPaymentAmount()}
        />
      )}
    </main>
  )
}

