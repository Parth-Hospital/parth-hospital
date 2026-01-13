"use client"

import { useState } from "react"
import { Calendar, Clock, User, CreditCard, Hash, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils/appointment"
import jsPDF from "jspdf"

interface AppointmentTicketProps {
  patientName: string
  appointmentDate: Date | null
  serialNumber?: number
  arrivalTime?: string
  slotTime?: string
  appointmentType: "general" | "priority"
  preferredTime?: string
  paymentMethod: string
}

// Helper function to load image as base64
const loadImageAsBase64 = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL("image/png"))
      } else {
        reject(new Error("Could not get canvas context"))
      }
    }
    img.onerror = reject
    img.src = src
  })
}

export function AppointmentTicket({
  patientName,
  appointmentDate,
  serialNumber,
  arrivalTime,
  slotTime,
  appointmentType,
  preferredTime,
  paymentMethod,
}: AppointmentTicketProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - 2 * margin
      let yPos = margin

      // Helper to convert hex to RGB
      const hexToRgb = (hex: string): [number, number, number] => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
          ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16),
            ]
          : [0, 0, 0]
      }

      // Colors (RGB format for jsPDF)
      const primaryColor = hexToRgb("#0e4b8f")
      const textColor = hexToRgb("#111827")
      const grayColor = hexToRgb("#4b5563")
      const lightGrayColor = hexToRgb("#6b7280")
      const bgGrayColor = hexToRgb("#f9fafb")
      const borderGrayColor = hexToRgb("#e5e7eb")

      // Load logo
      let logoDataUrl = ""
      try {
        logoDataUrl = await loadImageAsBase64("/Logo/parth-logo.png")
      } catch (error) {
        console.warn("Could not load logo:", error)
      }

      // Header with Logo
      if (logoDataUrl) {
        pdf.addImage(logoDataUrl, "PNG", pageWidth / 2 - 15, yPos, 30, 30)
        yPos += 35
      }

      // Hospital Name
      pdf.setFontSize(20)
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.setFont("helvetica", "bold")
      const hospitalName = "Parth Hospital"
      const hospitalNameWidth = pdf.getTextWidth(hospitalName)
      pdf.text(hospitalName, pageWidth / 2 - hospitalNameWidth / 2, yPos)
      yPos += 8

      // Subtitle
      pdf.setFontSize(11)
      pdf.setTextColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
      pdf.setFont("helvetica", "normal")
      const subtitle = "Appointment Confirmation Ticket"
      const subtitleWidth = pdf.getTextWidth(subtitle)
      pdf.text(subtitle, pageWidth / 2 - subtitleWidth / 2, yPos)
      yPos += 6

      // Address
      pdf.setFontSize(9)
      pdf.setTextColor(156, 163, 175) // #9ca3af
      const address = "Polytechnic chauraha, Jaunpur, Uttar Pradesh 222002"
      const addressWidth = pdf.getTextWidth(address)
      pdf.text(address, pageWidth / 2 - addressWidth / 2, yPos)
      yPos += 12

      // Draw header border
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.setLineWidth(0.5)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 10

      // Helper function to add detail row
      const addDetailRow = (
        label: string,
        value: string,
        icon?: string
      ) => {
        // Background box
        pdf.setFillColor(bgGrayColor[0], bgGrayColor[1], bgGrayColor[2])
        pdf.roundedRect(margin, yPos, contentWidth, 15, 2, 2, "F")

        // Left border
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
        pdf.rect(margin, yPos, 2, 15, "F")

        // Label
        pdf.setFontSize(8)
        pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2])
        pdf.setFont("helvetica", "bold")
        pdf.text(label.toUpperCase(), margin + 6, yPos + 6)

        // Value
        pdf.setFontSize(12)
        pdf.setTextColor(textColor[0], textColor[1], textColor[2])
        pdf.setFont("helvetica", "bold")
        pdf.text(value, margin + 6, yPos + 11)

        yPos += 18
      }

      // Patient Name
      addDetailRow("Patient Name", patientName)

      // Appointment Date
      if (appointmentDate) {
        addDetailRow("Appointment Date", formatDate(appointmentDate))
      }

      // Serial Number (for general appointments)
      if (appointmentType === "general" && serialNumber) {
        pdf.setFillColor(bgGrayColor[0], bgGrayColor[1], bgGrayColor[2])
        pdf.roundedRect(margin, yPos, contentWidth, 20, 2, 2, "F")
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
        pdf.rect(margin, yPos, 2, 20, "F")

        pdf.setFontSize(8)
        pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2])
        pdf.setFont("helvetica", "bold")
        pdf.text("SERIAL NUMBER", margin + 6, yPos + 6)

        pdf.setFontSize(24)
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        pdf.setFont("helvetica", "bold")
        pdf.text(`#${serialNumber}`, margin + 6, yPos + 16)

        yPos += 23
      }

      // Arrival Time (for general appointments)
      if (appointmentType === "general" && arrivalTime) {
        let timeText = arrivalTime
        if (slotTime) {
          timeText += ` (Your consultation time slot: ${slotTime})`
        }
        addDetailRow("Please Arrive By", timeText)
      }

      // Priority Appointment Type
      if (appointmentType === "priority") {
        let priorityText = "Priority - Come at any time"
        if (preferredTime) {
          priorityText += ` (Preferred time: ${preferredTime})`
        }
        addDetailRow("Appointment Type", priorityText)
      }

      // Payment Method
      const paymentText =
        paymentMethod === "online"
          ? "Online Payment (Razorpay)"
          : "Pay at Counter"
      addDetailRow("Payment", paymentText)

      yPos += 10

      // Footer
      pdf.setDrawColor(borderGrayColor[0], borderGrayColor[1], borderGrayColor[2])
      pdf.setLineWidth(0.3)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 8

      pdf.setFontSize(9)
      pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2])
      pdf.setFont("helvetica", "normal")
      pdf.text(
        "Please bring this ticket to the reception counter on your appointment date.",
        pageWidth / 2,
        yPos,
        { align: "center", maxWidth: contentWidth }
      )
      yPos += 6
      pdf.text(
        "For queries, call: +91 78601 15757 | Email: parthhospitaljnp@gmail.com",
        pageWidth / 2,
        yPos,
        { align: "center", maxWidth: contentWidth }
      )

      // Generate filename
      const fileName = `Parth-Hospital-Appointment-Ticket-${patientName.replace(/\s+/g, "-")}-${appointmentDate ? formatDate(appointmentDate).replace(/\s+/g, "-") : "ticket"}.pdf`

      // Save PDF
      pdf.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border-2 border-primary p-8 max-w-2xl mx-auto">
      {/* Header with Logo */}
      <div className="text-center border-b-2 border-primary pb-4 mb-6">
        <div className="flex justify-center mb-4">
          <img
            src="/Logo/parth-logo.png"
            alt="Parth Hospital Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Parth Hospital
        </h1>
        <p className="text-sm text-gray-600 mb-2">
          Appointment Confirmation Ticket
        </p>
        <p className="text-xs text-gray-500">
          Polytechnic chauraha, Jaunpur, Uttar Pradesh 222002
        </p>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
          <User className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-1">Patient Name</div>
            <div className="text-lg font-bold text-gray-900">{patientName}</div>
          </div>
        </div>

        {appointmentDate && (
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
            <Calendar className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-1">Appointment Date</div>
              <div className="text-lg font-bold text-gray-900">{formatDate(appointmentDate)}</div>
            </div>
          </div>
        )}

        {appointmentType === "general" && serialNumber && (
          <>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
              <Hash className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-1">Serial Number</div>
                <div className="text-3xl font-bold text-primary">#{serialNumber}</div>
              </div>
            </div>
                {arrivalTime && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                    <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-1">Please Arrive By</div>
                  <div className="text-lg font-bold text-gray-900">{arrivalTime}</div>
                  {slotTime && (
                    <div className="text-xs text-gray-600 mt-1">
                      Your consultation time slot: {slotTime}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {appointmentType === "priority" && (
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
            <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-1">Appointment Type</div>
              <div className="text-lg font-bold text-gray-900">Priority - Come at any time</div>
              {preferredTime && (
                <div className="text-xs text-gray-600 mt-1">
                  Preferred time: {preferredTime}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
          <CreditCard className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-1">Payment</div>
            <div className="text-lg font-bold text-gray-900">
              {paymentMethod === "online" ? "Online Payment (Razorpay)" : "Pay at Counter"}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-600 space-y-1">
        <p>Please bring this ticket to the reception counter on your appointment date.</p>
        <p>
          For queries, call: +91 78601 15757 | Email: parthhospitaljnp@gmail.com
        </p>
      </div>

      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Ticket
          </>
        )}
      </button>
    </div>
  )
}

