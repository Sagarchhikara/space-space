import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { UploadAndPredict } from "@/components/upload-and-predict"
import { SAFETY_CLASSES } from "@/lib/classes"

export default function Page() {
  return (
    <main className="min-h-dvh">
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-14 flex flex-col gap-8">
        <header className="rounded-xl border bg-card/70 card-glow relative overflow-hidden">
          <div className="bg-grid absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true" />
          <div className="relative p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/placeholder-logo.svg" width={28} height={28} alt="Mission logo" className="opacity-90" />
              <Badge className="bg-accent text-accent-foreground">Beta</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-balance">Space Station Safety Object Detector</h1>
            <p className="text-muted-foreground text-pretty mt-3 max-w-prose">
              Upload images to detect Oxygen/Nitrogen tanks, First Aid, Fire safety, and emergency equipment. The
              backend forwards to your ML endpoint and overlays results for rapid review.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/50 text-primary">
                7 classes
              </Badge>
              <Badge variant="outline" className="border-primary/50 text-primary">
                Fast inference
              </Badge>
              <Badge variant="outline" className="border-primary/50 text-primary">
                Overlay visuals
              </Badge>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="border border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Step 1</CardTitle>
              <CardDescription>Upload or drag &amp; drop</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Step 2</CardTitle>
              <CardDescription>Run detection</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Step 3</CardTitle>
              <CardDescription>Review results</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="border border-border/80 card-glow">
          <CardHeader>
            <CardTitle>Upload images</CardTitle>
            <CardDescription>
              Images are sent to the backend, forwarded to your ML model endpoint, then detections are rendered.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <UploadAndPredict />
            <div>
              <p className="text-sm font-medium mb-2">Legend</p>
              <div className="flex flex-wrap gap-2">
                {SAFETY_CLASSES.map((c) => (
                  <Badge key={c} variant="outline" className="border-primary/40 text-primary">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
