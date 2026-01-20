import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Info } from "lucide-react"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="absolute top-8 left-8 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hospital Site
        </Link>
      </div>

      <div className="flex-1 grid lg:grid-cols-2">
        {/* Visual Side */}
        <div className="relative bg-primary overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="absolute inset-0 bg-[url('/modern-hospital-interior-lobby.jpg')] bg-cover opacity-20 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-20 text-white">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo/parth-logo-nobg.png"
                alt="Parth Hospital"
                width={48}
                height={48}
                className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
              />
              <div className="space-y-1">
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tighter uppercase">Parth Hospital</h2>
                <p className="text-xs uppercase tracking-[0.4em] text-white/40">Secure Management Portal</p>
              </div>
            </div>

            <div className="space-y-4 lg:space-y-8 max-w-md">
              <h1 className="text-4xl lg:text-7xl font-medium leading-[0.9] tracking-tighter">
                PRECISION <br />
                <span className="italic text-accent">CONTROL.</span>
              </h1>
              <p className="text-base lg:text-xl font-light text-white/60 leading-relaxed">
                Empowering our medical and administrative staff with the tools they need to provide world-class
                healthcare in Jaunpur.
              </p>
            </div>

            <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold">
              Authorized Personnel Only • Secure Session • Phase 1.0
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex items-center justify-center p-8 lg:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-bl-full -z-10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-tr-full -z-10 blur-3xl" />

          <LoginForm />
        </div>
      </div>
    </main>
  )
}
