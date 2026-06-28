"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { VideoModal } from "@/components/video-modal"
import Link from "next/link"
import { OrbitSystem } from "@/components/orbit-system"
import { Rocket, PlayCircle, Radio } from "lucide-react"

/**
 * Hero variant "B" — an A/B alternative to the default <Hero />.
 *
 * Distinct from variant A in three deliberate ways:
 *  1. Headline: mission-control framing ("Design the Habitat. Survive the Void.")
 *     instead of "Think Beyond Earth, Imagine the Future".
 *  2. Layout: a single centered column with the OrbitSystem as a full-bleed
 *     background layer (A uses a 2-column split on desktop).
 *  3. CTA: primary action reads "Launch the Designer" and a compact inline
 *     mission-status stat strip replaces A's 3-card grid.
 *
 * Activated via the `?variant=b` query toggle (see app/page.tsx).
 */
export function HeroB() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 pt-20">
      {/* Full-bleed orbit as ambient background (all breakpoints) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20 sm:opacity-25 md:opacity-30">
        <div className="scale-110 sm:scale-125 md:scale-150">
          <OrbitSystem />
        </div>
      </div>

      {/* Radial vignette to keep centered text legible over the orbit */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_75%)]" />

      <div className="container relative z-20 mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* Mission badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-gradient-to-r from-primary/20 to-orange-500/20 px-5 py-2.5 text-sm font-medium text-primary backdrop-blur-md shadow-lg">
          <Radio className="h-4 w-4 animate-pulse" />
          <span className="font-semibold tracking-wide uppercase">Mission Control · Habitat Lab</span>
        </div>

        {/* Distinct headline */}
        <h1 className="mt-8 text-balance text-4xl font-bold uppercase leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Design the Habitat.
          <br />
          <span className="bg-gradient-to-r from-primary via-orange-400 to-orange-500 bg-clip-text text-transparent">
            Survive the Void.
          </span>
        </h1>

        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-orange-500" />

        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Voronova turns raw mission constraints — crew size, volume, radiation, days
          in orbit — into buildable space-habitat layouts. Simulate it, iterate it,
          then export a design that&apos;s ready for the launch pad.
        </p>

        {/* Distinct CTA */}
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link href="/app">
            <Button
              size="lg"
              className="group w-full bg-gradient-to-r from-primary to-orange-500 text-primary-foreground shadow-xl hover:from-primary/90 hover:to-orange-500/90 sm:w-auto"
            >
              <Rocket className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Launch the Designer
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-primary/50 bg-card/50 backdrop-blur-sm hover:bg-primary/10 sm:w-auto"
            onClick={() => setShowVideo(true)}
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Watch the Mission Brief
          </Button>
        </div>

        {/* Compact inline mission-status strip (replaces A's stat cards) */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-2xl border border-border/50 bg-card/30 px-6 py-4 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground sm:text-xl">AI-Guided</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Layout Engine</span>
          </div>
          <div className="hidden h-8 w-px bg-border/70 sm:block" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground sm:text-xl">2D → 3D</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Instant Preview</span>
          </div>
          <div className="hidden h-8 w-px bg-border/70 sm:block" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground sm:text-xl">Any Crew</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Any Mission</span>
          </div>
        </div>

        <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground/70">
          Variant B · NASA Space Apps
        </p>
      </div>

      {showVideo && (
        <VideoModal open={showVideo} onClose={() => setShowVideo(false)} src="/sample_3d_video.mp4" />
      )}
    </section>
  )
}
