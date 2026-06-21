import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = { title: "Sign up — Winning With The Hunt" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-ink">Join the hunt</h1>
      <p className="mt-2 text-sm font-semibold text-ink-soft">
        Create a free account to like adventures and build a profile. Once registered, you can
        freely post your own adventures.
      </p>

      <div className="mt-8">
        <AuthForm mode="signup" next={next ?? '/'} />
      </div>

      <p className="mt-6 text-sm font-semibold text-ink-soft">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-forest underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
