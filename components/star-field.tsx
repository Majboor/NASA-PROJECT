"use client"

import type React from "react"

export function StarField() {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 3,
  }))

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star-twinkle absolute rounded-full bg-white"
          style={
            {
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              "--twinkle-duration": `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
