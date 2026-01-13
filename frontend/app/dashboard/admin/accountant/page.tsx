"use client"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DollarSign, FileUp, TrendingUp, AlertCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Sample financial data
const salaryData = [
  { month: "Jan", paid: 700000, pending: 0 },
  { month: "Feb", paid: 700000, pending: 0 },
  { month: "Mar", paid: 700000, pending: 0 },
  { month: "Apr", paid: 700000, pending: 50000 },
  { month: "May", paid: 700000, pending: 0 },
  { month: "Jun", paid: 700000, pending: 0 },
]

const departmentPayroll = [
  { department: "Orthopedics", amount: 280000 },
  { department: "Nursing", amount: 180000 },
  { department: "Admin", amount: 120000 },
  { department: "Pharmacy", amount: 80000 },
  { department: "Reception", amount: 60000 },
]

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
                    <AlertCircle size={16} /> Pending Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-accent">₹0</p>
                  <p className="text-xs text-muted-foreground mt-2">All cleared</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Charts */}
          <Tabs defaultValue="trends" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trends">Payment Trends</TabsTrigger>
              <TabsTrigger value="department">Department Payroll</TabsTrigger>
            </TabsList>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Salary & Payment Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salaryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="paid" stroke="#10b981" strokeWidth={2} name="Paid" />
                      <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="department">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentPayroll}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      <Bar dataKey="amount" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
    </AdminLayout>
  )
}
