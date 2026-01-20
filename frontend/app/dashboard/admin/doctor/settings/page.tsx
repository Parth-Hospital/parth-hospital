"use client"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Phone, Mail, Globe } from "lucide-react"

export default function HospitalDetailsPage() {
  // Hardcoded hospital details - not editable
  const hospitalDetails = {
    hospitalName: "Parth Hospital",
    address: "Polytechnic chauraha, Jaunpur, Uttar Pradesh 222002",
    phone: "+91 78601 15757",
    email: "parthhospitaljnp@gmail.com",
    website: "https://parthhospital.com",
  }

  return (
    <AdminLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Hospital Details</h2>
          <p className="text-muted-foreground">View hospital information and contact details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hospital Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Hospital Name</p>
                <p className="text-lg font-semibold">{hospitalDetails.hospitalName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                <p className="text-lg">{hospitalDetails.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                <a href={`tel:${hospitalDetails.phone}`} className="text-lg hover:text-primary transition-colors">
                  {hospitalDetails.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                <a href={`mailto:${hospitalDetails.email}`} className="text-lg hover:text-primary transition-colors">
                  {hospitalDetails.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Website</p>
                <a
                  href={hospitalDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg hover:text-primary transition-colors"
                >
                  {hospitalDetails.website}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
