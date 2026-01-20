"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { FileText, Scale, AlertCircle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Parth Hospital's services, you agree to be bound by these Terms of Service",
        "If you do not agree with any part of these terms, you must not use our services",
        "We reserve the right to modify these terms at any time, and such modifications will be effective immediately",
      ],
    },
    {
      icon: Scale,
      title: "Medical Services",
      content: [
        "All medical services are provided by qualified and licensed healthcare professionals",
        "Medical advice and treatment are based on professional judgment and may vary based on individual circumstances",
        "We strive to provide accurate information, but medical outcomes cannot be guaranteed",
        "Patients are responsible for providing accurate medical history and information",
      ],
    },
    {
      icon: AlertCircle,
      title: "Limitation of Liability",
      content: [
        "Parth Hospital shall not be liable for any indirect, incidental, or consequential damages",
        "Our liability is limited to the maximum extent permitted by law",
        "We are not responsible for any loss or damage resulting from the use of our website or services",
        "Medical decisions should be made in consultation with qualified healthcare professionals",
      ],
    },
    {
      icon: CheckCircle2,
      title: "Patient Responsibilities",
      content: [
        "Provide accurate and complete medical information",
        "Follow medical advice and treatment plans as prescribed",
        "Pay all applicable fees and charges in a timely manner",
        "Respect hospital policies and staff",
        "Maintain confidentiality of other patients' information",
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
              Terms of Service
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
              These Terms of Service govern your use of Parth Hospital's services, facilities, and website. 
              Please read these terms carefully before using our services. By using our services, you agree 
              to comply with and be bound by these terms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
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
            <h2 className="text-4xl font-bold text-foreground mb-4">Questions About Terms?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              If you have any questions about these Terms of Service, please contact us:
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
