"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Map, MapPin, Sprout } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { WorldMapPattern } from "./shared";

export function HeroSection({ startHref }: { startHref: string }) {
  return (
    <section className="flora-full-bleed relative min-h-screen w-screen overflow-hidden bg-[linear-gradient(180deg,var(--flora-hero-start)_0%,var(--flora-hero-mid)_58%,var(--flora-hero-end)_100%)] px-[clamp(1rem,5vw,5.5rem)] pb-14 pt-28 sm:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_35%,color-mix(in_oklch,var(--accent)_38%,transparent),transparent_26%),radial-gradient(circle_at_88%_18%,color-mix(in_oklch,var(--primary)_20%,transparent),transparent_24%)]" />
      <Image
        src="/side-plants.png"
        alt=""
        width={420}
        height={420}
        priority
        className="pointer-events-none absolute -left-28 bottom-2 hidden w-[360px] -scale-x-100 rotate-[-10deg] opacity-38 md:block"
      />

      <div className="relative z-10 grid min-h-[calc(100vh-8rem)] w-full grid-cols-1 items-center gap-12 lg:grid-cols-[0.98fr_1.02fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="flora-glass-soft mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-secondary-foreground">
            <Leaf className="h-4 w-4" />
            Track. Map. Grow.
          </div>

          <h1 className="max-w-3xl font-serif text-[clamp(2.45rem,5.35vw,5.85rem)] font-black leading-[1.01] tracking-tight">
            Discover, Track &{" "}
            <span className="block text-primary">Celebrate Plants</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Flora helps you catalog plants, explore the world&apos;s flora, and
            connect with a global community of plant lovers. It is free,
            useful, and built for real discoveries.
          </p>

          <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              className="group h-13 w-full justify-between rounded-full bg-primary py-2 pl-2 pr-4 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 sm:min-w-56 sm:w-auto"
            >
              <Link href={startHref} className="gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-primary-foreground/16">
                  <Sprout className="h-4 w-4" />
                </span>
                <span className="flex-1 text-left">Start Your Garden</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flora-glass-soft h-13 w-full rounded-full border-primary/20 bg-card/48 py-2 pl-2 pr-5 text-sm font-black text-primary hover:bg-secondary sm:min-w-48 sm:w-auto"
            >
              <Link href="/map" className="gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-secondary text-primary">
                  <Map className="h-4 w-4" />
                </span>
                Explore Map
              </Link>
            </Button>
          </div>
        </motion.div>

        <HeroVisual startHref={startHref} />
      </div>
    </section>
  );
}

function HeroVisual({ startHref }: { startHref: string }) {
  return (
    <div className="relative min-h-[620px] w-full overflow-hidden md:overflow-visible">
      <div className="absolute inset-y-10 right-[2%] hidden w-[58%] opacity-50 md:block">
        <WorldMapPattern />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 64, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 right-[-5rem] top-8 z-10 w-80 md:right-[-9vw] md:w-[520px] lg:right-[-7vw] lg:w-[620px]"
      >
        <Image
          src="/side-plants.png"
          alt="Decorative tropical leaves"
          fill
          priority
          className="pointer-events-none object-contain object-right-bottom drop-shadow-2xl"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.72, delay: 0.1, ease: "easeOut" }}
        className="flora-glass-dark absolute left-1/2 top-4 z-30 w-[292px] -translate-x-1/2 rounded-[2.6rem] border-[9px] border-foreground bg-foreground p-2 shadow-2xl shadow-foreground/20 sm:w-[330px]"
      >
        <PhoneMockup startHref={startHref} />
      </motion.div>

      {[
        ["74%", "17%", 0],
        ["62%", "47%", 0.35],
        ["88%", "32%", 0.7],
      ].map(([left, top, delay]) => (
        <motion.div
          key={`${left}-${top}`}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            delay: Number(delay),
            ease: "easeInOut",
          }}
          className="absolute z-40 hidden rounded-full bg-primary p-3 text-primary-foreground shadow-xl shadow-primary/25 md:block"
          style={{ left, top }}
        >
          <MapPin className="h-6 w-6" />
        </motion.div>
      ))}
    </div>
  );
}

function PhoneMockup({ startHref }: { startHref: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-background/86 text-foreground backdrop-blur-xl">
      <div className="mx-auto mt-2 h-7 w-28 rounded-full bg-foreground" />
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">
            Welcome back
          </p>
          <h2 className="mt-1 text-lg font-black">Your garden is growing</h2>
        </div>

        <div className="flora-glass-soft rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold">Today&apos;s Highlights</p>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <MiniStat value="12" label="New Plants" />
            <MiniStat value="3" label="Locations" />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold">Recent Plants</p>
          {[
            ["Monstera Deliciosa", "Home Garden", "2h ago"],
            ["Snake Plant", "Office", "1d ago"],
            ["Fiddle Leaf Fig", "Living Room", "2d ago"],
          ].map(([name, place, time], index) => (
            <div
              key={name}
              className="flora-glass-soft mb-3 flex items-center gap-3 rounded-xl p-2"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src="/hero-plants.png"
                  alt=""
                  fill
                  className="object-cover"
                  style={{ objectPosition: `${38 + index * 18}% center` }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black">{name}</p>
                <p className="text-[10px] text-muted-foreground">{place}</p>
              </div>
              <p className="text-[10px] text-muted-foreground">{time}</p>
            </div>
          ))}
        </div>

        <Button
          asChild
          className="h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          <Link href={startHref} className="gap-2">
            <Sprout className="h-4 w-4" />
            Add New Plant
          </Link>
        </Button>
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flora-glass-soft rounded-xl p-3">
      <p className="text-lg font-black text-primary">{value}</p>
      <p className="text-[10px] font-semibold text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
