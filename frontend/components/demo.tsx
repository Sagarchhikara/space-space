"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"

export function Demo() {
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null) // local preview
  const [backendImage, setBackendImage] = useState<string | null>(null) // processed image from backend

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // show local preview immediately
    const reader = new FileReader()
    reader.onload = (event) => setPreview(event.target?.result as string)
    reader.readAsDataURL(file)

    // now send image to backend
    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Backend request failed")

      // backend returns JSON like { image_url: "http://localhost:5000/uploads/result.jpg" }
      const data = await res.json();
      console.log(data);  // <-- add this to see what is actually returned
      setBackendImage(data.annotated_image);  // must match key exactly
    } catch (err) {
      console.error("Upload error:", err)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
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
                <div className="glass-dark p-8 rounded-backendImagelg border-2 border-dashed border-primary/50 hover:border-primary transition-smooth cursor-pointer text-center">
                  <Upload size={32} className="mx-auto mb-4 text-primary" />
                  <p className="text-foreground/70 mb-2">Drag and drop your image here</p>
                  <p className="text-sm text-foreground/50">or click to browse</p>
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </div>
              </label>
            </div>

            {/* Preview Area */}
            <div className="flex-1 relative">
              {(preview || backendImage) ? (
                <div className="relative">
                  <img
                    src={backendImage || preview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <Loader2 size={32} className="text-primary animate-spin" />
                    </div>
                  )}
                  {!isLoading && backendImage && (
                    <div className="mt-4 p-4 glass rounded-lg">
                      <p className="text-sm text-foreground/70 mb-2">Processed by backend ✅</p>
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
