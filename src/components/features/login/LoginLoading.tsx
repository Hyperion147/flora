export function LoginLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,var(--background),var(--secondary))] px-4 text-foreground">
      <div className="text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-muted border-b-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </main>
  );
}

