import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNewUserNotification } from '@/lib/email';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data?.user) {
      const user = data.user;
      const createdAt = new Date(user.created_at ?? '').getTime();
      const confirmedAt = new Date(user.email_confirmed_at ?? '').getTime();
      const isNewSignup = Math.abs(createdAt - confirmedAt) < 60_000;

      if (isNewSignup) {
        sendNewUserNotification({
          email: user.email ?? '',
          username: user.user_metadata?.username ?? user.email?.split('@')[0] ?? 'unknown',
          signedUpAt: user.created_at ?? new Date().toISOString(),
        }).catch(() => {}); // fire-and-forget
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
