"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ImageIcon,
    MapPin,
    MapPinCheck,
    Sparkles,
    Sprout,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CROP_CATEGORIES from "@/lib/cropCategories";
import Image from "next/image";

const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Plant name must be at least 2 characters." }),
    description: z.string(),
    category: z.string().optional(),
    image: z.custom<File>(
        (value) => value instanceof File,
        "Plant image is required.",
    ),
    lat: z.number({ message: "Latitude is required." }).min(-90).max(90),
    lng: z.number({ message: "Longitude is required." }).min(-180).max(180),
});

interface PlantFormProps {
    userId?: string;
    onCancel?: () => void;
    showCancelButton?: boolean;
}

export default function PlantForm({ userId, onCancel, showCancelButton = false }: PlantFormProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [locationHint, setLocationHint] = useState(
        "We'll use this to geotag your plant discovery",
    );

    const clearPreviewImage = () => {
        setPreviewImage((currentPreview) => {
            if (currentPreview) {
                URL.revokeObjectURL(currentPreview);
            }
            return null;
        });
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            image: undefined,
            lat: undefined,
            lng: undefined,
        },
    });

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleImageChange = (file: File) => {
        const MAX_SIZE_MB = 10;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error("Image should not exceed 10MB.");
            form.setValue("image", undefined as unknown as File, {
                shouldValidate: true,
            });
            clearPreviewImage();
            return;
        }
        form.setValue("image", file, { shouldValidate: true });
        setPreviewImage((currentPreview) => {
            if (currentPreview) {
                URL.revokeObjectURL(currentPreview);
            }
            return URL.createObjectURL(file);
        });
    };

    const generatePlantInfo = async () => {
        const plantName = form.getValues("name");
        if (!plantName || plantName.length < 2) {
            toast.error("Please enter a plant name first");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch("/api/generate-plant-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ plantName }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate plant information");
            }

            const data = await response.json();

            const currentCategory = form.getValues("category")?.trim();
            const currentDescription = form.getValues("description")?.trim();
            let filledCount = 0;
            let preservedCount = 0;

            if (!currentCategory && data.category) {
                form.setValue("category", data.category, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                filledCount += 1;
            } else if (currentCategory) {
                preservedCount += 1;
            }

            if (!currentDescription && data.description) {
                form.setValue("description", data.description, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                filledCount += 1;
            } else if (currentDescription) {
                preservedCount += 1;
            }

            const sourceMessage =
                data.source === "ai" ? "AI-generated" : "Template-based";

            if (filledCount > 0) {
                toast.success(
                    `Plant information generated successfully! (${sourceMessage})`,
                    {
                        description:
                            preservedCount > 0
                                ? "Existing edits were kept."
                                : undefined,
                    },
                );
            } else {
                toast.message("Your existing category and description were kept.");
            }
        } catch (error) {
            console.error("Error generating plant info:", error);
            toast.error(
                "Failed to generate plant information. Please try again.",
            );
        } finally {
            setIsGenerating(false);
        }
    };


     const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLocating(true);
            setLocationHint("Trying to get your current location...");
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    form.setValue("lat", lat, { shouldValidate: true });
                    form.setValue("lng", lng, { shouldValidate: true });

                    try {
                        const response = await fetch(
                            `/api/reverse-geocode?lat=${lat}&lng=${lng}`,
                        );
                        if (response.ok) {
                            const data = await response.json();
                            setAddress(data.addressLabel || null);
                        }
                    } catch (err) {
                        console.error("Reverse geocoding error:", err);
                    }

                    toast.success("Location captured!");
                    setLocationHint("Your plant will be geotagged with this location.");
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setAddress(null);
                    form.resetField("lat");
                    form.resetField("lng");
                    setLocationHint(
                        "Location unavailable. Check permissions and try again.",
                    );
                    toast.error("Could not get your location. Please try again.");
                    setIsLocating(false);
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
            setLocationHint("Geolocation is not supported on this device.");
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!userId) {
            toast.error("You must be logged in to track plants");
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description || "");
            formData.append("category", values.category || "");
            formData.append("lat", values.lat.toString());
            formData.append("lng", values.lng.toString());

            if (values.image) {
                formData.append("image", values.image);
            }

            const response = await fetch("/api/plants", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                let details = "";
                try {
                    const err = await response.json();
                    details = [err.error, err.details]
                        .filter(Boolean)
                        .join(" - ");
                } catch {}
                throw new Error(details || "Failed to create plant");
            }

            toast.success("Plant tracked successfully!", {
                description: `${values.name} has been added to your collection`,
            });

            // Reset form
            form.reset({
                name: "",
                description: "",
                category: "",
                lat: undefined,
                lng: undefined,
                image: undefined,
            });
            clearPreviewImage();
            setAddress(null);
            setLocationHint("We'll use this to geotag your plant discovery");

            // Invalidate and refetch queries - this will trigger updates across all components
            await queryClient.invalidateQueries({
                queryKey: ["userPlants"],
            });
            await queryClient.invalidateQueries({ queryKey: ["plants"] });
        } catch (error) {
            console.error("Error creating plant:", error);
            toast.error("Failed to track plant", {
                description: "Please try again later",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="flora-glass-soft mx-auto w-full overflow-hidden rounded-2xl border border-border/70 bg-background/90 shadow-xl shadow-foreground/5">
            <CardHeader className="relative overflow-hidden border-b border-border/60 px-6">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-full opacity-100">
                    <Image
                        src="/globe.png"
                        alt=""
                        fill
                        className="object-contain object-right"
                    />
                </div>
                <div className="relative max-w-[calc(100%-5rem)] sm:max-w-[calc(100%-9rem)]">
                    <CardTitle className="text-xl font-black tracking-tight sm:text-[1.75rem]">
                    Track a New Plant
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-bold">
                                        Plant Name *
                                    </FormLabel>
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <FormControl>
                                            <Input
                                                placeholder="Enter plant name"
                                                {...field}
                                                required
                                                aria-busy={isGenerating}
                                                className="h-11 flex-1 rounded-xl border-border bg-background/80"
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={generatePlantInfo}
                                            disabled={isGenerating || !field.value || field.value.length < 2}
                                            aria-busy={isGenerating}
                                            className="h-11 shrink-0 rounded-xl border-primary/20 bg-secondary/60 px-4 text-primary hover:bg-secondary"
                                        >
                                            {isGenerating ? (
                                                <span className="animate-spin">↻</span>
                                            ) : (
                                                <Sparkles className="h-4 w-4" />
                                            )}
                                            {isGenerating ? "Generating..." : "Generate"}
                                        </Button>
                                    </div>
                                    <FormMessage />
                                    <FormDescription className="text-xs">
                                        Enter plant name and click Generate to auto-fill category and description
                                    </FormDescription>
                                    <p aria-live="polite" className="text-xs text-muted-foreground">
                                        {isGenerating
                                            ? "Generating category and description..."
                                            : ""}
                                    </p>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-bold">
                                        Category
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-background/80">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(CROP_CATEGORIES).map((category) => (
                                                <SelectItem key={category.label} value={category.label}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.3fr]">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-bold">
                                            Plant Image *
                                        </FormLabel>
                                        <FormControl>
                                            <label className="block cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/40 focus-within:ring-offset-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file) {
                                                            handleImageChange(
                                                                file,
                                                            );
                                                        }
                                                    }}
                                                    className="sr-only"
                                                    required
                                                />
                                                <div className="flex min-h-[10rem] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/70 px-4 py-5 text-center transition-colors hover:border-primary/35 hover:bg-secondary/20">
                                                    {previewImage ? (
                                                        <div className="space-y-3">
                                                            <Image
                                                                src={previewImage}
                                                                alt="Plant preview"
                                                                width={112}
                                                                height={112}
                                                                className="mx-auto h-24 w-24 rounded-xl object-cover border border-border"
                                                            />
                                                            <p className="text-xs font-semibold text-primary">
                                                                Click to change image
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {field.value?.name}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="grid size-10 place-items-center rounded-full bg-secondary text-primary">
                                                                <ImageIcon className="h-5 w-5" />
                                                            </div>
                                                            <p className="mt-3 text-sm font-semibold">
                                                                Click to upload
                                                            </p>
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                JPG, PNG up to 10MB
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                        </FormControl>
                                        <FormMessage />
                                        {field.value && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    field.onChange(undefined);
                                                    clearPreviewImage();
                                                }}
                                                className="h-8 px-0 text-xs text-muted-foreground hover:text-foreground"
                                            >
                                                Remove image
                                            </Button>
                                        )}
                                        <FormDescription className="text-xs">
                                            Upload a clear photo so the discovery is easy to identify.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-bold">
                                            Description (optional)
                                        </FormLabel>
                                        <FormControl>
                                            <div className="rounded-xl border border-border bg-background/80 p-3">
                                                <Textarea
                                                    placeholder="Describe your plant (species, care tips, etc.)"
                                                    maxLength={300}
                                                    className="min-h-[136px] resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                                    {...field}
                                                />
                                                <div className="mt-2 text-right text-xs text-muted-foreground">
                                                    {field.value?.length || 0}/300
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <FormLabel className="text-sm font-bold">
                                    Location *
                                </FormLabel>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={getCurrentLocation}
                                aria-busy={isLocating}
                                className="group relative h-11 w-full overflow-hidden rounded-xl border border-primary/15 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--secondary)_72%,white),color-mix(in_oklch,var(--accent)_12%,white))] px-4 text-sm font-semibold text-secondary-foreground transition-all hover:bg-accent"
                                disabled={isLocating}
                            >
                                {isLocating ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin text-primary">↻</span>
                                        Locating...
                                    </span>
                                ) : address ? (
                                    <span className="flex items-center gap-2 font-black text-primary">
                                        <MapPinCheck className="w-4 h-4" />
                                        {address}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 transition-colors group-hover:text-primary">
                                        <MapPin className="w-4 h-4" />
                                        Get My Location
                                    </span>
                                )}
                            </Button>
                            <FormDescription className="text-xs">
                                {locationHint}
                            </FormDescription>
                            <p aria-live="polite" className="text-xs text-muted-foreground">
                                {isLocating ? "Fetching your location..." : ""}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-12 flex-1 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">↻</span>
                                        Tracking Plant...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Sprout className="w-4 h-4" />
                                        Track This Plant
                                    </span>
                                )}
                            </Button>
                            {showCancelButton && onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isSubmitting}
                                    className="h-12 flex-1 rounded-xl border-border bg-background/80 sm:flex-initial sm:min-w-[140px]"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
