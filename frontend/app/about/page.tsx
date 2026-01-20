"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import Image from "next/image"
import { CheckCircle2, Award, History, Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <FloatingActions />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Our Story
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-huge text-primary leading-[0.85] mb-6 sm:mb-8">
              HEALING
              <br />
              <span className="text-foreground italic font-light opacity-80">LEGACY.</span>
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed text-muted-foreground">
                Parth Hospital was founded with a singular vision: to bring world-class healthcare to the doorstep of
                Jaunpur.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                For over two decades, we have been more than just a medical facility. We have been a pillar of trust,
                combining advanced surgical expertise with the empathy that every patient deserves.
              </p>
            </motion.div>
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Our commitment to excellence extends beyond medical procedures. We believe in building lasting
                relationships with our patients, understanding their unique needs, and providing personalized care that
                makes a difference.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                With state-of-the-art facilities and a team of dedicated professionals, we continue to set new
                standards in orthopedic care and patient satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Grid Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            <motion.div
              className="md:col-span-8 relative h-[300px] md:h-full rounded-3xl overflow-hidden soft-depth"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image src="/modern-hospital-interior-lobby.jpg" alt="Hospital Interior" fill className="object-cover" />
            </motion.div>
            <div className="md:col-span-4 grid grid-cols-1 md:grid-rows-2 gap-6 h-auto md:h-full">
              <motion.div
                className="relative h-[250px] md:h-full rounded-3xl overflow-hidden soft-depth"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              >
                <Image src="/hospital-corridor-modern.jpg" alt="Operating Theater" fill className="object-cover" />
              </motion.div>
              <motion.div
                className="relative rounded-3xl overflow-hidden soft-depth bg-primary flex flex-col justify-center p-6 md:p-8 text-white min-h-[200px] md:min-h-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <Award className="w-10 h-10 md:w-12 md:h-12 text-accent mb-4 md:mb-6" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">20+ Years</h3>
                <p className="text-white/60 text-sm">Of continuous medical excellence and community service.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <motion.section
        className="py-32 bg-secondary/20"
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
          <div className="grid lg:grid-cols-3 gap-16">
            {[
              {
                icon: History,
                title: "Our Mission",
                content:
                  "To provide accessible, high-quality, and compassionate healthcare services that exceed patient expectations and foster a healthier community in Jaunpur.",
              },
              {
                icon: Heart,
                title: "Our Core Values",
                isList: true,
                items: [
                  "Patient-Centricity in every action",
                  "Integrity and Clinical Excellence",
                  "Innovation in Medical Technology",
                  "Empathy and Respect for all",
                ],
              },
              {
                icon: Award,
                title: "Our Vision",
                content:
                  "To be the most trusted and sought-after healthcare destination in Uttar Pradesh, recognized for medical precision and humanitarian service.",
              },
            ].map((section, i) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="space-y-6"
                >
                  <Icon className={`w-10 h-10 ${i === 1 ? "text-accent" : "text-primary"}`} />
                  <h2 className="text-4xl font-medium tracking-tight">{section.title}</h2>
                  {section.isList ? (
                    <ul className="space-y-4">
                      {section.items?.map((value, j) => (
                        <li key={j} className="flex gap-3 items-center text-muted-foreground font-medium">
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                          {value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-muted-foreground leading-relaxed">{section.content}</p>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}
