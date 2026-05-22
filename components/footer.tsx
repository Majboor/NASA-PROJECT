import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Rocket } from "lucide-react"

const columns: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Design Studio", href: "/app" },
      { label: "Results", href: "/results" },
      { label: "Features", href: "/#features" },
      { label: "How It Works", href: "/#how-it-works" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Guides", href: "/learn" },
      { label: "For Professionals", href: "/learn" },
      { label: "For Everyone", href: "/learn" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-card/20 backdrop-blur-sm">
      {/* Ambient glow */}
      <div className="nebula-glow left-1/4 top-0 h-64 w-64" aria-hidden />

      <div className="container relative z-10 mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Voronova" width={36} height={36} className="h-9 w-9" />
              <span className="text-lg font-bold tracking-tight text-foreground">VORONOVA</span>
            </Link>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              AI-powered space habitat design. Turn mission constraints into launch-ready
              layouts and 3D concepts — built for students, dreamers, and engineers alike.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Rocket className="h-3.5 w-3.5" />
              NASA Space Apps Challenge
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-underline inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {link.external && <ArrowUpRight className="h-3 w-3" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Voronova. Crafted for the future of off-world living.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/waleedsworld/NASA-PROJECT"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
            <span className="text-xs text-muted-foreground">
              Uptime may vary — cloud credits are limited.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
