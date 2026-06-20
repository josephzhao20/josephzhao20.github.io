import type { Metadata } from 'next';
import { Fraunces, Work_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getCurrentProfile } from '@/lib/auth/roles';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['500', '600', '700', '900'],
  style: ['normal', 'italic'],
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
  title: "Winning With The Hunt — Every pin tells a story.",
  description:
    "A community-driven map of adventures, memories, and places worth remembering. From family vacations and national parks to fishing trips and hidden gems, every pin represents a story waiting to be explored.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${workSans.variable} ${jetbrainsMono.variable} font-body antialiased`}
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
