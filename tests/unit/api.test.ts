import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createFloorPlan,
  editFloorPlan,
  healthCheck,
  downloadFile,
  type CreatePlanRequest,
  type EditPlanRequest,
} from '@/lib/api'

const API_BASE_URL = 'https://plangen.waleeds.world'

function jsonResponse(body: unknown, init: Partial<{ ok: boolean; status: number; statusText: string }> = {}) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: init.statusText ?? 'OK',
    json: async () => body,
  } as unknown as Response
}

describe('createFloorPlan', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('POSTs JSON to /create_plan and returns the parsed body', async () => {
    const request: CreatePlanRequest = {
      zones: [{ type: 'Residential', compartments: ['Bedroom'] }],
    }
    const payload = { status: 'success', results: [], message: 'ok' }
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(payload))
    vi.stubGlobal('fetch', fetchMock)

    const result = await createFloorPlan(request)

    expect(result).toEqual(payload)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, opts] = fetchMock.mock.calls[0]
    expect(url).toBe(`${API_BASE_URL}/create_plan`)
    expect(opts.method).toBe('POST')
    expect(opts.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(opts.body)).toEqual(request)
  })

  it('throws with status details when the response is not ok', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({}, { ok: false, status: 500, statusText: 'Internal Server Error' }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(createFloorPlan({ zones: [] })).rejects.toThrow(
      'Failed to create floor plan: 500 Internal Server Error',
    )
  })
})

describe('editFloorPlan', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('sends multipart form-data including the edited image and optional reference', async () => {
    const request: EditPlanRequest = {
      image_url: 'https://img/x.png',
      action_type: 'ADD',
      prompt: 'add a window',
    }
    const edited = new File(['a'], 'edited.png', { type: 'image/png' })
    const reference = new File(['b'], 'ref.png', { type: 'image/png' })
    const payload = { status: 'success', action_type: 'ADD', prompt: 'add a window', result_image_path: '', result_image_url: '', message: 'ok' }
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(payload))
    vi.stubGlobal('fetch', fetchMock)

    const result = await editFloorPlan(request, edited, reference)

    expect(result).toEqual(payload)
    const [url, opts] = fetchMock.mock.calls[0]
    expect(url).toBe(`${API_BASE_URL}/edit`)
    expect(opts.method).toBe('POST')
    const fd = opts.body as FormData
    expect(fd).toBeInstanceOf(FormData)
    expect(fd.get('image_url')).toBe('https://img/x.png')
    expect(fd.get('action_type')).toBe('ADD')
    expect(fd.get('prompt')).toBe('add a window')
    expect(fd.get('edited_image')).toBeInstanceOf(File)
    expect(fd.get('reference_image')).toBeInstanceOf(File)
  })

  it('omits reference_image when none is provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}))
    vi.stubGlobal('fetch', fetchMock)
    const edited = new File(['a'], 'edited.png', { type: 'image/png' })

    await editFloorPlan({ image_url: 'u', action_type: 'REMOVE', prompt: 'p' }, edited)

    const fd = fetchMock.mock.calls[0][1].body as FormData
    expect(fd.get('reference_image')).toBeNull()
  })

  it('throws on a non-ok response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({}, { ok: false, status: 422, statusText: 'Unprocessable Entity' }))
    vi.stubGlobal('fetch', fetchMock)
    const edited = new File(['a'], 'edited.png', { type: 'image/png' })

    await expect(
      editFloorPlan({ image_url: 'u', action_type: 'MODIFY', prompt: 'p' }, edited),
    ).rejects.toThrow('Failed to edit floor plan: 422 Unprocessable Entity')
  })
})

describe('healthCheck', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('GETs /health and returns the parsed body', async () => {
    const payload = { status: 'ok', message: 'healthy', timestamp: '2026-01-01T00:00:00Z' }
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(payload))
    vi.stubGlobal('fetch', fetchMock)

    const result = await healthCheck()

    expect(result).toEqual(payload)
    // healthCheck now routes through the timeout-guarded fetch wrapper, so the
    // request carries an (optional) AbortController signal alongside the URL.
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/health`, expect.any(Object))
  })

  it('throws when the health endpoint fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({}, { ok: false, status: 503, statusText: 'Service Unavailable' }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(healthCheck()).rejects.toThrow('Health check failed: 503 Service Unavailable')
  })
})

describe('downloadFile', () => {
  let clickSpy: ReturnType<typeof vi.fn>
  let anchor: HTMLAnchorElement

  beforeEach(() => {
    anchor = document.createElement('a')
    clickSpy = vi.fn()
    anchor.click = clickSpy
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds a download link to the API and clicks it', () => {
    downloadFile('plan-123.png')

    expect(anchor.href).toBe(`${API_BASE_URL}/download/plan-123.png`)
    expect(anchor.download).toBe('plan-123.png')
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })
})
