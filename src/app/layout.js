'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from '../app/contexts/AuthContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
              duration: 5000,
            }} 
          />
        </AuthProvider>
      </body>
    </html>
  );
}