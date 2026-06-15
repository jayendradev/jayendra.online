import type { Viewport } from "next";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";
import { InstallPwa } from "@/components/InstallPwa";
import { JsonLd } from "@/components/JsonLd";
import { RegisterPwa } from "@/components/RegisterPwa";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#0b0e13",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <GoogleAnalytics />
        <JsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <RegisterPwa />
        <InstallPwa />
      </body>
    </html>
  );
}
