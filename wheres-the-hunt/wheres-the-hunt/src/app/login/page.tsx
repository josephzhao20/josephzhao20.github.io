import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = { title: "Log in — Winning With The Hunt" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-ink">Welcome back</h1>
      <p className="mt-2 text-sm font-semibold text-ink-soft">
        Log in to like adventures and share your own stories.
      </p>

      <div className="mt-8">
        <AuthForm mode="login" next={next ?? '/'} />
      </div>

      <div className="mt-4 text-right">
        <Link href="/forgot-password" className="text-sm font-semibold text-forest hover:underline">
          Forgot password?
        </Link>
      </div>

      <p className="mt-6 text-sm font-semibold text-ink-soft">
        New here?{' '}
        <Link href="/signup" className="font-bold text-forest underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
