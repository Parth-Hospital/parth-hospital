"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, DollarSign, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { analyticsApi } from "@/lib/api/analytics"
import { useToast } from "@/hooks/use-toast"

export default function DoctorDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await analyticsApi.getDoctorDashboardStats()
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

  const dailyAppointmentData = stats?.today
    ? [
        { name: "General", value: stats.today.generalAppointments, color: "#0ea5e9" },
        { name: "Priority", value: stats.today.priorityAppointments, color: "#ef4444" },
      ]
    : []

  return (
    <AdminLayout role="doctor">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Monitor hospital operations and performance</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <section>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Today's Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

          {/* Chart Section */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointment Distribution</CardTitle>
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
          </>
        )}
      </div>
    </AdminLayout>
  )
}
