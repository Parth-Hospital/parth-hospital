"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar } from "lucide-react"
import { leaveApi, LeaveRequest } from "@/lib/api/leave"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function LeaveRequestsPage() {
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([])
  const [pastRequests, setPastRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPast, setLoadingPast] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")
  const [comments, setComments] = useState("")
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadLeaveRequests()
    loadPastRequests()
  }, [])

  const loadLeaveRequests = async () => {
    try {
      setLoading(true)
      const data = await leaveApi.getLeaveRequests({ status: "PENDING" })
      setPendingRequests(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load leave requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPastRequests = async () => {
    try {
      setLoadingPast(true)
      // Fetch both approved and rejected leaves
      const [approved, rejected] = await Promise.all([
        leaveApi.getLeaveRequests({ status: "APPROVED" }),
        leaveApi.getLeaveRequests({ status: "REJECTED" }),
      ])
      // Combine and sort by date (most recent first)
      const combined = [...approved, ...rejected].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setPastRequests(combined)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load past leave requests",
        variant: "destructive",
      })
    } finally {
      setLoadingPast(false)
    }
  }

  const handleActionClick = (request: LeaveRequest, type: "approve" | "reject") => {
    setSelectedRequest(request)
    setActionType(type)
    setShowActionDialog(true)
    setComments("")
  }

  const handleActionSubmit = async () => {
    if (!selectedRequest) return

    try {
      setProcessing(true)
      await leaveApi.updateLeaveStatus(selectedRequest.id, {
        status: actionType === "approve" ? "APPROVED" : "REJECTED",
        comments: comments || undefined,
      })
      toast({
        title: "Success",
        description: `Leave request ${actionType === "approve" ? "approved" : "rejected"} successfully`,
      })
      setShowActionDialog(false)
      await loadLeaveRequests()
      await loadPastRequests()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update leave request",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <AdminLayout role="manager">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Leave Requests</h2>
          <p className="text-muted-foreground">Approve or reject employee leave requests</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Leave Requests ({pendingRequests.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Employee</th>
                      <th className="p-4 text-left font-semibold">Start Date</th>
                      <th className="p-4 text-left font-semibold">End Date</th>
                      <th className="p-4 text-left font-semibold">Duration</th>
                      <th className="p-4 text-left font-semibold">Reason</th>
                      <th className="p-4 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No pending leave requests
                        </td>
                      </tr>
                    ) : (
                      pendingRequests.map((request) => (
                        <tr key={request.id} className="border-b border-border hover:bg-muted/30">
                          <td className="p-4 font-medium">
                            {request.user?.name || "N/A"}
                          </td>
                          <td className="p-4">
                            {new Date(request.startDate).toLocaleDateString("en-IN")}
                          </td>
                          <td className="p-4">
                            {new Date(request.endDate).toLocaleDateString("en-IN")}
                          </td>
                          <td className="p-4">
                            {calculateDays(request.startDate, request.endDate)} days
                          </td>
                          <td className="p-4 text-muted-foreground max-w-xs truncate">
                            {request.reason}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleActionClick(request, "reject")}
                              >
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleActionClick(request, "approve")}
                              >
                                Approve
                              </Button>
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

        <Card>
          <CardHeader>
            <CardTitle>Past Leave Requests ({pastRequests.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingPast ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Employee</th>
                      <th className="p-4 text-left font-semibold">Start Date</th>
                      <th className="p-4 text-left font-semibold">End Date</th>
                      <th className="p-4 text-left font-semibold">Duration</th>
                      <th className="p-4 text-left font-semibold">Reason</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-left font-semibold">Approved By</th>
                      <th className="p-4 text-left font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastRequests.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          No past leave requests
                        </td>
                      </tr>
                    ) : (
                      pastRequests.map((request) => (
                        <tr key={request.id} className="border-b border-border hover:bg-muted/30">
                          <td className="p-4 font-medium">
                            {request.user?.name || "N/A"}
                          </td>
                          <td className="p-4">
                            {new Date(request.startDate).toLocaleDateString("en-IN")}
                          </td>
                          <td className="p-4">
                            {new Date(request.endDate).toLocaleDateString("en-IN")}
                          </td>
                          <td className="p-4">
                            {calculateDays(request.startDate, request.endDate)} days
                          </td>
                          <td className="p-4 text-muted-foreground max-w-xs truncate">
                            {request.reason}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={request.status === "APPROVED" ? "default" : "destructive"}
                              className={
                                request.status === "APPROVED"
                                  ? "bg-green-600"
                                  : "bg-red-600"
                              }
                            >
                              {request.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {request.approver?.name || "N/A"}
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {new Date(request.updatedAt).toLocaleDateString("en-IN")}
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

        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Approve" : "Reject"} Leave Request
              </DialogTitle>
              <DialogDescription>
                {selectedRequest && (
                  <>
                    {selectedRequest.user?.name} - {calculateDays(selectedRequest.startDate, selectedRequest.endDate)} days
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add any comments..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowActionDialog(false)}
                  className="flex-1"
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleActionSubmit}
                  className="flex-1"
                  disabled={processing}
                  variant={actionType === "reject" ? "destructive" : "default"}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4  animate-spin" />
                      Processing...
                    </>
                  ) : (
                    actionType === "approve" ? "Approve" : "Reject"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

