'use client';

import { useState } from 'react';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-card border border-stone/40 bg-white px-3 py-1.5 text-sm font-semibold text-ink-soft shadow-card transition-all hover:border-ink hover:text-ink hover:shadow-card-hover"
    >
      {copied ? (
        <>✓ Link copied!</>
      ) : (
        <>↗ Share</>
      )}
    </button>
  );
}
