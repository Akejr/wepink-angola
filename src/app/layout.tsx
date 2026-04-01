import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-headline",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wepinkangola.com"),
  title: {
    default: "Wepink Angola | Perfumes, Body Splash e Fragrâncias Premium em Luanda",
    template: "%s | Wepink Angola",
  },
  description:
    "Loja oficial Wepink em Angola. Compre perfumes, body splash, body mist e fragrâncias femininas premium com entrega em Luanda. Pagamentos via Multicaixa e Multicaixa Express.",
  keywords: [
    "wepink angola",
    "wepink",
    "perfumes angola",
    "perfumes luanda",
    "body splash angola",
    "body mist angola",
    "fragrâncias femininas angola",
    "perfumes femininos luanda",
    "comprar perfumes angola",
    "perfumes premium angola",
    "wepink perfumes",
    "loja de perfumes angola",
    "perfumaria angola",
    "perfumes baratos angola",
    "body splash luanda",
    "wepink luanda",
    "perfumes entrega luanda",
    "multicaixa perfumes",
    "perfumes online angola",
  ],
  authors: [{ name: "Wepink Angola" }],
  creator: "Wepink Angola",
  publisher: "Wepink Angola",
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
  openGraph: {
    title: "Wepink Angola | Perfumes e Body Splash Premium em Luanda",
    description:
      "Loja oficial Wepink em Angola. Perfumes, body splash e fragrâncias femininas premium com entrega em toda Luanda.",
    url: "https://www.wepinkangola.com",
    siteName: "Wepink Angola",
    images: [{ url: "/images/wepinkangola.png", width: 1200, height: 630, alt: "Wepink Angola - Perfumes Premium" }],
    locale: "pt_AO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wepink Angola | Perfumes e Body Splash Premium em Luanda",
    description:
      "Perfumes, body splash e fragrâncias femininas premium com entrega em Luanda. Pagamentos via Multicaixa.",
    images: ["/images/wepinkangola.png"],
  },
  alternates: {
    canonical: "https://www.wepinkangola.com",
  },
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-AO" className={`${notoSerif.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FE4B8E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="google-site-verification" content="2kdIw-NajFadBeWtXKsmVC1exuQ7kfWKz7j8kdFjm1M" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
