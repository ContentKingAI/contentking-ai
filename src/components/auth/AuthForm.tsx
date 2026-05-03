"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { signIn, signUp } = useAppState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("creator@contentking.ai");
  const [password, setPassword] = useState("contentking");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isSignup) {
        await signUp({ name, email, password });
      } else {
        await signIn({ email, password });
      }
      router.push("/dashboard");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
          <Crown className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-black text-ink">{isSignup ? "Create account" : "Welcome back"}</h1>
          <p className="text-sm text-ink/60">Paid customer access using local prototype auth.</p>
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {isSignup ? (
          <label className="block">
            <span className="text-sm font-bold text-ink">Name</span>
            <input
              className="field mt-2"
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Morgan"
              value={name}
            />
          </label>
        ) : null}

        <label className="block">
          <span className="text-sm font-bold text-ink">Email</span>
          <input
            className="field mt-2"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-ink">Password</span>
          <input
            className="field mt-2"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>

        {error ? (
          <div className="rounded-lg border border-coral/25 bg-coral/10 p-3 text-sm font-semibold text-ink">
            {error}
          </div>
        ) : null}

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSignup ? "Create account" : "Log in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/60">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link className="font-black text-ink underline decoration-mint decoration-2 underline-offset-4" href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
