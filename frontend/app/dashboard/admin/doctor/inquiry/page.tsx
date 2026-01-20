"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Phone, Mail, Calendar, Loader2 } from "lucide-react"
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

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null)
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

  const filteredInquiries = inquiries.filter(
    (inq) =>
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedInquiryData = inquiries.find((inq) => inq.id === selectedInquiry)

  return (
    <AdminLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Inquiry Management</h2>
          <p className="text-muted-foreground">
            View patient inquiries and questions (Read-only)
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
                              <button
                                className="text-primary hover:underline text-sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedInquiry(inquiry.id)
                                }}
                              >
                                View
                              </button>
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
      </div>
    </AdminLayout>
  )
}

