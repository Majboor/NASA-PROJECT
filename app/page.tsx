"use client"

import { Hero } from "@/components/hero"
import { HeroB } from "@/components/hero-b"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { CTA } from "@/components/cta"
import { Navigation } from "@/components/navigation"
import { StarField } from "@/components/star-field"
import { LoadingScreen } from "@/components/loading-screen"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import dynamic from "next/dynamic"

// Code-split the guide modal: it is only needed after the loading screen
// finishes (or on CTA click), so keep it out of the initial home bundle.
const GuideModal = dynamic(
  () => import("@/components/guide-modal").then((m) => m.GuideModal),
  { ssr: false },
)

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const [showAlert, setShowAlert] = useState(true)
  // A/B hero toggle: ?variant=b renders the alternate hero (default = A).
  const [variant, setVariant] = useState<"a" | "b">("a")

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Show guide after loading completes
    setShowGuide(true)
  }

  // Reset loading on page refresh
  useEffect(() => {
    setIsLoading(true)
  }, [])

  // Read the A/B hero variant from the URL (?variant=b). Runs client-side only,
  // which is required because this is a fully static export (no server params).
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("variant")
    setVariant(v?.toLowerCase() === "b" ? "b" : "a")
  }, [])

  // Auto-dismiss header alert after 5s
  useEffect(() => {
    if (!showAlert) return
    const t = setTimeout(() => setShowAlert(false), 5000)
    return () => clearTimeout(t)
  }, [showAlert])

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <main id="main-content" className="relative min-h-screen overflow-hidden bg-background">
      <ScrollProgress />
      <div className="grain-overlay" aria-hidden />
      {showGuide && (
        <GuideModal open={showGuide} onClose={() => setShowGuide(false)} />
      )}
      {showAlert && (
        <div className="fixed top-14 left-0 right-0 z-40" role="status" aria-live="polite">
          <div className="mx-auto max-w-5xl px-4">
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-200 backdrop-blur-sm px-4 py-2 shadow-md text-xs sm:text-sm">
              We have limited resources for training and serving this app. Cloud credits are scarce, so uptime may vary. Please don’t mind occasional downtime.
            </div>
          </div>
        </div>
      )}
      <StarField />
      <Navigation />
      {variant === "b" ? <HeroB /> : <Hero />}
      <div className="reveal-on-scroll">
        <Features />
      </div>
      <div className="reveal-on-scroll">
        <HowItWorks />
      </div>
      <div className="reveal-on-scroll">
        <CTA onOpenGuide={() => setShowGuide(true)} />
      </div>
      <Footer />
    </main>
  )
}
