import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-forest text-cream border-ink hover:bg-forest-dark',
  secondary: 'bg-sunset text-cream border-ink hover:bg-sunset-dark',
  ghost: 'bg-transparent text-ink border-ink hover:bg-ink/5',
  danger: 'bg-red-600 text-cream border-ink hover:bg-red-700',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-trail border-2 font-bold ' +
  'shadow-trail transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ' +
  'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 ' +
  'disabled:pointer-events-none disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-trail';

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
