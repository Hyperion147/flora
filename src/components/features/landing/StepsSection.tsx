"use client";

import type { ReactNode } from "react";

type StepKind = "account" | "plant" | "discover" | "ranks";

const steps: Array<{
  number: string;
  title: string;
  text: string;
  kind: StepKind;
}> = [
  {
    number: "01",
    title: "Create Account",
    text: "Sign in once and keep all your plant discoveries safe and organized in your profile.",
    kind: "account",
  },
  {
    number: "02",
    title: "Add Your Plant",
    text: "Log plant details with a photo, exact location, and useful information.",
    kind: "plant",
  },
  {
    number: "03",
    title: "Explore & Discover",
    text: "Browse community entries on the map and through powerful search tools.",
    kind: "discover",
  },
  {
    number: "04",
    title: "Climb the Ranks",
    text: "Track more plants, earn recognition, and rise on the contribution leaderboard.",
    kind: "ranks",
  },
];

export function StepsSection() {
  return (
    <section className="flora-full-bleed relative w-screen overflow-hidden bg-[linear-gradient(180deg,var(--background)_0%,var(--flora-section-soft)_100%)] px-[clamp(1rem,4vw,4.5rem)] py-20">
      <DecorativeLeaves />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <div className="mx-auto inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.36em] text-primary">
          <CssGlyph kind="leaf" small />
          How It Works
        </div>
        <h2 className="mt-7 font-serif text-[clamp(2.35rem,4.9vw,5.25rem)] font-black leading-[1.02] tracking-tight">
          Simple Steps to{" "}
          <span className="text-primary">Make a Difference</span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          Start in minutes and help catalog plants one real discovery at a time.
        </p>
      </div>

      <div className="relative z-10 mt-20 grid gap-8 lg:grid-cols-4">
        {steps.map((step, index) => (
          <StepCard key={step.title} step={step} index={index} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,color-mix(in_oklch,var(--secondary)_68%,transparent))]" />
    </section>
  );
}

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  return (
    <article className="flora-glass relative flex min-h-[610px] flex-col items-center rounded-[2rem] px-6 pb-6 pt-10 text-center shadow-xl shadow-foreground/5">
      <div className="absolute -top-7 left-1/2 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-primary text-base font-black text-primary-foreground shadow-xl shadow-primary/25">
        {step.number}
      </div>

      {index < steps.length - 1 && <ArrowConnector />}

      <div className="relative mb-5 grid size-28 place-items-center rounded-full bg-secondary text-primary">
        <CssGlyph kind={step.kind} />
        {step.kind === "account" && (
          <span className="absolute bottom-3 right-2 grid size-10 place-items-center rounded-full bg-accent text-2xl font-black text-primary">
            +
          </span>
        )}
        {step.kind === "plant" && (
          <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-xl bg-card text-primary shadow-lg">
            <CssGlyph kind="camera" small />
          </span>
        )}
      </div>

      <h3 className="font-serif text-2xl font-black">{step.title}</h3>
      <p className="mt-3 max-w-72 text-sm leading-7 text-muted-foreground">
        {step.text}
      </p>

      <StepPreview kind={step.kind} />
    </article>
  );
}

function ArrowConnector() {
  return (
    <div className="pointer-events-none absolute left-[92%] top-[19%] z-20 hidden w-[36%] lg:block">
      <svg
        viewBox="0 0 190 56"
        fill="none"
        aria-hidden="true"
        className="h-16 w-full overflow-visible"
      >
        <path
          d="M6 44 C 48 6, 112 6, 162 44"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="7 8"
          className="text-primary/55"
        />
        <circle
          cx="95"
          cy="28"
          r="24"
          className="fill-card stroke-border"
          strokeWidth="1"
        />
        <path
          d="M87 28h16m-6-6 6 6-6 6"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
      </svg>
    </div>
  );
}

function StepPreview({ kind }: { kind: StepKind }) {
  if (kind === "account") {
    return (
      <PreviewShell className="relative overflow-hidden">
        <SoftHills />
        <div className="relative z-10 mx-auto w-[82%] rounded-2xl border border-border bg-card/92 p-5 shadow-xl">
          <div className="mx-auto mb-3 grid size-9 place-items-center rounded-full bg-secondary text-primary">
            <CssGlyph kind="leaf" small />
          </div>
          <p className="text-sm font-black">Create your account</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Join our growing community of plant lovers.
          </p>
          <InputLine label="Email address" />
          <InputLine label="Password" muted />
          <button className="mt-3 h-9 w-full rounded-lg bg-primary text-[10px] font-black text-primary-foreground">
            Sign Up
          </button>
        </div>
      </PreviewShell>
    );
  }

  if (kind === "plant") {
    return (
      <PreviewShell className="space-y-3">
        <p className="text-left text-sm font-black">Add New Plant</p>
        <PlantImageMock />
        <InfoRow icon="leaf" label="Plant Name" value="Monstera Deliciosa" />
        <InfoRow icon="tag" label="Category" value="Houseplant" />
        <InfoRow icon="pin" label="Location" value="San Francisco, USA" />
      </PreviewShell>
    );
  }

  if (kind === "discover") {
    return (
      <PreviewShell className="relative overflow-hidden p-0">
        <div className="relative h-[295px] rounded-[1.35rem] bg-[linear-gradient(135deg,color-mix(in_oklch,var(--secondary)_72%,white),color-mix(in_oklch,var(--accent)_28%,white))]">
          <MapGrid />
          <MapMarker left="34%" top="14%" />
          <MapMarker left="15%" top="34%" />
          <MapMarker left="73%" top="34%" />
          <MapMarker left="25%" top="70%" />
          <MapMarker left="45%" top="82%" />
          <div className="absolute bottom-12 left-1/2 flex w-[70%] -translate-x-1/2 items-center gap-3 rounded-2xl bg-card/95 p-3 text-left shadow-xl">
            <PlantAvatar />
            <div>
              <p className="text-xs font-black">Fiddle Leaf Fig</p>
              <p className="text-[10px] text-muted-foreground">Jane Doe</p>
              <p className="text-[10px] text-muted-foreground">
                San Francisco, CA
              </p>
            </div>
          </div>
        </div>
      </PreviewShell>
    );
  }

  return (
    <PreviewShell className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-black">Leaderboard</p>
        <span className="rounded-lg bg-muted px-3 py-1 text-[10px] font-semibold">
          All Time
        </span>
      </div>
      {[
        ["PlantMaster", "2,847", "primary"],
        ["GreenThumb", "2,446", "muted"],
        ["NatureLover", "2,045", "accent"],
        ["LeafExplorer", "1,644", "plain"],
      ].map(([name, score, tone], index) => (
        <div key={name} className="flex items-center gap-3 text-xs">
          <Medal tone={tone} rank={index + 1} />
          <span className="grid size-8 place-items-center rounded-full bg-secondary font-black text-primary">
            {name.charAt(0)}
          </span>
          <span className="flex-1 text-left font-semibold">{name}</span>
          <span className="font-black text-primary">{score}</span>
        </div>
      ))}
    </PreviewShell>
  );
}

function PreviewShell({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mt-auto w-full rounded-[1.5rem] border border-border bg-card/74 p-4 shadow-xl shadow-foreground/5 ${className}`}
    >
      {children}
    </div>
  );
}

function InputLine({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <div
      className={`mt-3 h-9 rounded-lg border border-border px-3 text-left text-[10px] leading-9 ${
        muted ? "bg-muted text-muted-foreground" : "bg-background text-muted-foreground"
      }`}
    >
      {label}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-background/80 p-3 text-left shadow-sm">
      <span className="grid size-9 place-items-center rounded-full bg-secondary text-primary">
        <CssGlyph kind={icon} small />
      </span>
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-xs font-black">{value}</p>
      </div>
    </div>
  );
}

function PlantImageMock() {
  return (
    <div className="relative h-20 overflow-hidden rounded-xl bg-[linear-gradient(135deg,var(--secondary),var(--card))]">
      <div className="absolute inset-x-0 bottom-0 h-8 bg-[linear-gradient(180deg,transparent,var(--flora-leaf-muted))]" />
      <span className="absolute left-[28%] top-7 h-14 w-6 origin-bottom -rotate-45 rounded-[100%_0_100%_0] bg-primary/75" />
      <span className="absolute left-[44%] top-4 h-16 w-7 origin-bottom rotate-12 rounded-[100%_0_100%_0] bg-primary" />
      <span className="absolute left-[60%] top-7 h-14 w-6 origin-bottom rotate-45 rounded-[100%_0_100%_0] bg-primary/75" />
    </div>
  );
}

function SoftHills() {
  return (
    <>
      <div className="absolute bottom-0 left-0 h-24 w-full rounded-t-[50%] bg-secondary" />
      <div className="absolute -bottom-6 left-[-8%] h-24 w-[70%] rounded-t-[60%] bg-accent/45" />
      <div className="absolute bottom-2 right-5 h-20 w-8 rotate-45 rounded-[100%_0_100%_0] bg-primary/70" />
    </>
  );
}

function MapGrid() {
  return (
    <div className="absolute inset-0 opacity-55">
      {Array.from({ length: 7 }).map((_, index) => (
        <span
          key={`h-${index}`}
          className="absolute left-0 h-px w-full bg-primary/18"
          style={{ top: `${(index + 1) * 12}%` }}
        />
      ))}
      {Array.from({ length: 7 }).map((_, index) => (
        <span
          key={`v-${index}`}
          className="absolute top-0 h-full w-px bg-primary/18"
          style={{ left: `${(index + 1) * 12}%` }}
        />
      ))}
      <span className="absolute left-[64%] top-0 h-full w-12 rotate-12 bg-primary/8" />
      <span className="absolute left-0 top-[54%] h-10 w-full -rotate-6 bg-primary/8" />
    </div>
  );
}

function MapMarker({ left, top }: { left: string; top: string }) {
  return (
    <span
      className="absolute grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20"
      style={{ left, top }}
    >
      <span className="size-2 rounded-full bg-primary-foreground" />
    </span>
  );
}

function PlantAvatar() {
  return (
    <div className="relative size-16 overflow-hidden rounded-xl bg-secondary">
      <span className="absolute left-5 top-6 h-10 w-5 origin-bottom -rotate-45 rounded-[100%_0_100%_0] bg-primary/70" />
      <span className="absolute left-8 top-3 h-12 w-5 origin-bottom rotate-12 rounded-[100%_0_100%_0] bg-primary" />
    </div>
  );
}

function Medal({ tone, rank }: { tone: string; rank: number }) {
  const className =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : tone === "accent"
        ? "bg-accent text-accent-foreground"
        : tone === "muted"
          ? "bg-muted text-muted-foreground"
          : "bg-transparent text-foreground";

  return (
    <span className={`grid size-7 place-items-center rounded-full text-[10px] font-black ${className}`}>
      {rank}
    </span>
  );
}

function CssGlyph({
  kind,
  small = false,
}: {
  kind: string;
  small?: boolean;
}) {
  const size = small ? "size-4" : "size-12";

  if (kind === "account") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute left-[30%] top-[8%] size-[35%] rounded-full border-[3px] border-current" />
        <span className="absolute bottom-[10%] left-[18%] h-[42%] w-[64%] rounded-t-full border-[3px] border-current border-b-0" />
      </span>
    );
  }

  if (kind === "plant") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute bottom-[10%] left-[28%] h-[34%] w-[44%] rounded-sm border-[3px] border-current" />
        <span className="absolute left-[30%] top-[12%] h-[42%] w-[22%] origin-bottom -rotate-45 rounded-[100%_0_100%_0] border-[3px] border-current" />
        <span className="absolute right-[28%] top-[12%] h-[42%] w-[22%] origin-bottom rotate-45 rounded-[100%_0_100%_0] border-[3px] border-current" />
      </span>
    );
  }

  if (kind === "discover") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute left-[3%] top-[15%] h-[68%] w-[30%] rounded-sm border-[3px] border-current" />
        <span className="absolute left-[35%] top-[6%] h-[72%] w-[30%] rounded-sm border-[3px] border-current" />
        <span className="absolute right-[3%] top-[15%] h-[68%] w-[30%] rounded-sm border-[3px] border-current" />
        <span className="absolute bottom-[3%] right-[4%] grid size-[40%] place-items-center rounded-full bg-primary text-primary-foreground">
          <span className="size-2 rounded-full bg-current" />
        </span>
      </span>
    );
  }

  if (kind === "ranks") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute left-[24%] top-[10%] h-[50%] w-[52%] rounded-b-lg border-[3px] border-current" />
        <span className="absolute left-[8%] top-[19%] h-[26%] w-[22%] rounded-l-full border-[3px] border-r-0 border-current" />
        <span className="absolute right-[8%] top-[19%] h-[26%] w-[22%] rounded-r-full border-[3px] border-l-0 border-current" />
        <span className="absolute bottom-[22%] left-1/2 h-[20%] w-1 -translate-x-1/2 bg-current" />
        <span className="absolute bottom-[12%] left-[26%] h-1 w-[48%] bg-current" />
      </span>
    );
  }

  if (kind === "leaf") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute inset-[10%] rounded-[100%_0_100%_0] border-2 border-current" />
        <span className="absolute bottom-[6%] left-1/2 h-[78%] w-0.5 -rotate-45 bg-current" />
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

  if (kind === "tag") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute inset-[12%] rotate-45 rounded-md border-2 border-current" />
        <span className="absolute left-[29%] top-[29%] size-[18%] rounded-full bg-current" />
      </span>
    );
  }

  if (kind === "pin") {
    return (
      <span className={`relative block ${size}`}>
        <span className="absolute left-[24%] top-[4%] h-[70%] w-[52%] rounded-full rounded-bl-none border-2 border-current rotate-45" />
        <span className="absolute left-[42%] top-[24%] size-[16%] rounded-full bg-current" />
      </span>
    );
  }

  return null;
}

function DecorativeLeaves() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -left-16 top-40 h-40 w-72 rotate-12 opacity-40 blur-sm">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-24 w-12 rounded-[100%_0_100%_0] bg-primary/60"
            style={{
              left: `${index * 32}px`,
              top: `${Math.abs(2 - index) * 10}px`,
              transform: `rotate(${index * 18 - 42}deg)`,
            }}
          />
        ))}
      </div>
      <div className="absolute -right-2 top-0 h-44 w-44">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="absolute h-32 w-14 rounded-[100%_0_100%_0] bg-primary/75"
            style={{
              right: `${index * 38}px`,
              top: `${index * 18}px`,
              transform: `rotate(${25 - index * 28}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
