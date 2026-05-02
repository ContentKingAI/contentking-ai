import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <AuthForm mode="signup" />
    </section>
  );
}
