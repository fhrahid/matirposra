import type { Metadata } from "next";
import { Hind_Siliguri, Tiro_Bangla } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
});

const tiroBangla = Tiro_Bangla({
  variable: "--font-tiro-bangla",
  subsets: ["latin", "bengali"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "মাটির পশরা - ঐতিহ্যের ছোঁয়ায় মাটির সৃষ্টি",
  description: "হাতে তৈরি মাটির পণ্য, সরাসরি কারিগরের কাছ থেকে আপনার দরজায়।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body
        className={`${hindSiliguri.variable} ${tiroBangla.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
