import Link from "next/link";

const footerLinks = [
  {
    label: "X",
    href: "https://x.com/suryansu87",
  },
  {
    label: "Portfolio",
    href: "https://www.suryansu.in/",
  },
  {
    label: "GitHub",
    href: "https://github.com/Hyperion147",
  },
];

export function FloraFooter() {
  return (
    <footer className="flora-full-bleed relative w-screen overflow-hidden px-4 pt-8 pb-28 md:pb-0 text-foreground sm:px-8 lg:px-20">
      <div className="relative z-10 border-t border-border pt-5">
        <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left md:text-base">
          <p>© 2026 Flora. All rights reserved.</p>

          <nav
            aria-label="Footer links"
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:justify-end"
          >
            {footerLinks.map((link, index) => (
              <span key={link.label} className="flex items-center gap-2">
                {index > 0 ? <span className="text-muted-foreground/60">·</span> : null}
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-primary focus-visible:text-primary"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <Link
          href="/"
          aria-label="Flora home"
          className="mx-auto mt-8 hidden md:flex max-w-full select-none flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-4xl font-black leading-none tracking-normal text-transparent sm:gap-x-4 sm:text-6xl md:text-7xl lg:text-8xl"
          style={{
            backgroundImage:
              "linear-gradient(180deg, color-mix(in oklch, var(--primary) 22%, transparent) 0%, color-mix(in oklch, var(--primary) 8%, transparent) 58%, color-mix(in oklch, var(--flora-leaf-muted) 46%, transparent) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          <span>Plant</span>
          <span>|</span>
          <span>Track</span>
          <span>|</span>
          <span>Grow</span>
        </Link>
      </div>
    </footer>
  );
}
