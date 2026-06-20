import { cn } from '@/lib/utils';

export function Tag({
  children,
  tone = 'forest',
  className,
}: {
  children: React.ReactNode;
  tone?: 'forest' | 'earth' | 'rust' | 'neutral';
  className?: string;
}) {
  const tones: Record<string, string> = {
    forest: 'text-forest border-forest bg-forest/10',
    earth: 'text-earth-dark border-earth bg-earth/10',
    rust: 'text-rust-dark border-rust bg-rust/10',
    neutral: 'text-ink-soft border-ink/30 bg-ink/5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
