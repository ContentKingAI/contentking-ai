import { AuthForm } from "@/components/auth/AuthForm";
import { DemoAccessGate } from "@/components/auth/DemoAccessGate";

export default function LoginPage() {
  return (
    <DemoAccessGate>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <AuthForm mode="login" />
      </section>
    </DemoAccessGate>
  );
}
