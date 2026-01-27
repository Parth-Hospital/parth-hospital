"use client";

interface PrescriptionItem {
  id: string;
  saltName: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

interface PrescriptionTemplateProps {
  date?: string;
  medicines: PrescriptionItem[];
  doctorName?: string;
  patientName?: string;
  patientAge?: string;
  hospitalName?: string;
  hospitalAddress?: string;
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
  // medicines per page
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(medicines.length / ITEMS_PER_PAGE) || 1;

  return (
    <div className="print-container">
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const currentMedicines = medicines.slice(
          pageIndex * ITEMS_PER_PAGE,
          (pageIndex + 1) * ITEMS_PER_PAGE,
        );

        return (
          <div
            key={pageIndex}
            className="bg-white relative mx-auto print:border-0 mb-8 last:mb-0 box-border"
            style={{
              width: "210mm",
              height: "297mm",
              padding: "20mm",
              position: "relative",
              overflow: "hidden",
              pageBreakAfter: pageIndex < totalPages - 1 ? "always" : "auto",
              fontFamily: "var(--font-outfit), 'Inter', sans-serif",
              border: "2px solid #e5e7eb", // Visible in preview
            }}
          >
            {/* Watermark - Centered on every page */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 0,
                pointerEvents: "none",
              }}
            >
              <img
                src="/Logo/parth-logo.png"
                alt="Parth Hospital Watermark"
                style={{
                  height: "150mm",
                  width: "auto",
                  opacity: 0.08,
                }}
              />
            </div>

            {/* Header Section */}
            {/* Header Section */}
            <div className="relative z-10 border-b-2 border-gray-800 pb-4 mb-6">
              {/* Top Row: Logo - Title - Spacer */}
              <div
                className="flex items-start justify-between"
                style={{ minHeight: "35mm" }}
              >
                {/* Left: Logo (Moved Upward) */}
                <div
                  className="shrink-0"
                  style={{ width: "35mm", marginTop: "-5mm" }}
                >
                  <img
                    src="/Logo/parth-logo.png"
                    alt="Parth Hospital Logo"
                    style={{
                      height: "30mm",
                      width: "auto",
                    }}
                  />
                </div>

                {/* Center: Hospital Info */}
                <div className="flex-1 text-center mt-2">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 font-heading">
                    {hospitalName}
                  </h1>
                  <p className="text-gray-600 font-medium">{hospitalAddress}</p>
                </div>

                {/* Right: Invisible Spacer for Centering */}
                <div className="shrink-0 invisible" style={{ width: "35mm" }}>
                  {/* Visual balance for logo */}
                </div>
              </div>

              {/* Bottom Row: Date & Doctor (Full Width, Extreme Edges) */}
              <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Date:</span> {date}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">
                    {doctorName}
                  </p>
                  <p className="text-sm text-gray-600">Orthopedic Specialist</p>
                </div>
              </div>
            </div>

            {/* Patient Info Row */}
            {(patientName || patientAge) && (
              <div className="relative z-10 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100 flex gap-8 justify-center">
                {patientName && (
                  <p className="font-medium text-gray-800">
                    <span className="text-gray-500 mr-2">Patient Name:</span>
                    {patientName}
                  </p>
                )}
                {patientAge && (
                  <p className="font-medium text-gray-800">
                    <span className="text-gray-500 mr-2">Age:</span>
                    {patientAge}
                  </p>
                )}
              </div>
            )}

            {/* Medicines List */}
            <div className="relative z-10 flex-1">
              {/* <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <span></span>
                <span className="text-sm font-normal text-gray-500 ml-auto">
                  Page {pageIndex + 1} of {totalPages}
                </span>
              </h2> */}

              <div className="space-y-0">
                {currentMedicines.length === 0 ? (
                  <p className="text-gray-400 italic text-center py-12">
                    No medicines added
                  </p>
                ) : (
                  currentMedicines.map((medicine, index) => {
                    const globalIndex = pageIndex * ITEMS_PER_PAGE + index + 1;
                    return (
                      <div
                        key={medicine.id}
                        className="py-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 text-lg">
                                {globalIndex}. {medicine.saltName}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1 font-medium">
                              {[
                                medicine.dosage,
                                medicine.frequency,
                                medicine.duration,
                              ]
                                .filter(Boolean)
                                .join("  •  ")}
                            </div>
                          </div>
                        </div>
                        {medicine.instructions && (
                          <p className="text-sm text-gray-500 mt-1 italic pl-5">
                            Note: {medicine.instructions}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer Signatures (Only on last page) */}
            {pageIndex === totalPages - 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "20mm",
                  right: "20mm",
                  textAlign: "center",
                  zIndex: 10,
                }}
              >
                {/* Placeholder for Signature */}
                <div
                  style={{ height: "16mm", width: "32mm", marginBottom: "8px" }}
                ></div>
                <p
                  style={{
                    borderTop: "1px solid #111827", // gray-900
                    paddingTop: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Doctor's Signature
                </p>
              </div>
            )}

            {/* Page Footer */}
            <div
              style={{
                position: "absolute",
                bottom: "4mm",
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: 10,
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "#9ca3af", // gray-400
                }}
              >
                Not valid for medico-legal purposes. | {hospitalAddress}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
