"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StarField } from "@/components/star-field"
import { ArrowLeft, BookOpen, Download, FileText, GraduationCap, Sparkles, Users } from "lucide-react"

export default function GuidePage() {
  const [choice, setChoice] = useState<"everyone" | "professional" | null>(null)

  const everyonePdf = "/Kid nova _2.pdf"
  const professionalPdf = "/PHD Guide nova .pdf"
  const pdfSrc = choice === "professional" ? professionalPdf : everyonePdf

  const cards = [
    {
      key: "professional" as const,
      icon: GraduationCap,
      eyebrow: "Advanced",
      title: "For Professionals",
      desc: "A deep-dive guide covering engineering constraints, evaluation criteria, and the science behind every design tradeoff.",
      cta: "Open Professional Guide",
      points: ["Design constraints & systems", "Evaluation criteria", "Mission-grade context"],
    },
    {
      key: "everyone" as const,
      icon: Users,
      eyebrow: "Beginner-friendly",
      title: "For Everyone",
      desc: "A friendly, visual walkthrough that makes space habitat design approachable — no engineering background required.",
      cta: "Open Everyone Guide",
      points: ["Plain-language explanations", "Illustrated examples", "Fun for all ages"],
    },
  ]

  return (
    <div id="main-content" className="relative min-h-screen overflow-hidden bg-background">
      <StarField />
      <div className="grain-overlay" aria-hidden />
      {/* Ambient glows */}
      <div className="nebula-glow left-[-6rem] top-24 h-72 w-72" aria-hidden />
      <div
        className="nebula-glow right-[-6rem] top-1/2 h-80 w-80"
        style={{ background: "radial-gradient(circle, oklch(0.45 0.15 250 / 0.4), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/15 to-orange-500/15 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <BookOpen className="h-4 w-4" />
              Knowledge Base
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Learn to design{" "}
              <span className="text-gradient-brand">off-world habitats</span>
            </h1>
            <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
              Choose the guide that fits you. Both open right here in the browser and are
              available as downloadable PDFs.
            </p>
          </div>
          <Link
            href="/"
            className="link-underline inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {!choice ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {cards.map((card) => (
              <button
                key={card.key}
                onClick={() => setChoice(card.key)}
                className="card-lift group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-7 text-left backdrop-blur-sm"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-orange-500/20 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <card.icon className="h-6 w-6" />
                </div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/80">
                  {card.eyebrow}
                </div>
                <h2 className="mb-2 text-xl font-semibold text-card-foreground">{card.title}</h2>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                <ul className="mb-6 space-y-2">
                  {card.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-foreground/80">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {card.cta}
                  <FileText className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-orange-500 transition-transform duration-500 group-hover:scale-x-100" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                {choice === "professional" ? (
                  <GraduationCap className="h-4 w-4 text-primary" />
                ) : (
                  <Users className="h-4 w-4 text-primary" />
                )}
                {choice === "professional" ? "Professional Guide" : "For Everyone Guide"}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setChoice(null)}>
                  <ArrowLeft className="h-4 w-4" />
                  Change Choice
                </Button>
                <a href={pdfSrc} download className="inline-block">
                  <Button className="btn-glow bg-gradient-to-r from-primary to-orange-500 text-primary-foreground hover:from-primary/90 hover:to-orange-500/90">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl shadow-primary/5">
              <iframe
                src={pdfSrc}
                title={choice === "professional" ? "Professional guide PDF" : "For Everyone guide PDF"}
                className="h-[75vh] w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
