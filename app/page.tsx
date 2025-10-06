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

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Show guide after loading completes
    setShowGuide(true)
  }

  // Reset loading on page refresh
  useEffect(() => {
    setIsLoading(true)
  }, [])

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {showGuide && (
        <GuideModal open={showGuide} onClose={() => setShowGuide(false)} />
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
