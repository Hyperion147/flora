"use client";

import { useAuth } from "@/app/context/AuthContext";
import { redirect } from "next/navigation";
import { Suspense, useEffect } from "react";
import { LoginCard } from "./LoginCard";
import { LoginErrorHandler } from "./LoginErrorHandler";
import { LoginLoading } from "./LoginLoading";

export default function LoginPageContent() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      redirect("/dashboard");
    }
  }, [user, loading]);

  if (loading) {
    return <LoginLoading />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,var(--background),var(--secondary))] px-4 pb-8 pt-24 text-foreground md:px-0">
      <Suspense fallback={null}>
        <LoginErrorHandler />
      </Suspense>
      <LoginCard />
    </main>
  );
}

