"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { Shield, CheckCircle2, FileText, Phone } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AyushmanPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <FloatingActions />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Government Health Scheme
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary leading-tight mb-6">
              Ayushman Bharat
              <br />
              <span className="text-blue-600">PM-JAY Scheme</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Parth Hospital proudly accepts Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY) cards. 
              Get quality healthcare services covered under the government health insurance scheme.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is Ayushman */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="w-12 h-12 text-blue-600" />
                <h2 className="text-4xl font-bold text-foreground">What is Ayushman Bharat?</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY) is the world's largest health insurance scheme 
                launched by the Government of India. It provides health coverage of up to ₹5 lakh per family per year for 
                secondary and tertiary care hospitalization.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The scheme covers over 10 crore poor and vulnerable families (approximately 50 crore beneficiaries) 
                providing them access to quality healthcare services at empaneled hospitals across India.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Coverage Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Up to ₹5 lakh per family per year</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Cashless treatment at empaneled hospitals</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Coverage for pre-existing conditions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>No age limit or family size restrictions</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Covered */}
      <section className="py-20 bg-supporting-light/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Services Covered at Parth Hospital</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive healthcare services under the Ayushman Bharat scheme
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Orthopedic Surgery & Joint Replacement",
              "Fracture Treatment & Trauma Care",
              "OPD Consultations",
              "Diagnostic Services (X-Ray, Lab Tests)",
              "Emergency Services",
              "Post-Operative Care",
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CheckCircle2 className="w-6 h-6 text-blue-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">{service}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">How to Use Your Ayushman Card</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to avail cashless treatment at Parth Hospital
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Check Eligibility",
                description: "Verify if you're eligible for AB-PMJAY scheme",
              },
              {
                step: "02",
                title: "Get Your Card",
                description: "Obtain your Ayushman Bharat card from authorized centers",
              },
              {
                step: "03",
                title: "Visit Hospital",
                description: "Come to Parth Hospital with your card and valid ID",
              },
              {
                step: "04",
                title: "Cashless Treatment",
                description: "Avail cashless treatment for covered procedures",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-blue-600 mb-3">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Need Help with Ayushman Card?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Our team is here to assist you with the Ayushman Bharat scheme and answer any questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 border-white">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </Link>
              <a href="tel:+917860115757">
                <Button size="lg" className="bg-white/10 text-white hover:bg-white/20 border border-white/30">
                  Call: +91 78601 15757
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
