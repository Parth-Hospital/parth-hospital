import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { Button } from "@/components/ui/button"
import { Stethoscope, Scale as Scalpel, Zap, Droplets, Activity, AlertCircle, ArrowRight, Scan, Microscope } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      id: "01",
      title: "OPD Consultation",
      icon: <Stethoscope className="w-8 h-8" />,
      desc: "Expert outpatient consultations with Dr. Subash Singh and specialists. Comprehensive diagnosis and treatment planning for bone, joint, and general health concerns.",
      details: ["Orthopedic Assessment", "General Medical Check-up", "Follow-up Care", "Health Counseling"],
    },
    {
      id: "02",
      title: "Operation Theatre",
      icon: <Scalpel className="w-8 h-8" />,
      desc: "State-of-the-art surgical facilities equipped for orthopedic, trauma, and general surgeries with advanced anesthesia monitoring.",
      details: ["Fracture Surgery", "Joint Procedures", "Trauma Management", "Emergency Operations"],
    },
    {
      id: "03",
      title: "X-Ray Services",
      icon: <Zap className="w-8 h-8" />,
      desc: "Advanced digital radiography for rapid bone and joint imaging. High-quality X-ray services for accurate diagnosis and treatment planning.",
      details: ["Digital X-Ray", "Bone Imaging", "Orthopedic X-Ray", "Quick Results"],
    },
    {
      id: "04",
      title: "Imaging & Diagnostics",
      icon: <Scan className="w-8 h-8" />,
      desc: "Comprehensive diagnostic imaging services including advanced scanning technologies. Precise imaging to guide surgical and treatment decisions.",
      details: ["CT Scan", "MRI Services", "Ultrasound", "Diagnostic Imaging"],
    },
    {
      id: "05",
      title: "Blood Tests",
      icon: <Droplets className="w-8 h-8" />,
      desc: "Complete blood work and hematology services with automated analysis. Fast and accurate results for health assessment and monitoring.",
      details: ["Complete Blood Count", "Blood Chemistry", "Hematology Tests", "Quick Turnaround"],
    },
    {
      id: "06",
      title: "Pathology Services",
      icon: <Microscope className="w-8 h-8" />,
      desc: "Comprehensive pathology and laboratory testing services. Expert analysis for pre-operative assessment and disease diagnosis.",
      details: ["Tissue Analysis", "Cytology", "Histopathology", "Laboratory Testing"],
    },
    {
      id: "07",
      title: "Physiotherapy",
      icon: <Activity className="w-8 h-8" />,
      desc: "Specialized rehabilitation and post-operative recovery programs. Evidence-based therapy to restore mobility and strength.",
      details: ["Post-Surgery Rehabilitation", "Joint Mobility", "Strength Training", "Pain Management"],
    },
    {
      id: "08",
      title: "Emergency & First Aid",
      icon: <AlertCircle className="w-8 h-8" />,
      desc: "24/7 emergency response for acute injuries and medical emergencies. Immediate stabilization and expert trauma care.",
      details: ["24/7 Availability", "Trauma Assessment", "Emergency Stabilization", "ICU Support"],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <FloatingActions />

      {/* Hero Section */}
      <section className="pt-36 md:pt-48 pb-16 md:pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-6 md:space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
              Comprehensive Care
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-huge text-primary leading-[0.85]">
              OUR
              <br />
              <span className="text-foreground italic font-light opacity-80">SERVICES.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-muted-foreground leading-relaxed max-w-2xl pt-4 md:pt-8">
              Parth Hospital provides complete healthcare services focused on orthopedic excellence, emergency care, and
              patient recovery.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid - Editorial List Pattern */}
      <section className="py-12 sm:py-16 md:py-24 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-1">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-background grid lg:grid-cols-12 gap-4 sm:gap-6 md:gap-12 p-4 sm:p-6 md:p-12 lg:p-20 hover:bg-primary transition-all duration-700 overflow-hidden relative border-b border-border/50 last:border-b-0"
              >
                {/* Visual Accent */}
                <span className="absolute -left-4 sm:-left-10 top-1/2 -translate-y-1/2 text-[8rem] sm:text-[12rem] lg:text-[15rem] font-bold text-primary/5 group-hover:text-white/5 transition-colors leading-none italic pointer-events-none">
                  {service.id}
                </span>

                <div className="lg:col-span-5 space-y-6 sm:space-y-8 relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-secondary/20 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                    {service.icon}
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight group-hover:text-white transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl font-light text-muted-foreground leading-relaxed group-hover:text-white/70 transition-colors">
                      {service.desc}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6 sm:space-y-8 lg:pt-24 relative z-10">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-secondary group-hover:text-accent transition-colors">
                    Key Features
                  </h4>
                  <ul className="grid sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4">
                    {service.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="text-muted-foreground group-hover:text-white/80 transition-colors flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary group-hover:bg-accent transition-colors flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-3 flex items-end justify-end relative z-10 pt-4 lg:pt-0">
                  <Button
                    variant="link"
                    className="text-primary group-hover:text-white font-bold text-base sm:text-lg p-0 h-auto gap-2 sm:gap-3 items-center group/btn"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-background text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6 sm:space-y-8">
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">Ready for expert care?</h3>
          <p className="text-base sm:text-lg md:text-xl font-light text-muted-foreground leading-relaxed">
            Contact Parth Hospital today to access any of our comprehensive healthcare services. Dr. Subash Singh and
            his team are ready to assist you.
          </p>
          <div className="pt-4 sm:pt-8">
            <Link href="/contact">
            <Button size="lg" className="rounded-full px-8 sm:px-12 h-14 sm:h-18 text-base sm:text-lg bg-primary hover:bg-primary/90 transition-all w-full sm:w-auto">
              Schedule a Service
            </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
