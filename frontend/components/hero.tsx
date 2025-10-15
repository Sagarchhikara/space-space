"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface HeroProps {
  scrollY: number
}

export function Hero({ scrollY }: HeroProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-animate opacity-20" />

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle w-1 h-1 bg-primary/50"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float ${3 + particle.id}s ease-in-out infinite`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
      ))}

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-10" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 glass rounded-full">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm text-foreground/80">Powered by Advanced AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Intelligent Vision
          </span>
          <br />
          <span className="text-foreground">for the Future</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
          Experience cutting-edge AI object detection that transforms how you see and interact with the world. Powered
          by state-of-the-art neural networks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 transition-smooth text-base"
          >
            Start Detecting
            <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 transition-smooth text-base bg-transparent"
          >
            Watch Demo
          </Button>
        </div>

        {/* Floating cards */}
        <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
          {[
            { label: "99.9%", desc: "Accuracy" },
            { label: "<100ms", desc: "Response Time" },
            { label: "1M+", desc: "Objects Detected" },
          ].map((stat, i) => (
            <div key={i} className="glass p-4 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-smooth">
              <div className="text-2xl font-bold text-primary">{stat.label}</div>
              <div className="text-xs text-foreground/60">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </section>
  )
}
