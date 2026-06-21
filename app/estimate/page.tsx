"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { StarField } from "@/components/star-field"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DESTINATIONS, estimate, type DestinationId } from "@/lib/mission-estimator"
import { Ruler, Droplets, Wind, Utensils, Recycle, Users, CalendarClock, ArrowRight, Rocket } from "lucide-react"

function fmt(n: number, digits = 0) {
  return n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 })
}

const comfortStyles: Record<string, string> = {
  Tight: "text-yellow-300 border-yellow-500/40 bg-yellow-500/10",
  Adequate: "text-sky-300 border-sky-500/40 bg-sky-500/10",
  Comfortable: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
}

export default function EstimatePage() {
  const [crew, setCrew] = useState(4)
  const [duration, setDuration] = useState(180)
  const [destination, setDestination] = useState<DestinationId>("mars-transit")
  const [closedLoop, setClosedLoop] = useState(true)

  const result = useMemo(
    () => estimate({ crew, durationDays: duration, destination, closedLoop }),
    [crew, duration, destination, closedLoop],
  )

  const maxZone = Math.max(...result.zones.map((z) => z.volume))
  const activeDest = DESTINATIONS.find((d) => d.id === destination)!

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <StarField />
      <Navigation />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-20">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Rocket className="h-3.5 w-3.5" /> Mission Volume Estimator
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">How big should your habitat be?</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Set your crew and mission profile. Voronova estimates the net habitable volume, how it splits across
              functional zones, and the life-support consumables you&apos;ll need to pack.
            </p>
          </div>
          <Link href="/app">
            <Button variant="outline" className="gap-2">
              Design it <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Controls */}
          <Card className="lg:col-span-2 p-6 gap-6 border-border/60 bg-card/60 backdrop-blur-sm">
            {/* Destination */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-foreground">Destination</label>
              <div className="grid grid-cols-2 gap-2">
                {DESTINATIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDestination(d.id)}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      destination === d.id
                        ? "border-primary bg-primary/15 ring-1 ring-primary/40"
                        : "border-border/60 bg-background/40 hover:border-primary/40"
                    }`}
                  >
                    <div className="text-sm font-medium text-foreground">{d.label}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{d.context}</div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{activeDest.blurb}</p>
            </div>

            {/* Crew */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Users className="h-4 w-4 text-primary" /> Crew size
                </label>
                <span className="text-sm font-bold text-primary">{crew}</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={crew}
                onChange={(e) => setCrew(Number(e.target.value))}
                className="voronova-range w-full"
                aria-label="Crew size"
              />
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>1</span>
                <span>8 astronauts</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CalendarClock className="h-4 w-4 text-primary" /> Mission duration
                </label>
                <span className="text-sm font-bold text-primary">
                  {duration >= 365 ? `${(duration / 365).toFixed(1)} yr` : `${duration} days`}
                </span>
              </div>
              <input
                type="range"
                min={7}
                max={1095}
                step={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="voronova-range w-full"
                aria-label="Mission duration in days"
              />
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>1 week</span>
                <span>3 years</span>
              </div>
            </div>

            {/* Closed loop toggle */}
            <button
              onClick={() => setClosedLoop((v) => !v)}
              className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                closedLoop ? "border-emerald-500/50 bg-emerald-500/10" : "border-border/60 bg-background/40"
              }`}
            >
              <span className="flex items-center gap-2">
                <Recycle className={`h-4 w-4 ${closedLoop ? "text-emerald-400" : "text-muted-foreground"}`} />
                <span className="text-sm font-medium text-foreground">Closed-loop ECLSS</span>
              </span>
              <span
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  closedLoop ? "bg-emerald-500" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    closedLoop ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
            <p className="-mt-3 text-[11px] text-muted-foreground">
              Recycles water &amp; oxygen (ISS-class recovery). Turn off to size an open-loop, resupply-heavy mission.
            </p>
          </Card>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Headline volume */}
            <Card className="p-6 gap-4 border-border/60 bg-card/60 backdrop-blur-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Ruler className="h-4 w-4 text-primary" /> Recommended net habitable volume
                  </div>
                  <div className="mt-1 text-4xl font-bold text-foreground">
                    {fmt(result.totalVolume)} <span className="text-xl text-muted-foreground">m³</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {fmt(result.perCrewVolume, 1)} m³ per crew member · {fmt(result.pressurizedVolume)} m³ pressurized
                    (with systems &amp; structure)
                  </div>
                </div>
                <div
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${comfortStyles[result.comfort]}`}
                >
                  {result.comfort}
                </div>
              </div>

              {/* Volume vs minimum bar */}
              <div>
                <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>Survival minimum: {fmt(result.minimumVolume)} m³</span>
                  <span>Recommended: {fmt(result.totalVolume)} m³</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-background/60">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/60 to-primary"
                    style={{ width: `${Math.min(100, (result.totalVolume / (result.totalVolume * 1.05)) * 100)}%` }}
                  />
                  <div
                    className="absolute inset-y-0 w-0.5 bg-yellow-400"
                    style={{ left: `${Math.min(100, (result.minimumVolume / result.totalVolume) * 95)}%` }}
                    title="Performance limit"
                  />
                </div>
              </div>
            </Card>

            {/* Zone breakdown */}
            <Card className="p-6 gap-4 border-border/60 bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Volume by functional zone</h2>
                <span className="text-xs text-muted-foreground">{result.zones.length} zones</span>
              </div>
              <div className="space-y-2.5">
                {result.zones.map((z) => (
                  <div key={z.name} className="flex items-center gap-3">
                    <div className="w-36 shrink-0 text-xs text-foreground sm:w-44">{z.name}</div>
                    <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-background/50">
                      <div
                        className="flex h-full items-center rounded-md transition-all duration-500"
                        style={{ width: `${Math.max(6, (z.volume / maxZone) * 100)}%`, backgroundColor: z.color }}
                      />
                    </div>
                    <div className="w-24 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                      {fmt(z.volume, 1)} m³ · {fmt(z.share * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Consumables */}
            <Card className="p-6 gap-4 border-border/60 bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Life-support consumables</h2>
                <span className="text-xs text-muted-foreground">
                  {fmt(result.crewYears, 1)} crew-years · {closedLoop ? "closed-loop" : "open-loop"}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <ConsumableTile icon={<Droplets className="h-4 w-4" />} label="Water" value={result.consumables.waterKg} accent="text-sky-300" />
                <ConsumableTile icon={<Wind className="h-4 w-4" />} label="Oxygen" value={result.consumables.oxygenKg} accent="text-cyan-300" />
                <ConsumableTile icon={<Utensils className="h-4 w-4" />} label="Food" value={result.consumables.foodKg} accent="text-amber-300" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-4 py-3">
                <span className="text-sm text-muted-foreground">Total upmass to carry</span>
                <span className="text-lg font-bold text-foreground">{fmt(result.consumables.totalKg)} kg</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Planning estimates from public human-spaceflight habitability &amp; ECLSS figures. Use them to frame a
                design, then explore the real layout in the{" "}
                <Link href="/app" className="text-primary underline-offset-2 hover:underline">
                  habitat designer
                </Link>
                .
              </p>
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .voronova-range {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 9999px;
          background: color-mix(in oklab, var(--muted) 70%, transparent);
          outline: none;
        }
        .voronova-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          background: var(--primary);
          border: 2px solid var(--background);
          cursor: pointer;
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 30%, transparent);
        }
        .voronova-range::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          background: var(--primary);
          border: 2px solid var(--background);
          cursor: pointer;
        }
      `}</style>
    </main>
  )
}

function ConsumableTile({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent: string
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-4">
      <div className={`flex items-center gap-2 text-xs ${accent}`}>
        {icon} {label}
      </div>
      <div className="mt-1 text-xl font-bold text-foreground">
        {fmt(value)} <span className="text-xs font-normal text-muted-foreground">kg</span>
      </div>
    </div>
  )
}
