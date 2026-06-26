"use client";

import { type ReactNode, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plant } from "@/lib/types";
import { Filter, Globe2, Leaf, MapPin, Search, Users } from "lucide-react";

const PlantMap = dynamic(() => import("@/app/components/PlantMap"), {
    ssr: false,
    loading: () => (
        <div className="h-[26rem] w-full animate-pulse rounded-[1.75rem] bg-secondary/50 sm:h-[34rem]" />
    ),
});

const timeframeOptions = ["All Time", "Last 7 Days", "Last 30 Days"] as const;

type TimeframeFilter = (typeof timeframeOptions)[number];

type RegionSummary = {
    name: string;
    count: number;
    description: string;
    objectPosition: string;
};

type ContributorSummary = {
    userId: string;
    userName: string;
    count: number;
    avatarUrl?: string | null;
};

export default function MapPageContent() {
    const { data: plants = [], error } = useQuery<Plant[]>({
        queryKey: ["plants"],
        queryFn: async () => {
            const response = await fetch("/api/plants");
            if (!response.ok) {
                throw new Error("Failed to fetch plants");
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedTimeframe, setSelectedTimeframe] =
        useState<TimeframeFilter>("All Time");
    const [showOnlyGeotagged, setShowOnlyGeotagged] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

    const deferredSearchQuery = useDeferredValue(searchQuery);

    useEffect(() => {
        if (error) {
            console.error("Error fetching plants:", error);
            toast.error("Failed to load plants");
        }
    }, [error]);

    const filteredPlants = useMemo(() => {
        const normalizedSearch = deferredSearchQuery.trim().toLowerCase();
        const now = Date.now();

        return plants.filter((plant) => {
            const createdAt = new Date(plant.created_at).getTime();
            const withinTimeframe =
                selectedTimeframe === "All Time"
                    ? true
                    : selectedTimeframe === "Last 7 Days"
                      ? now - createdAt <= 7 * 24 * 60 * 60 * 1000
                      : now - createdAt <= 30 * 24 * 60 * 60 * 1000;

            const matchesCategory =
                selectedCategory === "All Categories"
                    ? true
                    : (plant.category || "").toLowerCase() ===
                      selectedCategory.toLowerCase();

            const matchesSearch = normalizedSearch
                ? [
                      plant.name,
                      plant.pid,
                      plant.user_name,
                      plant.category,
                      describeLocation(plant),
                  ]
                      .filter(Boolean)
                      .some((value) =>
                          String(value)
                              .toLowerCase()
                              .includes(normalizedSearch),
                      )
                : true;

            const matchesGeotagged = showOnlyGeotagged
                ? !!(plant.lat && plant.lng)
                : true;

            return (
                withinTimeframe &&
                matchesCategory &&
                matchesSearch &&
                matchesGeotagged
            );
        });
    }, [
        plants,
        deferredSearchQuery,
        selectedCategory,
        selectedTimeframe,
        showOnlyGeotagged,
    ]);

    useEffect(() => {
        if (!filteredPlants.length) {
            setSelectedPlant(null);
            return;
        }

        if (
            selectedPlant &&
            !filteredPlants.some((plant) => plant.id === selectedPlant.id)
        ) {
            setSelectedPlant(null);
        }
    }, [filteredPlants, selectedPlant]);

    const categoryOptions = useMemo(() => {
        const categories = Array.from(
            new Set(
                plants
                    .map((plant) => plant.category?.trim())
                    .filter((value): value is string => !!value),
            ),
        ).sort((a, b) => a.localeCompare(b));

        return ["All Categories", ...categories];
    }, [plants]);

    const contributorCount = countContributors(filteredPlants);
    const countryCount = countCountries(filteredPlants);
    const popularRegions = buildPopularRegions(filteredPlants);
    const topContributors = buildTopContributors(filteredPlants);

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_14%_16%,color-mix(in_oklch,var(--accent)_26%,transparent),transparent_25%),linear-gradient(180deg,var(--flora-hero-start)_0%,var(--background)_88%)] px-3 pb-24 pt-22 text-foreground sm:px-5 sm:pb-10 sm:pt-24 lg:px-6 xl:px-8">
            <div className="mx-auto w-full max-w-[1680px]">
                <section className="flora-glass relative overflow-hidden rounded-2xl border border-border/70 bg-background/72 px-4 py-5 shadow-xl shadow-foreground/5 sm:px-6 sm:py-7 lg:px-8 lg:py-9 xl:px-10 xl:py-10">
                    <Image
                        src="/side-plants.png"
                        alt=""
                        width={420}
                        height={420}
                        className="pointer-events-none absolute -right-8 top-0 hidden w-56 opacity-22 blur-[2px] lg:block"
                    />

                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                                Global Discoveries
                            </p>
                            <h1 className="mt-3 max-w-[12ch] font-serif text-[clamp(2rem,4vw,4rem)] font-black leading-[0.95] tracking-tight">
                                Explore the World of Plants
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <StatCard
                                icon={Leaf}
                                value={filteredPlants.length}
                                label="Total Plants"
                            />
                            <StatCard
                                icon={MapPin}
                                value={
                                    filteredPlants.filter(
                                        (plant) => plant.lat && plant.lng,
                                    ).length
                                }
                                label="Geotagged"
                            />
                            <StatCard
                                icon={Users}
                                value={contributorCount}
                                label="Contributors"
                            />
                            <StatCard
                                icon={Globe2}
                                value={countryCount}
                                label="Countries"
                            />
                        </div>
                    </div>
                </section>

                <section className="mt-4 space-y-4">
                    <div className="flora-glass flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/72 p-3 shadow-lg shadow-foreground/5 lg:flex-row lg:flex-wrap lg:items-center">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-card/72 px-4 py-2">
                            <Search className="h-4 w-4 shrink-0 text-primary" />
                            <Input
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Search plants, locations, or PID..."
                                className="h-auto min-w-0 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                            />
                        </label>

                        <FilterSelect
                            icon={Leaf}
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                            placeholder="All Categories"
                            options={categoryOptions}
                        />
                        <FilterSelect
                            icon={Globe2}
                            value={selectedTimeframe}
                            onValueChange={(value) =>
                                setSelectedTimeframe(value as TimeframeFilter)
                            }
                            placeholder="All Time"
                            options={timeframeOptions}
                        />
                        <Button
                            type="button"
                            variant={showOnlyGeotagged ? "default" : "outline"}
                            onClick={() =>
                                setShowOnlyGeotagged((value) => !value)
                            }
                            className="h-10 rounded-xl px-4 text-sm font-semibold"
                        >
                            <MapPin className="h-4 w-4" />
                            {showOnlyGeotagged
                                ? "Geotagged Only"
                                : "All Plants"}
                        </Button>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("All Categories");
                                setSelectedTimeframe("All Time");
                                setShowOnlyGeotagged(false);
                                setSelectedPlant(null);
                            }}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card/72 px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                        >
                            <Filter className="h-4 w-4 text-primary" />
                            Reset
                        </button>
                    </div>

                    <div className="flora-glass overflow-hidden rounded-2xl border border-border/70 bg-background/76 p-4 shadow-xl shadow-foreground/6">
                        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_22rem]">
                            <div className="relative min-w-0 overflow-hidden rounded-xl border border-border bg-card/70">
                                <PlantMap
                                    plants={filteredPlants}
                                    selectedPlant={selectedPlant}
                                    onSelectPlant={(plant) =>
                                        setSelectedPlant(plant)
                                    }
                                />
                            </div>

                            <aside className="flora-glass flex min-h-full flex-col rounded-xl border border-border/70 bg-background/80 p-4 shadow-lg shadow-foreground/6 sm:rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-sm font-black">
                                            Recently Added
                                        </h2>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Click a plant to expand its details.
                                        </p>
                                    </div>
                                    <Link
                                        href="/search"
                                        className="text-sm font-semibold text-primary"
                                    >
                                        View all
                                    </Link>
                                </div>

                                <div className="mt-4 flex-1 space-y-3">
                                    {filteredPlants.length ? (
                                        filteredPlants.slice(0, 5).map((plant) => (
                                            <RecentDiscoveryRow
                                                key={plant.id}
                                                plant={plant}
                                                active={
                                                    selectedPlant?.id === plant.id
                                                }
                                                onClick={() => {
                                                    setSelectedPlant((current) =>
                                                        current?.id === plant.id
                                                            ? null
                                                            : plant,
                                                    );
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground sm:rounded-2xl">
                                            No discoveries match the current
                                            filters.
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>

                <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.95fr] 2xl:grid-cols-[1.45fr_0.9fr]">
                    <section className="flora-glass rounded-2xl border border-border/70 bg-background/78 p-5 shadow-lg shadow-foreground/5 sm:p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-black">
                                    Popular Regions
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Where discoveries are clustering right now.
                                </p>
                            </div>
                            <Link
                                href="/search"
                                className="text-sm font-semibold text-primary"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {popularRegions.map((region) => (
                                <article
                                    key={region.name}
                                    className="overflow-hidden rounded-xl border border-border bg-card/72 shadow-sm sm:rounded-2xl"
                                >
                                    <div className="relative h-28">
                                        <Image
                                            src="/hero-plants.png"
                                            alt={region.name}
                                            fill
                                            className="object-cover"
                                            style={{
                                                objectPosition:
                                                    region.objectPosition,
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.55))]" />
                                        <div className="absolute left-3 top-3 grid size-7 place-items-center rounded-full bg-background/85 text-primary shadow-sm">
                                            <Leaf className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-black">
                                            {region.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {region.count} Plants
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-6 sm:grid-cols-[1.3fr_0.8fr] xl:grid-cols-1 xl:grid-rows-[auto_auto]">
                        <div className="flora-glass rounded-2xl border border-border/70 bg-background/78 p-5 shadow-lg shadow-foreground/5 sm:p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-black">
                                        Top Contributors
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        The people documenting plant life most
                                        actively.
                                    </p>
                                </div>
                                <Link
                                    href="/leaderboard"
                                    className="text-sm font-semibold text-primary"
                                >
                                    View leaderboard
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-4">
                                {topContributors.map((contributor, index) => (
                                    <div
                                        key={contributor.userId}
                                        className="text-center"
                                    >
                                        <Avatar className="mx-auto size-14 border-4 border-background shadow-md">
                                            <AvatarImage
                                                src={
                                                    contributor.avatarUrl ||
                                                    undefined
                                                }
                                                alt={contributor.userName}
                                            />
                                            <AvatarFallback className="bg-[linear-gradient(135deg,var(--accent),var(--primary))] text-sm font-black text-primary-foreground">
                                                {initials(
                                                    contributor.userName,
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="mt-3 text-sm font-black">
                                            {contributor.userName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {contributor.count} Plants
                                        </p>
                                        {index < 3 && (
                                            <span className="mt-2 inline-flex rounded-full bg-secondary px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                                                Top {index + 1}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flora-glass rounded-2xl border border-border/70 bg-background/78 px-5 py-4 text-center text-sm text-muted-foreground shadow-lg shadow-foreground/5 sm:px-6">
                            Every plant discovery helps build a greener, more
                            connected planet. Thank you!
                        </div>
                    </section>
                </section>
            </div>
        </main>
    );
}

function StatCard({
    icon: Icon,
    value,
    label,
}: {
    icon: typeof Leaf;
    value: number;
    label: string;
}) {
    return (
        <div className="rounded-xl border border-border/70 bg-background/82 px-4 py-5 text-center shadow-sm sm:rounded-2xl">
            <div className="mx-auto grid size-10 place-items-center rounded-full bg-secondary text-primary">
                <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-[clamp(1.45rem,2vw,2rem)] font-black">
                {value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}

function FilterSelect({
    icon: Icon,
    value,
    onValueChange,
    placeholder,
    options,
}: {
    icon: typeof Leaf;
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: readonly string[];
}) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="min-w-44 rounded-xl border-border bg-card/72 px-4 text-sm font-semibold shadow-none">
                <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-primary" />
                    <SelectValue placeholder={placeholder} />
                </span>
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function RecentDiscoveryRow({
    plant,
    active,
    onClick,
}: {
    plant: Plant;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full rounded-xl border p-3 text-left transition-all duration-200 sm:rounded-2xl ${
                active
                    ? "border-primary/45 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--secondary)_74%,white),color-mix(in_oklch,var(--accent)_16%,white))] shadow-md"
                    : "border-border bg-card/72 hover:border-primary/30 hover:bg-secondary/18"
            }`}
        >
            <div className="flex items-start gap-3">
                <PlantThumb plant={plant} active={active} />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-black">
                                {plant.name}
                            </p>
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                                {plant.category || "Uncategorized"} • PID:{" "}
                                {plant.pid}
                            </p>
                        </div>
                        <p className="shrink-0 text-xs text-muted-foreground">
                            {timeAgo(plant.created_at)}
                        </p>
                    </div>

                    <p className="mt-2 truncate text-xs text-muted-foreground">
                        {describeLocation(plant)}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Avatar className="size-6 border border-border">
                            <AvatarImage
                                src={plant.user_avatar_url || undefined}
                                alt={plant.user_name}
                            />
                            <AvatarFallback className="bg-secondary text-[9px] font-black text-primary">
                                {initials(plant.user_name)}
                            </AvatarFallback>
                        </Avatar>
                        <p className="truncate">{plant.user_name}</p>
                    </div>
                </div>
            </div>

            {active && (
                <div className="mt-4 overflow-hidden rounded-xl border border-primary/20 bg-background/78 p-3 shadow-sm sm:rounded-2xl">
                    <div className="flex items-start gap-3">
                        <PlantThumb plant={plant} active={active} large />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                                    Recently added
                                </span>
                                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                                    {plant.category || "No category"}
                                </span>
                            </div>
                            <p className="mt-3 text-base font-black leading-tight">
                                {plant.name}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {plant.description ||
                                    "Fresh discovery added to the flora map."}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <InfoPill
                            icon={<MapPin className="h-3.5 w-3.5 text-primary" />}
                            label="Location"
                            value={describeLocation(plant)}
                        />
                        <InfoPill
                            icon={<Leaf className="h-3.5 w-3.5 text-primary" />}
                            label="Tracked"
                            value={timeAgo(plant.created_at)}
                        />
                    </div>
                </div>
            )}
        </button>
    );
}

function PlantThumb({
    plant,
    active,
    large = false,
}: {
    plant: Plant;
    active: boolean;
    large?: boolean;
}) {
    const sizeClass = large ? "h-24 w-24 sm:h-28 sm:w-28" : "h-16 w-16";

    if (plant.image_url) {
        return (
            <Image
                src={plant.image_url}
                alt={plant.name}
                width={large ? 112 : 68}
                height={large ? 112 : 68}
                className={`${sizeClass} shrink-0 rounded-xl object-cover transition-transform sm:rounded-2xl ${
                    active ? "scale-[1.02]" : ""
                }`}
            />
        );
    }

    return (
        <div
            className={`${sizeClass} grid shrink-0 place-items-center rounded-xl bg-secondary text-primary sm:rounded-2xl ${
                active ? "shadow-sm" : ""
            }`}
        >
            <Leaf className={large ? "h-8 w-8" : "h-6 w-6"} />
        </div>
    );
}

function InfoPill({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-card/80 px-3 py-2 sm:rounded-2xl">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-primary">
                {icon}
                <span>{label}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{value}</p>
        </div>
    );
}

function countContributors(plants: Plant[]) {
    return new Set(plants.map((plant) => plant.user_id)).size;
}

function countCountries(plants: Plant[]) {
    return new Set(plants.map((plant) => getRegionName(plant))).size;
}

function buildPopularRegions(plants: Plant[]): RegionSummary[] {
    const regionMap = new Map<string, number>();

    for (const plant of plants) {
        const region = getRegionName(plant);
        regionMap.set(region, (regionMap.get(region) || 0) + 1);
    }

    const defaults: RegionSummary[] = [
        {
            name: "India",
            count: 124,
            description: "South Asia",
            objectPosition: "18% center",
        },
        {
            name: "Indonesia",
            count: 89,
            description: "Southeast Asia",
            objectPosition: "36% center",
        },
        {
            name: "Brazil",
            count: 76,
            description: "South America",
            objectPosition: "52% center",
        },
        {
            name: "USA",
            count: 63,
            description: "North America",
            objectPosition: "68% center",
        },
        {
            name: "Kenya",
            count: 51,
            description: "East Africa",
            objectPosition: "84% center",
        },
    ];

    if (!regionMap.size) return defaults;

    return Array.from(regionMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count], index) => ({
            name,
            count,
            description: "Active region",
            objectPosition:
                [
                    "18% center",
                    "36% center",
                    "52% center",
                    "68% center",
                    "84% center",
                ][index] || "50% center",
        }));
}

function buildTopContributors(plants: Plant[]): ContributorSummary[] {
    const map = new Map<string, ContributorSummary>();

    for (const plant of plants) {
        const existing = map.get(plant.user_id);
        if (existing) {
            existing.count += 1;
        } else {
            map.set(plant.user_id, {
                userId: plant.user_id,
                userName: plant.user_name,
                count: 1,
                avatarUrl: plant.user_avatar_url ?? null,
            });
        }
    }

    const rows = Array.from(map.values()).sort((a, b) => b.count - a.count);

    if (rows.length) return rows.slice(0, 4);

    return [
        {
            userId: "plantmaster",
            userName: "PlantMaster",
            count: 2847,
            avatarUrl: null,
        },
        {
            userId: "greenthumb",
            userName: "GreenThumb",
            count: 2446,
            avatarUrl: null,
        },
        {
            userId: "naturelover",
            userName: "NatureLover",
            count: 2045,
            avatarUrl: null,
        },
        {
            userId: "leafexplorer",
            userName: "LeafExplorer",
            count: 1644,
            avatarUrl: null,
        },
    ];
}

function initials(name: string) {
    return name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

function timeAgo(dateValue: string | Date) {
    const timestamp = new Date(dateValue).getTime();
    const diffMs = Date.now() - timestamp;
    const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));

    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks}w ago`;
}

function describeLocation(plant: Plant) {
    return `${getRegionName(plant)} • ${plant.lat.toFixed(2)}, ${plant.lng.toFixed(2)}`;
}

function getRegionName(plant: Plant) {
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
