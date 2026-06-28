# Hero A/B Variants

Voronova's landing hero ships in two interchangeable versions so we can A/B test
messaging and layout without redeploying. The active variant is chosen at runtime
from the URL query string — no build flags, no separate bundles.

## How to switch

| URL | Hero rendered | Component |
| --- | --- | --- |
| `/` or `/?variant=a` | **Variant A** (default) | `components/hero.tsx` |
| `/?variant=b` | **Variant B** | `components/hero-b.tsx` |

The value is read client-side in `app/page.tsx`:

```ts
const v = new URLSearchParams(window.location.search).get("variant")
setVariant(v?.toLowerCase() === "b" ? "b" : "a")
```

Anything other than `b` (missing, empty, `a`, garbage) falls back to Variant A,
so the default experience is never accidentally broken. Because the site is a
fully static export (`output: 'export'`), the toggle must run in the browser —
there are no server-side query params at request time.

## What differs

Both variants share the same background (`StarField`, `OrbitSystem`), navigation,
video modal, and the `/app` destination — only the hero section changes.

| Aspect | Variant A (default) | Variant B |
| --- | --- | --- |
| Headline | "Think Beyond Earth, Imagine the Future" | "Design the Habitat. Survive the Void." (uppercase) |
| Framing | Aspirational / inspirational | Mission-control / operational |
| Layout | 2-column split on desktop (copy left, orbit right) | Single centered column, orbit as full-bleed ambient background at every breakpoint |
| Primary CTA | "Explore More" | "Launch the Designer" (rocket icon) |
| Secondary CTA | "Watch Demo" | "Watch the Mission Brief" (play icon) |
| Social proof | 3 stat cards (Concepts / Layouts / User) | Compact inline status strip (AI-Guided · 2D → 3D · Any Crew) |

## Notes for maintainers

- Variant B is additive: it lives entirely in `components/hero-b.tsx`. The only
  edit to shared code is the small toggle in `app/page.tsx` (import + one
  `useState`/`useEffect` + a ternary at the render site).
- To make B the default, flip the fallback in `app/page.tsx` (`=== "b" ? "b" : "a"`
  → default to `"b"`), or swap the ternary. To retire the experiment, delete
  `hero-b.tsx` and revert the toggle.
- Verified against the static export (`npm run build` → `npx serve dist`) at both
  `?variant=a` and `?variant=b`.
