"use client"

import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { CTA } from "@/components/cta"
import { Navigation } from "@/components/navigation"
import { StarField } from "@/components/star-field"
import { LoadingScreen } from "@/components/loading-screen"
import { useState, useEffect } from "react"
import { GuideModal } from "@/components/guide-modal"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const [showAlert, setShowAlert] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Show guide after loading completes
    setShowGuide(true)
  }

  // Reset loading on page refresh
  useEffect(() => {
    setIsLoading(true)
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
    <main className="relative min-h-screen overflow-hidden bg-background">
      {showGuide && (
        <GuideModal open={showGuide} onClose={() => setShowGuide(false)} />
      )}
      {showAlert && (
        <div className="fixed top-14 left-0 right-0 z-40">
          <div className="mx-auto max-w-5xl px-4">
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-200 backdrop-blur-sm px-4 py-2 shadow-md text-xs sm:text-sm">
              We have limited resources for training and serving this app. Cloud credits are scarce, so uptime may vary. Please don’t mind occasional downtime.
            </div>
          </div>
        </div>
      )}
      <StarField />
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA onOpenGuide={() => setShowGuide(true)} />
    </main>
  )
}
