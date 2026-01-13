import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { GraduationCap, Award, Bone, Clock, CheckCircle2, Star } from "lucide-react"
import Link from "next/link"

export default function DoctorPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <FloatingActions />

      <section className="pt-48 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left Column: Doctor Portrait & Bio */}
            <div className="lg:col-span-5 space-y-12">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden soft-depth group">
                <Image
                  src="/experienced-indian-doctor-portrait.jpg"
                  alt="Dr. Subash Singh - Chief Orthopedic Surgeon"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 text-secondary">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Chief Orthopedic Surgeon
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-primary">
                  Dr. Subash Singh <br />
                  <span className="text-foreground italic font-light opacity-60">MBBS, MS</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl font-light leading-relaxed text-muted-foreground">
                  Chief Medical Director and Senior Orthopedic Surgeon at Parth Hospital, specializing in bone and joint
                  care, fracture management, and trauma surgery with over 20 years of clinical excellence.
                </p>
              </div>

              <div className="pt-6">
                <Link href="/appointment">
                  <Button size="lg" className="rounded-full px-12 h-16 text-lg bg-primary w-full sm:w-auto soft-depth">
                    Book OPD Appointment
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Experience Timeline & Stats */}
            <div className="lg:col-span-7 space-y-20">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {[
                  { label: "Orthopedic Experience", value: "20+ Years", icon: <Award className="text-secondary" /> },
                  { label: "Successful Surgeries", value: "10,000+", icon: <Bone className="text-secondary" /> },
                  { label: "Patient Satisfaction", value: "99%", icon: <CheckCircle2 className="text-secondary" /> },
                  { label: "Medical Lectures", value: "100+", icon: <GraduationCap className="text-secondary" /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-secondary/10 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-border/50 space-y-3 sm:space-y-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-background flex items-center justify-center border border-border">
                      {stat.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-medium tracking-tight">Professional Journey</h2>
                  <div className="h-px bg-border flex-1" />
                </div>
                <div className="space-y-12">
                  {[
                    {
                      year: "2003",
                      title: "MBBS - Medical Degree",
                      institution: "King George Medical College, Lucknow",
                      desc: "Graduated with distinction in clinical medicine and patient care excellence.",
                    },
                    {
                      year: "2007",
                      title: "MS - General Surgery",
                      institution: "Specialized Surgical Training",
                      desc: "Completed postgraduate specialization with advanced focus on orthopedic and trauma surgery techniques.",
                    },
                    {
                      year: "2009",
                      title: "Established Parth Hospital",
                      institution: "Jaunpur, Uttar Pradesh",
                      desc: "Founded Parth Hospital with a vision to bring international-standard orthopedic care and trauma management to Jaunpur.",
                    },
                    {
                      year: "2015",
                      title: "5,000 Procedures Milestone",
                      institution: "Clinical Excellence Recognition",
                      desc: "Successfully completed over 5,000 orthopedic and trauma procedures with exceptional patient outcomes.",
                    },
                    {
                      year: "2023",
                      title: "10,000+ Procedures",
                      institution: "Leading Orthopedic Center",
                      desc: "Surpassed 10,000 successful surgical procedures, establishing Parth Hospital as a trusted orthopedic institution.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-8 group">
                      <div className="w-full sm:w-24 shrink-0">
                        <span className="text-lg sm:text-xl font-bold text-secondary italic">{item.year}</span>
                      </div>
                      <div className="space-y-2 flex-1">
                        <h4 className="text-xl sm:text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
                          {item.institution}
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary text-white p-12 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-[100px]" />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-secondary" />
                    <h3 className="text-3xl font-bold">OPD Schedule</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-white/10 pb-3">
                        <span className="text-white/70 font-medium">Monday - Friday</span>
                        <span className="font-bold">11:00 AM - 05:00 PM</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-3">
                        <span className="text-white/70 font-medium">Saturday</span>
                        <span className="font-bold">11:00 AM - 05:00 PM</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-3">
                        <span className="text-white/70 font-medium">Sunday</span>
                        <span className="text-secondary font-bold">Closed</span>
                      </div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                      <p className="text-xs uppercase tracking-widest text-white/60 mb-3 font-semibold">
                        Emergency Contact
                      </p>
                      <p className="text-sm leading-relaxed text-white/90">
                        Dr. Singh is available for emergency orthopedic and trauma consultations 24/7. Call the hospital
                        directly for immediate assistance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-medium tracking-tight">Areas of Specialization</h2>
                  <div className="h-px bg-border flex-1" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "Fracture Management & Trauma Surgery",
                    "Joint Replacement Consultations",
                    "Orthopedic Sports Injuries",
                    "Arthritis & Joint Pain Management",
                    "Post-Operative Rehabilitation",
                    "Advanced Surgical Techniques",
                  ].map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg border border-border/50 hover:border-secondary transition-colors"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary flex-shrink-0" />
                      <p className="font-medium text-foreground">{spec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
