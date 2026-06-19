'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AdventureWithStats } from '@/lib/types/database.types';
import { Button } from '@/components/ui/Button';

export function AdminAdventureTable({ adventures }: { adventures: AdventureWithStats[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function toggleFeature(adventureId: string, feature: boolean) {
    setPendingId(adventureId);
    try {
      await fetch('/api/admin/feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adventureId, feature }),
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function deleteAdventure(adventureId: string) {
    if (!confirm('Delete this adventure permanently? This cannot be undone.')) return;
    setPendingId(adventureId);
    try {
      await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adventureId }),
      });
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
            <th className="px-4 py-3 font-bold">Adventure</th>
            <th className="px-4 py-3 font-bold">Author</th>
            <th className="px-4 py-3 font-bold">Likes</th>
            <th className="px-4 py-3 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {adventures.map((a) => {
            const busy = pendingId === a.id;
            return (
              <tr key={a.id} className="border-b border-ink/10">
                <td className="px-4 py-3">
                  <Link href={`/adventures/${a.id}`} className="font-bold text-ink hover:text-forest">
                    {a.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">@{a.username}</td>
                <td className="px-4 py-3 text-ink-soft">{a.like_count}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={a.is_featured ? 'ghost' : 'secondary'}
                      disabled={busy}
                      onClick={() => toggleFeature(a.id, !a.is_featured)}
                    >
                      {a.is_featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button size="sm" variant="danger" disabled={busy} onClick={() => deleteAdventure(a.id)}>
                      Delete
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
