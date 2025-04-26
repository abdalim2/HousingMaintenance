import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'نظام إدارة صيانة المجمعات السكنية',
  description: 'نظام متكامل لإدارة وتتبع صيانة المجمعات السكنية للعمال',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}