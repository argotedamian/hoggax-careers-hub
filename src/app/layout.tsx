import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Basic SEO
  title: {
    default: "Hoggax Careers | Únete a nuestro equipo",
    template: "%s | Hoggax Careers",
  },
  description: "Explora oportunidades laborales en Hoggax. Únete a un equipo dinámico y construyamos juntos el futuro de las garantías de alquiler.",
  keywords: ["trabajo", "empleo", "careers", "Hoggax", "garantías", "alquiler", "empleo tech", "startup"],
  authors: [{ name: "Hoggax" }],
  creator: "Hoggax",
  publisher: "Hoggax",

  // Canonical URL
  metadataBase: new URL("https://portalempleo.hoggax.com"),

  // Open Graph
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://portalempleo.hoggax.com",
    siteName: "Hoggax Careers",
    title: "Hoggax Careers | Únete a nuestro equipo",
    description: "Explora oportunidades laborales en Hoggax. Únete a un equipo dinámico y construyamos juntos el futuro de las garantías de alquiler.",
    // images: [
    //   {
    //     url: "https://portalempleo.hoggax.com/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Hoggax Careers - Únete a nuestro equipo",
    //   },
    // ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Hoggax Careers | Únete a nuestro equipo",
    description: "Explora oportunidades laborales en Hoggax. Únete a un equipo dinámico y construyamos juntos el futuro.",
    // images: ["https://portalempleo.hoggax.com/og-image.png"],
    creator: "@hoggax",
  },

  // robots.txt
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verificación deOwnership (Google, Bing)
  // googleSiteVerification: "verification-code",
  // bingVerification: "verification-code",

  // Favicon
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}