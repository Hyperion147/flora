import { impactStats } from "./data";
import Image from "next/image";

export function ImpactSection() {
  return (
    <section className="flora-full-bleed relative w-screen overflow-hidden bg-[var(--flora-section)] px-4 py-8 sm:px-6 sm:py-10 lg:px-[clamp(1rem,5vw,5.5rem)]">
      <div className="flora-glass-dark relative overflow-hidden rounded-[2rem] bg-[var(--flora-deep)] px-5 py-8 text-primary-foreground sm:px-7 sm:py-10 lg:px-[clamp(1.5rem,4vw,4rem)] lg:py-12">
        <Image
          src="/hero-plants.png"
          alt=""
          fill
          className="pointer-events-none object-cover opacity-18"
        />
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="font-serif text-3xl font-black sm:text-4xl">
              Making a Global Impact
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-primary-foreground/78 sm:mt-4 sm:text-base sm:leading-7">
              Every plant logged in Flora makes the shared directory more useful
              for gardeners, students, local explorers, and curious people.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:gap-6">
            {impactStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flora-glass-dark rounded-2xl p-3 text-center sm:rounded-3xl sm:p-4">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/12 text-accent sm:mb-4 sm:h-14 sm:w-14 sm:rounded-2xl">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <p className="text-2xl font-black sm:text-3xl lg:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-primary-foreground/78 sm:text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
