import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
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
  title: "Wepink Angola :: o seu mundo rosa em Angola",
  description:
    "Descubra fragrâncias exclusivas que capturam a sofisticação moderna. Perfumes premium com entrega em toda Luanda. Pagamentos via Multicaixa.",
  openGraph: {
    title: "Wepink Angola :: o seu mundo rosa em Angola",
    description:
      "Descubra fragrâncias exclusivas que capturam a sofisticação moderna. Perfumes premium com entrega em toda Luanda.",
    images: [{ url: "/images/wepinkangola.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wepink Angola :: o seu mundo rosa em Angola",
    description:
      "Descubra fragrâncias exclusivas que capturam a sofisticação moderna. Perfumes premium com entrega em toda Luanda.",
    images: ["/images/wepinkangola.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-AO" className={`${notoSerif.variable} ${manrope.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
