// API utility functions for the Floor Plan Editor

const API_BASE_URL = 'https://plangen.waleeds.world'

// Default per-request timeout so a stalled backend never hangs the UI forever.
const DEFAULT_TIMEOUT_MS = 120000

/**
 * Error type that carries an HTTP-ish `status` so callers can decide whether to
 * retry. Network failures and timeouts use status 0 (treated as retryable);
 * real HTTP errors carry the response status (4xx are not retried).
 */
export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * fetch wrapper with a timeout (via AbortController) that normalises failures
 * into ApiError instances with a meaningful `status`.
 */
async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  // Guard for non-browser / older runtimes without AbortController.
  const hasAbort = typeof AbortController !== 'undefined'
  const controller = hasAbort ? new AbortController() : null
  const timer = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null

  try {
    return await fetch(input, {
      ...init,
      signal: controller?.signal,
    })
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new ApiError(`Request timed out after ${Math.round(timeoutMs / 1000)}s`, 0)
    }
    // Network error, DNS failure, offline, CORS, etc.
    throw new ApiError(err?.message || 'Network request failed', 0)
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export interface Zone {
  type: string
  compartments: string[]
}

export interface CreatePlanRequest {
  zones: Zone[]
}

export interface CreatePlanResponse {
  status: string
  results: Array<{
    zone_type: string
    compartments: string[]
    image_path: string
    image_url: string
    status: string
  }>
  message: string
}

export interface EditPlanRequest {
  image_url: string
  action_type: 'ADD' | 'MODIFY' | 'REMOVE'
  prompt: string
}

export interface EditPlanResponse {
  status: string
  action_type: string
  prompt: string
  result_image_path: string
  result_image_url: string
  message: string
}

export interface HealthCheckResponse {
  status: string
  message: string
  timestamp: string
}

// Create floor plan
export async function createFloorPlan(request: CreatePlanRequest): Promise<CreatePlanResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/create_plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new ApiError(
      `Failed to create floor plan: ${response.status} ${response.statusText}`,
      response.status,
    )
  }

  return response.json()
}

// Edit floor plan
export async function editFloorPlan(
  request: EditPlanRequest, 
  editedImage: File, 
  referenceImage?: File
): Promise<EditPlanResponse> {
  const formData = new FormData()
  formData.append('image_url', request.image_url)
  formData.append('action_type', request.action_type)
  formData.append('prompt', request.prompt)
  formData.append('edited_image', editedImage)
  
  if (referenceImage) {
    formData.append('reference_image', referenceImage)
  }

  const response = await fetchWithTimeout(`${API_BASE_URL}/edit`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new ApiError(
      `Failed to edit floor plan: ${response.status} ${response.statusText}`,
      response.status,
    )
  }

  return response.json()
}

// Health check
export async function healthCheck(): Promise<HealthCheckResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 15000)

  if (!response.ok) {
    throw new ApiError(
      `Health check failed: ${response.status} ${response.statusText}`,
      response.status,
    )
  }

  return response.json()
}

// Download file
export function downloadFile(filename: string): void {
  const link = document.createElement('a')
  link.href = `${API_BASE_URL}/download/${filename}`
  link.download = filename
  link.click()
}
