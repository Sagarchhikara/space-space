import { NextResponse } from "next/server"

type BBox = [number, number, number, number]
type Prediction = { bbox: BBox; score: number; label: string }

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const files = form.getAll("images") as File[]
    console.log(
      "[v0] /api/predict received files:",
      files.map((f) => f.name),
    )

    if (!files.length) {
      return NextResponse.json({ error: "No images found in form-data under key 'images'" }, { status: 400 })
    }

    const endpoint = process.env.MODEL_API_URL // e.g., "https://your-inference-endpoint/predict"
    const authHeader = process.env.MODEL_API_AUTH_HEADER // e.g., "Bearer sk-123" (optional)

    // Map over images and collect predictions
    const results = await Promise.all(
      files.map(async (file, index) => {
        let predictions: Prediction[] = []
        if (endpoint) {
          // Forward to external model API
          const fd = new FormData()
          fd.append("image", file, file.name)
          // You can also add other params your endpoint expects, e.g. confidence thresholds
          // fd.append("confidence", "0.25")

          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: fd,
          })

          if (!res.ok) {
            const bodyText = await res.text()
            console.log("[v0] External model error:", res.status, bodyText)
            throw new Error(`Model API error: ${res.status}`)
          }

          const raw = await res.json()
          predictions = transformExternalResponse(raw)
        } else {
          predictions = await mockPredict(file)
        }
        return { index, predictions }
      }),
    )

    return NextResponse.json({ results }, { status: 200 })
  } catch (err: any) {
    console.log("[v0] /api/predict error:", err?.message)
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 })
  }
}

// Update this mapper to match your model's JSON.
// Supported inputs (examples):
// - Ultralytics-like: [{name, confidence, box: {x,y,w,h}}] (pixels) or normalized [0..1]
// - COCO-style: [x,y,w,h] with 'category' and 'score'
function transformExternalResponse(raw: any): Prediction[] {
  try {
    if (Array.isArray(raw)) {
      // Case: array of detections
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
          // [x,y,w,h,score,label]
          const [x, y, w, h, score, label] = d
          return { bbox: [Number(x), Number(y), Number(w), Number(h)], score: Number(score), label: String(label) }
        }
        // Fallback minimal
        return { bbox: [0, 0, 0, 0], score: 0, label: "Unknown" }
      })
    }
    if (raw?.detections && Array.isArray(raw.detections)) {
      return transformExternalResponse(raw.detections)
    }
  } catch (e) {
    console.log("[v0] transformExternalResponse error:", e)
  }
  return []
}

async function mockPredict(file: File): Promise<Prediction[]> {
  // Create 0-3 boxes with random sizes positioned within the image.
  // Box coordinates are normalized 0..1; overlay will scale to pixels.
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
  const preds: Prediction[] = Array.from({ length: count }).map(() => {
    const w = 0.2 + Math.random() * 0.3
    const h = 0.15 + Math.random() * 0.3
    const x = Math.random() * (1 - w)
    const y = Math.random() * (1 - h)
    const label = labels[Math.floor(Math.random() * labels.length)]
    const score = 0.5 + Math.random() * 0.49
    return { bbox: [x, y, w, h], score, label }
  })
  return preds
}
