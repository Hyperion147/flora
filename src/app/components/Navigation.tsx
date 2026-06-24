"use client";

import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@/app/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Grid2X2,
  Home,
  Info,
  Leaf,
  LogOut,
  Map,
  PlusCircle,
  Search,
  Sun,
  Trophy,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserMetadata {
  name?: string;
  full_name?: string;
  avatar_url?: string;
  picture?: string;
  [key: string]: unknown;
}

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/map", label: "Map", icon: Map },
  { href: "/dashboard", label: "Dashboard", icon: Grid2X2 },
  { href: "/dashboard", label: "Add Plant", icon: PlusCircle, action: true },
  { href: "/search", label: "Search", icon: Search },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "#features", label: "About", icon: Info },
];

export default function Navigation() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [greenAccent, setGreenAccent] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("flora-accent-mode");
    const enabled = saved === "green";
    setGreenAccent(enabled);
    document.documentElement.classList.toggle("flora-green-accent", enabled);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("flora-green-accent", greenAccent);
    window.localStorage.setItem("flora-accent-mode", greenAccent ? "green" : "light");
  }, [greenAccent]);

  if (pathname === "/login") return null;

  const userMetadata = user?.user_metadata as UserMetadata | undefined;
  const userName =
    userMetadata?.name ||
    userMetadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Guest";
  const avatarUrl = userMetadata?.avatar_url || userMetadata?.picture;

  const isActive = (href: string, isAction?: boolean) => {
    if (isAction || href.startsWith("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    const supabase = createClient();

    toast(
      (t) => (
        <div className="space-y-3 p-1">
          <p className="text-sm font-medium">Are you sure you want to log out?</p>
          <div className="flex justify-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await supabase.auth.signOut();
                  toast.success("Logged out successfully");
                  router.push("/");
                } catch (error) {
                  console.error("Error signing out:", error);
                  toast.error("Failed to log out");
                }
              }}
            >
              Log out
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </Button>
          </div>
        </div>
      ),
      { duration: 60000 }
    );
  };

  return (
    <header className="flora-navbar fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 shadow-sm shadow-foreground/5 backdrop-blur-xl">
      <div className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-[clamp(1rem,4vw,4rem)] py-3 lg:grid-cols-[auto_1fr_auto]">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-card shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/logo-flora.png"
              alt="Flora logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-2xl font-black leading-none text-primary">
              Flora
            </span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:block">
              Free plant discovery map
            </span>
          </span>
        </Link>

        <nav className="no-scrollbar order-3 col-span-2 flex w-full items-center gap-1 overflow-x-auto border-t border-border pt-3 lg:order-none lg:col-span-1 lg:justify-center lg:border-t-0 lg:pt-0">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href, link.action);

            return (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className={cn(
                  "group relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground/72 hover:bg-secondary hover:text-secondary-foreground",
                  link.action &&
                    "border border-border bg-card text-primary hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            aria-label="Toggle green accent mode"
            aria-pressed={greenAccent}
            onClick={() => setGreenAccent((value) => !value)}
            className={cn(
              "relative flex h-11 w-[86px] items-center rounded-full border border-border bg-card px-1.5 text-xs font-black text-muted-foreground transition-colors",
              greenAccent && "bg-[var(--flora-deep)] text-white"
            )}
          >
            <span
              className={cn(
                "absolute h-8 w-8 rounded-full bg-secondary shadow-sm transition-transform",
                greenAccent ? "translate-x-[42px] bg-primary" : "translate-x-0"
              )}
            />
            <Sun className={cn("relative z-10 h-4 w-4 flex-1", greenAccent && "text-white/55")} />
            <Leaf className={cn("relative z-10 h-4 w-4 flex-1", greenAccent ? "text-white" : "text-muted-foreground/55")} />
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-11 rounded-full bg-primary px-3 font-bold text-primary-foreground hover:bg-primary/90">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={avatarUrl} alt={userName} />
                    <AvatarFallback className="bg-emerald-100 text-xs text-emerald-800">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate sm:inline">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{userName}</p>
                    <p className="truncate text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <Grid2X2 className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/map")}>
                  <Map className="mr-2 h-4 w-4" />
                  Map
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="h-11 rounded-full bg-primary px-5 font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/login">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="h-1 w-full bg-[linear-gradient(90deg,transparent_0%,var(--primary)_24%,var(--accent)_50%,var(--primary)_76%,transparent_100%)] opacity-55" />
    </header>
  );
}
