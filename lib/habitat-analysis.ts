// Habitat Volume & Compliance Analyzer — pure computation module.
//
// A self-contained, deterministic engineering model for sizing a space
// habitat and checking it against NASA-derived design guidance. No network
// calls: every number below comes from the mission inputs. The reference
// values are approximations drawn from NASA human-spaceflight sizing
// literature (Net Habitable Volume studies, the Human Integration Design
// Handbook, and the classic duration-vs-volume curves) and are intended for
// educational design guidance, not flight certification.

export type StructureType = "Inflatable" | "Metallic" | "Hybrid"
export type Gravity = "Microgravity" | "Partial" | "Surface"

export interface MissionInputs {
  crew: number
  durationDays: number
  structureType: StructureType
  gravity: Gravity
  /** Launch fairing internal diameter in metres. */
  fairingDiameter: number
  /** IDs of the functional zones the designer has chosen to include. */
  selectedZones: string[]
}

export interface FunctionalZone {
  id: string
  name: string
  /** Habitable volume per crew member, in m^3. */
  perCrew: number
  /**
   * Contamination / activity class used for segregation checks.
   * "dirty": generates dust, odour, moisture or noise.
   * "clean": requires a low-contamination environment.
   * "neutral": equipment / logistics, no strong constraint.
   */
  activity: "clean" | "dirty" | "neutral"
  /** Whether the zone is essential for crew survival. */
  critical: boolean
  description: string
}

// Standard functional zones with approximate per-crew habitable volumes.
export const FUNCTIONAL_ZONES: FunctionalZone[] = [
  { id: "sleep", name: "Crew Quarters (Sleep)", perCrew: 3.6, activity: "clean", critical: true, description: "Private sleep and personal stowage." },
  { id: "lifesupport", name: "Life Support (ECLSS)", perCrew: 2.0, activity: "neutral", critical: true, description: "Air revitalisation, water recovery, thermal control." },
  { id: "waste", name: "Waste Management", perCrew: 0.9, activity: "dirty", critical: true, description: "Toilet / waste collection system." },
  { id: "hygiene", name: "Hygiene", perCrew: 1.1, activity: "dirty", critical: false, description: "Body cleansing and grooming." },
  { id: "food", name: "Food Prep (Galley)", perCrew: 1.5, activity: "clean", critical: true, description: "Food preparation and rehydration." },
  { id: "dining", name: "Dining / Wardroom", perCrew: 1.2, activity: "clean", critical: false, description: "Group meals and social gathering." },
  { id: "exercise", name: "Exercise", perCrew: 2.3, activity: "dirty", critical: false, description: "Resistive and aerobic countermeasures." },
  { id: "medical", name: "Medical", perCrew: 1.2, activity: "clean", critical: false, description: "Health checks and emergency care." },
  { id: "work", name: "Work / Science", perCrew: 2.5, activity: "clean", critical: false, description: "Research, maintenance and operations." },
  { id: "stowage", name: "Stowage / Logistics", perCrew: 3.0, activity: "neutral", critical: false, description: "Consumables, spares and cargo." },
  { id: "eva", name: "EVA / Airlock", perCrew: 1.5, activity: "dirty", critical: false, description: "Suit donning and airlock (dust ingress)." },
  { id: "agriculture", name: "Plant Growth", perCrew: 2.0, activity: "neutral", critical: false, description: "Crop growth for food and psychology." },
]

export function getZone(id: string): FunctionalZone | undefined {
  return FUNCTIONAL_ZONES.find((z) => z.id === id)
}

// Net Habitable Volume target per crew member (m^3) as a function of mission
// duration. Modelled as a saturating curve anchored to published guidance:
// short missions tolerate tight quarters, long missions approach ~27 m^3/person.
export function perCrewVolumeTargets(durationDays: number): {
  minimum: number
  recommended: number
  optimal: number
} {
  const d = Math.max(1, durationDays)
  // Saturating recommended curve: rises from ~10 toward ~27 m^3/person.
  const recommended = 27 - 17 * Math.exp(-d / 200)
  return {
    minimum: round(recommended * 0.62),
    recommended: round(recommended),
    optimal: round(recommended * 1.22),
  }
}

// Deployed usable diameter after accounting for structure type. Inflatable
// habitats expand well beyond their stowed fairing diameter; metallic hulls are
// fairing-limited. Values are multipliers on the fairing internal diameter.
const DEPLOY_FACTOR: Record<StructureType, number> = {
  Inflatable: 1.8,
  Hybrid: 1.35,
  Metallic: 1.0,
}
// Radial allowance lost to hull, insulation and outfitting, in metres.
const SHELL_ALLOWANCE: Record<StructureType, number> = {
  Inflatable: 0.35,
  Hybrid: 0.4,
  Metallic: 0.5,
}

const DECK_HEIGHT = 2.4 // usable metres per deck
const DECK_PACKING = 0.75 // fraction of a deck that becomes habitable volume

export interface GeometryResult {
  deployedDiameter: number
  usableDiameter: number
  deckArea: number
  usableVolumePerDeck: number
  decksNeeded: number
  habitatLength: number
}

export function computeGeometry(
  inputs: MissionInputs,
  requiredVolume: number
): GeometryResult {
  const deployedDiameter = round(inputs.fairingDiameter * DEPLOY_FACTOR[inputs.structureType])
  const usableDiameter = Math.max(1, round(deployedDiameter - 2 * SHELL_ALLOWANCE[inputs.structureType]))
  const radius = usableDiameter / 2
  const deckArea = round(Math.PI * radius * radius)
  const usableVolumePerDeck = round(deckArea * DECK_HEIGHT * DECK_PACKING)
  const decksNeeded = Math.max(1, Math.ceil(requiredVolume / usableVolumePerDeck))
  const habitatLength = round(decksNeeded * DECK_HEIGHT)
  return { deployedDiameter, usableDiameter, deckArea, usableVolumePerDeck, decksNeeded, habitatLength }
}

export interface ZoneAllocation {
  id: string
  name: string
  volume: number
  activity: FunctionalZone["activity"]
  share: number // 0..1 of total required volume
}

export type Severity = "pass" | "warn" | "fail"

export interface ComplianceCheck {
  id: string
  title: string
  severity: Severity
  detail: string
  /** Penalty subtracted from the 100-point score when not passing. */
  penalty: number
}

export interface AnalysisResult {
  targets: ReturnType<typeof perCrewVolumeTargets>
  requiredVolume: number // recommended NHV for the whole crew (m^3)
  minimumVolume: number
  optimalVolume: number
  allocations: ZoneAllocation[]
  allocatedVolume: number
  geometry: GeometryResult
  checks: ComplianceCheck[]
  score: number
  grade: string
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

function gradeFor(score: number): string {
  if (score >= 90) return "A"
  if (score >= 80) return "B"
  if (score >= 70) return "C"
  if (score >= 60) return "D"
  return "F"
}

export function analyzeHabitat(inputs: MissionInputs): AnalysisResult {
  const crew = Math.max(1, Math.round(inputs.crew))
  const targets = perCrewVolumeTargets(inputs.durationDays)
  const requiredVolume = round(targets.recommended * crew)
  const minimumVolume = round(targets.minimum * crew)
  const optimalVolume = round(targets.optimal * crew)

  const selected = inputs.selectedZones
    .map(getZone)
    .filter((z): z is FunctionalZone => Boolean(z))

  const allocatedVolume = round(selected.reduce((sum, z) => sum + z.perCrew * crew, 0))

  const allocations: ZoneAllocation[] = selected.map((z) => {
    const volume = round(z.perCrew * crew)
    return {
      id: z.id,
      name: z.name,
      volume,
      activity: z.activity,
      share: allocatedVolume > 0 ? round(volume / allocatedVolume) : 0,
    }
  })

  const geometry = computeGeometry(inputs, Math.max(requiredVolume, allocatedVolume))
  const checks = runChecks(inputs, crew, selected, requiredVolume, allocatedVolume, geometry)

  const penalty = checks.reduce((sum, c) => sum + (c.severity === "pass" ? 0 : c.penalty), 0)
  const score = Math.max(0, Math.min(100, 100 - penalty))

  return {
    targets,
    requiredVolume,
    minimumVolume,
    optimalVolume,
    allocations,
    allocatedVolume,
    geometry,
    checks,
    score,
    grade: gradeFor(score),
  }
}

function runChecks(
  inputs: MissionInputs,
  crew: number,
  selected: FunctionalZone[],
  requiredVolume: number,
  allocatedVolume: number,
  geometry: GeometryResult
): ComplianceCheck[] {
  const has = (id: string) => selected.some((z) => z.id === id)
  const checks: ComplianceCheck[] = []

  // 1. Critical zones present.
  const criticalIds = FUNCTIONAL_ZONES.filter((z) => z.critical).map((z) => z.id)
  const missingCritical = criticalIds.filter((id) => !has(id))
  checks.push(
    missingCritical.length === 0
      ? { id: "critical", title: "Life-critical zones present", severity: "pass", penalty: 0, detail: "Sleep, life support, waste and food prep are all included." }
      : {
          id: "critical",
          title: "Missing life-critical zones",
          severity: "fail",
          penalty: 12 * missingCritical.length,
          detail: `A survivable habitat needs ${missingCritical.map((id) => getZone(id)!.name).join(", ")}.`,
        }
  )

  // 2. Volume adequacy vs recommended NHV.
  if (allocatedVolume >= requiredVolume) {
    checks.push({ id: "volume", title: "Habitable volume meets NASA guidance", severity: "pass", penalty: 0, detail: `Allocated ${allocatedVolume} m³ vs ${requiredVolume} m³ recommended.` })
  } else if (allocatedVolume >= requiredVolume * 0.62) {
    checks.push({ id: "volume", title: "Habitable volume below recommended", severity: "warn", penalty: 10, detail: `Allocated ${allocatedVolume} m³ is under the ${requiredVolume} m³ recommended target (still above the tolerable minimum).` })
  } else {
    checks.push({ id: "volume", title: "Habitable volume below tolerable minimum", severity: "fail", penalty: 20, detail: `Allocated ${allocatedVolume} m³ is below the ${round(requiredVolume * 0.62)} m³ minimum for this crew and duration.` })
  }

  // 3. Exercise for missions beyond ~30 days (bone/muscle loss).
  if (inputs.durationDays > 30) {
    checks.push(
      has("exercise")
        ? { id: "exercise", title: "Exercise countermeasures included", severity: "pass", penalty: 0, detail: "Resistive exercise mitigates bone and muscle loss on long missions." }
        : { id: "exercise", title: "No exercise zone for a long mission", severity: "warn", penalty: 8, detail: `At ${inputs.durationDays} days, crew need dedicated exercise to counter musculoskeletal deconditioning.` }
    )
  }

  // 4. Medical for larger crews or longer missions.
  if (crew >= 4 || inputs.durationDays > 90) {
    checks.push(
      has("medical")
        ? { id: "medical", title: "Medical care provisioned", severity: "pass", penalty: 0, detail: "A medical area supports injury and illness response far from Earth." }
        : { id: "medical", title: "No medical zone", severity: "warn", penalty: 6, detail: "Crew size or duration warrants a dedicated medical area for autonomous care." }
    )
  }

  // 5. Contamination segregation (clean vs dirty).
  const dirty = selected.filter((z) => z.activity === "dirty")
  const clean = selected.filter((z) => z.activity === "clean")
  if (dirty.length > 0 && clean.length > 0) {
    checks.push({
      id: "segregation",
      title: "Clean / dirty zones require separation",
      severity: "warn",
      penalty: 4,
      detail: `Keep ${dirty.map((z) => z.name).join(", ")} physically separated from ${clean.map((z) => z.name).join(", ")} to avoid contamination and odour transfer.`,
    })
  } else {
    checks.push({ id: "segregation", title: "No clean/dirty adjacency conflicts", severity: "pass", penalty: 0, detail: "Current zone mix has no contamination-separation risk." })
  }

  // 6. Waste vs food prep — an explicit NASA hard rule.
  if (has("waste") && has("food")) {
    checks.push({ id: "wastefood", title: "Isolate waste from food prep", severity: "warn", penalty: 5, detail: "Waste management must never share a boundary with food preparation. Place them on different decks or opposite ends." })
  }

  // 7. Plant growth recommended for long-duration psychology & food.
  if (inputs.durationDays >= 180 && !has("agriculture")) {
    checks.push({ id: "agriculture", title: "Consider plant growth", severity: "warn", penalty: 3, detail: `At ${inputs.durationDays} days, a small crop area improves diet, air quality and crew morale.` })
  }

  // 8. Fairing / geometry feasibility.
  if (geometry.decksNeeded <= 4) {
    checks.push({ id: "fairing", title: "Fits the launch envelope", severity: "pass", penalty: 0, detail: `Design fits in ${geometry.decksNeeded} deck${geometry.decksNeeded > 1 ? "s" : ""} (~${geometry.habitatLength} m long, ${geometry.usableDiameter} m usable diameter).` })
  } else {
    checks.push({ id: "fairing", title: "Habitat may be difficult to launch", severity: "warn", penalty: 6, detail: `Requires ${geometry.decksNeeded} decks (~${geometry.habitatLength} m). Consider a wider fairing, an inflatable structure, or multiple launches.` })
  }

  return checks
}
