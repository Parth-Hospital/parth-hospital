"use client"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function ReportsPage() {
  return (
    <AdminLayout role="accountant">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Financial Reports</h2>
          <p className="text-muted-foreground">Generate and download financial reports</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Salary Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Generate monthly salary summary</p>
              <Button>
                <Download size={16} className="mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Annual Financial Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Generate annual financial summary</p>
              <Button>
                <Download size={16} className="mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

