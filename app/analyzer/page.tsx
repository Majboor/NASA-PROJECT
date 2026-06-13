"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts"
import {
  ArrowLeft,
  Gauge,
  Ruler,
  Layers,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Rocket,
  Copy,
  Check,
} from "lucide-react"
import {
  analyzeHabitat,
  FUNCTIONAL_ZONES,
  type MissionInputs,
  type StructureType,
  type Gravity,
  type Severity,
} from "@/lib/habitat-analysis"

const DURATIONS = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "180 days", value: 180 },
  { label: "1 year", value: 365 },
  { label: "2+ years", value: 730 },
]
const STRUCTURES: StructureType[] = ["Inflatable", "Metallic", "Hybrid"]
const GRAVITIES: Gravity[] = ["Microgravity", "Partial", "Surface"]
const FAIRINGS = [4.5, 8.4, 10]

const ACTIVITY_COLOR: Record<string, string> = {
  clean: "oklch(0.65 0.12 200)",
  dirty: "oklch(0.62 0.17 45)",
  neutral: "oklch(0.55 0.05 250)",
}
const SEVERITY_ICON: Record<Severity, typeof CheckCircle2> = {
  pass: CheckCircle2,
  warn: AlertTriangle,
  fail: XCircle,
}
const SEVERITY_CLASS: Record<Severity, string> = {
  pass: "text-emerald-400",
  warn: "text-amber-400",
  fail: "text-red-400",
}

const DEFAULT_ZONES = ["sleep", "lifesupport", "waste", "food", "exercise", "medical", "stowage", "hygiene"]

function Segment({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { label: string; value: string | number }[]
  value: string | number
  onChange: (v: string | number) => void
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value
          return (
            <button
              key={String(o.value)}
              onClick={() => onChange(o.value)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-primary bg-primary/20 text-foreground"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function AnalyzerPage() {
  const [crew, setCrew] = useState(4)
  const [durationDays, setDurationDays] = useState(180)
  const [structureType, setStructureType] = useState<StructureType>("Metallic")
  const [gravity, setGravity] = useState<Gravity>("Microgravity")
  const [fairingDiameter, setFairingDiameter] = useState(8.4)
  const [selectedZones, setSelectedZones] = useState<string[]>(DEFAULT_ZONES)
  const [copied, setCopied] = useState(false)

  const inputs: MissionInputs = { crew, durationDays, structureType, gravity, fairingDiameter, selectedZones }
  const result = useMemo(() => analyzeHabitat(inputs), [crew, durationDays, structureType, gravity, fairingDiameter, selectedZones])

  const toggleZone = (id: string) =>
    setSelectedZones((prev) => (prev.includes(id) ? prev.filter((z) => z !== id) : [...prev, id]))

  const volumeBars = [
    { name: "Minimum", value: result.minimumVolume, fill: "oklch(0.5 0.05 250)" },
    { name: "Recommended", value: result.requiredVolume, fill: "oklch(0.62 0.17 45)" },
    { name: "Optimal", value: result.optimalVolume, fill: "oklch(0.6 0.14 150)" },
    { name: "Your design", value: result.allocatedVolume, fill: "oklch(0.65 0.12 200)" },
  ]

  const gradeColor =
    result.grade === "A" || result.grade === "B"
      ? "text-emerald-400"
      : result.grade === "C" || result.grade === "D"
        ? "text-amber-400"
        : "text-red-400"

  const copyReport = () => {
    const lines = [
      `VORONOVA — Habitat Compliance Report`,
      `Mission: ${crew} crew · ${durationDays} days · ${structureType} · ${gravity} · ${fairingDiameter} m fairing`,
      `Compliance score: ${result.score}/100 (grade ${result.grade})`,
      `Recommended NHV: ${result.requiredVolume} m³  |  Allocated: ${result.allocatedVolume} m³`,
      `Geometry: ${result.geometry.usableDiameter} m usable dia · ${result.geometry.decksNeeded} deck(s) · ~${result.geometry.habitatLength} m long`,
      ``,
      `Zone allocations:`,
      ...result.allocations.map((a) => `  - ${a.name}: ${a.volume} m³ (${Math.round(a.share * 100)}%)`),
      ``,
      `Checks:`,
      ...result.checks.map((c) => `  [${c.severity.toUpperCase()}] ${c.title} — ${c.detail}`),
    ]
    navigator.clipboard?.writeText(lines.join("\n")).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-lg sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Voronova" width={36} height={36} className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight">VORONOVA</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/app">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Designer
              </Button>
            </Link>
            <Button size="sm" onClick={copyReport} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
              {copied ? "Copied" : "Copy report"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Gauge className="h-3.5 w-3.5" /> Engineering analysis
          </div>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Habitat Volume &amp; Compliance Analyzer</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Size your habitat against NASA-derived guidance. Set the mission, pick the functional zones, and get net
            habitable volume, a launch-fairing fit, and a live compliance score — no image generation required.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
          {/* Inputs */}
          <div className="space-y-5">
            <Card className="space-y-5 border-border/60 bg-card/40 p-5">
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Crew size</Label>
                  <span className="text-sm font-semibold text-foreground">{crew}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={crew}
                  onChange={(e) => setCrew(Number(e.target.value))}
                  className="mt-2 w-full accent-[oklch(0.62_0.17_45)]"
                />
              </div>
              <Segment
                label="Mission duration"
                options={DURATIONS}
                value={durationDays}
                onChange={(v) => setDurationDays(Number(v))}
              />
              <Segment
                label="Structure type"
                options={STRUCTURES.map((s) => ({ label: s, value: s }))}
                value={structureType}
                onChange={(v) => setStructureType(v as StructureType)}
              />
              <Segment
                label="Gravity environment"
                options={GRAVITIES.map((g) => ({ label: g, value: g }))}
                value={gravity}
                onChange={(v) => setGravity(v as Gravity)}
              />
              <Segment
                label="Launch fairing dia."
                options={FAIRINGS.map((f) => ({ label: `${f} m`, value: f }))}
                value={fairingDiameter}
                onChange={(v) => setFairingDiameter(Number(v))}
              />
            </Card>

            <Card className="border-border/60 bg-card/40 p-5">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Functional zones</Label>
              <div className="mt-3 space-y-2">
                {FUNCTIONAL_ZONES.map((z) => {
                  const active = selectedZones.includes(z.id)
                  return (
                    <button
                      key={z.id}
                      onClick={() => toggleZone(z.id)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                        active
                          ? "border-primary/60 bg-primary/10"
                          : "border-border/50 bg-transparent hover:border-primary/40"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: ACTIVITY_COLOR[z.activity] }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                          {z.name}
                          {z.critical && (
                            <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-300">
                              critical
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">{z.description}</span>
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{z.perCrew} m³/ea</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: ACTIVITY_COLOR.clean }} /> clean
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: ACTIVITY_COLOR.dirty }} /> dirty
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: ACTIVITY_COLOR.neutral }} /> neutral
                </span>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Score + geometry row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="flex items-center gap-5 border-border/60 bg-card/40 p-5">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.25 0.03 250 / 0.5)" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.score / 100) * 264} 264`}
                      className={gradeColor}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className={`text-2xl font-bold ${gradeColor}`}>{result.grade}</span>
                    <span className="text-[10px] text-muted-foreground">{result.score}/100</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Compliance score</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Live grade across {result.checks.length} NASA-derived design checks. Adjust the mission or zones on
                    the left to see it respond.
                  </p>
                </div>
              </Card>

              <Card className="border-border/60 bg-card/40 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Ruler className="h-4 w-4 text-primary" /> Geometry &amp; fit
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Stat icon={Boxes} label="Usable diameter" value={`${result.geometry.usableDiameter} m`} />
                  <Stat icon={Layers} label="Decks needed" value={`${result.geometry.decksNeeded}`} />
                  <Stat icon={Rocket} label="Habitat length" value={`~${result.geometry.habitatLength} m`} />
                  <Stat icon={Gauge} label="Vol / deck" value={`${result.geometry.usableVolumePerDeck} m³`} />
                </div>
              </Card>
            </div>

            {/* Charts row */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border-border/60 bg-card/40 p-5">
                <div className="mb-1 text-sm font-semibold text-foreground">Net habitable volume</div>
                <p className="mb-3 text-xs text-muted-foreground">
                  Your allocated volume vs the tolerable minimum, recommended target and optimal level for this crew and
                  duration.
                </p>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeBars} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.65 0.02 250)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "oklch(0.65 0.02 250)" }} axisLine={false} tickLine={false} unit="" />
                      <Tooltip
                        cursor={{ fill: "oklch(0.3 0.03 250 / 0.3)" }}
                        contentStyle={{
                          background: "oklch(0.15 0.02 250)",
                          border: "1px solid oklch(0.25 0.03 250)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(v: number) => [`${v} m³`, "Volume"]}
                      />
                      <ReferenceLine y={result.requiredVolume} stroke="oklch(0.62 0.17 45)" strokeDasharray="4 4" />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {volumeBars.map((b, i) => (
                          <Cell key={i} fill={b.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="border-border/60 bg-card/40 p-5">
                <div className="mb-1 text-sm font-semibold text-foreground">Volume by zone</div>
                <p className="mb-3 text-xs text-muted-foreground">
                  How the {result.allocatedVolume} m³ of habitable volume is distributed across your chosen zones.
                </p>
                {result.allocations.length === 0 ? (
                  <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
                    Select zones to see the breakdown.
                  </div>
                ) : (
                  <div className="flex h-56 items-center gap-2">
                    <div className="h-full w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip
                            contentStyle={{
                              background: "oklch(0.15 0.02 250)",
                              border: "1px solid oklch(0.25 0.03 250)",
                              borderRadius: 8,
                              fontSize: 12,
                            }}
                            formatter={(v: number, n: string) => [`${v} m³`, n]}
                          />
                          <Pie
                            data={result.allocations}
                            dataKey="volume"
                            nameKey="name"
                            innerRadius="55%"
                            outerRadius="90%"
                            paddingAngle={2}
                            stroke="none"
                          >
                            {result.allocations.map((a) => (
                              <Cell key={a.id} fill={ACTIVITY_COLOR[a.activity]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 text-xs">
                      {result.allocations
                        .slice()
                        .sort((a, b) => b.volume - a.volume)
                        .map((a) => (
                          <div key={a.id} className="flex items-center gap-2">
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ACTIVITY_COLOR[a.activity] }} />
                            <span className="min-w-0 flex-1 truncate text-muted-foreground">{a.name}</span>
                            <span className="tabular-nums text-foreground">{Math.round(a.share * 100)}%</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Compliance checklist */}
            <Card className="border-border/60 bg-card/40 p-5">
              <div className="mb-3 text-sm font-semibold text-foreground">Compliance checks</div>
              <div className="space-y-2.5">
                {result.checks.map((c) => {
                  const Icon = SEVERITY_ICON[c.severity]
                  return (
                    <div key={c.id} className="flex gap-3 rounded-lg border border-border/40 bg-background/30 p-3">
                      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${SEVERITY_CLASS[c.severity]}`} />
                      <div>
                        <div className="text-sm font-medium text-foreground">{c.title}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{c.detail}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Reference values are approximations drawn from NASA human-spaceflight sizing literature (Net Habitable
              Volume studies and the Human Integration Design Handbook) and are provided for educational design guidance,
              not flight certification.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Ruler
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/30 p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
    </div>
  )
}
