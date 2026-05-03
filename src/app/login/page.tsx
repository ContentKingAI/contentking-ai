import { AuthForm } from "@/components/auth/AuthForm";
import { PaidAuthGate } from "@/components/auth/PaidAuthGate";

export default function LoginPage() {
  return (
    <PaidAuthGate>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <AuthForm mode="login" />
      </section>
    </PaidAuthGate>
  );
}
