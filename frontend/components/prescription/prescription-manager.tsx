"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Plus, X, Printer } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { searchMedicines, MedicineSalt } from "@/lib/data/medicines"
import { PrescriptionTemplate } from "./prescription-template"

interface PrescriptionItem {
  id: string
  saltName: string
  dosage?: string
  frequency?: string
  duration?: string
  instructions?: string
}

export function PrescriptionManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<MedicineSalt[]>([])
  const [medicines, setMedicines] = useState<PrescriptionItem[]>([])
  const [patientName, setPatientName] = useState("")
  const [patientAge, setPatientAge] = useState("")
  const [doctorName, setDoctorName] = useState("Dr. Subash Singh")
  const printAreaRef = useRef<HTMLDivElement>(null)

  // Handle responsive scaling for prescription preview
  useEffect(() => {
    const updateScale = () => {
      if (printAreaRef.current) {
        const isMobile = window.innerWidth < 640
        if (isMobile) {
          printAreaRef.current.style.transform = "scale(0.5)"
          printAreaRef.current.style.transformOrigin = "top left"
        } else {
          printAreaRef.current.style.transform = "scale(1)"
          printAreaRef.current.style.transformOrigin = "center"
        }
      }
    }

    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim().length >= 1) {
      const results = searchMedicines(query)
      setSearchResults(results.slice(0, 5)) // Show top 5 results
    } else {
      setSearchResults([])
    }
  }

  // Add medicine to prescription
  const handleAddMedicine = (medicine: MedicineSalt) => {
    const newMedicine: PrescriptionItem = {
      id: medicine.id,
      saltName: medicine.saltName,
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    }
    setMedicines([...medicines, newMedicine])
    setSearchQuery("")
    setSearchResults([])
  }

  // Remove medicine from prescription
  const handleRemoveMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id))
  }

  // Update medicine details
  const handleUpdateMedicine = (id: string, field: keyof PrescriptionItem, value: string) => {
    setMedicines(
      medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  // Handle print directly without opening new tab
  const handlePrint = () => {
    if (!printAreaRef.current) return

    // Reset transform for printing
    const originalTransform = printAreaRef.current.style.transform
    const originalTransformOrigin = printAreaRef.current.style.transformOrigin
    printAreaRef.current.style.transform = "none"
    printAreaRef.current.style.transformOrigin = "center"

    // Ensure images are loaded before printing
    const logoImg = printAreaRef.current.querySelector('img[alt="Parth Hospital Logo"]') as HTMLImageElement
    const watermarkImg = printAreaRef.current.querySelector('img[alt="Parth Hospital Watermark"]') as HTMLImageElement
    
    const imagesToLoad = []
    if (logoImg && !logoImg.complete) imagesToLoad.push(new Promise(resolve => { logoImg.onload = resolve; logoImg.onerror = resolve }))
    if (watermarkImg && !watermarkImg.complete) imagesToLoad.push(new Promise(resolve => { watermarkImg.onload = resolve; watermarkImg.onerror = resolve }))

    // Scroll to top to ensure we start from the beginning
    printAreaRef.current.scrollIntoView({ behavior: "instant", block: "start" })
    window.scrollTo(0, 0)

    // Wait for images to load, then proceed with print
    Promise.all(imagesToLoad).then(() => {
      // Create a style element with print-specific CSS
      const printStyle = document.createElement("style")
      printStyle.id = "prescription-print-style"
    printStyle.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        @page :first {
          size: A4;
          margin: 0;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 210mm !important;
          height: 297mm !important;
          position: relative !important;
          overflow: hidden !important;
          page-break-after: avoid !important;
        }
        * {
          visibility: hidden;
        }
        #prescription-print-area,
        #prescription-print-area * {
          visibility: visible;
        }
        #prescription-print-area {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          right: auto !important;
          bottom: auto !important;
          transform: none !important;
          width: 210mm !important;
          height: 297mm !important;
          min-height: 297mm !important;
          max-height: 297mm !important;
          padding: 20mm !important;
          margin: 0 !important;
          border: 2px solid #000 !important;
          border-radius: 0 !important;
          background: white !important;
          font-family: var(--font-outfit), 'Inter', sans-serif !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
          display: block !important;
          page-break-before: avoid !important;
        }
        #prescription-print-area img[alt="Parth Hospital Logo"] {
          position: absolute !important;
          top: 10mm !important;
          left: 10mm !important;
          height: 30mm !important;
          width: auto !important;
          max-width: 60mm !important;
          z-index: 10 !important;
          display: block !important;
        }
        #prescription-print-area img[alt="Parth Hospital Watermark"] {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          height: 150mm !important;
          width: auto !important;
          max-width: 180mm !important;
          opacity: 0.08 !important;
          z-index: 1 !important;
          pointer-events: none !important;
          display: block !important;
        }
        #prescription-print-area > div {
          position: relative !important;
          z-index: 5 !important;
        }
        #prescription-print-area > div:first-of-type {
          padding-top: 8mm !important;
          margin-top: 0 !important;
        }
        #prescription-print-area * {
          font-family: var(--font-outfit), 'Inter', sans-serif !important;
        }
      }
    `
    
    // Remove existing print style if any
    const existingStyle = document.getElementById("prescription-print-style")
    if (existingStyle) {
      document.head.removeChild(existingStyle)
    }
    
    document.head.appendChild(printStyle)

      // Small delay to ensure styles are applied
      setTimeout(() => {
        // Trigger print
        window.print()

        // Restore original transform and remove style after printing
        setTimeout(() => {
          if (printAreaRef.current) {
            printAreaRef.current.style.transform = originalTransform
            printAreaRef.current.style.transformOrigin = originalTransformOrigin
          }
          const styleToRemove = document.getElementById("prescription-print-style")
          if (styleToRemove) {
            document.head.removeChild(styleToRemove)
          }
        }, 1000)
      }, 100)
    }).catch(() => {
      // If images fail to load, proceed anyway
      const printStyle = document.createElement("style")
      printStyle.id = "prescription-print-style"
      printStyle.textContent = `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          @page :first {
            size: A4;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            position: relative !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
          }
          * {
            visibility: hidden;
          }
          #prescription-print-area,
          #prescription-print-area * {
            visibility: visible;
          }
          #prescription-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            right: auto !important;
            bottom: auto !important;
            transform: none !important;
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            padding: 20mm !important;
            margin: 0 !important;
            border: 2px solid #000 !important;
            border-radius: 0 !important;
            background: white !important;
            font-family: var(--font-outfit), 'Inter', sans-serif !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            display: block !important;
            page-break-before: avoid !important;
          }
          #prescription-print-area img[alt="Parth Hospital Logo"] {
            position: absolute !important;
            top: 10mm !important;
            left: 10mm !important;
            height: 30mm !important;
            width: auto !important;
            max-width: 60mm !important;
            z-index: 10 !important;
            display: block !important;
          }
          #prescription-print-area img[alt="Parth Hospital Watermark"] {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            height: 150mm !important;
            width: auto !important;
            max-width: 180mm !important;
            opacity: 0.08 !important;
            z-index: 1 !important;
            pointer-events: none !important;
            display: block !important;
          }
          #prescription-print-area > div {
            position: relative !important;
            z-index: 5 !important;
          }
          #prescription-print-area > div:first-of-type {
            padding-top: 8mm !important;
            margin-top: 0 !important;
          }
          #prescription-print-area * {
            font-family: var(--font-outfit), 'Inter', sans-serif !important;
          }
        }
      `
      const existingStyle = document.getElementById("prescription-print-style")
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
      document.head.appendChild(printStyle)
      setTimeout(() => {
        window.print()
        setTimeout(() => {
          // Restore original transform and remove style after printing
          if (printAreaRef.current) {
            printAreaRef.current.style.transform = originalTransform
            printAreaRef.current.style.transformOrigin = originalTransformOrigin
          }
          const styleToRemove = document.getElementById("prescription-print-style")
          if (styleToRemove) {
            document.head.removeChild(styleToRemove)
          }
        }, 1000)
      }, 100)
    })
  }

  // Clear prescription
  const handleClear = () => {
    setMedicines([])
    setPatientName("")
    setPatientAge("")
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Doctor Name</label>
              <Input
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Enter doctor name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Patient Name (Optional)</label>
              <Input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Age (Optional)</label>
              <Input
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="Enter age"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicine Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add Medicine (Salt Name)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type salt name or short form (e.g., 'par' for Paracetamol)"
                className="pl-10 pr-4"
                autoFocus
              />
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((medicine) => (
                  <button
                    key={medicine.id}
                    onClick={() => handleAddMedicine(medicine)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{medicine.saltName}</p>
                        {medicine.commonName && (
                          <p className="text-xs text-gray-500">{medicine.commonName}</p>
                        )}
                      </div>
                      <Badge variant="outline" >
                        {medicine.shortForm}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Tips */}
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Type short forms (e.g., "par", "ibu", "amx") for faster search
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Added Medicines List */}
      {medicines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Prescription Medicines ({medicines.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicines.map((medicine, index) => (
                <div key={medicine.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base sm:text-lg text-gray-900 wrap-break-word">
                        {index + 1}. {medicine.saltName}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedicine(medicine.id)}
                      className="text-red-600 hover:text-red-700 shrink-0"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Dosage (Optional)</label>
                      <Input
                        value={medicine.dosage}
                        onChange={(e) => handleUpdateMedicine(medicine.id, "dosage", e.target.value)}
                        placeholder="e.g., 500mg"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Frequency (Optional)</label>
                      <Input
                        value={medicine.frequency}
                        onChange={(e) => handleUpdateMedicine(medicine.id, "frequency", e.target.value)}
                        placeholder="e.g., Twice daily"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Duration (Optional)</label>
                      <Input
                        value={medicine.duration}
                        onChange={(e) => handleUpdateMedicine(medicine.id, "duration", e.target.value)}
                        placeholder="e.g., 5 days"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Instructions (Optional)</label>
                      <Input
                        value={medicine.instructions}
                        onChange={(e) => handleUpdateMedicine(medicine.id, "instructions", e.target.value)}
                        placeholder="e.g., After meals"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prescription Preview & Print */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <CardTitle className="text-lg sm:text-xl">Prescription Preview</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handleClear} 
                disabled={medicines.length === 0}
                className="w-full sm:w-auto"
              >
                Clear
              </Button>
              <Button 
                onClick={handlePrint} 
                disabled={medicines.length === 0}
                className="w-full sm:w-auto"
              >
                <Printer size={16} className="mr-2" />
                Print Prescription
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <div 
              ref={printAreaRef} 
              className="bg-white w-full max-w-full sm:w-auto sm:max-w-none" 
              id="prescription-print-area"
              style={{
                width: "210mm",
                minHeight: "297mm",
              }}
            >
              <PrescriptionTemplate
                medicines={medicines}
                patientName={patientName}
                patientAge={patientAge}
                doctorName={doctorName}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center sm:hidden">
            💡 Scroll horizontally to view full prescription. Print will be full size.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

