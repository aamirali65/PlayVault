"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Crown, Mail } from "lucide-react";

const forgotSchema = z.object({
  email: z.email("Please enter a valid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = (data: ForgotForm) => {
    toast("Reset link sent to your email.", "success");
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 casino-hero-glow" />
      <div className="absolute top-[15%] left-[8%] h-[350px] w-[350px] rounded-full bg-gold/10 blur-[140px] animate-pulse" />
      <div className="absolute bottom-[15%] right-[8%] h-[300px] w-[300px] rounded-full bg-purple/10 blur-[140px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gold-bright to-gold animate-pulse opacity-60 blur-lg" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-gold-bright to-gold flex items-center justify-center shadow-[0_0_40px_rgba(255,209,92,0.4)]">
              <Crown className="h-10 w-10 text-[#080A12]" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight bg-gradient-to-r from-gold-bright via-gold to-gold-dim bg-clip-text text-transparent">
            RESET PASSWORD
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            Enter your email to recover your account.
          </p>
        </div>

        <Card className="rounded-2xl bg-canvas-card border border-border p-6 shadow-2xl shadow-black/40">
          {sent ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright/20 to-gold/10 border border-gold/30">
                <Mail className="h-8 w-8 text-gold" />
              </div>
              <p className="text-sm text-text-secondary font-medium">
                If an account exists with that email, you&apos;ll receive a reset link shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                className="bg-surface border-border focus:ring-gold/40"
                {...register("email")}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-b from-gold-bright to-gold text-[#080A12] font-bold text-sm tracking-wide hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(255,209,92,0.3)]"
              >
                SEND RESET LINK
              </Button>
            </form>
          )}

          <p className="mt-5 text-center text-sm text-text-muted">
            <Link href="/login" className="text-gold hover:text-gold-bright transition-colors font-bold tracking-wide">
              BACK TO SIGN IN
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
