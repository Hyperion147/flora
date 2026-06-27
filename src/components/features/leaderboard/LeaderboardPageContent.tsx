"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plant } from "@/lib/types";
import {
    Calendar,
    Globe2,
    Leaf,
    Map as MapIcon,
    Medal,
    Sprout,
    Trophy,
    Users,
} from "lucide-react";

const timeframeOptions = ["All Time", "This Week", "Last 30 Days"] as const;

type TimeframeOption = (typeof timeframeOptions)[number];

type LeaderboardEntry = {
    user_id: string;
    user_name: string;
    plant_count: number;
    avatar_url?: string | null;
};

export default function LeaderboardPageContent() {
    const { user } = useAuth();
    const [timeframe, setTimeframe] = useState<TimeframeOption>("All Time");
    const [country, setCountry] = useState("All Countries");

    const {
        data: plants = [],
        isLoading,
        error,
    } = useQuery<Plant[]>({
        queryKey: ["plants", "leaderboard-page"],
        queryFn: async () => {
            const response = await fetch("/api/plants");
            if (!response.ok) {
                throw new Error("Failed to fetch plants");
            }
            return response.json();
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (error) {
            console.error("Error fetching leaderboard data:", error);
            toast.error("Failed to load leaderboard");
        }
    }, [error]);

    const countryOptions = useMemo(() => {
        const values = Array.from(
            new Set(plants.map((plant) => getCountryName(plant))),
        ).sort((a, b) => a.localeCompare(b));

        return ["All Countries", ...values];
    }, [plants]);

    const filteredPlants = useMemo(() => {
        const now = Date.now();

        return plants.filter((plant) => {
            const createdAt = new Date(plant.created_at).getTime();
            const matchesTimeframe =
                timeframe === "All Time"
                    ? true
                    : timeframe === "This Week"
                      ? now - createdAt <= 7 * 24 * 60 * 60 * 1000
                      : now - createdAt <= 30 * 24 * 60 * 60 * 1000;

            const matchesCountry =
                country === "All Countries"
                    ? true
                    : getCountryName(plant) === country;

            return matchesTimeframe && matchesCountry;
        });
    }, [plants, timeframe, country]);

    const leaderboard = useMemo<LeaderboardEntry[]>(() => {
        const map = new globalThis.Map<string, LeaderboardEntry>();

        for (const plant of filteredPlants) {
            const existing = map.get(plant.user_id);
            if (existing) {
                existing.plant_count += 1;
                existing.avatar_url =
                    existing.avatar_url || plant.user_avatar_url || null;
            } else {
                map.set(plant.user_id, {
                    user_id: plant.user_id,
                    user_name: plant.user_name,
                    plant_count: 1,
                    avatar_url: plant.user_avatar_url ?? null,
                });
            }
        }

        return Array.from(map.values()).sort((a, b) => {
            if (b.plant_count !== a.plant_count) {
                return b.plant_count - a.plant_count;
            }

            return a.user_name.localeCompare(b.user_name);
        });
    }, [filteredPlants]);

    const currentUserId = user?.id ?? null;
    const currentUserName =
        (user?.user_metadata?.name as string | undefined) ||
        (user?.user_metadata?.full_name as string | undefined) ||
        user?.email?.split("@")[0] ||
        "Guest";
    const currentUserAvatar =
        (user?.user_metadata?.avatar_url as string | undefined) ||
        (user?.user_metadata?.picture as string | undefined) ||
        null;

    const currentUserRank = currentUserId
        ? leaderboard.findIndex((entry) => entry.user_id === currentUserId) + 1
        : 0;
    const currentUserEntry =
        (currentUserId &&
            leaderboard.find((entry) => entry.user_id === currentUserId)) ||
        null;
    const topThisPeriod = leaderboard[0] ?? null;
    const uniqueCountries = new Set(
        filteredPlants.map((plant) => getCountryName(plant)),
    ).size;

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_14%_16%,color-mix(in_oklch,var(--accent)_24%,transparent),transparent_22%),linear-gradient(180deg,var(--flora-hero-start)_0%,var(--background)_88%)] px-3 pb-24 pt-22 text-foreground sm:px-5 sm:pb-10 sm:pt-24 lg:px-6 xl:px-8">
            <div className="mx-auto w-full max-w-[1600px]">
                <section className="mt-4 grid gap-4 xl:grid-cols-[21rem_minmax(0,1fr)] 2xl:grid-cols-[23rem_minmax(0,1fr)]">
                    <aside className="space-y-4">
                        <section className="flora-glass relative overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_18%,white),color-mix(in_oklch,var(--secondary)_80%,white))] p-4 shadow-xl shadow-foreground/6">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_35%)]" />
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-black">
                                        Your Rank
                                    </h2>
                                    <Leaf className="h-4 w-4 text-primary/60" />
                                </div>

                                <div className="mt-5 rounded-xl border border-white/70 bg-background/88 px-4 pb-4 pt-12 shadow-lg shadow-foreground/6">
                                    <Avatar className="mx-auto -mt-16 size-20 border-4 border-background shadow-md">
                                        <AvatarImage
                                            src={currentUserAvatar || undefined}
                                            alt={currentUserName}
                                        />
                                        <AvatarFallback className="bg-secondary text-3xl font-black text-primary">
                                            {initials(currentUserName)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="mt-3 text-center">
                                        <p className="truncate text-xl font-black">
                                            {currentUserName}
                                        </p>
                                        <span className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-primary">
                                            {currentUserRank
                                                ? getPlacementLabel(
                                                      currentUserRank,
                                                  )
                                                : "Start tracking"}
                                        </span>
                                    </div>

                                    <div className="mt-5 border-t border-border/70 pt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Plants Tracked
                                        </p>
                                        <div className="mt-2 flex items-end gap-2">
                                            <p className="text-4xl font-black text-primary">
                                                {currentUserEntry?.plant_count ??
                                                    0}
                                            </p>
                                            <span className="pb-1 text-sm text-muted-foreground">
                                                plants
                                            </span>
                                        </div>
                                        {currentUserRank ? (
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Current rank #{currentUserRank}{" "}
                                                in the selected period.
                                            </p>
                                        ) : (
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Track your first plant to appear
                                                on the board.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="flora-glass rounded-2xl border border-border/70 bg-background/78 p-4 shadow-lg shadow-foreground/5">
                            <div className="flex items-center gap-2">
                                <Medal className="h-4 w-4 text-primary" />
                                <h3 className="font-black">Top This Period</h3>
                            </div>

                            {topThisPeriod ? (
                                <div className="mt-4 flex items-center gap-3">
                                    <Avatar className="size-11 border border-border">
                                        <AvatarImage
                                            src={
                                                topThisPeriod.avatar_url ||
                                                undefined
                                            }
                                            alt={topThisPeriod.user_name}
                                        />
                                        <AvatarFallback className="bg-secondary text-sm font-black text-primary">
                                            {initials(topThisPeriod.user_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold">
                                            {topThisPeriod.user_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {topThisPeriod.plant_count} plants
                                        </p>
                                    </div>
                                    <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground">
                                        1
                                    </span>
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    No contributors yet for the current filter.
                                </p>
                            )}
                        </section>
                    </aside>

                    <section className="flora-glass overflow-hidden rounded-2xl border border-border/70 bg-background/78 shadow-xl shadow-foreground/6">
                        <div className="flex flex-col gap-4 border-b border-border/70 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-3">
                                <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-primary">
                                    <Trophy className="h-5 w-5" />
                                </span>
                                <div>
                                    <h2 className="text-xl font-black">
                                        Top Plant Trackers
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Sorted by plants tracked in the selected
                                        filters.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Select
                                    value={timeframe}
                                    onValueChange={(value) =>
                                        setTimeframe(value as TimeframeOption)
                                    }
                                >
                                    <SelectTrigger className="h-11 min-w-[10rem] rounded-xl border-border bg-card/72 px-4 text-sm font-semibold shadow-none">
                                        <span className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            <SelectValue />
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeframeOptions.map((option) => (
                                            <SelectItem
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={country}
                                    onValueChange={setCountry}
                                >
                                    <SelectTrigger className="h-11 min-w-[11rem] rounded-xl border-border bg-card/72 px-4 text-sm font-semibold shadow-none">
                                        <span className="flex items-center gap-3">
                                            <Globe2 className="h-4 w-4 text-primary" />
                                            <SelectValue />
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countryOptions.map((option) => (
                                            <SelectItem
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px]">
                                <thead>
                                    <tr className="border-b border-border/70 text-left">
                                        <th className="px-4 py-4 text-sm font-black text-muted-foreground sm:px-5">
                                            Rank
                                        </th>
                                        <th className="px-4 py-4 text-sm font-black text-muted-foreground sm:px-5">
                                            User
                                        </th>
                                        <th className="px-4 py-4 text-right text-sm font-black text-muted-foreground sm:px-5">
                                            Plants Tracked
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        Array.from({ length: 6 }).map(
                                            (_, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-border/60"
                                                >
                                                    <td className="px-4 py-4 sm:px-5">
                                                        <div className="h-5 w-10 animate-pulse rounded bg-secondary/60" />
                                                    </td>
                                                    <td className="px-4 py-4 sm:px-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-11 animate-pulse rounded-full bg-secondary/60" />
                                                            <div className="space-y-2">
                                                                <div className="h-4 w-32 animate-pulse rounded bg-secondary/60" />
                                                                <div className="h-3 w-20 animate-pulse rounded bg-secondary/45" />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-right sm:px-5">
                                                        <div className="ml-auto h-5 w-16 animate-pulse rounded bg-secondary/60" />
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    ) : leaderboard.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-4 py-12 text-center sm:px-5"
                                            >
                                                <Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                                <h3 className="font-black">
                                                    No leaderboard data yet
                                                </h3>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    Try a different filter or
                                                    start tracking more plants.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        leaderboard.map((entry, index) => {
                                            const rank = index + 1;
                                            const isCurrentUser =
                                                currentUserId === entry.user_id;

                                            return (
                                                <tr
                                                    key={entry.user_id}
                                                    className={`border-b border-border/60 transition-colors ${
                                                        isCurrentUser
                                                            ? "bg-[linear-gradient(180deg,color-mix(in_oklch,var(--secondary)_88%,white),color-mix(in_oklch,var(--accent)_14%,white))]"
                                                            : "hover:bg-secondary/18"
                                                    }`}
                                                >
                                                    <td className="px-4 py-4 sm:px-5">
                                                        <div className="flex items-center gap-3">
                                                            <span
                                                                className={rankBadgeClassName(
                                                                    rank,
                                                                )}
                                                            >
                                                                {rank}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 sm:px-5">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="size-11 border border-border bg-background shadow-sm">
                                                                <AvatarImage
                                                                    src={
                                                                        entry.avatar_url ||
                                                                        undefined
                                                                    }
                                                                    alt={
                                                                        entry.user_name
                                                                    }
                                                                />
                                                                <AvatarFallback className="bg-secondary text-sm font-black text-primary">
                                                                    {initials(
                                                                        entry.user_name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <p className="truncate font-semibold">
                                                                        {
                                                                            entry.user_name
                                                                        }
                                                                    </p>
                                                                    {rank ===
                                                                        1 && (
                                                                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-primary">
                                                                            Top
                                                                            Tracker
                                                                        </span>
                                                                    )}
                                                                    {isCurrentUser && (
                                                                        <span className="rounded-full border border-primary/25 bg-background px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-primary">
                                                                            You
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {getPlacementLabel(
                                                                        rank,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-right sm:px-5">
                                                        <span className="text-3xl font-black">
                                                            {entry.plant_count}
                                                        </span>
                                                        <span className="ml-2 text-sm text-muted-foreground">
                                                            plants
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </section>

                {!isLoading && leaderboard.length > 0 && (
                    <section className="flora-glass relative mt-5 overflow-hidden rounded-2xl border border-border/70 bg-background/80 px-5 py-8 text-center shadow-lg shadow-foreground/5 sm:px-8">
                        <Image
                            src="/side-plants.png"
                            alt=""
                            width={260}
                            height={260}
                            className="pointer-events-none absolute bottom-0 left-0 hidden w-36 scale-x-[-1] opacity-28 lg:block"
                        />
                        <Image
                            src="/side-plants.png"
                            alt=""
                            width={260}
                            height={260}
                            className="pointer-events-none absolute bottom-0 right-0 hidden w-36 opacity-28 lg:block"
                        />

                        <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary shadow-sm">
                            <Leaf className="h-6 w-6" />
                        </span>
                        <h2 className="mt-5 font-serif text-3xl font-black tracking-tight">
                            Want to climb the leaderboard?
                        </h2>
                        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                            Start tracking more plants and contribute to a
                            greener world.
                        </p>

                        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button asChild className="h-12 rounded-xl px-6">
                                <Link href="/dashboard">
                                    <Sprout className="h-4 w-4" />
                                    Track a Plant
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-12 rounded-xl px-6"
                            >
                                <Link href="/map">
                                    <MapIcon className="h-4 w-4" />
                                    View Map
                                </Link>
                            </Button>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

function rankBadgeClassName(rank: number) {
    if (rank === 1) {
        return "grid size-8 place-items-center rounded-full bg-amber-100 text-sm font-black text-amber-700";
    }
    if (rank === 2) {
        return "grid size-8 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-700";
    }
    if (rank === 3) {
        return "grid size-8 place-items-center rounded-full bg-orange-100 text-sm font-black text-orange-700";
    }
    return "grid size-8 place-items-center rounded-full bg-secondary text-sm font-black text-primary";
}

function getPlacementLabel(rank: number) {
    if (rank === 1) return "Top Tracker";
    if (rank === 2) return "Plant Lover";
    if (rank === 3) return "Nature Explorer";
    if (rank <= 10) return `Rank #${rank}`;
    return "Growing Contributor";
}

function initials(name: string) {
    return name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

function getCountryName(plant: Plant) {
    const { lat, lng } = plant;

    if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) return "India";
    if (lat >= -12 && lat <= 8 && lng >= 95 && lng <= 141) return "Indonesia";
    if (lat >= -35 && lat <= 6 && lng >= -75 && lng <= -34) return "Brazil";
    if (lat >= 24 && lat <= 49 && lng >= -125 && lng <= -66) return "USA";
    if (lat >= -5 && lat <= 6 && lng >= 33 && lng <= 42) return "Kenya";
    if (lat >= 36 && lat <= 56 && lng >= 60 && lng <= 90) return "Kazakhstan";
    if (lat >= 18 && lat <= 54 && lng >= 73 && lng <= 135) return "China";
    if (lat >= 35 && lat <= 72 && lng >= -10 && lng <= 40) return "Europe";
    if (lat >= -35 && lat <= 35 && lng >= -20 && lng <= 55) return "Africa";
    return "Global";
}
