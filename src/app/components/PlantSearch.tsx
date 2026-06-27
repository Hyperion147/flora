// app/components/PlantSearch.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Search, User, Calendar, MapPin } from "lucide-react";
import { Plant } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Image from "next/image";

// Debounce hook with improved implementation
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function PlantSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [page, setPage] = useState(1);
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // Increased to 500ms for better UX
    const pageSize = 20;

    // Track if user is currently typing
    useEffect(() => {
        setIsTyping(searchTerm !== debouncedSearchTerm);
    }, [searchTerm, debouncedSearchTerm]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm]);

    const {
        data: latestPlants,
        isLoading: isLatestLoading,
        error: latestError,
    } = useQuery({
        queryKey: ["plants", "latest"],
        queryFn: async (): Promise<Plant[]> => {
            const response = await fetch("/api/plants");
            if (!response.ok) {
                throw new Error("Failed to load plants");
            }
            return await response.json();
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    const {
        data: plants,
        isLoading: isSearchLoading,
        error: searchError,
    } = useQuery({
        queryKey: ["search", debouncedSearchTerm],
        queryFn: async (): Promise<Plant[]> => {
            if (!debouncedSearchTerm.trim()) return [];

            const response = await fetch(
                `/api/search?q=${encodeURIComponent(
                    debouncedSearchTerm.trim()
                )}`
            );
            if (!response.ok) {
                throw new Error("Failed to search plants");
            }
            return await response.json();
        },
        enabled: debouncedSearchTerm.trim().length > 0,
        staleTime: 5 * 60 * 1000, // 5 minutes - search results don't change frequently
        retry: 2,
    });

    // Handle search errors
    useEffect(() => {
        if (searchError) {
            console.error("Search error:", searchError);
            toast.error("Failed to search plants. Please try again.");
        }
    }, [searchError]);

    useEffect(() => {
        if (latestError) {
            console.error("Latest plants error:", latestError);
            toast.error("Failed to load latest plants.");
        }
    }, [latestError]);

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
        },
        []
    );

    const searchResults = useMemo(() => plants ?? [], [plants]);
    const latestResults = useMemo(() => latestPlants ?? [], [latestPlants]);
    const hasSearched = debouncedSearchTerm.trim().length > 0;
    const activeResults = hasSearched ? searchResults : latestResults;
    const showLoading = isTyping || (hasSearched ? isSearchLoading : isLatestLoading);
    const hasResults = activeResults.length > 0;
    const totalPages = Math.max(1, Math.ceil(activeResults.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paginatedResults = activeResults.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
    );
    const startIndex = hasResults ? (currentPage - 1) * pageSize + 1 : 0;
    const endIndex = hasResults
        ? Math.min(currentPage * pageSize, activeResults.length)
        : 0;

    return (
        <div className="mx-auto w-full max-w-6xl">
            <div className="relative mb-5">
                <Input
                    placeholder="Search by name, user, or PID"
                    className="flora-glass-soft h-12 rounded-2xl border-primary/15 bg-card/55 pl-4 pr-10 text-sm sm:h-13 sm:pl-5 sm:text-base"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {showLoading && (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="flora-glass-soft">
                            <CardContent>
                                <div className="flex items-start gap-3">
                                    <Skeleton className="h-14 w-14 rounded-md flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!showLoading && hasResults && (
                <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            {hasSearched
                                ? `Showing ${startIndex}-${endIndex} of ${activeResults.length} results for "${debouncedSearchTerm}"`
                                : `Showing ${startIndex}-${endIndex} of ${activeResults.length} latest plants`}
                        </p>
                        <Link href="/map">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                View Map
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        {paginatedResults.map((plant) => (
                            <Card
                                key={plant.id}
                                className="flora-glass-soft z-20 overflow-hidden transition-shadow hover:shadow-md"
                            >
                                <CardContent className="px-3 sm:px-3.5">
                                    <div className="flex items-start gap-3">
                                    {plant.image_url ? (
                                        <Image
                                            src={plant.image_url}
                                            alt={plant.name}
                                            width={80}
                                            height={80}
                                            className="h-14 w-14 rounded-md object-cover flex-shrink-0 sm:h-16 sm:w-16"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                                e.currentTarget.nextElementSibling?.classList.remove(
                                                    "hidden"
                                                );
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-primary sm:h-16 sm:w-16 ${
                                            plant.image_url ? "hidden" : ""
                                        }`}
                                    >
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="truncate text-sm font-semibold sm:text-base">
                                                    {plant.name}
                                                </h3>
                                                {plant.description && (
                                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                                                        {plant.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground sm:ml-2 sm:flex-shrink-0">
                                                <span className="font-mono font-semibold text-accent-foreground">
                                                    PID: {plant.pid}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex flex-col gap-1.5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:text-xs">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                <span className="truncate">
                                                    {plant.user_name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {new Date(
                                                        plant.created_at
                                                    ).toLocaleDateString()} at {new Date(
                                                        plant.created_at
                                                    ).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>

                                        {plant.lat && plant.lng && (
                                            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground sm:text-xs">
                                                <MapPin className="h-3 w-3" />
                                                <span>
                                                    {plant.lat.toFixed(4)},{" "}
                                                    {plant.lng.toFixed(4)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/55 px-4 py-3">
                            <p className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setPage((value) => Math.max(1, value - 1))
                                    }
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setPage((value) =>
                                            Math.min(totalPages, value + 1),
                                        )
                                    }
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!showLoading && hasSearched && !hasResults && (
                <Card className="flora-glass-soft">
                    <CardContent className="px-8 text-center">
                        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">No plants found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try another plant name, PID, or contributor.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
