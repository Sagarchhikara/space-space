"use client"

import { Card } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      title: "Real-time Detection",
      description: "Process images instantly with sub-100ms latency.",
      gradient: "from-primary to-secondary",
    },
    {
      title: "High Accuracy",
      description: "99.9% accuracy rate across 10,000+ object categories.",
      gradient: "from-secondary to-accent",
    },
    {
      title: "Batch Processing",
      description: "Handle thousands of images simultaneously.",
      gradient: "from-accent to-primary",
    },
    {
      title: "API Integration",
      description: "Easy REST API for seamless integration.",
      gradient: "from-primary to-accent",
    },
    {
      title: "Custom Models",
      description: "Train custom models for specific use cases.",
      gradient: "from-secondary to-primary",
    },
    {
      title: "24/7 Support",
      description: "Enterprise-grade support and SLA guarantees.",
      gradient: "from-accent to-secondary",
    },
  ]

  return (
    <section id="features" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Everything you need for advanced AI vision capabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card
              key={i}
              className={`glass p-8 hover:shadow-lg transition-smooth group cursor-pointer overflow-hidden relative`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-smooth`}
              />
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
