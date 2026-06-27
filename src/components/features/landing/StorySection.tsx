import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function StorySection({ startHref }: { startHref: string }) {
  return (
    <section className="flora-full-bleed w-screen bg-[linear-gradient(180deg,var(--flora-section)_0%,var(--background)_100%)] px-4 py-12 sm:px-6 sm:py-14 lg:px-[clamp(1rem,5vw,5.5rem)] lg:py-16">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flora-glass rounded-2xl bg-secondary/70 p-5 sm:p-7 lg:p-[clamp(1.5rem,4vw,4rem)]">
          <div className="grid items-center gap-6 sm:gap-8 md:grid-cols-[auto_1fr]">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-card sm:h-32 sm:w-32 sm:border-6 lg:h-36 lg:w-36 lg:border-8">
              <Image
                src="/hero-plants.png"
                alt="Plant community member"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-serif text-4xl leading-none text-primary sm:text-5xl lg:text-6xl">“</p>
              <p className="max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                Flora turns tiny plant moments into something useful. A photo,
                a place, a name, and suddenly the map gets better for everyone.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div>
                  <p className="font-black text-primary">Flora Community</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Plant enthusiasts and local explorers
                  </p>
                </div>
                <div className="flex text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[20rem] overflow-hidden rounded-2xl bg-[var(--flora-deep)] p-6 text-primary-foreground shadow-xl sm:min-h-[21rem] sm:p-7 lg:min-h-[21.25rem] lg:p-8">
          <Image
            src="/hero-plants.png"
            alt=""
            fill
            className="pointer-events-none object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklch,var(--flora-deep)_86%,black_14%)_0%,color-mix(in_oklch,var(--flora-deep)_72%,transparent)_48%,color-mix(in_oklch,var(--flora-deep)_42%,transparent)_100%)]" />
          <div className="relative z-10 flex min-h-[calc(20rem-3rem)] flex-col justify-between gap-10 sm:min-h-[calc(21rem-3.5rem)] lg:min-h-[calc(21.25rem-4rem)]">
            <div>
              <h2 className="max-w-xl text-balance font-serif text-3xl font-black leading-tight sm:text-4xl lg:text-[2.75rem]">
                Ready to Start Your Botanical Journey?
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-primary-foreground/82 sm:mt-4 sm:text-base sm:leading-7">
                Join plant lovers making Flora more helpful, one plant at a time.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:w-64">
              <Button
                asChild
                className="h-12 w-full rounded-xl bg-card text-card-foreground hover:bg-card/90"
              >
                <Link href={startHref}>Start Your Journey</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-xl border-primary-foreground/45 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <Link href="/map">Explore the Map</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
