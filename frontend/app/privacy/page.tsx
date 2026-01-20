"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { Shield, Lock, Eye, FileText } from "lucide-react"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: [
        "Personal information such as name, contact details, date of birth, and identification documents",
        "Medical information including medical history, diagnosis, treatment records, and prescriptions",
        "Payment information for billing and insurance purposes",
        "Technical information such as IP address, browser type, and device information when using our website",
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "To provide medical services, treatment, and care",
        "To process payments and manage billing",
        "To communicate with you about appointments, treatments, and hospital services",
        "To comply with legal and regulatory requirements",
        "To improve our services and patient experience",
      ],
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        "We implement appropriate technical and organizational measures to protect your personal information",
        "Access to your information is restricted to authorized personnel only",
        "We use secure systems and encryption to safeguard sensitive data",
        "Regular security audits and updates are conducted to maintain data protection",
      ],
    },
    {
      icon: Eye,
      title: "Your Rights",
      content: [
        "Right to access your personal and medical information",
        "Right to request correction of inaccurate data",
        "Right to request deletion of your information (subject to legal requirements)",
        "Right to object to certain processing activities",
        "Right to data portability",
      ],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <FloatingActions />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Legal Information
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary leading-tight mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              At Parth Hospital, we are committed to protecting your privacy and ensuring the confidentiality 
              of your personal and medical information. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you visit our hospital or use our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-20 bg-supporting-light/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-12">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-8 border border-border/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-lg text-muted-foreground mb-8">
              If you have any questions about this Privacy Policy or wish to exercise your rights, 
              please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong className="text-foreground">Parth Hospital</strong>
              </p>
              <p>Polytechnic chauraha, Jaunpur, Uttar Pradesh 222002</p>
              <p>
                Email:{" "}
                <a href="mailto:parthhospitaljnp@gmail.com" className="text-primary hover:underline">
                  parthhospitaljnp@gmail.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+917860115757" className="text-primary hover:underline">
                  +91 78601 15757
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
