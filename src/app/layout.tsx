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
        url: "/images/41.png",
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
    images: ["/images/41.png"],
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SITOMPUL MOTOR BEKAS PAHAE",
    "image": "https://sitompul-mokas.my.id/images/41.png",
    "@id": "https://sitompul-mokas.my.id",
    "url": "https://sitompul-mokas.my.id",
    "telephone": "+6281263374426",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Usaha Bersama Sitompul - Onan Hasang",
      "addressLocality": "Kec. Pahae Julu, Kab. Tapanuli Utara",
      "addressRegion": "Sumatera Utara",
      "postalCode": "22455",
      "addressCountry": "ID"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "17:00"
    },
    "sameAs": [
      "https://web.facebook.com/usaha.bersama.724671"
    ]
  };

  return (
    <html lang="id">
      <body className={poppins.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
