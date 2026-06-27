export function DashboardHeader({ displayName }: { displayName: string }) {
  return (
    <header className="mb-5 pt-1 sm:mb-7 md:pt-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
        Personal Garden
      </p>
      <h1 className="mt-2 max-w-[12ch] font-serif text-3xl font-black tracking-tight sm:max-w-none sm:text-4xl">
        Welcome, {displayName}!
      </h1>
    </header>
  );
}
