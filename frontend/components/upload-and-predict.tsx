"use client"

import type React from "react"

import { useCallback, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PredictionOverlay } from "./prediction-overlay"
import { SAFETY_CLASSES } from "@/lib/classes"
import { UploadCloud, RefreshCcw, Play, Camera } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

type BBox = [number, number, number, number]
type Prediction = { bbox: BBox; score: number; label: string }
type ImageResult = { index: number; predictions: Prediction[] }

export function UploadAndPredict() {
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<ImageResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const cameraRef = useRef<HTMLInputElement | null>(null)

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
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <div
            className={cn(
              "group border-2 border-dashed rounded-xl p-12 text-center transition-all",
              "bg-card/70 hover:bg-card/80 card-glow cursor-pointer outline-0",
              "focus-visible:ring-2 focus-visible:ring-ring",
            )}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={() => inputRef.current?.click()}
            role="button"
            aria-label="Upload images"
          >
            <div className="flex flex-col items-center gap-3">
              <UploadCloud className="size-8 text-primary" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground">Drag & drop images here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              </div>
            </div>
            <Input ref={inputRef} type="file" accept="image/*" multiple onChange={onChooseFiles} className="hidden" />
          </div>
        </div>

        {/* Camera Option */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => cameraRef.current?.click()}
            className={cn(
              "group border-2 border-dashed rounded-xl p-8 text-center transition-all",
              "bg-card/70 hover:bg-card/80 card-glow cursor-pointer outline-0 flex-1",
              "focus-visible:ring-2 focus-visible:ring-ring flex flex-col items-center justify-center",
            )}
          >
            <Camera className="size-8 text-accent mb-2" aria-hidden="true" />
            <p className="font-semibold text-foreground text-sm">Capture</p>
            <p className="text-xs text-muted-foreground mt-1">from camera</p>
          </button>
          <Input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onChooseFiles}
            className="hidden"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSubmit} disabled={!files.length || loading} className="gap-2" size="lg">
          {loading ? (
            <>
              <Spinner className="size-4" />
              Analyzing…
            </>
          ) : (
            <>
              <Play className="size-4" />
              Run Detection
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
          size="lg"
        >
          <RefreshCcw className="size-4" />
          Reset
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {!!files.length && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">AI Analysis Results</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {filePreviews.map(({ file, url }, idx) => (
              <Card key={idx} className="overflow-hidden border-border/60 card-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium truncate">{file.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PredictionOverlay
                    file={file}
                    imageUrl={results?.[idx]?.image || url}
                    predictions={detectionsByIndex.get(idx) || []}
                  />

                  {!!detectionsByIndex.get(idx)?.length && (
                    <div className="pt-2 border-t border-border/40">
                      <p className="text-sm font-semibold mb-3 text-foreground">Detections</p>
                      <div className="space-y-2">
                        {detectionsByIndex.get(idx)!.map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-card/50">
                            <span className="text-sm font-medium text-foreground">{p.label}</span>
                            <span className="text-xs font-semibold text-accent">{(p.score * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!detectionsByIndex.get(idx)?.length && results && (
                    <div className="pt-2 border-t border-border/40">
                      <p className="text-sm text-muted-foreground">No objects detected</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      {!files.length && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Detectable Objects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {SAFETY_CLASSES.map((c) => (
                <Badge key={c} variant="outline" className="border-primary/40 text-primary">
                  {c}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import { Badge } from "@/components/ui/badge"
