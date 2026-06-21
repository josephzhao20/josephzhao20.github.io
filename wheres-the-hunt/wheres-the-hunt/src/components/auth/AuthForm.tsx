'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface AuthFormProps {
  mode: 'login' | 'signup';
  next?: string;
}

export function AuthForm({ mode, next = '/' }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = next;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` },
        });
        if (error) throw error;
        setSignedUp(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (signedUp) {
    return (
      <div className="rounded-card bg-forest/10 p-5 text-center">
        <p className="font-display font-bold text-ink">Check your inbox 📬</p>
        <p className="mt-2 text-sm font-semibold text-ink-soft">
          We sent a confirmation link to <strong>{email}</strong>. Click it to finish setting up
          your account.
        </p>
      </div>
    );
  }

  const inputClass = "w-full rounded-card border border-stone/40 bg-white px-3 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-forest/30";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-bold text-ink">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-bold text-ink">Password</label>
        <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </div>

      {mode === 'signup' && (
        <div>
          <label htmlFor="confirm-password" className="mb-1 block text-sm font-bold text-ink">Confirm password</label>
          <input id="confirm-password" type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm font-bold text-red-700">{error}</p>
      )}

      <Button type="submit" disabled={loading} className="mt-1">
        {loading ? 'Just a sec…' : mode === 'login' ? 'Log in' : 'Create account'}
      </Button>
    </form>
  );
}
