import './globals.css';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: 'Hitchyard',
  description: 'Hitchyard — premium ride-sharing and logistics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          {children}
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
