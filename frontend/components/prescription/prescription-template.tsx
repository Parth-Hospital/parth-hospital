"use client"

interface PrescriptionItem {
  id: string
  saltName: string
  dosage?: string
  frequency?: string
  duration?: string
  instructions?: string
}

interface PrescriptionTemplateProps {
  date?: string
  medicines: PrescriptionItem[]
  doctorName?: string
  patientName?: string
  patientAge?: string
  hospitalName?: string
  hospitalAddress?: string
}

export function PrescriptionTemplate({
  date = new Date().toLocaleDateString("en-IN"),
  medicines,
  doctorName = "Dr. Subash Singh",
  patientName,
  patientAge,
  hospitalName = "Parth Hospital",
  hospitalAddress = "Jaunpur, Uttar Pradesh",
}: PrescriptionTemplateProps) {
  return (
    <div
      id="prescription-print-area"
      className="bg-white border-2 border-gray-300 relative"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm",
        margin: "0 auto",
        boxSizing: "border-box",
        fontFamily: "var(--font-outfit), 'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "block",
      }}
    >
      {/* Top-left Logo */}
      <img
        src="/Logo/parth-logo.png"
        alt="Parth Hospital Logo"
        style={{
          position: "absolute",
          top: "10mm",
          left: "10mm",
          height: "30mm",
          width: "auto",
          zIndex: 10,
        }}
      />

      {/* Centered Watermark */}
      <img
        src="/Logo/parth-logo.png"
        alt="Parth Hospital Watermark"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "150mm",
          width: "auto",
          opacity: 0.08,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Hospital Header & Doctor Name at Top */}
      <div
        className="text-center border-b-2 border-gray-800 relative"
        style={{
          paddingTop: "8mm",
          paddingBottom: "16px",
          marginBottom: "24px",
          fontFamily: "var(--font-outfit), 'Inter', sans-serif",
          zIndex: 5,
          position: "relative",
        }}
      >
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "8px",
            fontFamily: "var(--font-outfit), 'Inter', sans-serif",
          }}
        >
          {hospitalName}
        </h1>
        <p
          className="text-sm text-gray-600"
          style={{
            fontSize: "14px",
            marginBottom: "12px",
            fontFamily: "var(--font-outfit), 'Inter', sans-serif",
          }}
        >
          {hospitalAddress}
        </p>
        {/* Patient Information (if provided) */}
        {(patientName || patientAge) && (
          <div
            className="mb-3"
            style={{
              marginBottom: "12px",
              fontFamily: "var(--font-outfit), 'Inter', sans-serif",
            }}
          >
            <div
              className="flex justify-center gap-4 text-sm"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                fontSize: "14px",
                fontFamily: "var(--font-outfit), 'Inter', sans-serif",
              }}
            >
              {patientName && (
                <p
                  className="text-gray-700 font-medium"
                  style={{
                    fontFamily: "var(--font-outfit), 'Inter', sans-serif",
                    fontWeight: "500",
                  }}
                >
                  Name: {patientName}
                </p>
              )}
              {patientAge && (
                <p
                  className="text-gray-700 font-medium"
                  style={{
                    fontFamily: "var(--font-outfit), 'Inter', sans-serif",
                    fontWeight: "500",
                  }}
                >
                  Age: {patientAge}
                </p>
              )}
            </div>
          </div>
        )}
        <div
          className="flex justify-between items-center"
          style={{
            paddingTop: "8px",
            fontFamily: "var(--font-outfit), 'Inter', sans-serif",
          }}
        >
          <div className="text-left">
            <p
              className="text-xs text-gray-500"
              style={{
                fontSize: "12px",
                fontFamily: "var(--font-outfit), 'Inter', sans-serif",
              }}
            >
              Date: {date}
            </p>
          </div>
          <div className="text-right">
            <p
              className="font-semibold text-gray-900 text-base"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                fontFamily: "var(--font-outfit), 'Inter', sans-serif",
              }}
            >
              {doctorName}
            </p>
            <p
              className="text-xs text-gray-600"
              style={{
                fontSize: "12px",
                fontFamily: "var(--font-outfit), 'Inter', sans-serif",
              }}
            >
              Orthopedic Specialist
            </p>
          </div>
        </div>
      </div>

      {/* Prescription Medicines */}
      <div
        className="mb-6 flex-1 relative"
        style={{
          marginBottom: "24px",
          fontFamily: "var(--font-outfit), 'Inter', sans-serif",
          zIndex: 5,
          position: "relative",
        }}
      >
        <h2
          className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "16px",
            paddingBottom: "8px",
            fontFamily: "var(--font-outfit), 'Inter', sans-serif",
          }}
        >
          Prescription
        </h2>
        <div
          className="space-y-4"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            fontFamily: "var(--font-outfit), 'Inter', sans-serif",
          }}
        >
          {medicines.length === 0 ? (
            <p
              className="text-gray-500 italic text-center py-8"
              style={{
                paddingTop: "32px",
                paddingBottom: "32px",
                fontFamily: "var(--font-outfit), 'Inter', sans-serif",
              }}
            >
              No medicines added
            </p>
          ) : (
            medicines.map((medicine, index) => (
              <div
                key={medicine.id}
                className="border-b border-gray-200"
                style={{
                  paddingBottom: "12px",
                  borderBottom: "1px solid #e5e7eb",
                  fontFamily: "var(--font-outfit), 'Inter', sans-serif",
                }}
              >
                <div
                  className="flex items-start gap-4"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    fontFamily: "var(--font-outfit), 'Inter', sans-serif",
                  }}
                >
                  <span
                    className="font-semibold text-gray-700"
                    style={{
                      minWidth: "30px",
                      fontSize: "16px",
                      fontWeight: "600",
                      fontFamily: "var(--font-outfit), 'Inter', sans-serif",
                    }}
                  >
                    {index + 1}.
                  </span>
                  <div
                    className="flex-1"
                    style={{
                      flex: "1",
                      fontFamily: "var(--font-outfit), 'Inter', sans-serif",
                    }}
                  >
                    <p
                      className="font-semibold text-gray-900 text-lg mb-1"
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "4px",
                        fontFamily: "var(--font-outfit), 'Inter', sans-serif",
                      }}
                    >
                      {medicine.saltName}
                    </p>
                    {(medicine.dosage || medicine.frequency || medicine.duration || medicine.instructions) && (
                      <div
                        className="mt-1 text-sm text-gray-700 space-y-1"
                        style={{
                          marginTop: "4px",
                          fontSize: "14px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          fontFamily: "var(--font-outfit), 'Inter', sans-serif",
                        }}
                      >
                        {medicine.dosage && (
                          <p style={{ fontFamily: "var(--font-outfit), 'Inter', sans-serif" }}>Dosage: {medicine.dosage}</p>
                        )}
                        {medicine.frequency && (
                          <p style={{ fontFamily: "var(--font-outfit), 'Inter', sans-serif" }}>Frequency: {medicine.frequency}</p>
                        )}
                        {medicine.duration && (
                          <p style={{ fontFamily: "var(--font-outfit), 'Inter', sans-serif" }}>Duration: {medicine.duration}</p>
                        )}
                        {medicine.instructions && (
                          <p
                            className="italic text-gray-600"
                            style={{
                              fontStyle: "italic",
                              fontFamily: "var(--font-outfit), 'Inter', sans-serif",
                            }}
                          >
                            {medicine.instructions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

