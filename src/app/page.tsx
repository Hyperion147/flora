"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";
import { MapPin, Search, Trophy, Leaf, ChevronRight, Upload, Sprout, Globe } from "lucide-react";
import Image from "next/image";

export default function Home() {
    const { user } = useAuth();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-transparent overflow-x-hidden px-26">
            {/* Hero Section */}
            <section className="relative w-full pt-5 flex flex-col items-center justify-center">
                <div className="container relative z-10 mx-auto">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="flex flex-col justify-center space-y-6"
                        >
                            <motion.div variants={itemVariants} className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium w-fit">
                                    <Sprout className="h-4 w-4" />
                                    <span>Welcome to Flora</span>
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 pb-2">
                                    Your Digital <br /> Plant Directory
                                </h1>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                                    Discover, identify, and map the world&apos;s flora.
                                </p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col gap-3 min-[400px]:flex-row">
                                <Link href={user ? "/dashboard" : "/login"}>
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold px-8 w-full min-[400px]:w-auto h-14 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95">
                                        <Upload className="h-5 w-5" />
                                        {user ? "Go to Dashboard" : "Start your Journey"}
                                    </Button>
                                </Link>
                                <Link href="/map">
                                    <Button variant="outline" size="lg" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2 font-semibold px-8 w-full min-[400px]:w-auto h-14 rounded-xl transition-all hover:scale-105 active:scale-95">
                                        <MapPin className="h-5 w-5" />
                                        Explore Map
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative mx-auto w-full max-w-[500px] aspect-square lg:max-w-none"
                        >
                            <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-3xl" />
                            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-900 group">
                                <Image
                                    src="/hero-plants.png"
                                    alt="Modern indoor garden"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        </motion.div>
                    </div>
                </div>
                
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-emerald-100/40 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] bg-green-100/30 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
            </section>

            {/* Quick Access Grid */}
            <section className="w-full py-20 bg-emerald-50/50 dark:bg-zinc-900/50">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <QuickLinkCard 
                            href="/map" 
                            title="Interactive Map" 
                            description="Explore plant life across the globe with our real-time mapping system." 
                            icon={<Globe className="h-6 w-6" />}
                        />
                        <QuickLinkCard 
                            href="/search" 
                            title="Advanced Search" 
                            description="Find exactly what you're looking for with our powerful discovery engine." 
                            icon={<Search className="h-6 w-6" />}
                        />
                        <QuickLinkCard 
                            href="/leaderboard" 
                            title="Leaderboard" 
                            description="Climb the ranks and show off your botanical discoveries to the world." 
                            icon={<Trophy className="h-6 w-6" />}
                        />
                        <QuickLinkCard 
                            href={user ? "/dashboard" : "/login"} 
                            title="Management" 
                            description="Organize your personal plant collection and track their healthy growth." 
                            icon={<Leaf className="h-6 w-6" />}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-20 pb-12">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="relative rounded-[3rem] overflow-hidden bg-emerald-950 p-8 md:p-16 lg:p-24 text-center">
                        <div className="absolute top-0 left-0 w-full h-full opacity-30">
                            <Image
                                src="/hero-plants.png"
                                alt="CTA Background"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 bg-emerald-950/80" />
                        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">Ready to start your botanical adventure?</h2>
                            <p className="text-emerald-100/80 text-lg md:text-xl">Join thousands of plant lovers today and start documenting the beauty around you.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link href="/login">
                                    <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 transition-colors w-full sm:w-auto h-14 px-10 rounded-xl font-bold text-lg">
                                        Join Flora Now
                                    </Button>
                                </Link>
                                <Link href="/map">
                                    <Button size="lg" variant="outline" className="border-white/20 text-white bg-white/10 transition-colors w-full sm:w-auto h-14 px-10 rounded-xl font-bold text-lg">
                                        Explore the Map
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer Placeholder */}
            <footer className="w-full py-10 border-t">
                <div className="container px-4 md:px-6 mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                            <Leaf className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-xl text-emerald-900 dark:text-emerald-100">Flora</span>
                    </div>
                    <p className="text-sm text-muted-foreground">© 2025 Flora App. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-sm text-muted-foreground hover:text-emerald-600">Privacy Policy</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-emerald-600">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}

function QuickLinkCard({ href, title, description, icon }: { href: string, title: string, description: string, icon: React.ReactNode }) {
    return (
        <Link href={href}>
            <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative h-full flex flex-col p-8 rounded-3xl border bg-card hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
            >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    {icon}
                </div>
                <h3 className="mb-3 text-2xl font-bold group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">{description}</p>
                <div className="flex items-center text-sm font-bold text-emerald-600 group-hover:translate-x-2 transition-transform">
                    Explore <ChevronRight className="ml-1 h-4 w-4" />
                </div>
            </motion.div>
        </Link>
    );
}
