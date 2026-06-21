// Mission Volume Estimator — NASA-informed sizing heuristics.
//
// These formulas are simplified planning approximations drawn from public
// human-spaceflight habitability literature (e.g. NASA/TP habitability volume
// studies and ECLSS consumable rates). They are meant for early concept
// exploration inside Voronova, not for flight design.

export type DestinationId = "lunar" | "mars-transit" | "mars-surface" | "deep-space"

export interface Destination {
  id: DestinationId
  label: string
  blurb: string
  // Multiplier applied to recommended per-crew volume to reflect how much
  // "psychological breathing room" a mission profile demands.
  volumeFactor: number
  // Rough one-way trip context, purely for flavour in the UI.
  context: string
}

export const DESTINATIONS: Destination[] = [
  {
    id: "lunar",
    label: "Lunar Surface",
    blurb: "Short hops, frequent resupply, Earth in the window.",
    volumeFactor: 1.0,
    context: "~3 day transit",
  },
  {
    id: "mars-transit",
    label: "Mars Transit",
    blurb: "Months in a can — isolation drives volume up.",
    volumeFactor: 1.25,
    context: "~6-9 month cruise",
  },
  {
    id: "mars-surface",
    label: "Mars Surface",
    blurb: "Long stay, partial gravity, dust everywhere.",
    volumeFactor: 1.15,
    context: "~500 day stay",
  },
  {
    id: "deep-space",
    label: "Deep Space",
    blurb: "No resupply, no rescue. Room to stay sane.",
    volumeFactor: 1.35,
    context: "years, no return",
  },
]

export interface ZoneAllocation {
  name: string
  // Share of net habitable volume, 0..1
  share: number
  color: string
}

// Functional allocation of net habitable volume. Shares sum to 1.0.
export const ZONE_ALLOCATIONS: ZoneAllocation[] = [
  { name: "Crew Quarters", share: 0.2, color: "oklch(0.62 0.19 35)" },
  { name: "Stowage", share: 0.15, color: "oklch(0.55 0.14 250)" },
  { name: "Life Support (ECLSS)", share: 0.13, color: "oklch(0.66 0.13 200)" },
  { name: "Galley & Food", share: 0.12, color: "oklch(0.6 0.16 300)" },
  { name: "Exercise", share: 0.1, color: "oklch(0.63 0.14 150)" },
  { name: "Work / Command", share: 0.1, color: "oklch(0.7 0.15 90)" },
  { name: "Hygiene", share: 0.08, color: "oklch(0.6 0.12 220)" },
  { name: "Medical", share: 0.06, color: "oklch(0.66 0.17 20)" },
  { name: "Waste Management", share: 0.06, color: "oklch(0.5 0.1 280)" },
]

// Per-crew daily consumable rates (kg/person/day), open-loop baseline.
// Recycling (closed-loop ECLSS) can reclaim a large fraction of water & O2.
const DAILY = {
  waterKg: 27, // total incl. hygiene & food prep
  oxygenKg: 0.84,
  foodKg: 1.8, // packaged
}

const RECLAIM = {
  waterFraction: 0.9, // ISS-class water recovery
  oxygenFraction: 0.42, // O2 recovered from CO2 (Sabatier-class)
}

export interface EstimatorInput {
  crew: number
  durationDays: number
  destination: DestinationId
  closedLoop: boolean
}

export interface EstimatorResult {
  perCrewVolume: number // m³ recommended net habitable volume per crew member
  totalVolume: number // m³ total recommended net habitable volume
  minimumVolume: number // m³ hard "performance limit" floor
  pressurizedVolume: number // m³ incl. structure/systems overhead
  zones: Array<{ name: string; volume: number; share: number; color: string }>
  consumables: {
    waterKg: number
    oxygenKg: number
    foodKg: number
    totalKg: number
  }
  crewYears: number
  comfort: "Tight" | "Adequate" | "Comfortable"
}

/**
 * Recommended net habitable volume per crew member.
 * Grows with mission duration and asymptotes — long missions need more room,
 * but the marginal benefit tapers. Roughly: 10 m³ survivable floor rising
 * toward ~55 m³ for very long-duration, isolated missions.
 */
function perCrewVolume(durationDays: number, volumeFactor: number): number {
  const floor = 10 // performance limit, m³/person
  const gain = 22 * Math.log10(1 + durationDays / 20)
  const raw = (floor + gain) * volumeFactor
  return Math.min(raw, 60) // cap; beyond this returns diminish sharply
}

export function estimate(input: EstimatorInput): EstimatorResult {
  const dest = DESTINATIONS.find((d) => d.id === input.destination) ?? DESTINATIONS[0]
  const crew = Math.max(1, Math.round(input.crew))
  const days = Math.max(1, Math.round(input.durationDays))

  const perCrew = perCrewVolume(days, dest.volumeFactor)
  const totalVolume = perCrew * crew
  const minimumVolume = 10 * crew
  // Structure, systems racks, and unusable volume add overhead on top of NHV.
  const pressurizedVolume = totalVolume * 1.6

  const zones = ZONE_ALLOCATIONS.map((z) => ({
    name: z.name,
    volume: totalVolume * z.share,
    share: z.share,
    color: z.color,
  }))

  const crewDays = crew * days
  const waterRate = input.closedLoop ? DAILY.waterKg * (1 - RECLAIM.waterFraction) : DAILY.waterKg
  const oxygenRate = input.closedLoop ? DAILY.oxygenKg * (1 - RECLAIM.oxygenFraction) : DAILY.oxygenKg
  const waterKg = waterRate * crewDays
  const oxygenKg = oxygenRate * crewDays
  const foodKg = DAILY.foodKg * crewDays // food is not recycled

  const crewYears = crewDays / 365

  let comfort: EstimatorResult["comfort"] = "Adequate"
  if (perCrew < 18) comfort = "Tight"
  else if (perCrew >= 33) comfort = "Comfortable"

  return {
    perCrewVolume: perCrew,
    totalVolume,
    minimumVolume,
    pressurizedVolume,
    zones,
    consumables: {
      waterKg,
      oxygenKg,
      foodKg,
      totalKg: waterKg + oxygenKg + foodKg,
    },
    crewYears,
    comfort,
  }
}
