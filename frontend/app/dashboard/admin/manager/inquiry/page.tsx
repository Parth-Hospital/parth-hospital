"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Phone, Mail, Calendar, Loader2, CheckCircle2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { inquiryApi, Inquiry } from "@/lib/api/inquiry"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null)
  const [showResponseDialog, setShowResponseDialog] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadInquiries()
  }, [])

  const loadInquiries = async () => {
    try {
      setLoading(true)
      const data = await inquiryApi.getInquiries()
      setInquiries(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load inquiries",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, response?: string) => {
    try {
      setUpdating(true)
      await inquiryApi.updateInquiryStatus(id, {
        status: "RESPONDED",
        response: response || "Inquiry has been responded to.",
      })
      toast({
        title: "Success",
        description: "Inquiry status updated successfully",
      })
      setShowResponseDialog(false)
      setResponseText("")
      await loadInquiries()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update inquiry status",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const filteredInquiries = inquiries.filter(
    (inq) =>
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedInquiryData = inquiries.find((inq) => inq.id === selectedInquiry)

  return (
    <AdminLayout role="manager">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Inquiry Management</h2>
          <p className="text-muted-foreground">
            View and manage patient inquiries and questions
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, subject, or inquiry ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Inquiries List */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Inquiries ({filteredInquiries.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      ) : filteredInquiries.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No inquiries found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInquiries.map((inquiry) => (
                          <TableRow
                            key={inquiry.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedInquiry(inquiry.id)}
                          >
                            <TableCell className="font-medium">{inquiry.id}</TableCell>
                            <TableCell>{inquiry.name}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {inquiry.subject}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  inquiry.type === "EMERGENCY"
                                    ? "destructive"
                                    : inquiry.type === "APPOINTMENT"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {inquiry.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(inquiry.createdAt).toLocaleDateString("en-IN")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  inquiry.status === "RESPONDED"
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {inquiry.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedInquiry(inquiry.id)
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inquiry Details */}
          <div className="md:col-span-1">
            {selectedInquiryData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Inquiry Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Inquiry ID
                    </p>
                    <p className="font-semibold">{selectedInquiryData.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Name
                    </p>
                    <p className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {selectedInquiryData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Contact
                    </p>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        {selectedInquiryData.email}
                      </p>
                      <p className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4" />
                        {selectedInquiryData.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Date
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedInquiryData.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Subject
                    </p>
                    <p className="font-semibold">{selectedInquiryData.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Message
                    </p>
                    <p className="text-sm bg-muted p-3 rounded-lg">
                      {selectedInquiryData.message}
                    </p>
                  </div>
                  {selectedInquiryData.response && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Response
                      </p>
                      <p className="text-sm bg-primary/10 p-3 rounded-lg">
                        {selectedInquiryData.response}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Status
                    </p>
                    <div className="flex gap-2">
                      {selectedInquiryData.status === "PENDING" ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setShowResponseDialog(true)
                            setResponseText("")
                          }}
                          className="flex-1"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark as Responded
                        </Button>
                      ) : (
                        <Badge variant="default" className="w-full justify-center py-2">
                          Responded
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    Select an inquiry to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Inquiry as Responded</DialogTitle>
              <DialogDescription>
                Add a response message (optional)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="response">Response Message (Optional)</Label>
                <Textarea
                  id="response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter response message..."
                  rows={4}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResponseDialog(false)}
                  className="flex-1"
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedInquiry) {
                      handleStatusChange(selectedInquiry, responseText)
                    }
                  }}
                  className="flex-1"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Mark as Responded"
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

