import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sitompul-mokas.my.id"),
  title: "SITOMPUL MOTOR BEKAS PAHAE - Jual Beli Motor Bekas Berkualitas & Bergaransi",
  description: "Temukan motor bekas impian Anda dengan kondisi terbaik, dokumen lengkap, dan garansi mesin di Tapanuli Utara. Pembelian cash & kredit mudah di Sitompul Motor Bekas Pahae.",
  keywords: [
    "mokas pahae",
    "motor bekas pahae",
    "jual beli motor bekas pahae",
    "sitompul motor bekas",
    "motor bekas tapanuli utara",
    "mokas tarutung",
    "dealer motor bekas pahae",
    "usaha bersama sitompul",
    "motor bekas sumatera utara",
    "nmax bekas pahae",
    "beat bekas pahae",
    "motor bekas murah"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SITOMPUL MOTOR BEKAS PAHAE",
    description: "Jual beli motor bekas berkualitas, surat-surat 100% lengkap dan aman, serta garansi mesin. Showroom terpercaya sejak 2014 di Pahae, Tapanuli Utara.",
    url: "https://sitompul-mokas.my.id",
    siteName: "Sitompul Motor Bekas Pahae",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/24.png",
        width: 1200,
        height: 750,
        alt: "Showroom Sitompul Motor Bekas Pahae",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SITOMPUL MOTOR BEKAS PAHAE",
    description: "Jual beli motor bekas berkualitas & bergaransi di Tapanuli Utara.",
    images: ["/images/24.png"],
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
    <html lang="id">
      <body className={poppins.variable}>
        {children}
      </body>
    </html>
  );
}
