"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useUserStore } from "@/store/userStore";

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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="font-sora text-2xl font-bold">Welcome Back</h1>
          <p className="mt-1 text-sm text-text-muted">
            Sign in to continue playing.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="secondary" onClick={handleDemoUser} className="w-full">
          Continue as Demo User
        </Button>

        <p className="mt-4 text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
