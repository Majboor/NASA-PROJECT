"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Play } from "lucide-react"

interface VideoModalProps {
  open: boolean
  onClose: () => void
  src: string
}

export function VideoModal({ open, onClose, src }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-4xl rounded-xl border border-border/50 bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="text-sm font-semibold text-foreground">Product Demo</div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-primary/10">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative bg-black">
          <video ref={videoRef} src={src} className="w-full h-auto" controls={isPlaying} />
          {!isPlaying && (
            <button
              className="absolute inset-0 flex items-center justify-center text-white"
              onClick={() => {
                setIsPlaying(true)
                videoRef.current?.play()
              }}
            >
              <div className="rounded-full bg-white/20 border border-white/50 p-6 hover:bg-white/30 transition">
                <Play className="h-10 w-10" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoModal


