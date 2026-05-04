import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050b17] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>ContentKing AI prototype. Mock SaaS flows today, real integrations tomorrow.</p>
        <div className="flex gap-4 font-semibold text-white/70">
          <Link href="/pricing">Pricing</Link>
          <Link href="/demo">Demo</Link>
          <Link href="/templates">Templates</Link>
          <Link href="/signup">Signup</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}
