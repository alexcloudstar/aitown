import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Town — Your AI conversations, brought to life",
  description:
    "Upload your Claude history and watch it become a living pixel art town. Every conversation a building. Every message a person.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://aitown.so"),
  openGraph: {
    title: "AI Town — Your AI conversations, brought to life",
    description:
      "Upload your Claude history and watch it become a living pixel art town.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Town — Your AI conversations, brought to life",
    description:
      "Upload your Claude history and watch it become a living pixel art town.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
