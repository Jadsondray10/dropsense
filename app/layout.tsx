import type { Metadata } from "next";
import { Web3Provider } from "@/lib/web3Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "DropSense",
  description: "AI-powered airdrop hunter dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}