"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export function Testimonials() {
  const [current, setCurrent] = useState(0)

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechVision Inc",
      content: "VisionAI has transformed our product inspection process. The accuracy and speed are unmatched.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "CTO, DataFlow Systems",
      content: "Integrating VisionAI was seamless. The API documentation is excellent and support is responsive.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Product Manager, CloudScale",
      content: "Our customers love the real-time detection capabilities. It's a game-changer for our platform.",
      rating: 5,
    },
  ]

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-lg text-foreground/70">See what our customers have to say about VisionAI.</p>
        </div>

        <div className="relative">
          <Card className="glass p-12">
            <div className="flex gap-1 mb-6">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} size={20} className="fill-accent text-accent" />
              ))}
            </div>
            <p className="text-xl mb-6 text-foreground/90">"{testimonials[current].content}"</p>
            <div>
              <p className="font-semibold">{testimonials[current].name}</p>
              <p className="text-sm text-foreground/60">{testimonials[current].role}</p>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-2 glass rounded-full hover:shadow-lg hover:shadow-primary/30 transition-smooth"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-smooth ${
                    i === current ? "bg-primary w-8" : "bg-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
              className="p-2 glass rounded-full hover:shadow-lg hover:shadow-primary/30 transition-smooth"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
