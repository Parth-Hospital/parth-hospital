"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Mail, Instagram, Facebook, Twitter, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="bg-primary pt-24 pb-12 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90 opacity-50" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-20 border-b border-white/10">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tighter uppercase">Parth Hospital</span>
              <span className="text-xs uppercase tracking-widest text-white/60">Legacy of Care • Jaunpur</span>
            </div>
            <p className="text-white/60 leading-relaxed max-w-xs">
              Providing world-class healthcare with a human touch. Led by Dr. Subash Singh, we are committed to medical
              excellence and patient well-being.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-bold text-lg">Hospital</h4>
            <nav className="flex flex-col gap-4 text-white/60">
              {[
                { label: "Our Story", href: "/about" },
                { label: "Medical Services", href: "/services" },
                { label: "Dr. Subash Singh", href: "/doctor" },
                { label: "Contact Us", href: "/contact" },
                { label: "Staff Login", href: "/login" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-accent transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          <div className="space-y-6 lg:col-span-2">
            <h4 className="font-bold text-lg">Contact & Location</h4>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-white/60 leading-relaxed text-sm">
                    Polytechnic chauraha,
                    <br />
                    Jaunpur, Uttar Pradesh 222002
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-white/60 text-sm">parthhospitaljnp@gmail.com</p>
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 soft-depth">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">
                  Emergency Response 24/7
                </p>
                <p className="text-2xl font-bold text-accent">+91 78601 15757</p>
                <p className="text-xs text-white/40 mt-3 italic leading-relaxed">
                  Dedicated trauma unit and ambulance services available round the clock.
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-white/40 font-medium tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p>© 2026 Parth Hospital Jaunpur. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3 text-white/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs sm:text-sm">Developed and maintained by</p>
          <Link
            href="https://nexerve.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
          >
            <Image
              src="/Logo/logo-nobg-dark.png"
              alt="Nexerve"
              width={100}
              height={30}
              className="h-10 w-auto"
            />
          </Link>
        </motion.div>
      </div>
    </footer>
  )
}
