"use client"

import { Button } from "@/components/ui/button"
import { Github, ExternalLink, FileText, Settings } from "lucide-react"

export function BottomNavigation() {
  return (
    <div className="border-t border-border/40 bg-card/50 backdrop-blur-sm mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Info */}
          <div className="text-xs text-muted-foreground">
            <p>Space Station Safety Challenge • Duality AI</p>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" className="gap-2 text-xs" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4" />
                Docs
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Challenge
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
