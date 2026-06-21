'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-ink">Reset your password</h1>
      <p className="mt-2 text-sm font-semibold text-ink-soft">
        Enter your email and we&rsquo;ll send you a reset link.
      </p>

      {sent ? (
        <div className="mt-8 rounded-card bg-forest/10 p-5 text-center">
          <p className="font-display font-bold text-ink">Check your email 📬</p>
          <p className="mt-2 text-sm font-semibold text-ink-soft">
            We sent a reset link to <strong>{email}</strong>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-bold text-ink">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-card border border-stone/40 bg-white px-3 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>
          {error && <p role="alert" className="text-sm font-bold text-red-700">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </div>
  );
}
