import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import { Cairo } from 'next/font/google';

// تكوين الخط العربي Cairo
const cairo = Cairo({ 
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700'],
});

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
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`min-h-screen font-sans antialiased`}>
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1 lg:mr-64 transition-all duration-300">
            <div className="container mx-auto px-4 py-8 pb-32 lg:py-12 lg:pb-16">
              {children}
            </div>

            {/* Footer */}
            <footer className="py-6 px-8 mt-auto border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    © {new Date().getFullYear()} نظام إدارة صيانة المجمعات السكنية
                  </p>
                  <div className="mt-4 md:mt-0 flex space-x-4">
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">الشروط والأحكام</a>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">سياسة الخصوصية</a>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}