import GoogleLoginButton from "@/app/components/auth/GoogleAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const featureItems = [
  "Track plants with photos and locations",
  "View plants on the interactive map",
  "Search and discover plants",
];

export function LoginCard() {
  return (
    <div className="w-full max-w-md">
      <Card className="flora-glass border-primary/10 shadow-xl">
        <CardHeader className="pb-6 text-center">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-secondary">
            <Image
              src="/logo-flora.png"
              alt="Flora logo"
              width={52}
              height={52}
              className="size-13 object-contain"
              priority
            />
          </div>
          <CardTitle className="font-serif text-3xl font-black tracking-tight text-foreground">
            Welcome to Flora
          </CardTitle>
          <p className="mt-2 text-muted-foreground">
            Sign in to start tracking your plants.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <GoogleLoginButton />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                Don&apos;t have an account? No problem.
              </p>
              <p className="text-xs text-muted-foreground">
                Sign in with Google to automatically create your account.
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="mb-3 text-sm font-black">What you&apos;ll get</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {featureItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-secondary text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              <span>Explore the map first</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

