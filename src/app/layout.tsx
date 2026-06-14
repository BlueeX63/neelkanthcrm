import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import SmoothScroll from "@/components/animations/SmoothScroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Neelkanth CRM | Premium Jewelry Management",
    template: "%s | Neelkanth CRM",
  },
  description: "A state-of-the-art Customer Relationship Management platform designed exclusively for Neelkanth Jewelers. Streamline operations, track customer orders, manage karigars, and organize inventory with precision.",
  keywords: ["Neelkanth", "Jewelry CRM", "Order Tracking", "Karigar Management", "Inventory System", "Business Dashboard"],
  authors: [{ name: "Neelkanth Tech Team" }],
  creator: "Neelkanth Jewelers",
  publisher: "Neelkanth Jewelers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Neelkanth CRM | Manage Your Jewelry Operations",
    description: "A premium dashboard to streamline your jewelry business, track orders, manage artisans, and organize customer data in one unified platform.",
    url: "https://neelkanthcrm.com",
    siteName: "Neelkanth CRM",
    images: [
      {
        url: "/opengraph-image.png", // Next.js automatically creates the proper absolute URL
        width: 1200,
        height: 630,
        alt: "Neelkanth CRM Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neelkanth CRM | Elevate Your Business",
    description: "Premium Customer Relationship Management and Order Tracking Dashboard.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-brand-500 selection:text-white">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
