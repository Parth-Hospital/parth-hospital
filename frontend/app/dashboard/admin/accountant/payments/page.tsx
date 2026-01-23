"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download, CreditCard, Loader2 } from "lucide-react"
import { paymentApi, Payment, PaymentStats } from "@/lib/api/payment"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadPayments()
    loadStats()
  }, [])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const data = await paymentApi.getPayments()
      setPayments(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load payments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await paymentApi.getPaymentStats()
      setStats(data)
    } catch (error: any) {
      console.error("Failed to load payment stats:", error)
    }
  }

  const handleExport = () => {
    try {
      // Filter payments based on search query
      const filteredPayments = payments.filter(
        (payment) =>
          payment.appointment.patientName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.razorpayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.razorpayOrderId?.toLowerCase().includes(searchQuery.toLowerCase())
      )

      // Create CSV content
      const headers = [
        "Transaction ID",
        "Razorpay Order ID",
        "Razorpay Payment ID",
        "Patient Name",
        "Patient Phone",
        "Amount (₹)",
        "Status",
        "Payment Method",
        "Appointment Type",
        "Date & Time",
      ]

      const rows = filteredPayments.map((payment) => [
        payment.id,
        payment.razorpayOrderId || "N/A",
        payment.razorpayPaymentId || "N/A",
        payment.appointment.patientName,
        payment.appointment.patientPhone,
        payment.amount.toFixed(2),
        payment.status,
        payment.method,
        payment.appointment.appointmentType,
        format(new Date(payment.createdAt), "dd/MM/yyyy HH:mm:ss"),
      ])

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n")

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute(
        "download",
        `payments_${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}.csv`
      )
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: `Exported ${filteredPayments.length} payment(s) to CSV`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export payments",
        variant: "destructive",
      })
    }
  }

  const filteredPayments = payments.filter(
    (payment) =>
      payment.appointment.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.razorpayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.razorpayOrderId?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <AdminLayout role="accountant">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Online Payments</h2>
          <p className="text-muted-foreground">
            View and manage Razorpay online payments from appointment bookings
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(stats.today.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.today.count} transaction{stats.today.count !== 1 ? "s" : ""}
                  </p>
                </>
              ) : (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <>
                  <p className="text-3xl font-bold text-secondary">
                    {formatCurrency(stats.thisMonth.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.thisMonth.count} transaction{stats.thisMonth.count !== 1 ? "s" : ""}
                  </p>
                </>
              ) : (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <>
                  <p className="text-3xl font-bold text-accent">
                    {formatCurrency(stats.pending.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.pending.count} transaction{stats.pending.count !== 1 ? "s" : ""}
                  </p>
                </>
              ) : (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.successRate}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
                </>
              ) : (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, transaction ID..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-background">
                    <tr>
                      <th className="p-4 text-left font-semibold">Transaction ID</th>
                      <th className="p-4 text-left font-semibold">Patient Name</th>
                      <th className="p-4 text-left font-semibold">Amount</th>
                      <th className="p-4 text-left font-semibold">Date & Time</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-left font-semibold">Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No payments found
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-border hover:bg-background/50"
                        >
                          <td className="p-4 font-mono text-xs">
                            {payment.razorpayPaymentId || payment.id.slice(0, 12)}
                          </td>
                          <td className="p-4 font-medium">
                            {payment.appointment.patientName}
                          </td>
                          <td className="p-4 font-semibold">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {format(new Date(payment.createdAt), "dd/MM/yyyy HH:mm")}
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                payment.status === "SUCCESS"
                                  ? "bg-green-600"
                                  : payment.status === "PENDING"
                                    ? "bg-yellow-600"
                                    : "bg-red-600"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <CreditCard size={14} />
                              <span className="text-xs">
                                {payment.method === "ONLINE" ? "Online" : "Pay at Counter"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
