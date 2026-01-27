"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, Plus, X, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchMedicines, MedicineSalt } from "@/lib/data/medicines";
import { PrescriptionTemplate } from "./prescription-template";

interface PrescriptionItem {
  id: string;
  saltName: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export function PrescriptionManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MedicineSalt[]>([]);
  const [medicines, setMedicines] = useState<PrescriptionItem[]>([]);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Subash Singh");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle responsive scaling for prescription preview
  useEffect(() => {
    const calculateScale = () => {
      if (printAreaRef.current && printAreaRef.current.parentElement) {
        const containerWidth = printAreaRef.current.parentElement.clientWidth;
        // A4 width in pixels (approx 794px at 96 DPI)
        // We add some buffer for padding/margins
        const a4WidthPx = 794;
        const padding = 32; // 16px padding on each side

        let scale = 1;

        // Calculate scale to fit container
        if (containerWidth < a4WidthPx + padding) {
          scale = (containerWidth - padding) / a4WidthPx;
        }

        // Apply scale
        printAreaRef.current.style.transform = `scale(${scale})`;
        printAreaRef.current.style.transformOrigin = "top left";

        // Adjust height of the container to match scaled content
        // This prevents excessive whitespace below the scaled preview
        // A4 height is approx 1123px
        const ITEMS_PER_PAGE = 10;
        const totalPages = Math.ceil(medicines.length / ITEMS_PER_PAGE) || 1;
        const a4HeightPx = 1123 * totalPages;
        const scaledHeight = a4HeightPx * scale;
        printAreaRef.current.parentElement.style.height = `${scaledHeight + padding}px`;
      }
    };

    // Initial calculation
    calculateScale();

    // Watch for container resizes
    const observer = new ResizeObserver(() => {
      calculateScale();
    });

    if (printAreaRef.current?.parentElement) {
      observer.observe(printAreaRef.current.parentElement);
    }

    return () => observer.disconnect();
  }, [medicines.length]);

  // Handle print using Portal strategy
  const handlePrint = useCallback(() => {
    // Create print styles
    const printStyle = document.createElement("style");
    printStyle.id = "prescription-print-style";
    printStyle.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
        /* Hide everything else to prevent blank pages */
        body > *:not(#print-portal-root) {
          display: none !important;
        }
        /* The portal wrapper */
        #print-portal-root {
          display: block !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 210mm !important;
          /* Height auto to allow multi-page flow */
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          z-index: 99999 !important;
        }
      }
    `;

    // Remove existing if any
    const existingStyle = document.getElementById("prescription-print-style");
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    document.head.appendChild(printStyle);

    // Print
    window.print();

    // Cleanup style after print dialog closes (timeout)
    // We keep it briefly to ensure print preview captures it
    setTimeout(() => {
      const styleToRemove = document.getElementById("prescription-print-style");
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    }, 1000);
  }, []);

  // Handle Ctrl+Shift+P shortcut for printing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        if (medicines.length > 0) {
          handlePrint();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [medicines, handlePrint]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedIndex(-1); // Reset selection when search changes
    if (query.trim().length >= 1) {
      const results = searchMedicines(query);
      setSearchResults(results.slice(0, 5)); // Show top 5 results
    } else {
      setSearchResults([]);
    }
  };

  // Add medicine to prescription
  const handleAddMedicine = (medicine: MedicineSalt) => {
    const newMedicine: PrescriptionItem = {
      id: medicine.id,
      saltName: medicine.saltName,
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    };
    setMedicines([...medicines, newMedicine]);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedIndex(-1);
    // Refocus search input after adding medicine
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  // Remove medicine from prescription
  const handleRemoveMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  // Update medicine details
  const handleUpdateMedicine = (
    id: string,
    field: keyof PrescriptionItem,
    value: string,
  ) => {
    setMedicines(
      medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  // Handle keyboard navigation in search dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = prev < searchResults.length - 1 ? prev + 1 : prev;
          // Scroll into view
          if (dropdownRef.current && nextIndex >= 0) {
            const item = dropdownRef.current.children[nextIndex] as HTMLElement;
            item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
          }
          return nextIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : -1;
          // Scroll into view
          if (dropdownRef.current && nextIndex >= 0) {
            const item = dropdownRef.current.children[nextIndex] as HTMLElement;
            item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
          }
          return nextIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleAddMedicine(searchResults[selectedIndex]);
        } else if (searchResults.length > 0) {
          // If nothing selected, select first item
          handleAddMedicine(searchResults[0]);
        }
        break;
      case "Escape":
        setSearchResults([]);
        setSelectedIndex(-1);
        break;
    }
  };

  // Clear prescription
  const handleClear = () => {
    setMedicines([]);
    setPatientName("");
    setPatientAge("");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Left Column: Inputs & List */}
      <div className="space-y-4 sm:space-y-6">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Doctor Name
                </label>
                <Input
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Enter doctor name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Patient Name (Optional)
                </label>
                <Input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Age (Optional)
                </label>
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
            <CardTitle className="text-lg sm:text-xl">
              Add Medicine (Salt Name)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type salt name, short form, common name, or company name (e.g., 'par', 'Cipla')"
                  className="pl-10 pr-4"
                  autoFocus
                />
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {searchResults.map((medicine, index) => (
                    <button
                      key={medicine.id}
                      onClick={() => handleAddMedicine(medicine)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                        index === selectedIndex
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {medicine.saltName}
                          </p>
                          {medicine.commonName && (
                            <p className="text-xs text-gray-500">
                              {medicine.commonName}
                            </p>
                          )}
                          {medicine.companyName && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Companies: {medicine.companyName}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">{medicine.shortForm}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Tips */}
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use arrow keys to navigate, Enter to select. Search by
                salt name, short form, common name, or company name. Press
                Ctrl+Shift+P to print.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Added Medicines List */}
        {medicines.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Prescription Medicines ({medicines.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicines.map((medicine, index) => (
                  <div
                    key={medicine.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4"
                  >
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
                        <label className="text-xs text-gray-600 mb-1 block">
                          Dosage (Optional)
                        </label>
                        <Input
                          value={medicine.dosage}
                          onChange={(e) =>
                            handleUpdateMedicine(
                              medicine.id,
                              "dosage",
                              e.target.value,
                            )
                          }
                          placeholder="e.g., 500mg"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">
                          Frequency (Optional)
                        </label>
                        <Input
                          value={medicine.frequency}
                          onChange={(e) =>
                            handleUpdateMedicine(
                              medicine.id,
                              "frequency",
                              e.target.value,
                            )
                          }
                          placeholder="e.g., Twice daily"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">
                          Duration (Optional)
                        </label>
                        <Input
                          value={medicine.duration}
                          onChange={(e) =>
                            handleUpdateMedicine(
                              medicine.id,
                              "duration",
                              e.target.value,
                            )
                          }
                          placeholder="e.g., 5 days"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">
                          Instructions (Optional)
                        </label>
                        <Input
                          value={medicine.instructions}
                          onChange={(e) =>
                            handleUpdateMedicine(
                              medicine.id,
                              "instructions",
                              e.target.value,
                            )
                          }
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
      </div>

      {/* Right Column: Preview (Sticky) */}
      <div
        className="lg:sticky lg:top-6 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar pr-2"
        style={{ maxHeight: "calc(100vh - 3rem)" }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <CardTitle className="text-lg sm:text-xl">
                Prescription Preview
              </CardTitle>
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
            {/* Container for the preview that determines available width */}
            <div className="flex justify-center lg:justify-start -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="w-full relative">
                <div
                  ref={printAreaRef}
                  className="bg-white shadow-sm"
                  id="prescription-print-area"
                  style={{
                    width: "210mm",
                    minHeight: "297mm",
                    // Ensure it doesn't default to full width of parent if that's smaller
                    // We want it to be exactly A4 size consistently for the transform to work right
                    flexShrink: 0,
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
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center sm:hidden">
              💡 Scroll horizontally to view full prescription. Print will be
              full size.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Portal for Print */}
      {mounted &&
        createPortal(
          <div id="print-portal-root" className="hidden print:block">
            <PrescriptionTemplate
              medicines={medicines}
              patientName={patientName}
              patientAge={patientAge}
              doctorName={doctorName}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
