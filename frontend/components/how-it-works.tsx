"use client"

import { Card } from "@/components/ui/card"
import { Upload, Zap, CheckCircle } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Image",
      description: "Simply upload an image or provide a URL to analyze.",
      number: "01",
    },
    {
      icon: Zap,
      title: "AI Processing",
      description: "Our neural networks analyze and identify objects in milliseconds.",
      number: "02",
    },
    {
      icon: CheckCircle,
      title: "Get Results",
      description: "Receive detailed detection results with confidence scores.",
      number: "03",
    },
  ]

  return (
    <section id="how-it-works" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Three simple steps to unlock the power of AI vision.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="relative">
                <Card className="glass p-8 h-full hover:shadow-lg hover:shadow-secondary/30 transition-smooth">
                  <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>
                  <Icon size={32} className="text-secondary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-foreground/70">{step.description}</p>
                </Card>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-secondary to-transparent" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
