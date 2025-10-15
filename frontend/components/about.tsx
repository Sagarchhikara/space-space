"use client"

import { Card } from "@/components/ui/card"
import { Brain, Zap, Shield } from "lucide-react"

export function About() {
  const features = [
    {
      icon: Brain,
      title: "Advanced Neural Networks",
      description: "Built on state-of-the-art deep learning models trained on millions of images.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time processing with sub-100ms latency for instant results.",
    },
    {
      icon: Shield,
      title: "Enterprise Grade",
      description: "Secure, scalable, and reliable infrastructure for mission-critical applications.",
    },
  ]

  return (
    <section id="about" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">VisionAI</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Revolutionary AI-powered object detection technology that understands and analyzes visual content with
            unprecedented accuracy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card
                key={i}
                className="glass p-8 hover:shadow-lg hover:shadow-primary/30 transition-smooth group cursor-pointer"
              >
                <div className="mb-4 inline-block p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg group-hover:shadow-lg group-hover:shadow-primary/50 transition-smooth">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
