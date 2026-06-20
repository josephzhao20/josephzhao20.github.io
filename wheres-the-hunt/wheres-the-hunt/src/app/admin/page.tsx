import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/roles';
import { getAllUsersForAdmin } from '@/lib/data/users';
import { getAllAdventuresForAdmin } from '@/lib/data/adventures';
import { getMerchItems } from '@/lib/data/merch';
import { AdminUserTable } from '@/components/admin/AdminUserTable';
import { AdminAdventureTable } from '@/components/admin/AdminAdventureTable';
import { AdminMerchManager } from '@/components/admin/AdminMerchManager';

export const metadata = { title: "Admin — Winning With The Hunt" };

export default async function AdminPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login?next=/admin');
  if (!profile.is_admin) redirect('/');

  const [users, adventures, merch] = await Promise.all([
    getAllUsersForAdmin(),
    getAllAdventuresForAdmin(),
    getMerchItems(),
  ]);
  const pendingCount = users.filter((u) => u.upload_requested && !u.upload_approved).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-3xl font-bold text-ink">Admin dashboard</h1>
      <p className="mt-1 font-semibold text-ink-soft">
        {pendingCount > 0
          ? `${pendingCount} upload request${pendingCount === 1 ? '' : 's'} waiting for review.`
          : 'No pending upload requests.'}
      </p>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-xl font-bold text-ink">Users</h2>
        <AdminUserTable users={users} />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-xl font-bold text-ink">Adventures</h2>
        <AdminAdventureTable adventures={adventures} />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-xl font-bold text-ink">Merch — More 2 The Hunt</h2>
        <AdminMerchManager items={merch} />
      </section>
    </div>
  );
}
