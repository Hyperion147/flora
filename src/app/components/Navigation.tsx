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
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import toast from "react-hot-toast";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { MdDashboard, MdLeaderboard } from "react-icons/md";

// Define proper type for user metadata
interface UserMetadata {
  name?: string;
  avatar_url?: string;
  [key: string]: unknown;
}

export default function Navigation() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (pathname === "/login") return;

      gsap.registerPlugin(ScrollTrigger);

      // Reset any existing animations/styles
      gsap.set(navRef.current, {
        width: "100%",
        maxWidth: "100%",
        top: 0,
        backgroundColor: "transparent",
        borderRadius: 0,
        padding: "0px",
        border: "1px solid rgba(214, 192, 192, 0.3)",
        boxShadow: "none",
        backdropFilter: "blur(0px)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "50px top",
          scrub: 1,
        },
      });

      tl.to(navRef.current, {
        width: "90%",
        maxWidth: "800px",
        top: "16px",
        borderRadius: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: "2px 8px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        ease: "power2.out",
      });
    },
    { scope: navRef, dependencies: [pathname] }
  );

  if (pathname === "/login") return null;

  const userMetadata = user?.user_metadata as UserMetadata | undefined;
  const userName = userMetadata?.name || user?.email || "Guest";

  const handleSignOut = async () => {
    const supabase = createClient();

    toast(
      (t) => (
        <div className="space-y-3 p-1">
          <p className="text-sm font-medium">
            Are you sure you want to log out?
          </p>
          <div className="flex gap-2 justify-center">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      { duration: 60000 }
    );
  };

  return (
    <nav
      ref={navRef}
      className="fixed left-1/2 -translate-x-1/2 z-9999 transition-colors duration-300 dark:bg-slate-900/80 dark:text-white dark:border-white/10"
    >
      <div
        ref={containerRef}
        className="mx-auto flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-left flex gap-1 group"
          >
            <h1 className="text-xl font-bold text-green-600 cursor-pointer group-hover:scale-105 transition-transform">
              🌱 Flora
            </h1>
            <p className="text-xs text-green-900 font-semibold dark:text-green-400 opacity-70">
              v1.3
            </p>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
            >
              Dashboard
            </Button>
          </Link>
          <Link href="/map">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
            >
              Map
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
            >
              Leaderboard
            </Button>
          </Link>
          <Link href="/search">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
            >
              Search
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {!user && (
            <Link href="/login">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Sign In
              </Button>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userMetadata?.avatar_url} alt={userName} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    {user ? (
                      userMetadata?.name?.charAt(0) || user.email?.charAt(0)
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">
                    {userName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user ? user.email : "Not signed in"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/")}
                className="cursor-pointer"
              >
                <IoHome className="mr-2 h-4 w-4" />
                Home
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer"
              >
                <MdDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/map")}
                className="cursor-pointer"
              >
                <FaMapLocationDot className="mr-2 h-4 w-4" />
                Map
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/search")}
                className="cursor-pointer"
              >
                <FaSearch className="mr-2 h-4 w-4" />
                Search
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/leaderboard")}
                className="cursor-pointer"
              >
                <MdLeaderboard className="mr-2 h-4 w-4" />
                Leaderboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user ? (
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => router.push("/login")}
                  className="cursor-pointer"
                >
                  Sign In
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
