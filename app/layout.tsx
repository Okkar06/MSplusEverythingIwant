import type { Metadata, Viewport } from "next";
import { Figtree, Fredoka } from "next/font/google";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

// Display face: rounded and friendly, used for the distance number and moods.
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
// Body face: everything else.
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata: Metadata = {
  title: "MSplusEverythingIwant",
  description: "Mood and location sharing app",
  // Full-screen when opened from the iOS home screen.
  appleWebApp: { capable: true, title: "Us", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f2f6" },
    { media: "(prefers-color-scheme: dark)", color: "#17121c" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
