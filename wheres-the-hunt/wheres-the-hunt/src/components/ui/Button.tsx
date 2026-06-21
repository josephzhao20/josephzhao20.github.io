import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:   'bg-forest text-cream border-transparent hover:bg-forest-dark',
  secondary: 'bg-rust text-cream border-transparent hover:bg-rust-dark',
  ghost:     'bg-transparent text-ink border-ink/30 hover:border-ink hover:bg-ink/5',
  outline:   'bg-transparent text-forest border-forest hover:bg-forest hover:text-cream',
  danger:    'bg-red-700 text-cream border-transparent hover:bg-red-800',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-card border font-semibold ' +
  'transition-all duration-150 hover:shadow-card active:scale-[0.98] ' +
  'disabled:opacity-50 disabled:pointer-events-none tracking-wide';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(base, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}
      {...props}
    />
  );
}

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({ href, variant = 'primary', size = 'md', className, children }: LinkButtonProps) {
  return (
    <Link href={href} className={cn(base, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}>
      {children}
    </Link>
  );
}
