"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

// Sample 5-star reviews - In production, these would be fetched from Google Places API
const reviews: Review[] = [
  {
    id: "1",
    author: "Rajesh Kumar",
    rating: 5,
    text: "Excellent orthopedic care! Dr. Subash Singh is very experienced and caring. The hospital has modern facilities and the staff is very helpful.",
    date: "2 weeks ago",
  },
  {
    id: "2",
    author: "Priya Sharma",
    rating: 5,
    text: "Best hospital in Jaunpur for orthopedic treatment. Got my fracture treated here and the recovery was smooth. Highly recommended!",
    date: "1 month ago",
  },
  {
    id: "3",
    author: "Amit Verma",
    rating: 5,
    text: "Professional service and clean environment. Dr. Singh's expertise in orthopedic surgery is unmatched. Thank you for the excellent care.",
    date: "3 weeks ago",
  },
  {
    id: "4",
    author: "Sunita Devi",
    rating: 5,
    text: "Very satisfied with the treatment. The staff is courteous and the doctor takes time to explain everything. Great hospital!",
    date: "1 month ago",
  },
  {
    id: "5",
    author: "Vikash Singh",
    rating: 5,
    text: "Outstanding orthopedic services. The operation theatre is well-equipped and the post-surgery care was excellent. Thank you Parth Hospital!",
    date: "2 months ago",
  },
]

export function GoogleReviews() {
  return (
    <section className="py-20 bg-white border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">5.0</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">What Our Patients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read what our patients have to say about their experience at Parth Hospital
          </p>
          <a
            href="https://www.google.com/maps/place/Parth+Hospital/@25.7366524,82.6735418,17z/data=!4m16!1m9!3m8!1s0x39903bb8da5fca85:0xfdd6dc1b711b1787!2sParth+Hospital!8m2!3d25.7366524!4d82.6761167!9m1!1b1!16s%2Fg%2F11gd4hx_7_!3m5!1s0x39903bb8da5fca85:0xfdd6dc1b711b1787!8m2!3d25.7366524!4d82.6761167!16s%2Fg%2F11gd4hx_7_?entry=ttu&g_ep=EgoyMDI2MDEwNi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mt-4"
          >
            <span>View all reviews on Google</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">{review.author.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{review.author}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{review.text}</p>
              <p className="text-xs text-muted-foreground">{review.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

