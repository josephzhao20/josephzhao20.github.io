'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function RequestUploadButton({ alreadyRequested }: { alreadyRequested: boolean }) {
  const [requested, setRequested] = useState(alreadyRequested);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch('/api/users/request-upload', { method: 'POST' });
      if (res.ok) setRequested(true);
    } finally {
      setLoading(false);
    }
  }

  if (requested) {
    return (
      <p className="font-bold text-forest">
        Request sent — we&rsquo;ll email you once an admin approves it.
      </p>
    );
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? 'Sending…' : 'Request upload access'}
    </Button>
  );
}
