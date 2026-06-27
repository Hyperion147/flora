import { CheckCircle2, Github, Instagram, Mail, Send, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FloraFooter() {
  return (
    <footer className="flora-full-bleed w-screen border-t border-border bg-background px-4 pb-24 pt-12 sm:px-6 md:pb-12 lg:px-[clamp(1rem,5vw,5.5rem)]">
      <div className="grid w-full gap-10 pb-12 md:grid-cols-[1.55fr_1.35fr] md:items-start md:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 font-serif text-3xl font-black text-primary">
            <Image
              src="/logo-flora.png"
              alt="Flora logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            Flora
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">
            Your digital companion for discovering, tracking, and celebrating plants.
          </p>
          <div className="mt-6 flex gap-3">
            {[Twitter, Instagram, Github, Mail].map((Icon, index) => (
              <Link
                key={index}
                href="#"
                className="flora-glass-soft flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-secondary"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="md:justify-self-end">
          <h3 className="text-sm font-black">Stay in the loop</h3>
          <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">
            Subscribe to get the latest updates, new features, and plant stories.
          </p>
          <form className="flora-glass-soft mt-6 flex max-w-sm rounded-xl p-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              aria-label="Subscribe"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Flora. All rights reserved.</p>
        <p className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Made with care for nature lovers
        </p>
      </div>
    </footer>
  );
}
