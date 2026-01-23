"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileUp, CheckCircle, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { analyticsApi } from "@/lib/api/analytics"
import { useToast } from "@/hooks/use-toast"

export default function ManagerDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await analyticsApi.getManagerDashboardStats()
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

  const attendanceData = stats?.weeklyTrends || []
  const departmentData = stats?.departmentDistribution || []

  return (
    <AdminLayout role="manager">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor employee management and operations</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <section>
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Users size={16} /> Total Employees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats?.totalEmployees || 0}</p>
                    <p className="text-xs text-muted-foreground mt-2">Active staff</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <CheckCircle size={16} /> Present Today
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-secondary">
                      {stats?.presentToday || 0}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp size={14} className="text-green-600" />
                      <span className="text-xs text-green-600">
                        {stats?.totalEmployees
                          ? Math.round((stats.presentToday / stats.totalEmployees) * 100)
                          : 0}
                        % attendance
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <AlertCircle size={16} /> Pending Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-accent">
                      {stats?.pendingApprovals || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Requires action</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <FileUp size={16} /> On Leave
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats?.onLeaveToday || 0}</p>
                    <p className="text-xs text-muted-foreground mt-2">Today</p>
                  </CardContent>
                </Card>
              </div>
            </section>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {attendanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#10b981" />
                      <Bar dataKey="absent" fill="#ef4444" />
                      <Bar dataKey="onLeave" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No attendance data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employees by Department</CardTitle>
              </CardHeader>
              <CardContent>
                {departmentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="department" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No department data available
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
