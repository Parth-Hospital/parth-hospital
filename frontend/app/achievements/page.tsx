"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Award, Users, Zap, Heart, Loader2 } from "lucide-react"
import Link from "next/link"
import { achievementApi, Achievement } from "@/lib/api/achievement"

export default function AchievementsPage() {
  const [doctorAchievements, setDoctorAchievements] = useState<Achievement[]>([])
  const [hospitalAchievements, setHospitalAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      setLoading(true)
      const [doctorData, hospitalData] = await Promise.all([
        achievementApi.getAchievements("DOCTOR"),
        achievementApi.getAchievements("HOSPITAL"),
      ])
      setDoctorAchievements(doctorData)
      setHospitalAchievements(hospitalData)
    } catch (error) {
      // Only log in development
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to load achievements:", error)
      }
    } finally {
      setLoading(false)
    }
  }

  const metrics = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "10,000+",
      label: "Successful Procedures",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      value: "20+",
      label: "Years of Experience",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      value: "98%",
      label: "Patient Satisfaction",
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "100%",
      label: "NABH Certified",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-6 md:space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
              Our Legacy
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-huge text-primary leading-[0.85] mb-6 sm:mb-8 break-words">
              BUILDING
              <br />
              <span className="text-foreground italic font-light opacity-80">TRUST THROUGH RESULTS</span>
            </h1>
            <p className="text-2xl font-light text-muted-foreground leading-relaxed max-w-2xl pt-8">
              Parth Hospital's commitment to advancing healthcare in Jaunpur through evidence-based, compassionate
              orthopedic care.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {metrics.map((metric, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto text-accent">
                  {metric.icon}
                </div>
                <div>
                  <p className="text-4xl sm:text-5xl md:text-6xl font-bold">{metric.value}</p>
                  <p className="text-white/70 text-base sm:text-lg font-medium mt-2">{metric.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dr. Subash's Milestones */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 space-y-4">
            <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight">
              Dr. Subash Singh's Milestones
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : doctorAchievements.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No milestones available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {doctorAchievements.map((achievement) => {
                const year = new Date(achievement.date).getFullYear()
                return (
                  <div
                    key={achievement.id}
                    className="group bg-secondary/5 hover:bg-primary border border-border/50 hover:border-primary transition-all duration-500 p-8 rounded-xl"
                  >
                    <div className="grid md:grid-cols-12 gap-8 items-start">
                      <div className="md:col-span-2">
                        <p className="text-4xl font-bold text-primary group-hover:text-white transition-colors">
                          {year}
                        </p>
                      </div>
                      <div className="md:col-span-10 space-y-2">
                        <h3 className="text-2xl font-medium group-hover:text-white transition-colors">
                          {achievement.title}
                        </h3>
                        {achievement.description && (
                          <p className="text-lg font-light text-muted-foreground group-hover:text-white/70 transition-colors leading-relaxed">
                            {achievement.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Hospital Milestones */}
      <section className="py-24 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 space-y-4">
            <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight">Hospital Milestones</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : hospitalAchievements.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No milestones available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {hospitalAchievements.map((achievement) => {
                const year = new Date(achievement.date).getFullYear()
                return (
                  <div
                    key={achievement.id}
                    className="group bg-white hover:bg-primary border border-border/50 hover:border-primary transition-all duration-500 p-8 rounded-xl"
                  >
                    <div className="grid md:grid-cols-12 gap-8 items-start">
                      <div className="md:col-span-2">
                        <p className="text-4xl font-bold text-primary group-hover:text-white transition-colors">
                          {year}
                        </p>
                      </div>
                      <div className="md:col-span-10 space-y-2">
                        <h3 className="text-2xl font-medium group-hover:text-white transition-colors">
                          {achievement.title}
                        </h3>
                        {achievement.description && (
                          <p className="text-lg font-light text-muted-foreground group-hover:text-white/70 transition-colors leading-relaxed">
                            {achievement.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-background text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight">
            Be Part of Our Success Story
          </h2>
          <p className="text-xl font-light text-muted-foreground leading-relaxed">
            Join thousands of patients who have experienced Parth Hospital's commitment to orthopedic excellence and
            patient care. Your health journey matters to us.
          </p>
          <div className="pt-8 flex flex-wrap justify-center gap-4">
            <Link href="/appointment">
            <Button size="lg" className="rounded-full px-12 h-16 text-lg bg-primary hover:bg-primary/90">
              Schedule Consultation
            </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-12 h-16 text-lg border-primary/20 hover:bg-primary/5 bg-transparent"
              >
                Contact Hospital
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
