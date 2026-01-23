"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, DollarSign, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { analyticsApi } from "@/lib/api/analytics"
import { appointmentApi } from "@/lib/api/appointment"
import { useToast } from "@/hooks/use-toast"
import { logger } from "@/lib/utils/logger"

export default function ReceptionistDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [bookings, setBookings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
    loadBookings()
  }, [])

  const loadStats = async () => {
    try {
      const data = await analyticsApi.getReceptionistDashboardStats()
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

  const loadBookings = async () => {
    try {
      const data = await appointmentApi.getCurrentBookings()
      setBookings(data)
    } catch (error: any) {
      // Only log in development
      logger.error("Failed to load bookings:", error)
    }
  }

  const patientFlowData = stats?.patientFlow || []
  const collectionData = stats?.collectionData || []

  return (
    <AdminLayout role="receptionist">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor patient flow and daily operations</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Current Queue */}
            <section>
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Users size={16} /> Total Patients Today
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{bookings?.summary?.total || 0}</p>
                    <p className="text-xs text-muted-foreground mt-2">Registered today</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <AlertCircle size={16} /> Waiting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-accent">
                      {bookings?.appointments?.filter((a: any) => a.status === "PENDING" || a.status === "ARRIVED").length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">In queue</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <DollarSign size={16} /> Collections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      ₹{collectionData.reduce((sum: number, item: any) => sum + (item.collections || 0), 0).toLocaleString() || "0"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Last 7 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Clock size={16} /> Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {bookings?.appointments?.filter((a: any) => a.status === "COMPLETED").length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Today</p>
                  </CardContent>
                </Card>
              </div>
            </section>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Patient Flow & Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                {patientFlowData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={patientFlowData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="patients" fill="#0ea5e9" name="Total Patients" />
                      <Bar dataKey="completed" fill="#10b981" name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No patient flow data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Collections Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {collectionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={collectionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                      <Area type="monotone" dataKey="collections" fill="#0ea5e9" stroke="#0ea5e9" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No collection data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
