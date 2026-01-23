"use client"

import { EmployeeLayout } from "@/components/layouts/employee-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, FileText, Calendar } from "lucide-react"

// Current month salary breakdown
const currentSalary = {
  baseSalary: 30000,
  allowances: 5000,
  bonus: 2000,
  deductions: 2000,
  netSalary: 35000,
}

// Salary history
const salaryHistory = [
  { month: "Jan 2024", amount: 35000, status: "Paid" },
  { month: "Dec 2023", amount: 35000, status: "Paid" },
  { month: "Nov 2023", amount: 35000, status: "Paid" },
  { month: "Oct 2023", amount: 32000, status: "Paid" },
  { month: "Sep 2023", amount: 35000, status: "Paid" },
  { month: "Aug 2023", amount: 35000, status: "Paid" },
]

export default function EmployeeSalary() {
  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Salary Details</h2>
          <p className="text-muted-foreground">View your salary breakdown and payment history</p>
        </div>

        {/* Current Month Salary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Current Month Salary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-background rounded">
                <span className="text-muted-foreground">Base Salary</span>
                <span className="font-semibold">₹{currentSalary.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded">
                <span className="text-muted-foreground">Allowances</span>
                <span className="font-semibold text-green-600">+₹{currentSalary.allowances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded">
                <span className="text-muted-foreground">Bonus</span>
                <span className="font-semibold text-green-600">+₹{currentSalary.bonus.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded">
                <span className="text-muted-foreground">Deductions</span>
                <span className="font-semibold text-destructive">-₹{Math.abs(currentSalary.deductions).toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold bg-primary/5 p-3 rounded">
                <span>Net Salary</span>
                <span className="text-primary text-lg">₹{currentSalary.netSalary.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Salary History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="p-4 text-left font-semibold">Month</th>
                    <th className="p-4 text-left font-semibold">Amount</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryHistory.map((salary, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{salary.month}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">₹{salary.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge className="bg-green-600">{salary.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </EmployeeLayout>
  )
}

