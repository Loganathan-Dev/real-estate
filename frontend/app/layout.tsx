import type { Metadata } from 'next';
import './globals.css';  // THIS LINE IS CRUCIAL - MUST BE PRESENT

export const metadata: Metadata = {
  title: 'Real Estate Platform',
  description: 'Find your dream property',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}