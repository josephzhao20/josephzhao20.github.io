import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth/roles';
import { UploadForm } from '@/components/upload/UploadForm';
import { LinkButton } from '@/components/ui/Button';

export const metadata = { title: "Share your story — Winning With The Hunt" };

export default async function UploadPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <p className="mb-3 text-4xl">🧭</p>
        <h1 className="font-display text-3xl font-bold text-ink">Share your story</h1>
        <p className="mt-3 font-semibold text-ink-soft">
          Create a free account to pin your hunts, catches, and outdoor memories to the map.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <LinkButton href="/signup?next=/upload" size="lg">Create a free account</LinkButton>
          <LinkButton href="/login?next=/upload" variant="ghost" size="lg">Log in</LinkButton>
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          Already have an account?{' '}
          <Link href="/login?next=/upload" className="font-bold text-forest underline">Log in</Link>
        </p>
      </div>
    );
  }

  if (profile.suspended) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Account suspended</h1>
        <p className="mt-3 font-semibold text-ink-soft">
          Your account is currently suspended and can&rsquo;t share new stories.
        </p>
      </div>
    );
  }

  if (!profile.upload_approved) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Uploads revoked</h1>
        <p className="mt-3 font-semibold text-ink-soft">
          Your upload access has been revoked. Contact an admin if you think this is a mistake.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">Share your story</h1>
      <p className="mt-2 font-semibold text-ink-soft">
        Every story is a trip worth remembering — add your photos, tell what happened, and pin it once.
      </p>
      <div className="mt-8">
        <UploadForm userId={profile.id} />
      </div>
    </div>
  );
}
