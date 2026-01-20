"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { XCircle, Clock, CreditCard, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function CancellationPage() {
  const sections = [
    {
      icon: Clock,
      title: "Appointment Cancellation",
      content: [
        "Appointments can be cancelled up to 24 hours before the scheduled time without any charges",
        "Cancellations made less than 24 hours before the appointment may be subject to a cancellation fee",
        "Same-day cancellations or no-shows may incur the full consultation fee",
        "To cancel an appointment, please call us at +91 78601 15757 or use our online portal",
      ],
    },
    {
      icon: XCircle,
      title: "Surgery/Procedure Cancellation",
      content: [
        "Surgery cancellations must be made at least 48 hours in advance",
        "Cancellations made less than 48 hours before the scheduled procedure may be subject to charges",
        "Deposits paid for surgeries are refundable if cancellation is made within the specified time frame",
        "Emergency situations will be considered on a case-by-case basis",
      ],
    },
    {
      icon: CreditCard,
      title: "Refund Policy",
      content: [
        "Refunds for cancelled services will be processed within 7-14 business days",
        "Refunds will be issued to the original payment method used",
        "Administrative fees may apply for certain cancellations",
        "Refunds for services already rendered are not applicable",
        "Insurance claim refunds are subject to insurance provider policies",
      ],
    },
    {
      icon: AlertCircle,
      title: "Special Circumstances",
      content: [
        "Medical emergencies preventing attendance will be handled with understanding and flexibility",
        "Refunds for services not utilized due to medical complications will be considered",
        "Government health scheme (Ayushman) cancellations follow scheme-specific policies",
        "For any disputes or special cases, please contact our patient relations department",
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
              Hospital Policies
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary leading-tight mb-6">
              Cancellation & Refund Policy
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
              At Parth Hospital, we understand that circumstances may change, and you may need to cancel or 
              reschedule appointments or procedures. This policy outlines our cancellation and refund procedures 
              to ensure transparency and fairness for all our patients.
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
            <h2 className="text-4xl font-bold text-foreground mb-4">Need Assistance?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              For questions about cancellations or refunds, please contact us:
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
