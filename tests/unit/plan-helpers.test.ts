import { describe, it, expect } from 'vitest'
import {
  ZONE_TYPES,
  zonesToApiRequest,
  countTotalSeparations,
  zoneTypeById,
  isQuestionnaireComplete,
  plansReadyMessage,
  type QuestionnaireData,
  type ZoneConfiguration,
} from '@/lib/plan-helpers'

const sampleConfigs: ZoneConfiguration[] = [
  { zoneName: 'Residential', interfaceCount: 2, separationNames: ['Bedroom', 'Common Area'] },
  { zoneName: 'Research', interfaceCount: 3, separationNames: ['Lab A', 'Lab B', 'Data Center'] },
]

const completeData: QuestionnaireData = {
  destination: 'Mars Transit',
  crewSize: '4',
  missionDuration: '180 days',
  structureType: 'Rigid',
  fairingSize: 'Large',
  priority: 'Safety',
  selectedZones: ['Residential', 'Research'],
  zoneConfigurations: sampleConfigs,
}

describe('zonesToApiRequest', () => {
  it('maps zone configurations into the create_plan payload shape', () => {
    expect(zonesToApiRequest(sampleConfigs)).toEqual({
      zones: [
        { type: 'Residential', compartments: ['Bedroom', 'Common Area'] },
        { type: 'Research', compartments: ['Lab A', 'Lab B', 'Data Center'] },
      ],
    })
  })

  it('returns an empty zones array for empty or nullish input', () => {
    expect(zonesToApiRequest([])).toEqual({ zones: [] })
    // @ts-expect-error exercising defensive nullish handling
    expect(zonesToApiRequest(undefined)).toEqual({ zones: [] })
  })
})

describe('countTotalSeparations', () => {
  it('sums interfaceCount across all zones', () => {
    expect(countTotalSeparations(sampleConfigs)).toBe(5)
  })

  it('is zero for no zones and tolerates missing counts', () => {
    expect(countTotalSeparations([])).toBe(0)
    expect(
      countTotalSeparations([{ zoneName: 'X', interfaceCount: undefined as any, separationNames: [] }]),
    ).toBe(0)
  })
})

describe('zoneTypeById', () => {
  it('finds a known zone type', () => {
    expect(zoneTypeById('medical')?.name).toBe('Medical')
  })

  it('returns undefined for an unknown id', () => {
    expect(zoneTypeById('nope')).toBeUndefined()
  })

  it('exposes six canonical zone types with unique ids', () => {
    expect(ZONE_TYPES).toHaveLength(6)
    expect(new Set(ZONE_TYPES.map((z) => z.id)).size).toBe(6)
  })
})

describe('isQuestionnaireComplete', () => {
  it('is true when every field is answered and a zone is selected', () => {
    expect(isQuestionnaireComplete(completeData)).toBe(true)
  })

  it('is false when a required field is blank', () => {
    expect(isQuestionnaireComplete({ ...completeData, priority: '' })).toBe(false)
    expect(isQuestionnaireComplete({ ...completeData, destination: '   ' })).toBe(false)
  })

  it('is false when no zones are selected', () => {
    expect(isQuestionnaireComplete({ ...completeData, selectedZones: [] })).toBe(false)
  })
})

describe('plansReadyMessage', () => {
  it('uses the plural form for multiple plans', () => {
    expect(plansReadyMessage(3)).toContain('3 floor plans')
  })

  it('uses the singular form for exactly one plan', () => {
    expect(plansReadyMessage(1)).toContain('1 floor plan.')
    expect(plansReadyMessage(1)).not.toContain('1 floor plans')
  })

  it('uses plural for zero plans', () => {
    expect(plansReadyMessage(0)).toContain('0 floor plans')
  })
})
