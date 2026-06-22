import Link from 'next/link';
import { LinkButton } from '@/components/ui/Button';

export const metadata = { title: "The Lodge Shop — Winning With The Hunt" };

// TODO: Replace with real e-commerce when shop backend is confirmed in scope.
export default function ShopPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <div className="mb-6 text-5xl">🏕️</div>
      <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">The Lodge Shop</h1>
      <p className="mx-auto mt-4 max-w-md text-base text-ink/60">
        Hunting-themed gear, the book, and more — coming soon. In the meantime, browse our current catalog.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <LinkButton href="/merch">Browse current catalog</LinkButton>
        <LinkButton href="/" variant="ghost">Back to camp</LinkButton>
      </div>
    </div>
  );
}
