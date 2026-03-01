import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Mars',
  description: 'Mode-aware writing workspace with contextual insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
