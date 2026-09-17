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

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const registerUser = useUserStore((s) => s.register);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    const user = registerUser(data.username, data.email, data.password);
    toast("Welcome! You received 10,000 Demo Coins.", "success");
    router.push("/");
    setLoading(false);
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
            JOIN THE GAME
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            Create your account and start winning.
          </p>
        </div>

        <div className="rounded-2xl bg-canvas-card border border-border p-6 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Username"
              placeholder="Choose a username"
              error={errors.username?.message}
              className="bg-surface border-border focus:ring-gold/40"
              {...register("username")}
            />
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
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••"
              error={errors.confirmPassword?.message}
              className="bg-surface border-border focus:ring-gold/40"
              {...register("confirmPassword")}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-b from-gold-bright to-gold text-[#080A12] font-bold text-sm tracking-wide hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(255,209,92,0.3)]"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-text-muted">
            Already playing?{" "}
            <Link href="/login" className="text-gold hover:text-gold-bright transition-colors font-bold tracking-wide">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
