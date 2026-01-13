"use client"

import type React from "react"
import { useState } from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, ArrowRight, Loader2, CheckCircle2, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import { inquiryApi } from "@/lib/api/inquiry"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await inquiryApi.createInquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || "noreply@parthhospital.com",
        subject: formData.subject,
        message: formData.message,
        type: formData.subject === "appointment" ? "APPOINTMENT" : "GENERAL",
      })
      setSubmitted(true)
      toast({
        title: "Success",
        description: "Your inquiry has been submitted successfully. We'll get back to you soon!",
      })
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <FloatingActions />

      {/* Hero Section */}
      <section className="pt-36 md:pt-44 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Reach Out
            </div>
            <h1 className="text-huge text-primary leading-[0.85] mb-8">
              ALWAYS
              <br />
              <span className="text-foreground italic font-light opacity-80">CONNECTED.</span>
            </h1>
            <p className="text-2xl font-light text-muted-foreground leading-relaxed max-w-3xl">
              Whether it's an emergency, a consultation, or a simple inquiry, our team is here to assist you 24/7.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <motion.div
            className="grid sm:grid-cols-2 gap-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              {
                icon: Phone,
                label: "Call Us",
                type: "OPD & General",
                value: "+91 78601 15757",
                bgColor: "bg-secondary/20",
                textColor: "text-primary",
                accentColor: "text-primary",
              },
              {
                icon: Clock,
                label: "Emergency",
                type: "Trauma 24/7",
                value: "+91 78601 15757",
                bgColor: "bg-primary",
                textColor: "text-white",
                accentColor: "text-accent",
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={i}
                  href={`tel:${item.value.replace(/\s/g, "")}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className={`space-y-4 p-8 rounded-3xl ${item.bgColor} border border-border/50 transition-all hover:shadow-lg cursor-pointer`}
                  aria-label={`${item.label}: ${item.value}`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${
                      i === 0 ? "bg-white" : "bg-white/10"
                    } flex items-center justify-center ${item.accentColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${item.textColor}`}>{item.label}</h3>
                    <p className={`text-sm ${item.textColor} opacity-60 mb-4 font-medium uppercase tracking-wider`}>
                      {item.type}
                    </p>
                    <p className={`text-xl font-bold ${item.accentColor}`}>{item.value}</p>
                  </div>
                </motion.a>
              )
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-white p-10 lg:p-16 rounded-[40px] soft-depth border border-border/50 space-y-10 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tight">Send a Message</h2>
              <p className="text-muted-foreground">We typically respond within 2-4 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                    Full Name <span aria-label="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                    aria-required="true"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-14 bg-secondary/20 border-none rounded-xl px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-xs uppercase tracking-widest font-bold text-muted-foreground"
                  >
                    Phone Number <span aria-label="required">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91"
                    required
                    aria-required="true"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-14 bg-secondary/20 border-none rounded-xl px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs uppercase tracking-widest font-bold text-muted-foreground"
                >
                  Email (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-14 bg-secondary/20 border-none rounded-xl px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-xs uppercase tracking-widest font-bold text-muted-foreground"
                >
                  Subject <span aria-label="required">*</span>
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    required
                    aria-required="true"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-14 bg-secondary/20 border-none rounded-xl px-6 pr-12 focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="appointment">Appointment Booking</option>
                    <option value="report">Report Related</option>
                    <option value="feedback">Feedback</option>
                  </select>
                  <ArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-xs uppercase tracking-widest font-bold text-muted-foreground"
                >
                  Message <span aria-label="required">*</span>
                </label>
                <textarea
                  id="message"
                  placeholder="How can we help you?"
                  rows={4}
                  required
                  aria-required="true"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-secondary/20 border-none rounded-xl p-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting || submitted}
                className="w-full h-16 rounded-full text-lg bg-primary hover:scale-[1.02] transition-all soft-depth disabled:opacity-50"
                aria-label="Submit contact form message"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Submitted!
                  </>
                ) : (
                  <>
                    Submit Message <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <motion.section
        className="py-24 bg-secondary/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="lg:col-span-4 space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-medium tracking-tight">Our Location</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Located in the heart of Jaunpur, making it easily accessible for patients across the district.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Main Address",
                    content: "Polytechnic chauraha, Jaunpur, Uttar Pradesh 222002",
                  },
                  {
                    icon: Mail,
                    title: "Email Support",
                    content: "parthhospitaljnp@gmail.com",
                  },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="flex gap-4 items-start">
                      <div
                        className={`w-10 h-10 rounded-xl ${
                          i === 0 ? "bg-primary text-white" : "bg-accent/20 text-accent"
                        } flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{item.title}</h4>
                        <p className="text-muted-foreground text-sm">{item.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Button
                variant="outline"
                className="rounded-full px-8 h-12 border-primary/20 hover:bg-primary/5 bg-transparent"
                asChild
              >
                <a href="https://maps.app.goo.gl/xFDXQcP3EpSSo6io8" target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
              </Button>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="lg:col-span-8 h-[500px] rounded-[40px] overflow-hidden relative soft-depth border border-border/50"
            >
              <iframe
                src="https://www.google.com/maps?q=Parth+Hospital,Jaunpur&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-[40px]"
                title="Parth Hospital Location"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}
