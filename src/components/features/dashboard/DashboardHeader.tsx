export function DashboardHeader({ displayName }: { displayName: string }) {
  return (
    <header className="mb-6 pt-2 sm:mb-8 md:pt-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
        Personal Garden
      </p>
      <h1 className="mt-2 font-serif text-3xl font-black tracking-tight sm:text-4xl">
        Welcome, {displayName}!
      </h1>
      <p className="mt-2 text-muted-foreground">
        Track your plants and see your collection grow.
      </p>
    </header>
  );
}

