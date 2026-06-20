'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/compressImage';
import { Button } from '@/components/ui/Button';
import type { MerchItem, MerchCategory } from '@/lib/types/database.types';

const CATEGORIES: { value: MerchCategory; label: string }[] = [
  { value: 'book', label: 'Book' },
  { value: 'shirt', label: 'Shirt' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'hat', label: 'Hat' },
  { value: 'tumbler', label: 'Tumbler' },
];

const CATEGORY_EMOJI: Record<MerchCategory, string> = {
  book: '📖', shirt: '👕', hoodie: '🧥', hat: '🧢', tumbler: '🥤',
};

function blankForm() {
  return { name: '', description: '', category: 'shirt' as MerchCategory, price: '', buy_url: '', in_stock: true, is_featured: false, sort_order: '0' };
}

export function AdminMerchManager({ items: initial }: { items: MerchItem[] }) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(blankForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    setEditId(null);
    setForm(blankForm());
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setError(null);
    setShowForm(true);
  }

  function openEdit(item: MerchItem) {
    setEditId(item.id);
    setForm({
      name: item.name,
      description: item.description ?? '',
      category: item.category,
      price: item.price != null ? String(item.price) : '',
      buy_url: item.buy_url ?? '',
      in_stock: item.in_stock,
      is_featured: item.is_featured,
      sort_order: String(item.sort_order),
    });
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(item.image_url);
    setError(null);
    setShowForm(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      let image_url = existingImageUrl ?? null;

      if (imageFile) {
        const compressed = await compressImage(imageFile);
        const path = `${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('merch')
          .upload(path, compressed, { cacheControl: '3600', upsert: false });
        if (uploadError) throw new Error(uploadError.message);
        const { data: pub } = supabase.storage.from('merch').getPublicUrl(path);
        image_url = pub.publicUrl;
      }

      const payload = {
        name: form.name,
        description: form.description || null,
        category: form.category,
        price: form.price ? parseFloat(form.price) : null,
        image_url,
        buy_url: form.buy_url || null,
        in_stock: form.in_stock,
        is_featured: form.is_featured,
        sort_order: parseInt(form.sort_order) || 0,
      };

      if (editId) {
        const res = await fetch(`/api/merch/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      } else {
        const res = await fetch('/api/merch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      }

      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item permanently?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/merch/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleStock(item: MerchItem) {
    await fetch(`/api/merch/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ in_stock: !item.in_stock }),
    });
    router.refresh();
  }

  const previewSrc = imagePreview ?? existingImageUrl;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold text-ink-soft">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        <Button size="sm" onClick={openNew}>+ Add item</Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-trail border-2 border-ink bg-white p-5">
          <h3 className="mb-4 font-display text-lg font-bold text-ink">{editId ? 'Edit item' : 'New item'}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-bold text-ink">Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full rounded-trail border-2 border-ink px-3 py-2 font-semibold focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-ink">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as MerchCategory }))}
                className="w-full rounded-trail border-2 border-ink bg-white px-3 py-2 font-semibold focus:outline-none">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-ink">Price ($)</label>
              <input type="number" min="0" step="0.01" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="29.99"
                className="w-full rounded-trail border-2 border-ink px-3 py-2 font-semibold focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-bold text-ink">Description</label>
              <textarea rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full rounded-trail border-2 border-ink px-3 py-2 font-semibold focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-bold text-ink">Buy link (external URL)</label>
              <input value={form.buy_url} onChange={e => setForm(f => ({ ...f, buy_url: e.target.value }))}
                placeholder="https://..."
                className="w-full rounded-trail border-2 border-ink px-3 py-2 font-semibold focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-ink">Sort order</label>
              <input type="number" value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                className="w-full rounded-trail border-2 border-ink px-3 py-2 font-semibold focus:outline-none" />
            </div>
            <div className="flex flex-col gap-3 pt-5">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="in_stock" checked={form.in_stock}
                  onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))} className="h-4 w-4" />
                <label htmlFor="in_stock" className="text-sm font-bold text-ink">In stock</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_featured" checked={form.is_featured}
                  onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="h-4 w-4" />
                <label htmlFor="is_featured" className="text-sm font-bold text-ink">Featured</label>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-bold text-ink">Photo</label>
              {previewSrc && (
                <div className="relative mb-2 h-32 w-32 overflow-hidden rounded-trail border-2 border-ink">
                  <Image src={previewSrc} alt="" fill className="object-cover" />
                </div>
              )}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="rounded-trail border-2 border-ink px-3 py-1.5 text-sm font-bold hover:bg-cream">
                {previewSrc ? 'Change photo' : 'Upload photo'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>
          {error && <p className="mt-3 text-sm font-bold text-red-700">{error}</p>}
          <div className="mt-4 flex gap-3">
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} disabled={saving}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Items table */}
      <div className="overflow-x-auto rounded-trail border-2 border-ink bg-white shadow-trail">
        <table className="w-full text-left text-sm">
          <thead className="border-b-2 border-ink bg-cream-dark">
            <tr>
              <th className="px-4 py-3 font-bold">Item</th>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">Price</th>
              <th className="px-4 py-3 font-bold">Stock</th>
              <th className="px-4 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center font-semibold text-ink-soft">No items yet. Add one above.</td></tr>
            )}
            {items.map(item => (
              <tr key={item.id} className="border-b border-ink/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {item.image_url && (
                      <div className="relative h-8 w-8 overflow-hidden rounded border border-ink/20">
                        <Image src={item.image_url} alt="" fill className="object-cover" />
                      </div>
                    )}
                    <span className="font-bold text-ink">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{CATEGORY_EMOJI[item.category]} {item.category}</td>
                <td className="px-4 py-3 text-ink-soft">{item.price != null ? `$${item.price.toFixed(2)}` : '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStock(item)}
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${item.in_stock ? 'bg-forest/10 text-forest' : 'bg-red-100 text-red-700'}`}>
                    {item.in_stock ? 'In stock' : 'Out of stock'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>Edit</Button>
                    <Button size="sm" variant="danger" disabled={deletingId === item.id}
                      onClick={() => handleDelete(item.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
