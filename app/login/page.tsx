"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useUserStore } from "@/store/userStore";
import { Sparkles, Crown } from "lucide-react";

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const login = useUserStore((s) => s.login);
  const continueAsGuest = useUserStore((s) => s.continueAsGuest);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const user = login(data.email, data.password);
    if (user) {
      toast("Welcome back!", "success");
      router.push("/");
    } else {
      toast("Login failed. Please try again.", "error");
    }
    setLoading(false);
  };

  const handleDemoUser = () => {
    continueAsGuest();
    toast("Welcome, Demo User! You received 10,000 Demo Coins.", "success");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 casino-hero-glow" />
      <div className="absolute top-[15%] left-[8%] h-[350px] w-[350px] rounded-full bg-gold/10 blur-[140px] animate-pulse" />
      <div className="absolute bottom-[15%] right-[8%] h-[300px] w-[300px] rounded-full bg-purple/10 blur-[140px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[60%] left-[50%] h-[200px] w-[200px] rounded-full bg-cyan/5 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gold-bright to-gold animate-pulse opacity-60 blur-lg" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-gold-bright to-gold flex items-center justify-center shadow-[0_0_40px_rgba(255,209,92,0.4)]">
              <Crown className="h-10 w-10 text-[#080A12]" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight bg-gradient-to-r from-gold-bright via-gold to-gold-dim bg-clip-text text-transparent">
            WELCOME BACK, PLAYER
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            Sign in to continue your adventure.
          </p>
        </div>

        <div className="rounded-2xl bg-canvas-card border border-border p-6 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              className="bg-surface border-border focus:ring-gold/40"
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••"
              error={errors.password?.message}
              className="bg-surface border-border focus:ring-gold/40"
              {...register("password")}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-b from-gold-bright to-gold text-[#080A12] font-bold text-sm tracking-wide hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(255,209,92,0.3)]"
            >
              {loading ? "SIGNING IN..." : "ENTER THE GAME"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-text-muted font-medium uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="cyan"
            onClick={handleDemoUser}
            className="w-full"
          >
            <Sparkles className="h-4 w-4" />
            CONTINUE AS DEMO
          </Button>

          <p className="mt-5 text-center text-sm text-text-muted">
            New player?{" "}
            <Link href="/register" className="text-gold hover:text-gold-bright transition-colors font-bold tracking-wide">
              CREATE ACCOUNT
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
