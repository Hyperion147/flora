"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function LoginErrorHandler() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "auth_callback_error") {
      toast.error("Authentication failed. Please try again.");
    }
  }, [error]);

  return null;
}

