import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talk2Nebiah | Safe Space for Real Conversations",
  description: "Talk2Nebiah is a supportive community for mental health, stress, anxiety, and emotional burnout. Join us for judgment-free conversations and peer support.",
  keywords: ["mental health", "anxiety support", "depression help", "peer support", "Talk2Nebiah", "safe space", "emotional wellness"],
  openGraph: {
    title: "Talk2Nebiah | Safe Space for Real Conversations",
    description: "A safe space for real conversations about real struggles. Join our supportive community.",
    type: "website",
    locale: "en_US",
    siteName: "Talk2Nebiah",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talk2Nebiah",
    description: "A safe space for real conversations about real struggles.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased selection:bg-mint selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
