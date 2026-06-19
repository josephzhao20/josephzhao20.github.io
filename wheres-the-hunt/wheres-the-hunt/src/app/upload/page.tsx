import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/roles';
import { UploadForm } from '@/components/upload/UploadForm';
import { RequestUploadButton } from '@/components/upload/RequestUploadButton';

export const metadata = { title: "Share an adventure — Where's The Hunt?" };

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
        <h1 className="font-display text-2xl font-bold text-ink">Almost there</h1>
        <p className="mt-3 font-semibold text-ink-soft">
          Posting adventures requires upload permission. Request it below and an admin will
          review your account.
        </p>
        <div className="mt-6 flex justify-center">
          <RequestUploadButton alreadyRequested={profile.upload_requested} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">Share an adventure</h1>
      <p className="mt-2 font-semibold text-ink-soft">
        Every adventure is a trip, not just a photo — add everything from one outing and pin it
        once.
      </p>
      <div className="mt-8">
        <UploadForm userId={profile.id} />
      </div>
    </div>
  );
}
