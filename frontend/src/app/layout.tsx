import type { Metadata } from "next";
import { Outfit, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import CustomCursor from "@/components/CustomCursor";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Archi Parmar | AI Engineer & Python Developer Portfolio",
  description:
    "Personal portfolio website of Archi Parmar, a Computer Engineering student specializing in Artificial Intelligence, Machine Learning, Python development, and Full Stack applications.",
  keywords: [
    "Archi Parmar",
    "AI Engineer",
    "Python Developer",
    "Full Stack Developer",
    "Machine Learning",
    "RAG Systems",
    "Next.js",
    "FastAPI",
  ],
  authors: [{ name: "Archi Parmar" }],
  openGraph: {
    title: "Archi Parmar | AI Engineer & Python Developer Portfolio",
    description:
      "Personal portfolio website of Archi Parmar, featuring projects, research papers, and code metrics.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  themeColor: "#050816",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased min-h-screen">
        <Providers>
          {children}
          <CustomCursor />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
