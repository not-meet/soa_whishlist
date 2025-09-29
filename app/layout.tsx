import type { Metadata } from "next";
import { Fjalla_One, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fjallaOne = Fjalla_One({
  variable: "--font-fjalla-one",
  weight: "400",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "SOA",
  description: "A cli that lets you setup your whole authentication in minutes!",
  icons: {
    icon: "/logo.svg",
  },
  authors: [
    {
      name: "Meet Jain",
      url: "https://github.com/not-meet",
    },
  ],
  creator: "Meet Jain",
  robots: "index, follow",
  alternates: {
    canonical: "https://soa.meet-jain.in",
  },
  category: "Technology",
  keywords: [
    "auth",
    "authentication",
    "auth cli",
    "developer tools",
    "cli",
    "cli tools",
    "cli authentication",
    "Better-Auth",
    "cli authentication tools",
    "authentication docs",
    "soa",
    "soa cli",
    "soa authentication",
    "soa authentication tools",
    "soa authentication docs",
    "TypeScript",
		"project scaffolding",
		"boilerplate",
  ],
  metadataBase: new URL("https://soa.meet-jain.in"),
  formatDetection: {
		email: false,
		telephone: false,
	},
  openGraph: {
    title: "SOA",
    locale: "en_US",
    type: "website",
    description:"A cli that lets you setup your whole authentication in minutes!",
    url: "https://soa.meet-jain.in",
    siteName: "SOA",
    images: [
      {
        url:"/og.png",
        width: 1200,
        height: 630,
        alt: "SOA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOA",
    description:"A cli that lets you setup your whole authentication in minutes!",
    creator: "@Heyy_Meet",
    images: [
      {
        url: "/og.png",
        alt: "SOA",
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} min-h-screen bg-[#0a0a0a] ${geistMono.variable} ${fjallaOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
