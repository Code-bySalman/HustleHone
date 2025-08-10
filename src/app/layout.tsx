import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {ThemeProvider} from "next-themes";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s - Resume Builder",
    absolute: "Awesome Resume Builder"
  },
  description: "Create your resume with ease using our Resume Builder.",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        {children}
        <Toaster/>
</ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
