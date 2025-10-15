"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"

export function Demo() {
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 2000)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <section id="demo" className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Try It Now</h2>
          <p className="text-lg text-foreground/70">Upload an image to see VisionAI in action.</p>
        </div>

        <Card className="glass p-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Upload Area */}
            <div className="flex-1">
              <label className="block">
                <div className="glass-dark p-8 rounded-lg border-2 border-dashed border-primary/50 hover:border-primary transition-smooth cursor-pointer text-center">
                  <Upload size={32} className="mx-auto mb-4 text-primary" />
                  <p className="text-foreground/70 mb-2">Drag and drop your image here</p>
                  <p className="text-sm text-foreground/50">or click to browse</p>
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </div>
              </label>
            </div>

            {/* Preview Area */}
            <div className="flex-1">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <Loader2 size={32} className="text-primary animate-spin" />
                    </div>
                  )}
                  {!isLoading && (
                    <div className="mt-4 p-4 glass rounded-lg">
                      <p className="text-sm text-foreground/70 mb-2">Detected Objects:</p>
                      <div className="space-y-2">
                        {["Person (98%)", "Dog (95%)", "Tree (87%)"].map((obj, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{obj.split("(")[0]}</span>
                            <span className="text-primary">{obj.split("(")[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 glass rounded-lg flex items-center justify-center">
                  <p className="text-foreground/50">Image preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
