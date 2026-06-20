'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  adventureId: string;
  initialLikeCount: number;
  initiallyLiked: boolean;
  isSignedIn: boolean;
}

export function LikeButton({
  adventureId,
  initialLikeCount,
  initiallyLiked,
  isSignedIn,
}: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initiallyLiked);
  const [count, setCount] = useState(initialLikeCount);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (!isSignedIn) {
      router.push(`/login?next=/adventures/${adventureId}`);
      return;
    }
    if (pending) return;

    setPending(true);
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));

    try {
      const res = await fetch(`/api/adventures/${adventureId}/like`, {
        method: nextLiked ? 'POST' : 'DELETE',
      });
      if (!res.ok) throw new Error('failed');
    } catch {
      // roll back on failure
      setLiked(!nextLiked);
      setCount((c) => c + (nextLiked ? -1 : 1));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={liked}
      className={cn(
        'inline-flex items-center gap-2 rounded-card border px-4 py-2 text-sm font-semibold shadow-card transition-all hover:shadow-card-hover active:scale-95',
        liked ? 'border-rust bg-rust text-cream' : 'border-stone/40 bg-white text-ink hover:border-rust hover:text-rust'
      )}
    >
      <span aria-hidden="true">{liked ? '♥' : '♡'}</span>
      {count.toLocaleString()}
    </button>
  );
}
