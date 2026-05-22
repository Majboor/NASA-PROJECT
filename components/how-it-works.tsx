import { Card } from "@/components/ui/card"

const steps = [
  {
    number: "01",
    title: "Define Your Idea",
    description:
      "Describe your habitat shape, crew size, or mission goals. Upload data or sketch your concept.",
  },
  {
    number: "02",
    title: "AI Exploration",
    description:
      "The system analyzes your input and generates layouts, zones, and volume solutions that match space living needs.",
  },
  {
    number: "03",
    title: "Visualize & Share",
    description:
      "Get 2D floor plans and 3D models ready to explore, validate, and present.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 px-6">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            How It <span className="text-primary bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Three simple steps to bring your space habitat ideas to life with AI-powered design.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="card-lift group relative h-full overflow-hidden border-border bg-card/50 p-8 backdrop-blur-sm">
                {/* Watermark step number */}
                <div className="mb-6 bg-gradient-to-br from-primary/50 to-orange-500/20 bg-clip-text text-6xl font-bold text-transparent transition-transform duration-500 group-hover:-translate-y-1">
                  {step.number}
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-card-foreground">{step.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{step.description}</p>
                {/* Hover accent bar */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-orange-500 transition-transform duration-500 group-hover:scale-x-100" />
                {/* Corner glow */}
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              </Card>
              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-gradient-to-r from-primary to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
