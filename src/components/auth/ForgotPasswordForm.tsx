"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await authService.sendPasswordResetEmail(email);
      setSuccess("Password reset link sent. Please check your email.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-white/12 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-black text-ink">Reset your password</h1>
          <p className="text-sm text-ink/60">We will email you a secure reset link.</p>
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-bold text-ink">Email</span>
          <input
            className="field mt-2"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
        </label>

        {success ? (
          <div className="flex gap-2 rounded-lg border border-mint/30 bg-mint/10 p-3 text-sm font-semibold text-ink">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
            <span>{success}</span>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-coral/25 bg-coral/10 p-3 text-sm font-semibold text-ink">
            {error}
          </div>
        ) : null}

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <Link
        className="mt-5 inline-flex items-center gap-2 text-sm font-black text-ink underline decoration-mint decoration-2 underline-offset-4"
        href="/login"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>
    </div>
  );
}
