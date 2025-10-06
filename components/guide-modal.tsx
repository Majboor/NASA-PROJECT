"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, ArrowLeft, ArrowRight, BookOpenText, BadgeCheck } from "lucide-react"

type GuideKey = "professional" | "everyone"

interface GuideStep {
  title: string
  description?: string
  bullets?: string[]
}

interface GuideModalProps {
  open: boolean
  onClose: () => void
}

export function GuideModal({ open, onClose }: GuideModalProps) {
  const [selectedGuide, setSelectedGuide] = useState<GuideKey | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const sampleImages = [
    "/sample3D_floorplan.jpeg",
    "/sample3D_floorplan_angle2.jpeg",
    "/sample3D_floorplan_angle3.jpeg",
    "/sample3D_floorplan_angle4.jpeg",
    "/sample2D_floorplan_angle2.jpeg",
    "/WhatsApp Image 2025-10-05 at 9.40.21 PM.jpeg",
  ]

  const professionalSteps: GuideStep[] = useMemo(
    () => [
      {
        title: "A conversational Generative Space Architecture Engine",
        description:
          "We built an AI-first workflow to design space habitats through guided conversation and interactive visualization.",
        bullets: [
          "LLM custom-trained on NASA habitat data for expert dialogue",
          "Diffusion model fine-tuned on historical NASA habitat designs",
          "2D→3D with Trellis (SLAT) exporting GLB and 3D Gaussian formats",
        ],
      },
      {
        title: "Requirements and Mission Context",
        description:
          "We start by capturing mission goals, destination, crew size, and duration to frame the design space.",
        bullets: [
          "Destination: Lunar Surface, Mars Transit, Deep Space",
          "Crew size and mission duration",
          "Priority tradeoffs (Mass, Volume, Performance, Crew Health/Safety)",
        ],
      },
      {
        title: "Resources and Physical Constraints",
        description:
          "Key constraints bound the pressure vessel geometry and architecture choices.",
        bullets: [
          "Launch fairing size (diameter) is a primary constraint",
          "Mass, volume, power, life support envelopes",
          "Interfaces to logistics, EVA, docking, and payloads",
        ],
      },
      {
        title: "Challenges and Evaluation Criteria",
        description:
          "Designs are evaluated against mission objectives and engineering limits.",
        bullets: [
          "Habitable volume per crew vs. mission duration",
          "Zoning and separation for safety and operations",
          "Reliability, redundancy, and maintainability",
        ],
      },
      {
        title: "Reference Scenarios and Corpora",
        description: "LLM grounding and examples include:",
        bullets: [
          "LUNAR SURFACE HABITAT",
          "MARS TRANSIT HABITAT",
          "SCENARIO 12.0 PCM",
          "TRANSHAB (NASA large-scale inflatable spacecraft)",
        ],
      },
      {
        title: "Systems and Zoning Considerations",
        bullets: [
          "Residential, Life Support, Safety & Health, Physical Integrity, Power & Utilities",
          "Hygiene & Waste Management, Galley & Meals, Health Maintenance",
          "Operational: Research/Science, Medical, Industrial/Maintenance, Logistics/Stowage",
        ],
      },
      {
        title: "From 2D Concepts to 3D Assets",
        description:
          "We convert generated plans to detailed 3D using Trellis (SLAT). Export to GLB or 3D Gaussian for downstream tools.",
        bullets: [
          "Curated asset library (chairs, tables, equipment, utilities)",
          "Export and handoff into a 3D editor for stacking/connecting layouts",
          "Iterate with AI edits or manual adjustments",
        ],
      },
    ],
    []
  )

  const everyoneSteps: GuideStep[] = useMemo(
    () => [
      {
        title: "Your Home in Space: The Habitat Layout Creator",
        description:
          "Tell the app about your mission, and it chats with you to design a space home step by step.",
        bullets: [
          "Made for everyone — easy, guided, and visual",
          "Built by Team Voronova",
        ],
      },
      {
        title: "What the app asks first",
        bullets: [
          "Requirements and Mission Context",
          "Resources and Physical Constraints",
          "Challenges and Evaluation Criteria",
          "Examples: mission duration, crew size, destination",
        ],
      },
      {
        title: "Designing the Space Home",
        bullets: [
          "AI suggests zones and room layouts (2D)",
          "Convert to 3D with realistic assets",
          "Export or keep editing in a 3D tool",
        ],
      },
      {
        title: "What a habitat needs",
        bullets: [
          "Residential, Life Support, Safety & Health, Physical Integrity, Power & Utilities",
          "Hygiene & Waste, Galley & Meals, Health Maintenance",
          "Work zones: Research, Medical, Maintenance, Logistics/Stowage",
        ],
      },
      {
        title: "Training and Examples",
        bullets: [
          "Inspired by NASA references: Lunar Surface and Mars Transit habitats",
          "Scenario 12.0 PCM and TransHab examples",
          "Diffusion and LLMs guide better designs",
        ],
      },
    ],
    []
  )

  const steps = selectedGuide === "professional" ? professionalSteps : everyoneSteps
  const isLast = selectedGuide !== null && stepIndex === steps.length - 1

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mx-4 w-full max-w-3xl rounded-2xl border border-border/50 bg-card/95 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <BookOpenText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Welcome Guide</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-primary/10">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {selectedGuide === null ? (
          <div className="p-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border/50 bg-card/50 p-5 flex flex-col">
              <div className="relative mb-2 h-40 w-full overflow-hidden rounded-lg border border-border/50">
                <Image src="/sample3D_floorplan.jpeg" alt="Professional" fill className="object-cover" />
              </div>
              <div className="text-center text-xs text-muted-foreground mb-2">Created by our software</div>
              <h4 className="text-base font-semibold text-foreground mb-1">Professional</h4>
              <p className="text-sm text-muted-foreground mb-4">Deep dive into constraints, systems, and evaluation criteria.</p>
              <Button onClick={() => { setSelectedGuide("professional"); setStepIndex(0) }} className="mt-auto">Start Professional Guide</Button>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/50 p-5 flex flex-col">
              <div className="relative mb-2 h-40 w-full overflow-hidden rounded-lg border border-border/50">
                <Image src="/sample2D_floorplan_angle2.jpeg" alt="For Everyone" fill className="object-cover" />
              </div>
              <div className="text-center text-xs text-muted-foreground mb-2">Created by our software</div>
              <h4 className="text-base font-semibold text-foreground mb-1">For Everyone</h4>
              <p className="text-sm text-muted-foreground mb-4">Simple, friendly walkthrough of how the app works.</p>
              <Button onClick={() => { setSelectedGuide("everyone"); setStepIndex(0) }} className="mt-auto" variant="outline">Start For Everyone</Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative h-56 w-full overflow-hidden rounded-lg border border-border/50">
                <Image src={sampleImages[stepIndex % sampleImages.length]} alt="Guide visual" fill className="object-cover" />
                <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-muted-foreground">Created by our software</div>
              </div>
              <div className="flex flex-col">
                <div>
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{selectedGuide === "professional" ? "Professional Guide" : "For Everyone"}</div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">{steps[stepIndex]?.title}</h4>
                  {steps[stepIndex]?.description && (
                    <p className="text-sm text-muted-foreground mb-3">{steps[stepIndex]?.description}</p>
                  )}
                  {steps[stepIndex]?.bullets && (
                    <ul className="space-y-1">
                      {steps[stepIndex]!.bullets!.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <BadgeCheck className="h-4 w-4 text-primary mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-auto pt-5 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Step {stepIndex + 1} of {steps.length}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (stepIndex === 0) {
                          setSelectedGuide(null)
                        } else {
                          setStepIndex((i) => Math.max(0, i - 1))
                        }
                      }}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    {isLast ? (
                      <Link href="/app">
                        <Button className="bg-gradient-to-r from-primary to-orange-500 text-primary-foreground">
                          Open the App <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    ) : (
                      <Button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>
                        Next <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuideModal


