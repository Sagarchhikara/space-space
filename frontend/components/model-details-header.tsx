"use client"

import { Badge } from "@/components/ui/badge"
import { Zap, Rocket, Users } from "lucide-react"

export function ModelDetailsHeader() {
  return (
    <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Model Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Space Station Safety Detector</h1>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">mAP Score:</span> 0.85
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Model:</span> YOLO v8
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Made by:</span> Maniac Coders
                </span>
              </div>
            </div>
          </div>

          {/* Right: Status Badges */}
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Badge className="bg-accent/20 text-accent border border-accent/30">7 Classes</Badge>
            <Badge className="bg-primary/20 text-primary border border-primary/30">Real-time</Badge>
            <Badge className="bg-green-500/20 text-green-600 border border-green-500/30">Active</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
