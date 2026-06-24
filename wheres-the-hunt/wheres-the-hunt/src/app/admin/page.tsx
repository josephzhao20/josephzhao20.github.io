import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/roles';
import { getAllUsersForAdmin } from '@/lib/data/users';
import { getAllAdventuresForAdmin } from '@/lib/data/adventures';
import { AdminUserTable } from '@/components/admin/AdminUserTable';
import { AdminAdventureTable } from '@/components/admin/AdminAdventureTable';

export const metadata = { title: "Admin — Winning With The Hunt" };

export default async function AdminPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login?next=/admin');
  if (!profile.is_admin) redirect('/');

  const [users, adventures] = await Promise.all([
    getAllUsersForAdmin(),
    getAllAdventuresForAdmin(),
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
        <h2 className="mb-2 font-display text-xl font-bold text-ink">The Lodge Shop</h2>
        <p className="mb-4 font-semibold text-ink-soft">
          Products are managed directly in Shopify. Use the links below to add products,
          update prices, manage inventory, and control which items appear as featured
          (add a <code className="rounded bg-ink/10 px-1 py-0.5 text-sm">featured</code> tag
          to any product in Shopify to surface it in the Featured section).
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://admin.shopify.com/store/more-2-the-hunt/products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-card border border-stone/40 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-card transition-all hover:shadow-card-hover"
          >
            Manage products ↗
          </a>
          <a
            href="https://admin.shopify.com/store/more-2-the-hunt/orders"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-card border border-stone/40 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-card transition-all hover:shadow-card-hover"
          >
            View orders ↗
          </a>
          <a
            href="https://admin.shopify.com/store/more-2-the-hunt/inventory"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-card border border-stone/40 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-card transition-all hover:shadow-card-hover"
          >
            Manage inventory ↗
          </a>
        </div>
      </section>
    </div>
  );
}
