import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/context/AppStateProvider";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export const metadata: Metadata = {
  title: "ContentKing AI",
  description: "AI social media content generator prototype for captions, reels hooks, hashtags, and calendars."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppStateProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AppStateProvider>
      </body>
    </html>
  );
}
