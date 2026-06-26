import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function StorySection({ startHref }: { startHref: string }) {
  return (
    <section className="flora-full-bleed w-screen bg-[linear-gradient(180deg,var(--flora-section)_0%,var(--background)_100%)] px-[clamp(1rem,5vw,5.5rem)] py-16">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flora-glass rounded-2xl bg-secondary/70 p-[clamp(1.5rem,4vw,4rem)]">
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <div className="relative h-36 w-36 overflow-hidden rounded-full border-8 border-card">
              <Image
                src="/hero-plants.png"
                alt="Plant community member"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-serif text-6xl leading-none text-primary">“</p>
              <p className="max-w-2xl text-xl leading-9">
                Flora turns tiny plant moments into something useful. A photo,
                a place, a name, and suddenly the map gets better for everyone.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div>
                  <p className="font-black text-primary">Flora Community</p>
                  <p className="text-sm text-muted-foreground">
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

        <div className="flora-glass-dark relative min-h-85 overflow-hidden rounded-2xl bg-(--flora-deep)] p-8 text-primary-foreground">
          <Image
            src="/hero-plants.png"
            alt=""
            fill
            className="pointer-events-none object-cover opacity-35"
          />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div>
              <h2 className="max-w-xl font-serif text-4xl font-black sm:text-5xl">
                Ready to Start Your Botanical Journey?
              </h2>
              <p className="mt-4 max-w-lg leading-7 text-primary-foreground/82">
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
                className="h-12 w-full rounded-xl border-primary-foreground/40 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/50 text-shadow-2xs backdrop-blur-md"
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
