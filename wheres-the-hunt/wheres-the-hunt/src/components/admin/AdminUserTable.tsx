'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRow } from '@/lib/types/database.types';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';

export function AdminUserTable({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function callAction(path: string, userId: string) {
    setPendingId(userId);
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body.error ?? 'That action failed.');
      }
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-trail border-2 border-ink bg-white shadow-trail">
      <table className="w-full text-left text-sm">
        <thead className="border-b-2 border-ink bg-cream-dark">
          <tr>
            <th className="px-4 py-3 font-bold">User</th>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const busy = pendingId === u.id;
            return (
              <tr key={u.id} className="border-b border-ink/10">
                <td className="px-4 py-3">
                  <p className="font-bold text-ink">@{u.username}</p>
                  <p className="text-xs text-ink-soft">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {u.is_admin && <Tag tone="forest">Admin</Tag>}
                    {u.upload_approved && <Tag tone="earth">Uploader</Tag>}
                    {u.upload_requested && !u.upload_approved && <Tag tone="sunset">Requested</Tag>}
                    {u.suspended && <Tag tone="neutral">Suspended</Tag>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {!u.upload_approved ? (
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() => callAction('/api/admin/approve', u.id)}
                      >
                        Approve uploads
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy}
                        onClick={() => callAction('/api/admin/approve?revoke=1', u.id)}
                      >
                        Revoke uploads
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={u.suspended ? 'ghost' : 'danger'}
                      disabled={busy}
                      onClick={() =>
                        callAction(u.suspended ? '/api/admin/suspend?lift=1' : '/api/admin/suspend', u.id)
                      }
                    >
                      {u.suspended ? 'Lift suspension' : 'Suspend'}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
