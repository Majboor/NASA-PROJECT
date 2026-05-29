"use client"

import { useEffect } from "react"

interface MenuA11yOptions {
  /**
   * When true and the viewport widens past the desktop breakpoint, the menu is
   * auto-closed. Useful for slide-in menus that only exist on small screens so a
   * device rotation / window resize doesn't leave a stale overlay mounted.
   */
  closeOnDesktop?: boolean
  /** Desktop breakpoint in px (matches Tailwind `lg`). */
  desktopBreakpoint?: number
  /** Lock body scroll while the menu is open so the page behind can't scroll. */
  lockScroll?: boolean
}

/**
 * Robustness helper for slide-in / overlay menus.
 *
 * - Closes the menu when the user presses Escape.
 * - Optionally locks background scrolling while open (restored on close).
 * - Optionally closes the menu when the viewport grows to desktop width, which
 *   prevents a stale mobile overlay from lingering after a resize / rotation.
 *
 * Safe on the server: all DOM access is guarded and only runs in effects.
 */
export function useMenuA11y(
  isOpen: boolean,
  onClose: () => void,
  options: MenuA11yOptions = {},
): void {
  const {
    closeOnDesktop = false,
    desktopBreakpoint = 1024,
    lockScroll = true,
  } = options

  // Escape-to-close.
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  // Close when the viewport reaches desktop width.
  useEffect(() => {
    if (!isOpen || !closeOnDesktop) return
    const handleResize = () => {
      if (window.innerWidth >= desktopBreakpoint) onClose()
    }
    window.addEventListener("resize", handleResize)
    // Run once in case we opened while already wide (e.g. hydration edge case).
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [isOpen, closeOnDesktop, desktopBreakpoint, onClose])

  // Lock background scroll while open.
  useEffect(() => {
    if (!isOpen || !lockScroll || typeof document === "undefined") return
    const body = document.body
    const previousOverflow = body.style.overflow
    body.style.overflow = "hidden"
    return () => {
      body.style.overflow = previousOverflow
    }
  }, [isOpen, lockScroll])
}
