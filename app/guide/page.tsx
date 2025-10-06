"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GuidePage() {
  const [choice, setChoice] = useState<"everyone" | "professional" | null>(null)

  const everyonePdf = "/Kid nova _2.pdf"
  const professionalPdf = "/PHD Guide nova .pdf"
  const pdfSrc = choice === "professional" ? professionalPdf : everyonePdf

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Guides</h1>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Back to Home</Link>
        </div>

        {!choice ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/50 p-6 bg-card/50">
              <h2 className="text-lg font-semibold mb-2">For Professionals</h2>
              <p className="text-sm text-muted-foreground mb-4">Deep-dive guide with engineering context and criteria.</p>
              <Button onClick={() => setChoice("professional")}>Open Professional Guide</Button>
            </div>
            <div className="rounded-xl border border-border/50 p-6 bg-card/50">
              <h2 className="text-lg font-semibold mb-2">For Everyone</h2>
              <p className="text-sm text-muted-foreground mb-4">Friendly walkthrough for non-technical audiences.</p>
              <Button variant="outline" onClick={() => setChoice("everyone")}>Open Everyone Guide</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{choice === "professional" ? "Professional Guide" : "For Everyone"}</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setChoice(null)}>Change Choice</Button>
                <a href={pdfSrc} download className="inline-block">
                  <Button>Download PDF</Button>
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-border/50 overflow-hidden bg-card">
              <iframe src={pdfSrc} className="w-full h-[75vh]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


