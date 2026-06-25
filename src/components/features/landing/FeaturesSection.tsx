"use client";

import { motion } from "framer-motion";
import { Leaf, Search, Trophy } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

const LandingMiniMap = dynamic(() => import("./LandingMiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-[1.25rem] bg-[linear-gradient(135deg,var(--secondary),var(--card))]" />
  ),
});

type FeaturePreviewKind =
  | "dashboard"
  | "form"
  | "map"
  | "search"
  | "leaderboard";

const features: Array<{
  title: string;
  text: string;
  preview: FeaturePreviewKind;
}> = [
  {
    title: "Dashboard",
    text: "A clean personal hub for your sightings, newest plants, and contribution progress.",
    preview: "dashboard",
  },
  {
    title: "Plant Form",
    text: "Capture name, image, category, description, and live location without a heavy workflow.",
    preview: "form",
  },
  {
    title: "Interactive Map",
    text: "Explore mapped discoveries from across the community with a simple visual layer.",
    preview: "map",
  },
  {
    title: "Search",
    text: "Find plants by name, contributor, description, location context, or unique PID.",
    preview: "search",
  },
  {
    title: "Leaderboard",
    text: "Make contribution visible and celebrate people who keep documenting plant life.",
    preview: "leaderboard",
  },
];

const dashboardPlants = [
  ["Monstera Deliciosa", "San Francisco, USA", "2h ago"],
  ["Snake Plant", "Lisbon, Portugal", "1d ago"],
  ["Fiddle Leaf Fig", "Nairobi, Kenya", "2d ago"],
  ["Neem Tree", "Panipat, India", "3d ago"],
  ["Aloe Vera", "Jaipur, India", "5d ago"],
];

const searchablePlants = [
  {
    name: "Monstera Deliciosa",
    meta: "Houseplant • San Francisco • PID: FLR12345",
  },
  {
    name: "Neem Tree",
    meta: "Tree • Panipat • PID: FLR1024",
  },
  {
    name: "Snake Plant",
    meta: "Indoor • Lisbon • PID: FLR2048",
  },
  {
    name: "Fiddle Leaf Fig",
    meta: "Houseplant • Nairobi • PID: FLR4096",
  },
  {
    name: "Aloe Vera",
    meta: "Medicinal • Jaipur • PID: FLR8192",
  },
];

const leaderboardRows = {
  allTime: [
    ["PlantMaster", "2,847"],
    ["GreenThumb", "2,446"],
    ["NatureLover", "2,045"],
    ["LeafExplorer", "1,644"],
    ["BloomBot", "1,234"],
    ["NeemScout", "1,102"],
    ["HerbHunter", "984"],
    ["GardenGuru", "876"],
  ],
  month: [
    ["NeemScout", "428"],
    ["FloraFan", "396"],
    ["PlantMaster", "372"],
    ["GreenThumb", "311"],
    ["LeafExplorer", "288"],
    ["AloeAce", "244"],
    ["TreeMapper", "219"],
    ["RootRider", "184"],
  ],
};

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="flora-full-bleed relative w-screen overflow-hidden bg-[linear-gradient(180deg,var(--flora-section)_0%,var(--background)_100%)] p-20"
    >
      <FloatingLeaves />

      <div className="relative z-10 mx-auto text-center">
        <div className="flora-glass-soft mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
          Features
        </div>
        <h2 className="mt-6 font-sans text-xl font-black">
          Everything You Need to
          <span className="block text-primary text-6xl">Explore & Track Plants</span>
        </h2>
      </div>

      <div className="relative z-10 mt-12 grid w-full gap-5 md:grid-cols-2 xl:grid-cols-5">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.05 }}
            className="flora-glass group flex min-h-[560px] flex-col rounded-2xl py-4 px-5 transition-all hover:-translate-y-px"
          >
            <h3 className="text-xl font-black text-card-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 min-h-[88px] text-sm leading-6 text-muted-foreground">
              {feature.text}
            </p>
            <FeaturePreview kind={feature.preview} />
            <a
              href={feature.preview === "dashboard" ? "/dashboard" : feature.preview === "map" ? "/map" : feature.preview === "search" ? "/search" : feature.preview === "leaderboard" ? "/leaderboard" : "/dashboard"}
              className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary"
            >
              Learn more
              <span aria-hidden="true">-&gt;</span>
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function FeaturePreview({ kind }: { kind: FeaturePreviewKind }) {
  if (kind === "dashboard") {
    return (
      <motion.div
        className="mt-auto rounded-xl border border-border bg-card/64 p-4 shadow-sm shadow-foreground/5 space-y-4"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-black">Overview</span>
          <span className="rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground">
            This Month
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["24", "Plants"],
            ["8", "Locations"],
            ["156", "Photos"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-md border border-border bg-card/70 p-2">
              <p className="text-lg font-black">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <MiniPlantList />
      </motion.div>
    );
  }

  if (kind === "form") {
    return <PlantFormPreview />;
  }

  if (kind === "map") {
    return (
      <PreviewFrame className="overflow-hidden p-0">
        <LandingMiniMap />
      </PreviewFrame>
    );
  }

  if (kind === "search") {
    return <SearchPreview />;
  }

  return <LeaderboardPreview />;
}

function PreviewFrame({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mt-auto rounded-xl border border-border bg-card/64 p-4 shadow-sm shadow-foreground/5 ${className}`}
    >
      {children}
    </div>
  );
}

function MiniPlantList() {
  return (
    <motion.div
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-black">Recent Plants</p>
        <span className="text-[10px] text-primary">Hover to expand</span>
      </div>
      {dashboardPlants.map(([name, location, time], index) => (
        <motion.div
          key={name}
          variants={{
            rest:
              index < 3
                ? { opacity: 1, y: 0, height: "auto" }
                : { opacity: 0, y: -12, height: 0 },
            hover: { opacity: 1, y: 0, height: "auto" },
          }}
          transition={{ duration: 0.22, delay: index >= 3 ? (index - 2) * 0.04 : 0 }}
          className="flex items-center gap-3 overflow-hidden"
        >
          <PlantAvatar index={index} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-black">{name}</p>
            <p className="truncate text-[10px] text-muted-foreground">
              {location}
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

function SearchPreview() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return searchablePlants.slice(0, 4);

    return searchablePlants.filter((plant) =>
      `${plant.name} ${plant.meta}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <PreviewFrame className="space-y-3">
      <label className="flex items-center gap-2 rounded-xl border border-border bg-card/75 px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-primary" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search plants, location, or PID..."
          className="min-w-0 flex-1 bg-transparent text-xs font-semibold outline-none placeholder:text-muted-foreground"
        />
      </label>
      <p className="text-xs font-black">Results</p>
      <div className="h-[280px] space-y-2 overflow-hidden">
        {results.length ? (
          results.map((plant, index) => (
            <motion.div
              key={plant.name}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: index * 0.03 }}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/55 px-3 py-2 text-xs"
            >
              <PlantAvatar index={index} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-black">{plant.name}</span>
                <span className="block truncate text-[10px] text-muted-foreground">
                  {plant.meta}
                </span>
              </span>
            </motion.div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border px-3 py-5 text-center text-xs text-muted-foreground">
            No demo plants found
          </div>
        )}
      </div>
    </PreviewFrame>
  );
}

function PlantFormPreview() {
  const [name, setName] = useState("Monstera Deliciosa");
  const [category, setCategory] = useState("Houseplant");
  const [location, setLocation] = useState("Panipat, India");

  return (
    <PreviewFrame className="space-y-3">
      <p className="text-xs font-black">Add New Plant</p>
      <PlantPhoto />
      <DemoInput label="Name" value={name} onChange={setName} />
      <DemoInput label="Category" value={category} onChange={setCategory} />
      <DemoInput label="Location" value={location} onChange={setLocation} />
      <Link
        href="/dashboard"
        className="block rounded-xl bg-primary px-4 py-3 text-center text-xs font-black text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Create Plant
      </Link>
    </PreviewFrame>
  );
}

function DemoInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-xl border border-border bg-card/70 px-3 py-2">
      <span className="block text-[10px] text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full bg-transparent text-xs font-semibold outline-none"
      />
    </label>
  );
}

function LeaderboardPreview() {
  const [activeTab, setActiveTab] = useState<"allTime" | "month">("allTime");
  const rows = leaderboardRows[activeTab];

  return (
    <PreviewFrame className="space-y-4">
      <div className="grid grid-cols-2 rounded-xl bg-muted p-1 text-center text-xs font-semibold">
        {[
          ["allTime", "All Time"],
          ["month", "This Month"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value as "allTime" | "month")}
            className={`rounded-lg px-2 py-2 transition-colors ${
              activeTab === value
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {rows.map(([name, score], index) => (
        <motion.div
          key={`${activeTab}-${name}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, delay: index * 0.03 }}
          className="flex items-center gap-3 text-xs"
        >
          <span
            className={`grid size-7 place-items-center rounded-full font-black ${
              index < 3
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-primary"
            }`}
          >
            {index < 3 ? <Trophy className="h-3.5 w-3.5" /> : index + 1}
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-secondary text-[10px] font-black text-primary">
            {name.slice(0, 1)}
          </span>
          <span className="flex-1 font-semibold">{name}</span>
          <span className="font-semibold">{score}</span>
        </motion.div>
      ))}
    </PreviewFrame>
  );
}

function PlantPhoto() {
  return (
    <div className="relative h-30 overflow-hidden rounded-xl border border-border bg-[linear-gradient(135deg,var(--secondary),var(--card))]">
      <div className="absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(180deg,transparent,var(--flora-leaf-muted))]" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-card/80 text-primary shadow-lg shadow-foreground/5">
          <Leaf className="h-8 w-8" strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}

function PlantAvatar({ index }: { index: number }) {
  const tones = ["bg-secondary", "bg-accent/70", "bg-primary/10"];

  return (
    <div
      className={`grid size-10 place-items-center rounded-xl text-primary ${tones[index % tones.length]}`}
    >
      <Leaf className="h-5 w-5" strokeWidth={2.5} />
    </div>
  );
}

function FloatingLeaves() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {[
        "left-[16%] top-10 -rotate-45 opacity-20",
        "left-[22%] top-24 rotate-12 opacity-16",
        "right-[20%] top-12 rotate-45 opacity-18",
        "right-[11%] top-28 -rotate-12 opacity-14",
      ].map((className, index) => (
        <span
          key={index}
          className={`absolute h-10 w-5 rounded-[100%_0_100%_0] bg-primary blur-[1px] ${className}`}
        />
      ))}
    </div>
  );
}
