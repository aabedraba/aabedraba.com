import { Header } from "../components/Header";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Abdallah Abedraba",
  description: "Escaping randomness",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col p-3 max-w-4xl mx-auto h-screen justify-between">
        <Header />
        <main className="py-10 mb-auto">{children}</main>
        <footer className="flex flex-col text-left text-gray-700">
          <span>Escape your randomness</span>
          <span>With {"<"}3</span>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
