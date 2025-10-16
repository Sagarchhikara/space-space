import { NextResponse } from "next/server"

type BBox = [number, number, number, number]
type Prediction = { bbox: BBox; score: number; label: string }

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const files = form.getAll("images") as File[]

    if (!files.length) {
      return NextResponse.json(
        { error: "No images found in form-data under key 'images'" },
        { status: 400 }
      )
    }

    const endpoint = process.env.MODEL_API_URL || "https://space-space-6nu3.onrender.com/predict"
    const authHeader = process.env.MODEL_API_AUTH_HEADER

    // Process all images
    const results = await Promise.all(
      files.map(async (file, index) => {
        let predictions: Prediction[] = []
        let imageData: string | null = null

        if (endpoint) {
          const fd = new FormData()
          fd.append("file", file, file.name)

          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: fd,
          })

          if (!res.ok) {
            const bodyText = await res.text()
            console.error("External model error:", res.status, bodyText)
            throw new Error(`Model API error: ${res.status}`)
          }

          // Backend returns JSON: { detections: [...], image: "data:image/png;base64,..." }
          const raw = await res.json()
          predictions = transformExternalResponse(raw.detections)
          imageData = raw.image
        } else {
          // fallback random predictions
          predictions = await mockPredict(file)
          imageData = null
        }

        return { index, predictions, image: imageData }
      })
    )

    return NextResponse.json({ results }, { status: 200 })
  } catch (err: any) {
    console.error("/api/predict error:", err?.message)
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    )
  }
}

// ----- Helpers -----

// Map backend response to Prediction[]
function transformExternalResponse(raw: any): Prediction[] {
  try {
    if (Array.isArray(raw)) {
      return raw.map((d: any) => {
        if (d?.box && typeof d.box === "object") {
          const { x, y, w, h } = d.box
          return {
            bbox: [x, y, w, h],
            score: Number(d.confidence ?? d.score ?? 0),
            label: String(d.name ?? d.label ?? d.category ?? "Unknown"),
          }
        }
        if (Array.isArray(d?.bbox)) {
          const [x, y, w, h] = d.bbox
          return {
            bbox: [Number(x), Number(y), Number(w), Number(h)],
            score: Number(d.score ?? 0),
            label: String(d.label ?? d.category ?? "Unknown"),
          }
        }
        if (Array.isArray(d) && d.length >= 6) {
          const [x, y, w, h, score, label] = d
          return {
            bbox: [Number(x), Number(y), Number(w), Number(h)],
            score: Number(score),
            label: String(label),
          }
        }
        return { bbox: [0, 0, 0, 0], score: 0, label: "Unknown" }
      })
    }
    if (raw?.detections && Array.isArray(raw.detections)) {
      return transformExternalResponse(raw.detections)
    }
  } catch (e) {
    console.log("[transformExternalResponse error]", e)
  }
  return []
}

// Mock prediction if backend not available
async function mockPredict(file: File): Promise<Prediction[]> {
  const labels = [
    "OxygenTank",
    "NitrogenTank",
    "FirstAidBox",
    "FireAlarm",
    "SafetySwitchPanel",
    "EmergencyPhone",
    "FireExtinguisher",
  ]
  const count = Math.floor(Math.random() * 4) // 0..3
  return Array.from({ length: count }).map(() => {
    const w = 0.2 + Math.random() * 0.3
    const h = 0.15 + Math.random() * 0.3
    const x = Math.random() * (1 - w)
    const y = Math.random() * (1 - h)
    const label = labels[Math.floor(Math.random() * labels.length)]
    const score = 0.5 + Math.random() * 0.49
    return { bbox: [x, y, w, h], score, label }
  })
}
