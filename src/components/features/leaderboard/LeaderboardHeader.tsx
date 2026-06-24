import { Trophy } from "lucide-react";

export function LeaderboardHeader() {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
          <Trophy className="h-7 w-7" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            Community
          </p>
          <h1 className="font-serif text-3xl font-black tracking-tight sm:text-4xl">
            Leaderboard
          </h1>
        </div>
      </div>
      <p className="mt-3 text-muted-foreground">
        Top contributors tracking the most plants.
      </p>
    </header>
  );
}

