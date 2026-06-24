"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

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

const featureGlyphs: Record<FeaturePreviewKind, string> = {
  dashboard: "grid",
  form: "leaf",
  map: "map",
  search: "search",
  leaderboard: "cup",
};

const stats = [
  { value: "250K+", label: "Plants Tracked", glyph: "leaf" },
  { value: "10K+", label: "Active Users", glyph: "people" },
  { value: "180+", label: "Countries", glyph: "globe" },
  { value: "500K+", label: "Photos Shared", glyph: "camera" },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="flora-full-bleed relative w-screen overflow-hidden bg-[linear-gradient(180deg,var(--flora-section)_0%,var(--background)_100%)] px-[clamp(1rem,4vw,4.5rem)] py-20"
    >
      <FloatingLeaves />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="flora-glass-soft mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
          <CssGlyph kind="leaf" small />
          Features
        </div>
        <h2 className="mt-7 font-sans text-[clamp(2.7rem,5.4vw,5.6rem)] font-black leading-[0.98] tracking-tight">
          Everything You Need to
          <span className="block text-primary">Explore & Track Plants</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          A full toolkit to discover, document, search, map, and celebrate plant
          life.
        </p>
      </div>

      <div className="relative z-10 mt-12 grid w-full gap-5 md:grid-cols-2 xl:grid-cols-5">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.05 }}
            className="flora-glass group flex min-h-[560px] flex-col rounded-[1.7rem] p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flora-glass-soft mb-6 grid size-14 place-items-center rounded-[1.2rem] text-primary transition-transform group-hover:scale-105">
              <CssGlyph kind={featureGlyphs[feature.preview]} />
            </div>
            <h3 className="text-xl font-black text-card-foreground">
              {feature.title}
            </h3>
            <p className="mt-3 min-h-[88px] text-sm leading-6 text-muted-foreground">
              {feature.text}
            </p>
            <FeaturePreview kind={feature.preview} />
            <a
              href={feature.preview === "dashboard" ? "/dashboard" : feature.preview === "map" ? "/map" : feature.preview === "search" ? "/search" : feature.preview === "leaderboard" ? "/leaderboard" : "/dashboard"}
              className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary"
            >
              Learn more
              <span aria-hidden="true">-&gt;</span>
            </a>
          </motion.article>
        ))}
      </div>

      <div className="flora-glass relative z-10 mx-auto mt-8 grid max-w-[88rem] gap-4 rounded-[2rem] px-6 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="flex items-center gap-5 lg:border-r lg:border-border/70 lg:last:border-r-0"
          >
            <div className="flora-glass-soft grid size-14 shrink-0 place-items-center rounded-full text-primary">
              <CssGlyph kind={stat.glyph} />
            </div>
            <div>
              <p className="text-3xl font-black text-primary">{stat.value}</p>
              <p className="text-sm font-semibold text-foreground">
                {stat.label}
              </p>
            </div>
            {index < stats.length - 1 && (
              <span className="hidden h-12 w-px bg-border lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturePreview({ kind }: { kind: FeaturePreviewKind }) {
  if (kind === "dashboard") {
    return (
      <PreviewFrame className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black">Overview</span>
          <span className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">
            This Month
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["24", "Plants"],
            ["8", "Locations"],
            ["156", "Photos"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-xl border border-border bg-card/70 p-3">
              <p className="text-lg font-black">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <MiniPlantList />
      </PreviewFrame>
    );
  }

  if (kind === "form") {
    return (
      <PreviewFrame className="space-y-3">
        <p className="text-xs font-black">Add New Plant</p>
        <PlantPhoto />
        <FormLine label="Name" value="Monstera Deliciosa" />
        <FormLine label="Category" value="Houseplant" />
        <div className="rounded-xl border border-border bg-card/70 p-3">
          <p className="text-[10px] text-muted-foreground">Location</p>
          <p className="text-xs font-semibold">San Francisco, USA</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            37.7749 N, 122.4194 W
          </p>
        </div>
        <span className="ml-auto block w-fit rounded-full bg-primary px-3 py-1 text-[10px] font-black text-primary-foreground">
          AI Autofill
        </span>
      </PreviewFrame>
    );
  }

  if (kind === "map") {
    return (
      <PreviewFrame className="overflow-hidden p-0">
        <div className="relative h-[300px] rounded-[1.25rem] bg-[linear-gradient(135deg,color-mix(in_oklch,var(--accent)_42%,white)_0%,color-mix(in_oklch,var(--primary)_18%,white)_45%,color-mix(in_oklch,var(--secondary)_70%,white)_100%)]">
          <MapLand className="left-[6%] top-[18%] h-20 w-28" />
          <MapLand className="left-[38%] top-[10%] h-28 w-24 rotate-12" />
          <MapLand className="left-[62%] top-[28%] h-24 w-32 -rotate-6" />
          <MapLand className="left-[22%] top-[62%] h-16 w-24 rotate-6" />
          <MapPin left="12%" top="25%" label="12" />
          <MapPin left="47%" top="42%" label="28" />
          <MapPin left="78%" top="20%" label="9" />
          <MapPin left="22%" top="68%" label="" />
          <div className="absolute bottom-4 right-4 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <button className="grid size-9 place-items-center text-lg font-black text-primary">
              +
            </button>
            <button className="grid size-9 place-items-center border-t border-border text-lg font-black text-primary">
              -
            </button>
          </div>
        </div>
      </PreviewFrame>
    );
  }

  if (kind === "search") {
    return (
      <PreviewFrame className="space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card/75 p-3">
          <CssGlyph kind="search" small />
          <span className="text-[11px] text-muted-foreground">
            Search plants, users, or PID...
          </span>
          <span className="ml-auto rounded-md bg-secondary px-2 py-1 text-primary">
            <CssGlyph kind="filter" small />
          </span>
        </div>
        <p className="text-xs font-black">Recent Searches</p>
        {["Monstera Deliciosa", "John Doe", "PID: FLR12345", "Snake Plant"].map(
          (item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/55 px-3 py-2 text-xs"
            >
              <CssGlyph kind="search" small />
              <span className="flex-1">{item}</span>
              <span className="text-muted-foreground">x</span>
            </div>
          ),
        )}
      </PreviewFrame>
    );
  }

  return (
    <PreviewFrame className="space-y-4">
      <div className="grid grid-cols-2 text-center text-xs font-semibold">
        <span className="border-b-2 border-primary pb-2 text-primary">
          All Time
        </span>
        <span className="border-b border-border pb-2 text-muted-foreground">
          This Month
        </span>
      </div>
      {[
        ["PlantMaster", "2,847"],
        ["GreenThumb", "2,446"],
        ["NatureLover", "2,045"],
        ["LeafExplorer", "1,644"],
        ["BloomBot", "1,234"],
      ].map(([name, score], index) => (
        <div key={name} className="flex items-center gap-3 text-xs">
          <span className="w-4 font-black">{index + 1}</span>
          <span className="grid size-8 place-items-center rounded-full bg-secondary text-[10px] font-black text-primary">
            {name.slice(0, 1)}
          </span>
          <span className="flex-1 font-semibold">{name}</span>
          <span className="font-semibold">{score}</span>
        </div>
      ))}
    </PreviewFrame>
  );
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
      className={`mt-auto rounded-[1.35rem] border border-border bg-card/64 p-4 shadow-lg shadow-foreground/5 ${className}`}
    >
      {children}
    </div>
  );
}

function MiniPlantList() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black">Recent Plants</p>
        <span className="text-[10px] text-primary">View all</span>
      </div>
      {[
        ["Monstera Deliciosa", "San Francisco, USA", "2h ago"],
        ["Snake Plant", "Lisbon, Portugal", "1d ago"],
        ["Fiddle Leaf Fig", "Nairobi, Kenya", "2d ago"],
      ].map(([name, location, time], index) => (
        <div key={name} className="flex items-center gap-3">
          <PlantAvatar index={index} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-black">{name}</p>
            <p className="truncate text-[10px] text-muted-foreground">
              {location}
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
      ))}
    </div>
  );
}

function PlantPhoto() {
  return (
    <div className="relative h-24 overflow-hidden rounded-xl border border-border bg-[linear-gradient(135deg,var(--secondary),var(--card))]">
      <div className="absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(180deg,transparent,var(--flora-leaf-muted))]" />
      <div className="absolute left-10 top-8 h-16 w-7 origin-bottom -rotate-45 rounded-[100%_0_100%_0] bg-primary/65" />
      <div className="absolute left-20 top-5 h-20 w-8 origin-bottom rotate-12 rounded-[100%_0_100%_0] bg-primary" />
      <div className="absolute left-32 top-9 h-16 w-7 origin-bottom rotate-45 rounded-[100%_0_100%_0] bg-primary/70" />
      <span className="absolute right-4 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl bg-card shadow-md">
        <CssGlyph kind="camera" small />
      </span>
    </div>
  );
}

function PlantAvatar({ index }: { index: number }) {
  const rotations = ["-rotate-45", "rotate-12", "rotate-45"];

  return (
    <div className="relative size-10 overflow-hidden rounded-xl bg-secondary">
      <div className={`absolute left-3 top-3 h-6 w-3 rounded-[100%_0_100%_0] bg-primary ${rotations[index]}`} />
      <div className={`absolute left-5 top-2 h-7 w-3 rounded-[100%_0_100%_0] bg-primary/70 ${rotations[(index + 1) % rotations.length]}`} />
    </div>
  );
}

function FormLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 px-3 py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="truncate text-xs font-semibold">{value}</p>
    </div>
  );
}

function MapLand({ className }: { className: string }) {
  return (
    <div
      className={`absolute rounded-[55%_45%_48%_52%] bg-[color-mix(in_oklch,var(--flora-leaf-muted)_62%,transparent)] blur-[0.2px] ${className}`}
    />
  );
}

function MapPin({
  left,
  top,
  label,
}: {
  left: string;
  top: string;
  label: string;
}) {
  return (
    <div
      className="absolute grid size-10 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground shadow-lg shadow-primary/20"
      style={{ left, top }}
    >
      {label || <span className="size-2 rounded-full bg-primary-foreground" />}
    </div>
  );
}

function CssGlyph({
  kind,
  small = false,
}: {
  kind: string;
  small?: boolean;
}) {
  const size = small ? "size-4" : "size-7";

  if (kind === "grid") {
    return (
      <span className={`grid ${size} grid-cols-2 gap-1`}>
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className="rounded-[0.22rem] border-2 border-current" />
        ))}
      </span>
    );
  }

  if (kind === "leaf") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute inset-[12%] rounded-[100%_0_100%_0] border-2 border-current" />
        <span className="absolute bottom-[8%] left-1/2 h-[78%] w-0.5 -rotate-45 bg-current" />
      </span>
    );
  }

  if (kind === "map") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute left-0 top-[18%] h-[70%] w-[30%] rounded-sm border-2 border-current" />
        <span className="absolute left-[35%] top-0 h-[78%] w-[30%] rounded-sm border-2 border-current" />
        <span className="absolute right-0 top-[18%] h-[70%] w-[30%] rounded-sm border-2 border-current" />
      </span>
    );
  }

  if (kind === "search") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute left-0 top-0 size-[68%] rounded-full border-2 border-current" />
        <span className="absolute bottom-[8%] right-[8%] h-0.5 w-[42%] rotate-45 bg-current" />
      </span>
    );
  }

  if (kind === "cup") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute left-[22%] top-[8%] h-[52%] w-[56%] rounded-b-lg border-2 border-current" />
        <span className="absolute left-[8%] top-[18%] h-[28%] w-[22%] rounded-l-full border-2 border-r-0 border-current" />
        <span className="absolute right-[8%] top-[18%] h-[28%] w-[22%] rounded-r-full border-2 border-l-0 border-current" />
        <span className="absolute bottom-[20%] left-1/2 h-[24%] w-0.5 -translate-x-1/2 bg-current" />
        <span className="absolute bottom-[8%] left-[28%] h-0.5 w-[44%] bg-current" />
      </span>
    );
  }

  if (kind === "people") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute left-[34%] top-[8%] size-[30%] rounded-full border-2 border-current" />
        <span className="absolute bottom-[8%] left-[20%] h-[42%] w-[60%] rounded-t-full border-2 border-current" />
      </span>
    );
  }

  if (kind === "globe") {
    return (
      <span className={`relative block ${size} rounded-full border-2 border-current`}>
        <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-current" />
        <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-current" />
      </span>
    );
  }

  if (kind === "camera") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute inset-x-[8%] bottom-[12%] top-[24%] rounded-md border-2 border-current" />
        <span className="absolute left-[35%] top-[8%] h-[22%] w-[30%] rounded-t-md border-2 border-b-0 border-current" />
        <span className="absolute left-[38%] top-[42%] size-[24%] rounded-full border-2 border-current" />
      </span>
    );
  }

  if (kind === "filter") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute left-[14%] top-[16%] h-0.5 w-[72%] bg-current" />
        <span className="absolute left-[30%] top-[44%] h-0.5 w-[40%] bg-current" />
        <span className="absolute left-[43%] top-[72%] h-0.5 w-[14%] bg-current" />
      </span>
    );
  }

  return null;
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
