import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

export function DoctorHighlight() {
  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[3/4] relative rounded-2xl overflow-hidden soft-depth group">
              <Image
                src="/experienced-indian-doctor-portrait.jpg"
                alt="Dr. Subash Singh"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />
            </div>
            {/* Design Element: Vertical Text */}
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden xl:block">
              <span className="text-vertical text-[10px] uppercase tracking-[0.5em] font-bold text-accent/40">
                Visionary Leadership • Healing Presence
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-medium leading-[0.9] tracking-tight">
                Trust the <br /> <span className="italic text-accent">Experience.</span>
              </h2>
              <p className="text-2xl font-light leading-relaxed text-muted-foreground max-w-2xl">
                "Healthcare is not just about clinical excellence; it's about the trust between a doctor and their
                community. At Parth, we've spent decades building that trust."
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 border-y border-border py-12">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-accent font-bold">Foundation</p>
                <p className="text-lg font-medium">MBBS, MS (General Surgery)</p>
                <p className="text-sm text-muted-foreground">King George Medical College</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-accent font-bold">Achievement</p>
                <p className="text-lg font-medium">10,000+ Successful Procedures</p>
                <p className="text-sm text-muted-foreground">Pioneer in Advanced Surgery in Jaunpur</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <Button size="lg" className="rounded-full px-10 h-16 bg-primary group text-lg">
                View Full Profile{" "}
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Chief Director
                </span>
                <span className="text-sm font-bold text-primary">Dr. Subash Singh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
