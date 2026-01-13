"use client"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { PrescriptionManager } from "@/components/prescription/prescription-manager"

export default function PrescriptionPage() {
  return (
    <AdminLayout role="owner">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Prescription Management</h2>
          <p className="text-muted-foreground">Create and print prescriptions with medicine salt names</p>
        </div>
        <PrescriptionManager />
      </div>
    </AdminLayout>
  )
}

