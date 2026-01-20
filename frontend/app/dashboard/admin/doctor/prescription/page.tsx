"use client"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { PrescriptionManager } from "@/components/prescription/prescription-manager"

export default function PrescriptionPage() {
  return (
    <AdminLayout role="doctor">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Prescription Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Create and print prescriptions with medicine salt names</p>
        </div>
        <PrescriptionManager />
      </div>
    </AdminLayout>
  )
}

