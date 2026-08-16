import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SITOMPUL MOTOR BEKAS PAHAE - Jual Beli Motor Bekas Berkualitas & Bergaransi",
  description: "Temukan motor bekas impian Anda dengan kondisi terbaik, dokumen lengkap, dan garansi resmi di Tapanuli Utara. Pembelian cash & kredit mudah di Sitompul Motor Bekas Pahae.",
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
