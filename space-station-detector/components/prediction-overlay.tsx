"use client"

import { useEffect, useRef, useState } from "react"

type BBox = [number, number, number, number] // [x, y, w, h]
type Prediction = { bbox: BBox; score: number; label: string }

export function PredictionOverlay({
  imageUrl,
  file,
  predictions,
}: {
  imageUrl: string
  file: File
  predictions: Prediction[]
}) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  useEffect(() => {
    const onLoad = () => {
      if (!imgRef.current) return
      const w = imgRef.current.naturalWidth
      const h = imgRef.current.naturalHeight
      setDims({ w, h })
    }
    const el = imgRef.current
    if (el?.complete && el.naturalWidth) {
      setDims({ w: el.naturalWidth, h: el.naturalHeight })
    } else {
      el?.addEventListener("load", onLoad)
      return () => el?.removeEventListener("load", onLoad)
    }
  }, [imageUrl, file])

  const normalize = (bbox: BBox): BBox => {
    // Accept either absolute pixels, or normalized (0..1). If appears normalized, scale up.
    const [x, y, w, h] = bbox
    const looksNormalized = [x, y, w, h].every((v) => v >= 0 && v <= 1)
    if (!looksNormalized) return bbox
    return [x * dims.w, y * dims.h, w * dims.w, h * dims.h]
  }

  return (
    <div className="relative w-full">
      <img
        ref={imgRef}
        src={imageUrl || "/placeholder.svg?height=400&width=600&query=uploaded%20image%20preview"} // use descriptive placeholder
        alt="Uploaded image"
        className="w-full h-auto rounded-lg border border-border/60"
        crossOrigin="anonymous"
      />
      {dims.w > 0 && dims.h > 0 && predictions.length > 0 && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label="Detections overlay"
        >
          {predictions.map((p, i) => {
            const [x, y, w, h] = normalize(p.bbox)
            const useAccent = p.score >= 0.8
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill="none"
                  stroke={useAccent ? "var(--color-accent)" : "var(--color-primary)"}
                  strokeWidth={Math.max(2, Math.min(w, h) * 0.012)}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <rect
                  x={x}
                  y={Math.max(0, y - 26)}
                  width={Math.max(64, p.label.length * 8 + 48)}
                  height={24}
                  fill={useAccent ? "var(--color-accent)" : "var(--color-primary)"}
                  rx="6"
                />
                <text
                  x={x + 10}
                  y={Math.max(0, y - 26) + 16}
                  fontSize="12"
                  fontWeight={600}
                  fill="var(--color-primary-foreground)"
                >
                  {p.label} {(p.score * 100).toFixed(0)}%
                </text>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}
