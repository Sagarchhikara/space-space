"use client"

import type React from "react"

import { useCallback, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PredictionOverlay } from "./prediction-overlay"
import { SAFETY_CLASSES } from "@/lib/classes"
import { UploadCloud, RefreshCcw, Play } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Kbd } from "@/components/ui/kbd"

type BBox = [number, number, number, number] // [x, y, w, h] in px or 0..1 normalized
type Prediction = { bbox: BBox; score: number; label: string }
type ImageResult = { index: number; predictions: Prediction[] }

export function UploadAndPredict() {
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<ImageResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onChooseFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files ? Array.from(e.target.files) : []
    setFiles(f)
    setResults(null)
    setError(null)
  }, [])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const f = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : []
    const onlyImages = f.filter((file) => file.type.startsWith("image/"))
    setFiles(onlyImages)
    setResults(null)
    setError(null)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const filePreviews = useMemo(() => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [files])

  const handleSubmit = useCallback(async () => {
    if (!files.length) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const form = new FormData()
      files.forEach((f) => form.append("images", f, f.name))
      console.log(
        "[v0] Sending images to /api/predict:",
        files.map((f) => f.name),
      )
      const res = await fetch("/api/predict", {
        method: "POST",
        body: form,
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Request failed with ${res.status}`)
      }
      const data = (await res.json()) as { results: ImageResult[] }
      setResults(data.results)
    } catch (err: any) {
      console.log("[v0] Prediction error:", err?.message)
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [files])

  const detectionsByIndex = useMemo(() => {
    const map = new Map<number, Prediction[]>()
    results?.forEach((r) => map.set(r.index, r.predictions))
    return map
  }, [results])

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          "group border-2 border-dashed rounded-xl p-10 text-center transition-all",
          "bg-card/70 hover:bg-card/80 card-glow cursor-pointer outline-0",
          "focus-visible:ring-2 focus-visible:ring-ring",
        )}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label="Upload images"
      >
        <div className="flex flex-col items-center gap-2">
          <UploadCloud className="size-7 text-primary" aria-hidden="true" />
          <p className="font-medium">Drag &amp; drop images here</p>
          <p className="text-sm text-muted-foreground">
            or click to browse{" "}
            <span className="ml-1">
              <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
            </span>
          </p>
        </div>
        <Input ref={inputRef} type="file" accept="image/*" multiple onChange={onChooseFiles} className="hidden" />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} disabled={!files.length || loading} className="gap-2">
          {loading ? (
            <>
              <Spinner className="size-4" />
              Detecting…
            </>
          ) : (
            <>
              <Play className="size-4" />
              Run detection
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setFiles([])
            setResults(null)
            setError(null)
          }}
          className="gap-2"
        >
          <RefreshCcw className="size-4" />
          Reset
        </Button>
      </div>

      {error && <div className="text-destructive">{error}</div>}

      {!files.length && (
        <Card>
          <CardHeader>
            <CardTitle>Expected Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {SAFETY_CLASSES.map((c) => (
                <li key={c} className="text-sm">
                  {c}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!!files.length && (
        <div className="grid gap-6 md:grid-cols-2">
          {filePreviews.map(({ file, url }, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base font-medium truncate">{file.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <PredictionOverlay
                  file={file}
                  imageUrl={results?.[idx]?.image || url} // use backend image if available
                  predictions={detectionsByIndex.get(idx) || []}
                />

                {!!detectionsByIndex.get(idx)?.length && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Detections</p>
                    <ul className="text-sm space-y-1">
                      {detectionsByIndex.get(idx)!.map((p, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span>{p.label}</span>
                          <span className="text-muted-foreground">({(p.score * 100).toFixed(1)}%)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
