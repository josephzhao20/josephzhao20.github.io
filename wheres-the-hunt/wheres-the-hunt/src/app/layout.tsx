import type { Metadata } from 'next';
import { Roboto_Slab, Work_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getCurrentProfile } from '@/lib/auth/roles';

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '900'],
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-worksans',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: "Winning With The Hunt — Every adventure tells a story.",
  description:
    "A community where hunters, anglers, and outdoor families keep the stories worth remembering. Every adventure tells a story. This is where it gets told.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  return (
    <html lang="en">
      <body
        className={`${robotoSlab.variable} ${workSans.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar profile={profile} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
