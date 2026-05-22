"use client"

import { useEffect, useState } from "react"

/**
 * Thin brand-gradient bar pinned to the very top of the viewport that
 * fills as the user scrolls the page. Pure visual polish — sits above the
 * navbar and ignores pointer events.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      setProgress(scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-[60] h-[3px] w-full bg-transparent"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-primary via-orange-500 to-amber-300 shadow-[0_0_12px_rgba(251,146,60,0.6)] transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
