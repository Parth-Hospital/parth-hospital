import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bone, Zap, BarChart3, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function OrthopedicCarePage() {
  const treatments = [
    {
      title: "Fracture Management",
      desc: "Expert diagnosis and treatment of bone fractures using modern surgical techniques and rehabilitation protocols.",
      image: "/orthopedic-fracture-treatment.jpg",
    },
    {
      title: "Joint Pain & Arthritis",
      desc: "Comprehensive care for arthritis, joint degeneration, and chronic joint pain with conservative and surgical options.",
      image: "/orthopedic-joint-care.jpg",
    },
    {
      title: "Joint Replacement Consultation",
      desc: "Guidance and consultations for knee, hip, and other joint replacement procedures with post-operative care planning.",
      image: "/orthopedic-joint-replacement.jpg",
    },
    {
      title: "Post-Surgery Rehabilitation",
      desc: "Evidence-based physiotherapy and rehabilitation programs to restore mobility and strength after orthopedic procedures.",
      image: "/orthopedic-rehabilitation.jpg",
    },
  ]

  const approaches = [
    {
      icon: <Bone className="w-6 h-6" />,
      title: "Surgical Excellence",
      desc: "Advanced orthopedic surgical techniques for complex bone and joint conditions.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Recovery",
      desc: "Minimally invasive procedures to reduce recovery time and patient discomfort.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Proven Results",
      desc: "Data-driven treatment plans with documented success rates and patient outcomes.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Patient-Centered Care",
      desc: "Holistic approach focusing on functional recovery and quality of life.",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-48 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
              Specialized Care
            </div>
            <h1 className="text-huge text-primary leading-[0.85]">
              BONE &<br />
              <span className="text-foreground italic font-light opacity-80">JOINT CARE</span>
            </h1>
            <p className="text-2xl font-light text-muted-foreground leading-relaxed max-w-2xl pt-8">
              At Parth Hospital, orthopedic excellence is our core specialization. Dr. Subash Singh brings over 20 years
              of experience in diagnosing, treating, and managing bone and joint conditions with precision and
              compassion.
            </p>
          </div>
        </div>
      </section>

      {/* Treatment Overview */}
      <section className="py-24 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 space-y-4">
            <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight">
              Comprehensive Treatment Options
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-x-24 gap-y-16">
            {treatments.map((treatment, idx) => (
              <div key={idx} className="group flex flex-col gap-6">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden soft-depth">
                  <Image
                    src={treatment.image || "/placeholder.svg"}
                    alt={treatment.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-3xl font-medium tracking-tight group-hover:text-primary transition-colors flex-1">
                      {treatment.title}
                    </h3>
                    <span className="text-accent/40 font-serif text-4xl italic group-hover:text-accent transition-colors ml-4">
                      0{idx + 1}
                    </span>
                  </div>
                  <p className="text-lg font-light text-muted-foreground leading-relaxed">{treatment.desc}</p>
                  <Button variant="link" className="text-primary p-0 h-auto font-semibold group/btn">
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 space-y-4">
            <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight">Our Approach</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {approaches.map((item, idx) => (
              <div
                key={idx}
                className="group bg-secondary/5 border border-border/50 p-8 rounded-2xl hover:bg-primary hover:border-primary transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-primary mb-6 group-hover:bg-white group-hover:text-primary transition-all">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-medium mb-4 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-muted-foreground group-hover:text-white/70 font-light leading-relaxed transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions We Treat */}
      <section className="py-24 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 space-y-4">
            <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight">Conditions We Treat</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Bone Fractures & Trauma",
              "Osteoarthritis",
              "Rheumatoid Arthritis",
              "Knee & Hip Pain",
              "Shoulder Injuries",
              "Spine Disorders",
              "Sports Injuries",
              "Ligament Tears",
              "Post-Operative Recovery",
            ].map((condition, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-6 bg-background rounded-xl border border-border/50 hover:border-primary transition-colors"
              >
                <div className="w-3 h-3 rounded-full bg-secondary flex-shrink-0 mt-2" />
                <p className="text-lg font-medium text-foreground">{condition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight">
            Expert Orthopedic Care Awaits
          </h2>
          <p className="text-xl font-light text-white/80 leading-relaxed">
            Schedule a consultation with Dr. Subash Singh to discuss your bone and joint health. Our team is committed
            to restoring your mobility and quality of life.
          </p>
          <div className="pt-8">
            <Link href="/appointment">
            <Button
              size="lg"
              className="rounded-full px-12 h-16 text-lg bg-white text-primary hover:bg-gray-100 hover:text-primary font-semibold"
            >
              Book Consultation
            </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
