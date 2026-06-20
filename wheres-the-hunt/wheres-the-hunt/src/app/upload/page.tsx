import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/roles';
import { UploadForm } from '@/components/upload/UploadForm';

export const metadata = { title: "Share an adventure — Winning With The Hunt" };

export default async function UploadPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect('/login?next=/upload');
  }

  if (profile.suspended) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Account suspended</h1>
        <p className="mt-3 font-semibold text-ink-soft">
          Your account is currently suspended and can&rsquo;t post new adventures.
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
