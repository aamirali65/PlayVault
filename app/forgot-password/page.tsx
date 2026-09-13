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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="font-sora text-2xl font-bold">Reset Password</h1>
          <p className="mt-1 text-sm text-text-muted">
            Enter your email to receive a reset link.
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              ✓
            </div>
            <p className="text-sm text-text-muted">
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
              {...register("email")}
            />
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-text-muted">
          <Link href="/login" className="text-accent hover:underline">
            Back to Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}
