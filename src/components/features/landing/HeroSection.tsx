"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, Leaf, Map, Sprout, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const LandingMiniMap = dynamic(() => import("./LandingMiniMap"), {
    ssr: false,
    loading: () => (
        <div className="h-75 rounded-sm bg-[linear-gradient(135deg,var(--secondary),var(--card))]" />
    ),
});

export function HeroSection({ startHref }: { startHref: string }) {
    return (
        <section className="flora-full-bleed relative min-h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_14%_42%,color-mix(in_oklch,var(--accent)_36%,transparent),transparent_28%),radial-gradient(circle_at_86%_14%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_30%),linear-gradient(180deg,var(--flora-hero-start)_0%,var(--background)_74%,var(--flora-hero-end)_100%)] px-[clamp(1rem,5vw,5.5rem)] pb-10 pt-12">
            <Image
                src="/side-plants.png"
                alt=""
                width={520}
                height={520}
                priority
                className="pointer-events-none absolute -left-36 bottom-0 z-0 w-80 -scale-x-100 rotate-[-8deg] opacity-45 lg:w-100 blur-[2px]"
            />
            <div className="relative z-10 grid min-h-[calc(100vh-9rem)] w-full grid-cols-1 items-center gap-12 lg:grid-cols-[0.86fr_1.14fr]">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    <div className="flora-glass-soft mb-7 inline-flex items-center gap-3 rounded-full bg-secondary/78 px-5 py-3 text-sm font-black text-primary shadow-sm">
                        <Leaf className="h-5 w-5" />
                        Your Global Plant Companion
                    </div>

                    <h1 className="font-serif text-4xl sm:text-6xl font-black leading-[0.98] tracking-normal text-foreground">
                        Discover, Track
                        <span className="block">&amp;</span>
                        <span className="block text-primary">
                            Celebrate Plants
                        </span>
                    </h1>

                    <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                        Flora helps you catalog plants, explore the world&apos;s
                        flora, and connect with a global community of plant
                        lovers. It is free, useful, and built for real
                        discoveries.
                    </p>

                    <div className="mt-9 flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:items-center">
                        <Button
                            asChild
                            className="h-11 w-full justify-between rounded-full bg-primary text-base font-black text-primary-foreground shadow-xl shadow-primary/24 hover:bg-primary/90 sm:w-auto"
                        >
                            <Link href={startHref} className="gap-4">
                                <Sprout className="h-5 w-5" />
                                <span className="flex-1 text-left">
                                    Start Your Garden
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="flora-glass-soft h-11 w-full rounded-full border-border/70 bg-card/70 text-base font-black text-primary hover:bg-secondary sm:w-auto sm:min-w-48"
                        >
                            <Link href="/map" className="gap-3">
                                <Map className="h-5 w-5" />
                                Explore Map
                            </Link>
                        </Button>
                    </div>
                </motion.div>
                <HeroProductCollage />
            </div>
        </section>
    );
}

function HeroProductCollage() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 56, rotate: 1.2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.82, delay: 0.08, ease: "easeOut" }}
            className="relative w-full lg:min-h-170"
        >
            <div className="flora-glass absolute right-0 top-12 z-20 hidden h-125 w-64 rotate-[1.5deg] rounded-2xl bg-card/76 p-5 opacity-80 shadow-2xl xl:block">
                <PhoneGardenPanel />
            </div>

            <div
                className="flora-glass relative z-30 w-full max-w-190 rounded-2xl bg-card/82 p-5 backdrop-blur-sm sm:p-7 lg:absolute lg:left-0 lg:top-0 xl:max-w-205"
                style={{
                    transform: "skew(-2deg, 1deg)",
                    boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.5)",
                }}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">
                            Global Discoveries
                        </p>
                        <h2 className="mt-1 font-serif text-2xl font-black">
                            Plant Map
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Explore all plants tracked in the app.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <MiniMetric
                            icon={Leaf}
                            value="1,247"
                            label="Total Plants"
                        />
                        <MiniMetric icon={Map} value="892" label="Geotagged" />
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-background/80 p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black">
                        <span className="grid size-6 place-items-center rounded-lg bg-secondary text-primary">
                            <Map className="h-3.5 w-3.5" />
                        </span>
                        Interactive Plant Map
                    </div>
                    <div className="overflow-hidden rounded-lg border border-border">
                        <LandingMiniMap />
                    </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <LeaderboardCard />
                    <DashboardCard />
                </div>
            </div>
        </motion.div>
    );
}

function MiniMetric({
    icon: Icon,
    value,
    label,
}: {
    icon: typeof Leaf;
    value: string;
    label: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-background/76 px-4 py-2 text-center shadow-sm flex items-center gap-2">
            <span className="mx-auto grid size-7 place-items-center rounded-lg bg-secondary text-primary">
                <Icon className="h-4 w-4" />
            </span>
            <p className="mt-2 text-lg font-black text-foreground">{value}</p>
            <p className="text-[10px] font-semibold text-muted-foreground">
                {label}
            </p>
        </div>
    );
}

function LeaderboardCard() {
    return (
        <div className="rounded-xl border border-border bg-background/78 p-4">
            <div className="flex items-start gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary">
                    <Trophy className="h-4 w-4" />
                </span>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        Community
                    </p>
                    <h3 className="font-serif text-lg font-black">
                        Leaderboard
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                        Top contributors tracking the most plants.
                    </p>
                </div>
            </div>
            <div className="mt-4 rounded-lg border border-border bg-card/72 p-3">
                {[
                    ["1", "GreenThumb", "342"],
                    ["2", "PlantLover", "289"],
                    ["3", "LeafScout", "247"],
                ].map(([rank, name, count]) => (
                    <div
                        key={name}
                        className="flex items-center gap-3 py-1.5 text-xs"
                    >
                        <span className="w-4 font-black">{rank}</span>
                        <span className="grid size-6 place-items-center rounded-full bg-secondary text-[10px] font-black text-primary">
                            {name[0]}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-semibold">
                            {name}
                        </span>
                        <span className="font-black text-primary">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DashboardCard() {
    return (
        <div className="rounded-xl border border-border bg-background/78 p-4">
            <div className="flex items-start gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary">
                    <BarChart3 className="h-4 w-4" />
                </span>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        Personal Garden
                    </p>
                    <h3 className="font-serif text-lg font-black">
                        Welcome, Suryansu Code!
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                        Track your plants and see your collection grow.
                    </p>
                </div>
            </div>
            <div className="mt-4 rounded-lg border border-border bg-card/72 p-3">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-black">Track a New Plant</p>
                    <span className="rounded-md bg-muted px-2 py-1 text-[10px]">
                        View All
                    </span>
                </div>
                <div className="space-y-2">
                    <div className="h-8 rounded-md border border-border bg-background/80 px-3 text-[10px] leading-8 text-muted-foreground">
                        Monstera Deliciosa
                    </div>
                    <div className="flex gap-2">
                        <span className="h-8 flex-1 rounded-md border border-border bg-background/80" />
                        <span className="h-8 w-20 rounded-md bg-primary/12" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PhoneGardenPanel() {
    return (
        <div className="h-full rounded-xl border border-border bg-background/80 p-4">
            <div className="mb-7 flex items-center justify-end gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-secondary text-primary">
                    <Users className="h-3.5 w-3.5" />
                </span>
                <span className="h-1.5 w-7 rounded-full bg-muted" />
            </div>
            <p className="text-[10px] text-muted-foreground">Welcome back</p>
            <h3 className="mt-1 text-sm font-black">Your garden is growing</h3>
            <div className="mt-4 rounded-lg border border-border bg-card/80 p-3">
                <p className="text-[10px] font-black">
                    Today&apos;s Highlights
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                    <SmallStat value="12" label="New Plants" />
                    <SmallStat value="3" label="Locations" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                {["Monstera Deliciosa", "Snake Plant", "Fiddle Leaf Fig"].map(
                    (name) => (
                        <div
                            key={name}
                            className="flex items-center gap-2 rounded-lg bg-card/70 p-2"
                        >
                            <span className="grid size-7 place-items-center rounded-full bg-secondary text-primary">
                                <Leaf className="h-3.5 w-3.5" />
                            </span>
                            <span className="min-w-0 flex-1 truncate text-[10px] font-black">
                                {name}
                            </span>
                        </div>
                    ),
                )}
            </div>
            <div className="mt-4 rounded-lg bg-primary px-3 py-2 text-center text-[10px] font-black text-primary-foreground">
                Add New Plant
            </div>
        </div>
    );
}

function SmallStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-md bg-background/80 p-2">
            <p className="text-sm font-black text-primary">{value}</p>
            <p className="text-[9px] text-muted-foreground">{label}</p>
        </div>
    );
}
