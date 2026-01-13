"use client"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PaymentsPage() {
  return (
    <AdminLayout role="receptionist">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Payment Management</h2>
          <p className="text-muted-foreground">Mark payment status for patients (on-site or at counter)</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Patient Payment Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="token">Patient Token</Label>
                <Input id="token" type="text" placeholder="Enter token #" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="₹" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="payment-mode">Payment Mode</Label>
                <Select>
                  <SelectTrigger id="payment-mode" className="mt-1">
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Mark Payment Complete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

