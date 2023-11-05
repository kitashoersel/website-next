import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kindergärten Hörsel' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='de' suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
