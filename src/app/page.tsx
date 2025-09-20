"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function Home() {
    const { user } = useAuth();

    return (
        <main className="flex flex-col gap-4 items-center justify-center h-screen w-full">
            <section className="pt-4 sm:pt-16 w-full">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary capitalize">
                        Just click plants
                    </h2>
                </div>

                <div className="relative w-full mt-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-4 text-muted-foreground">
                            and
                        </span>
                    </div>
                </div>
            </section>

            <section className="flex flex-col items-center w-full gap-4">
                <Link href={user ? "/dashboard" : "/login"}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg sm:w-auto capitalize">
                        You can upload it here
                    </Button>
                </Link>
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-4 text-muted-foreground">
                            or you can see other plants
                        </span>
                    </div>
                </div>
                <Link href="/map">
                    <Button
                        variant="outline"
                        className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg sm:w-auto"
                    >
                        Explore Map
                    </Button>
                </Link>
            </section>

            <section className="flex flex-col w-full items-center gap-4">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-4 text-muted-foreground">
                            or you can search for plants
                        </span>
                    </div>
                </div>
                <Link href="/search" className="">
                    <Button variant="secondary">
                        Plant Search
                    </Button>
                </Link>
            </section>

            <section className="flex flex-col w-full items-center gap-4">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-4 text-muted-foreground">
                            or you can see your rank
                        </span>
                    </div>
                </div>
                <Link href="/leaderboard">
                    <Button variant="default">
                        Leaderboard
                    </Button>
                </Link>
            </section>
        </main>
    );
}
