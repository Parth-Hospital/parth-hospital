"use client"

import { useRef } from "react"
import { Calendar, Clock, User, CreditCard, Hash } from "lucide-react"
import { formatDate } from "@/lib/utils/appointment"

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
  const ticketRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    if (!ticketRef.current) return

    const ticketContent = ticketRef.current.innerHTML
    
    // Create HTML content for the ticket
    const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Appointment Ticket - Parth Hospital</title>
    <style>
      @page {
        size: A4;
        margin: 15mm;
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Inter', 'Arial', sans-serif;
        margin: 0;
        padding: 20px;
        background: white;
        color: #1f2937;
      }
      .ticket-container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        border: 3px solid #0e4b8f;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .ticket-header {
        text-align: center;
        border-bottom: 3px solid #0e4b8f;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      .ticket-header h1 {
        font-size: 32px;
        font-weight: bold;
        color: #0e4b8f;
        margin-bottom: 10px;
      }
      .ticket-header p {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 5px;
      }
      .ticket-details {
        display: grid;
        gap: 20px;
        margin-bottom: 30px;
      }
      .ticket-row {
        display: flex;
        align-items: start;
        gap: 15px;
        padding: 20px;
        background: #f5f7fa;
        border-radius: 8px;
        border-left: 4px solid #0e4b8f;
      }
      .ticket-icon {
        width: 24px;
        height: 24px;
        color: #0e4b8f;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .ticket-content {
        flex: 1;
      }
      .ticket-label {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }
      .ticket-value {
        font-size: 18px;
        font-weight: 700;
        color: #1f2937;
      }
      .ticket-value.serial {
        font-size: 28px;
        color: #0e4b8f;
      }
      .ticket-subtext {
        font-size: 12px;
        color: #6b7280;
        margin-top: 4px;
      }
      .ticket-footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #e5e7eb;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
        line-height: 1.6;
      }
      .ticket-footer p {
        margin-bottom: 5px;
      }
      @media print {
        body {
          padding: 0;
        }
        .ticket-container {
          box-shadow: none;
          border: 3px solid #0e4b8f;
        }
      }
    </style>
  </head>
  <body>
    <div class="ticket-container">
      ${ticketContent}
    </div>
  </body>
</html>
    `

    // Create a blob and download it
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Parth-Hospital-Appointment-Ticket-${patientName.replace(/\s+/g, "-")}-${appointmentDate ? formatDate(appointmentDate).replace(/\s+/g, "-") : "ticket"}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div ref={ticketRef} className="hidden">
        <div className="ticket-container">
          {/* Header */}
          <div className="ticket-header">
            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#0e4b8f", marginBottom: "10px" }}>
              Parth Hospital
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "10px" }}>
              Appointment Confirmation Ticket
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
              Opposite Railway Station, Civil Lines, Jaunpur, Uttar Pradesh 222001
            </p>
          </div>

          {/* Details */}
          <div className="ticket-details">
            <div className="ticket-row">
              <User className="ticket-icon" />
              <div className="ticket-content">
                <div className="ticket-label">Patient Name</div>
                <div className="ticket-value">{patientName}</div>
              </div>
            </div>

            {appointmentDate && (
              <div className="ticket-row">
                <Calendar className="ticket-icon" />
                <div className="ticket-content">
                  <div className="ticket-label">Appointment Date</div>
                  <div className="ticket-value">{formatDate(appointmentDate)}</div>
                </div>
              </div>
            )}

            {appointmentType === "general" && serialNumber && (
              <>
                <div className="ticket-row">
                  <Hash className="ticket-icon" />
                  <div className="ticket-content">
                    <div className="ticket-label">Serial Number</div>
                    <div className="ticket-value serial">#{serialNumber}</div>
                  </div>
                </div>
                {arrivalTime && (
                  <div className="ticket-row">
                    <Clock className="ticket-icon" />
                    <div className="ticket-content">
                      <div className="ticket-label">Please Arrive By</div>
                      <div className="ticket-value">{arrivalTime}</div>
                      {slotTime && (
                        <div className="ticket-subtext">
                          Consultation time slot: {slotTime}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {appointmentType === "priority" && (
              <div className="ticket-row">
                <Clock className="ticket-icon" />
                <div className="ticket-content">
                  <div className="ticket-label">Appointment Type</div>
                  <div className="ticket-value">Priority - Come at any time</div>
                  {preferredTime && (
                    <div className="ticket-subtext">
                      Preferred time: {preferredTime}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="ticket-row">
              <CreditCard className="ticket-icon" />
              <div className="ticket-content">
                <div className="ticket-label">Payment Method</div>
                <div className="ticket-value">
                  {paymentMethod === "online" ? "Online Payment (Razorpay)" : "Pay at Counter"}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="ticket-footer">
            <p>Please bring this ticket to the reception counter on your appointment date.</p>
            <p style={{ marginTop: "8px" }}>
              For queries, call: +91 78601 15757 | Email: contact@parthhospital.com
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-semibold"
      >
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
      </button>
    </>
  )
}

