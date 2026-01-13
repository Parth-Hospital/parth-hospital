"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, DollarSign, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { analyticsApi } from "@/lib/api/analytics"
import { useToast } from "@/hooks/use-toast"

export default function OwnerDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await analyticsApi.getOwnerDashboardStats()
      setStats(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard stats",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Transform monthly trends for chart
  const appointmentData = stats?.monthlyTrends
    ? (() => {
        const monthMap: Record<string, { general: number; priority: number }> = {}
        stats.monthlyTrends.forEach((trend: any) => {
          const month = new Date().toLocaleDateString("en-US", { month: "short" })
          if (!monthMap[month]) {
            monthMap[month] = { general: 0, priority: 0 }
          }
          if (trend.appointmentType === "GENERAL") {
            monthMap[month].general = trend._count
          } else if (trend.appointmentType === "PRIORITY") {
            monthMap[month].priority = trend._count
          }
        })
        return Object.entries(monthMap).map(([month, data]) => ({ month, ...data }))
      })()
    : []

  const dailyAppointmentData = stats?.today
    ? [
        { name: "General", value: stats.today.generalAppointments, color: "#0ea5e9" },
        { name: "Priority", value: stats.today.priorityAppointments, color: "#ef4444" },
      ]
    : []

  return (
    <AdminLayout role="owner">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor hospital operations and performance</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Today's Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Calendar size={16} /> General Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      {stats?.today?.generalAppointments || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Today</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <AlertCircle size={16} /> Priority Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-red-600">
                      {stats?.today?.priorityAppointments || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Today</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Users size={16} /> Staff Present
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-secondary">
                      {stats?.today?.staffPresent || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Today</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <DollarSign size={16} /> Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-accent">
                      ₹{stats?.today?.revenue?.toLocaleString() || "0"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Today</p>
                  </CardContent>
                </Card>
              </div>
            </section>

          {/* Charts Section */}
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList>
              <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
              <TabsTrigger value="appointments">Monthly Appointments</TabsTrigger>
              <TabsTrigger value="status">Daily Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    Revenue tracking will be available after payment integration
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Appointments Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointmentData.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                      <ResponsiveContainer width="100%" minHeight={250} height={300}>
                        <BarChart data={appointmentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Bar dataKey="general" fill="#0ea5e9" name="General" />
                          <Bar dataKey="priority" fill="#ef4444" name="Priority" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      No appointment data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Appointment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {dailyAppointmentData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dailyAppointmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dailyAppointmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      No appointment data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
