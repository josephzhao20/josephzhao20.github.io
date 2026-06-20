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
        'inline-flex items-center gap-2 rounded-trail border-2 border-ink px-4 py-2 text-sm font-bold shadow-trail transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none',
        liked ? 'bg-rust text-cream' : 'bg-cream text-ink'
      )}
    >
      <span aria-hidden="true">{liked ? '♥' : '♡'}</span>
      {count.toLocaleString()}
    </button>
  );
}
