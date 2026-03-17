import { useState, useEffect } from 'react';
import { api } from '../api';
import type { InventoryItem, PackagingBatch } from '../api';
import { Package, Truck, AlertTriangle, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';

const batchStatusColors: Record<string, string> = {
  production: 'bg-yellow-500/10 text-yellow-400',
  ready: 'bg-blue-500/10 text-blue-400',
  shipped: 'bg-green-500/10 text-green-400',
  delivered: 'bg-emerald-500/10 text-emerald-400',
};

type Tab = 'inventory' | 'batches';

export function InventoryPage() {
  const [tab, setTab] = useState<Tab>('inventory');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [batches, setBatches] = useState<PackagingBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllocate, setShowAllocate] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invRes, batchRes] = await Promise.all([
        api.inventory.list(),
        api.inventory.batches(),
      ]);
      setInventory(invRes.data);
      setBatches(batchRes.data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const totalAllocated = inventory.reduce((s, i) => s + i.quantityAllocated, 0);
  const totalUsed = inventory.reduce((s, i) => s + i.quantityUsed, 0);
  const totalRemaining = inventory.reduce((s, i) => s + i.quantityRemaining, 0);
  const lowStock = inventory.filter(i => i.quantityRemaining < i.quantityAllocated * 0.2);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Packaging Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">Track packaging production, shipment, and usage</p>
        </div>
        <button onClick={() => setShowAllocate(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          <Plus size={16} /> Allocate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><Package size={12} /> Total Allocated</div>
          <p className="text-2xl font-bold text-white">{totalAllocated.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><CheckCircle size={12} /> Used</div>
          <p className="text-2xl font-bold text-blue-400">{totalUsed.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><Truck size={12} /> Remaining</div>
          <p className="text-2xl font-bold text-green-400">{totalRemaining.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><AlertTriangle size={12} /> Low Stock</div>
          <p className="text-2xl font-bold text-red-400">{lowStock.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg p-1 w-fit mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <button onClick={() => setTab('inventory')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'inventory' ? 'glass-card shadow-sm text-white' : 'text-gray-500 hover:text-gray-300'}`}>
          Restaurant Inventory
        </button>
        <button onClick={() => setTab('batches')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'batches' ? 'glass-card shadow-sm text-white' : 'text-gray-500 hover:text-gray-300'}`}>
          Production Batches
        </button>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-8 animate-shimmer">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-4 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
          </div>
        </div>
      ) : tab === 'inventory' ? (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Restaurant</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Campaign</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Allocated</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Used</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Remaining</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Est. Runout</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {inventory.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No inventory allocated yet</td></tr>
              ) : (
                inventory.map(item => {
                  const pct = item.quantityAllocated > 0 ? item.quantityRemaining / item.quantityAllocated : 0;
                  const isLow = pct < 0.2;
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{item.cafe?.name || '—'}</p>
                        <p className="text-xs text-gray-400">{item.cafe?.suburb}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {item.batch?.campaign?.name || '—'}
                        <p className="text-xs text-gray-400">{item.batch?.packagingType}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-white">{item.quantityAllocated.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-400">{item.quantityUsed.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${isLow ? 'text-red-400' : 'text-green-400'}`}>
                          {item.quantityRemaining.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div
                            className={`h-full rounded-full transition-all ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.max(pct * 100, 2)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {item.estimatedRunout ? new Date(item.estimatedRunout).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          {batches.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-gray-400">No batches yet</div>
          ) : (
            batches.map(batch => (
              <div key={batch.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[15px] text-white">{batch.campaign?.name || 'Unknown Campaign'}</h3>
                    <p className="text-xs text-gray-500">{batch.campaign?.advertiser?.businessName} · {batch.packagingType}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${batchStatusColors[batch.status]}`}>
                    {batch.status}
                  </span>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Produced</p>
                    <p className="font-medium text-white">{batch.quantityProduced.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center text-gray-500"><ArrowRight size={14} /></div>
                  <div>
                    <p className="text-xs text-gray-500">Shipped</p>
                    <p className="font-medium text-white">{batch.quantityShipped.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center text-gray-500"><ArrowRight size={14} /></div>
                  <div>
                    <p className="text-xs text-gray-500">Allocated To</p>
                    <p className="font-medium text-white">{batch._count?.inventory || 0} restaurants</p>
                  </div>
                  {batch.productionDate && (
                    <div className="ml-auto">
                      <p className="text-xs text-gray-500">Production Date</p>
                      <p className="font-medium text-white flex items-center gap-1"><Clock size={12} /> {new Date(batch.productionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showAllocate && <AllocateModal onClose={() => setShowAllocate(false)} onDone={loadData} batches={batches} />}
    </div>
  );
}

function AllocateModal({ onClose, onDone, batches }: { onClose: () => void; onDone: () => void; batches: PackagingBatch[] }) {
  const [form, setForm] = useState({ batchId: '', cafeId: '', quantity: '100' });
  const [restaurants, setRestaurants] = useState<{ id: string; name: string; suburb: string }[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.restaurants.list().then(res => setRestaurants(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.inventory.allocate({
        batchId: form.batchId,
        cafeId: form.cafeId,
        quantity: parseInt(form.quantity),
      });
      onDone();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-md" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
        <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-semibold text-white">Allocate Packaging</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 text-red-400 px-3 py-2 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Batch *</label>
            <select required value={form.batchId} onChange={e => setForm(f => ({...f, batchId: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-sm text-white" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <option value="">Select batch...</option>
              {batches.filter(b => b.status === 'ready' || b.status === 'shipped').map(b => (
                <option key={b.id} value={b.id}>{b.campaign?.name} - {b.packagingType} ({b.quantityProduced - b.quantityShipped} available)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Restaurant *</label>
            <select required value={form.cafeId} onChange={e => setForm(f => ({...f, cafeId: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-sm text-white" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <option value="">Select restaurant...</option>
              {restaurants.map(r => <option key={r.id} value={r.id}>{r.name} ({r.suburb})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
            <input type="number" required value={form.quantity} onChange={e => setForm(f => ({...f, quantity: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/[0.02] transition-colors" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
              {saving ? 'Allocating...' : 'Allocate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
