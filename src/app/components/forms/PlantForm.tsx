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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Upload, Camera, AlertCircle, Sparkles, MapPinCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CROP_CATEGORIES from "@/lib/cropCategories";
import Image from "next/image";

// All fields required, but no area bounds
const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Plant name must be at least 2 characters." }),
    description: z.string(),
    category: z.string().optional(),
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
    onCancel?: () => void;
    showCancelButton?: boolean;
}

export default function PlantForm({ userId, userName, onCancel, showCancelButton = false }: PlantFormProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            lat: undefined,
            lng: undefined,
        },
    });
    const handleImageChange = (file: File) => {
        const MAX_SIZE_MB = 10;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error(
                "Image should not exceed 10MB."
            );
            form.setValue("image", undefined);
            setPreviewImage(null);
            return;
        }
        form.setValue("image", file, { shouldValidate: true });
        setPreviewImage(URL.createObjectURL(file));
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
            
            // Update form with generated data
            form.setValue("category", data.category);
            form.setValue("description", data.description);
            
            const sourceMessage = data.source === 'ai' ? 'AI-generated' : 'Template-based';
            toast.success(`Plant information generated successfully! (${sourceMessage})`);
        } catch (error) {
            console.error("Error generating plant info:", error);
            toast.error("Failed to generate plant information. Please try again or fill manually.");
        } finally {
            setIsGenerating(false);
        }
    };


     const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    form.setValue("lat", lat);
                    form.setValue("lng", lng);

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
                        );
                        const data = await response.json();

                        const addr = data.address;
                        const town = addr.village || addr.town || addr.suburb || addr.neighbourhood || "";
                        const city = addr.city || addr.district || addr.state_district || addr.county || "";

                        if (town && city) {
                            setAddress(`${town}, ${city}`);
                        } else if (city) {
                            setAddress(city);
                        } else if (town) {
                            setAddress(town);
                        } else {
                            setAddress(data.display_name.split(',')[0]);
                        }
                    } catch (err) {
                        console.error("Reverse geocoding error:", err);
                    }

                    toast.success("Location captured!");
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.error(
                        "Could not get your location. Please enter coordinates manually."
                    );
                    setIsLocating(false);
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
            formData.append("category", values.category || "");
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
                category: "",
                lat: undefined,
                lng: undefined,
                image: undefined,
            });
            setPreviewImage(null);

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
        <Card className="flora-glass-soft mx-auto w-full">
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
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input
                                                placeholder="Monstera Deliciosa"
                                                {...field}
                                                required
                                                className="flex-1"
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={generatePlantInfo}
                                            disabled={isGenerating || !field.value || field.value.length < 2}
                                            className="shrink-0"
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
                                    <p className="text-xs text-muted-foreground">
                                        Enter plant name and click Generate to auto-fill category and description
                                    </p>
                                </FormItem>
                            )}
                        />

                        {/* Category */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
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

                        {/* Image Upload */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plant Image *</FormLabel>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                        <div className="space-y-2">
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file)
                                                            handleImageChange(
                                                                file
                                                            );
                                                    }}
                                                    className="cursor-pointer"
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground">
                                                Upload a photo of your plant
                                                <span className="pl-1 text-xs text-destructive">
                                                    (max. 10MB)
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
                                                >
                                                    Remove Image
                                                </Button>
                                            )}
                                        </div>
                                        {previewImage && (
                                            <div className="flex justify-center">
                                                <Image
                                                    src={previewImage}
                                                    alt="Plant preview"
                                                    width={128}
                                                    height={128}
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
                                    <FormLabel>
                                        Description (optional)
                                    </FormLabel>
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
                                    Location *
                                </FormLabel>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={getCurrentLocation}
                                className="group relative h-11 w-full overflow-hidden border border-primary/15 bg-secondary px-4 text-[10px] font-black uppercase tracking-wider text-secondary-foreground transition-all hover:bg-accent"
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
                                        <Camera className="w-4 h-4" />
                                        Get My Location
                                    </span>
                                )}
                            </Button>
                        </div>

                        {/* Submit and Cancel Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
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
                            {showCancelButton && onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isSubmitting}
                                    className="flex-1 sm:flex-initial sm:min-w-[120px]"
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
