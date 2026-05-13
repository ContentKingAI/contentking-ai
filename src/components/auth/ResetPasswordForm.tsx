"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";

const invalidResetLinkMessage = "This reset link is invalid or expired. Please request a new one.";

export function ResetPasswordForm() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasResetSession, setHasResetSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const hasSession = await authService.hasPasswordResetSession();

      if (!isMounted) {
        return;
      }

      setHasResetSession(hasSession);
      setError(hasSession ? "" : invalidResetLinkMessage);
      setIsCheckingSession(false);
    }

    const timer = window.setTimeout(() => {
      void checkSession();
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!hasResetSession) {
      setError(invalidResetLinkMessage);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.updatePassword(newPassword);
      await authService.signOut().catch(() => undefined);
      setSuccess("Password updated successfully. Please log in.");
      window.setTimeout(() => {
        router.push("/login");
      }, 1600);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : invalidResetLinkMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-white/12 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
          <KeyRound className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-black text-ink">Create new password</h1>
          <p className="text-sm text-ink/60">Choose a secure password for your account.</p>
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-bold text-ink">New password</span>
          <input
            className="field mt-2"
            disabled={isCheckingSession || !hasResetSession || Boolean(success)}
            onChange={(event) => setNewPassword(event.target.value)}
            type="password"
            value={newPassword}
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-ink">Confirm password</span>
          <input
            className="field mt-2"
            disabled={isCheckingSession || !hasResetSession || Boolean(success)}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            value={confirmPassword}
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

        <Button
          className="w-full"
          disabled={isCheckingSession || !hasResetSession || isSubmitting || Boolean(success)}
          type="submit"
        >
          {isCheckingSession || isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isCheckingSession ? "Checking link..." : isSubmitting ? "Updating..." : "Update password"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/60">
        Need another link?{" "}
        <Link className="font-black text-ink underline decoration-mint decoration-2 underline-offset-4" href="/forgot-password">
          Request reset
        </Link>
      </p>
    </div>
  );
}
