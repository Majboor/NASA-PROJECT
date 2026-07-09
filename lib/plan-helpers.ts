// Pure helper functions for the Voronova habitat questionnaire / plan flow.
// Extracted from app/app/page.tsx so the core transformation and validation
// logic can be unit-tested in isolation (no React / DOM required).

import type { CreatePlanRequest, Zone } from './api'

export interface ZoneConfiguration {
  zoneName: string
  interfaceCount: number
  separationNames: string[]
}

export interface QuestionnaireData {
  destination: string
  crewSize: string
  missionDuration: string
  structureType: string
  fairingSize: string
  priority: string
  selectedZones: string[]
  zoneConfigurations: ZoneConfiguration[]
}

export interface ZoneType {
  id: string
  name: string
  description: string
  icon: string
}

// The canonical set of habitat zone types offered in the questionnaire.
export const ZONE_TYPES: ZoneType[] = [
  { id: 'residential', name: 'Residential', description: 'Living quarters, bedrooms, common areas', icon: '🏠' },
  { id: 'commercial', name: 'Commercial', description: 'Office spaces, conference rooms, reception', icon: '🏢' },
  { id: 'industrial', name: 'Industrial', description: 'Workshops, storage, maintenance areas', icon: '🏭' },
  { id: 'research', name: 'Research', description: 'Laboratories, testing facilities, data centers', icon: '🔬' },
  { id: 'medical', name: 'Medical', description: 'Infirmary, emergency care, quarantine', icon: '🏥' },
  { id: 'agricultural', name: 'Agricultural', description: 'Greenhouses, food production, hydroponics', icon: '🌱' },
]

/**
 * Convert the questionnaire's zone configurations into the payload expected
 * by the plan-generation API (`POST /create_plan`).
 */
export function zonesToApiRequest(configs: ZoneConfiguration[]): CreatePlanRequest {
  const zones: Zone[] = (configs ?? []).map((config) => ({
    type: config.zoneName,
    compartments: config.separationNames,
  }))
  return { zones }
}

/**
 * Total number of internal separations (interfaces) across every configured zone.
 */
export function countTotalSeparations(configs: ZoneConfiguration[]): number {
  return (configs ?? []).reduce((sum, config) => sum + (config.interfaceCount || 0), 0)
}

/** Look up a zone type by its stable id. */
export function zoneTypeById(id: string, zoneTypes: ZoneType[] = ZONE_TYPES): ZoneType | undefined {
  return zoneTypes.find((z) => z.id === id)
}

/**
 * Whether every required questionnaire field has been answered and at least
 * one zone has been selected. Used to decide when the summary can be shown.
 */
export function isQuestionnaireComplete(data: QuestionnaireData): boolean {
  if (!data) return false
  const required = [
    data.destination,
    data.crewSize,
    data.missionDuration,
    data.structureType,
    data.fairingSize,
    data.priority,
  ]
  if (required.some((field) => !field || field.trim() === '')) return false
  return Array.isArray(data.selectedZones) && data.selectedZones.length > 0
}

/**
 * The user-facing success message shown once plans come back, with correct
 * singular/plural grammar for the plan count.
 */
export function plansReadyMessage(count: number): string {
  const suffix = count !== 1 ? 's' : ''
  return `🎉 Perfect! Your space habitat design is ready! I've generated ${count} floor plan${suffix}. Check the visualization panel to see your designs!`
}
