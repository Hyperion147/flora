import type { Metadata } from "next";
import LoginPageContent from "@/components/features/login/LoginPageContent";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Flora to track plants and manage your discoveries.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginPageContent />;
}
