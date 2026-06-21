import Link from 'next/link';
import { LinkButton } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center">
      <p className="font-mono text-sm font-bold uppercase tracking-widest text-stone">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
        This trail&rsquo;s gone cold.
      </h1>
      <p className="mt-4 text-base font-semibold text-ink-soft">
        We couldn&rsquo;t find that story.
      </p>
      <div className="mt-8">
        <LinkButton href="/map">Browse all stories →</LinkButton>
      </div>
    </div>
  );
}
