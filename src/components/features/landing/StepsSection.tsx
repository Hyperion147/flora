import { steps } from "./data";
import { SectionHeader } from "./shared";

export function StepsSection() {
  return (
    <section className="flora-full-bleed w-screen bg-[var(--flora-section)] px-[clamp(1rem,5vw,5.5rem)] py-20">
      <SectionHeader
        eyebrow="How it works"
        title="Simple Steps to Make a Difference"
        text="Start in minutes and help catalog plants one real discovery at a time."
      />

      <div className="mt-14 grid gap-10 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="absolute left-[62%] top-12 hidden h-px w-[76%] bg-border md:block" />
              )}
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-border bg-secondary text-primary">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-black">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-56 text-sm leading-6 text-muted-foreground">
                {step.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
