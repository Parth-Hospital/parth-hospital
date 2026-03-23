"use client"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, FileUp, TrendingUp, AlertCircle } from "lucide-react"

export default function AccountantDashboard() {
  return (
    <AdminLayout role="accountant">
          {/* Summary */}
          <section>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <DollarSign size={16} /> Total Payroll (This Month)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">₹7,00,000</p>
                  <p className="text-xs text-muted-foreground mt-2">20 employees</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <TrendingUp size={16} /> Amount Paid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-secondary">₹7,00,000</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge className="bg-green-600">100% Paid</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <AlertCircle size={16} /> Total Online Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-accent">₹50,000</p>
                  <p className="text-xs text-muted-foreground mt-2"> online payment</p>
                </CardContent>
              </Card>
            </div>
          </section>

    </AdminLayout>
  )
}
