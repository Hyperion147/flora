import { MapPin } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-4xl font-black tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{text}</p>
    </div>
  );
}

export function WorldMapPattern({ compact = false }: { compact?: boolean }) {
  const pins = compact
    ? [
        ["22%", "38%"],
        ["58%", "46%"],
        ["76%", "28%"],
      ]
    : [
        ["20%", "44%"],
        ["52%", "54%"],
        ["77%", "28%"],
      ];

  return (
    <div className={`relative ${compact ? "h-36" : "h-full w-full"}`}>
      <div className="absolute left-[5%] top-[28%] h-24 w-32 rounded-[55%_45%_48%_52%] bg-[var(--flora-leaf-muted)]" />
      <div className="absolute left-[36%] top-[18%] h-32 w-28 rounded-[45%_55%_60%_40%] bg-[var(--flora-leaf-muted)]" />
      <div className="absolute left-[62%] top-[34%] h-28 w-36 rounded-[60%_40%_45%_55%] bg-[var(--flora-leaf-muted)]" />
      <div className="absolute left-[30%] top-[63%] h-16 w-20 rounded-[50%] bg-[var(--flora-leaf-muted)]" />
      <div className="absolute left-[74%] top-[66%] h-14 w-24 rounded-[50%] bg-[var(--flora-leaf-muted)]" />
      <div className="absolute left-[17%] top-[43%] h-px w-[60%] rotate-[12deg] border-t border-dashed border-primary/55" />
      {pins.map(([left, top]) => (
        <div
          key={`${left}-${top}`}
          className="absolute rounded-full bg-primary p-2 text-primary-foreground shadow-lg shadow-primary/20"
          style={{ left, top }}
        >
          <MapPin className="h-4 w-4" />
        </div>
      ))}
    </div>
  );
}
