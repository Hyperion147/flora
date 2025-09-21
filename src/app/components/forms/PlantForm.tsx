"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Upload, Camera, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// All fields required, but no area bounds
const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Plant name must be at least 2 characters." }),
    description: z.string(),
    image: z
        .instanceof(File, { message: "Plant image is required." })
        .or(z.undefined()),
    lat: z.number({
        message: "Latitude is required.",
    }),
    lng: z.number({
        message: "Longitude is required.",
    }),
});

interface PlantFormProps {
    userId?: string;
    userName: string;
}

export default function PlantForm({ userId, userName }: PlantFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            lat: undefined,
            lng: undefined,
        },
    });
    const handleImageChange = (file: File) => {
        const MAX_SIZE_MB = 5;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error(
                "Image should not exceed 5MB. Please select a smaller file."
            );
            // Optionally, clear the file input:
            setPreviewImage(null);
            form.setValue("image", undefined);
            return;
        }
        form.setValue("image", file, { shouldValidate: true });
        setPreviewImage(URL.createObjectURL(file));
    };

    // Set location anywhere in the world
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    form.setValue("lat", lat);
                    form.setValue("lng", lng);
                    toast.success("Location captured!");
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.error(
                        "Could not get your location. Please enter coordinates manually."
                    );
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!userId) {
            toast.error("You must be logged in to track plants");
            return;
        }
        if (!values.image) {
            toast.error("Plant image is required");
            return;
        }
        if (typeof values.lat !== "number" || typeof values.lng !== "number") {
            toast.error("Latitude and longitude are required");
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description || "");
            formData.append("lat", values.lat.toString());
            formData.append("lng", values.lng.toString());
            formData.append("userId", userId);
            formData.append("userName", userName);

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
                lat: undefined,
                lng: undefined,
                image: undefined,
            });
            setPreviewImage(null);

            // Invalidate and refetch queries
            await queryClient.invalidateQueries({
                queryKey: ["userPlants"],
            });
            await queryClient.invalidateQueries({ queryKey: ["plants"] });

            // Refresh the page to update all components
            router.refresh();
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
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">
                    Track a New Plant (Global)
                </CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    <span>
                        You can track plants from anywhere in the world!
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Plant Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plant Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Monstera Deliciosa"
                                            {...field}
                                            required
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Upload */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plant Image *</FormLabel>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file) {
                                                            handleImageChange(
                                                                file
                                                            );
                                                            if (
                                                                file.size <=
                                                                5 * 1024 * 1024
                                                            ) {
                                                                field.onChange(
                                                                    file
                                                                );
                                                            } else {
                                                                field.onChange(
                                                                    undefined
                                                                );
                                                            }
                                                        }
                                                    }}
                                                    className="cursor-pointer"
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground">
                                                Upload a photo of your plant
                                                <span className="text-xs text-red-500 pl-1">
                                                (max. 5MB)
                                                </span>
                                            </p>
                                            {field.value && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        field.onChange(
                                                            undefined
                                                        );
                                                        setPreviewImage(null);
                                                    }}
                                                    className="w-full"
                                                >
                                                    Remove Image
                                                </Button>
                                            )}
                                        </div>
                                        {previewImage && (
                                            <div className="flex justify-center">
                                                <img
                                                    src={previewImage}
                                                    alt="Plant preview"
                                                    className="w-32 h-32 object-cover rounded-md border"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your plant (species, care tips, etc.)"
                                            className="resize-none min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Location Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <FormLabel>
                                    Location (Latitude, Longitude) *
                                </FormLabel>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="lat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">
                                                Latitude *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder=""
                                                    {...field}
                                                    required
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? parseFloat(
                                                                      e.target
                                                                          .value
                                                                  )
                                                                : undefined
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lng"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">
                                                Longitude *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder=""
                                                    {...field}
                                                    required
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? parseFloat(
                                                                      e.target
                                                                          .value
                                                                  )
                                                                : undefined
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={getCurrentLocation}
                                className="w-full sm:w-auto"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Get My Location
                            </Button>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">↻</span>
                                    Tracking Plant...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Track This Plant
                                </span>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
