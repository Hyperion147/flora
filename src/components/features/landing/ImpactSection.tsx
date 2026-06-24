import { impactStats } from "./data";
import Image from "next/image";

export function ImpactSection() {
  return (
    <section className="flora-full-bleed relative w-screen overflow-hidden bg-[var(--flora-section)] px-[clamp(1rem,5vw,5.5rem)] py-10">
      <div className="flora-glass-dark relative overflow-hidden rounded-[2rem] bg-[var(--flora-deep)] px-[clamp(1.5rem,4vw,4rem)] py-12 text-primary-foreground">
        <Image
          src="/hero-plants.png"
          alt=""
          fill
          className="pointer-events-none object-cover opacity-18"
        />
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="font-serif text-4xl font-black">
              Making a Global Impact
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-primary-foreground/78">
              Every plant logged in Flora makes the shared directory more useful
              for gardeners, students, local explorers, and curious people.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {impactStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flora-glass-dark rounded-3xl p-4 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/12 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-4xl font-black">{stat.value}</p>
                  <p className="mt-1 text-sm text-primary-foreground/78">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
