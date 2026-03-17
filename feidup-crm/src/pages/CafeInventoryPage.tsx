import { useState, useEffect } from 'react';
import { api } from '../api';
import type { CafePortalData } from '../api';
import { Package, AlertTriangle } from 'lucide-react';

export function CafeInventoryPage() {
  const [cafe, setCafe] = useState<CafePortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportForm, setReportForm] = useState({ packagingUsed: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.cafePortal.me()
      .then(res => setCafe(res.data))
      .catch(err => console.error('Failed to load inventory:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cafe) return;
    setSubmitting(true);
    try {
      await api.inventory.reportUsage({
        cafeId: cafe.id,
        packagingUsed: parseInt(reportForm.packagingUsed),
        notes: reportForm.notes || undefined,
      });
      setMessage('Usage reported successfully');
      setReportForm({ packagingUsed: '', notes: '' });
      const res = await api.cafePortal.me();
      setCafe(res.data);
    } catch (err) {
      setMessage('Failed to report usage');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8"><div className="animate-shimmer h-64 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} /></div>;
  }

  if (!cafe) {
    return <div className="p-8 text-gray-500">No cafe linked to your account.</div>;
  }

  const inventory = cafe.inventory || [];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Inventory</h1>
        <p className="text-gray-500 text-sm mt-1">Track your packaging stock levels</p>
      </div>

      {/* Inventory table */}
      <div className="glass-card rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Campaign</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Allocated</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Used</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Remaining</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {inventory.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-600">No inventory allocated</td></tr>
            ) : (
              inventory.map(inv => {
                const pct = inv.quantityAllocated > 0 ? (inv.quantityRemaining / inv.quantityAllocated) * 100 : 0;
                const isLow = pct < 20;
                return (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{inv.batch?.campaign?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-gray-400 capitalize">{inv.batch?.packagingType || 'cups'}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{inv.quantityAllocated.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{inv.quantityUsed.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium text-white">{inv.quantityRemaining.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                          <AlertTriangle size={10} /> Low
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Usage report form */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Package size={16} className="text-red-500" /> Report Usage</h3>
        {message && (
          <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${message.includes('success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleReport} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Cups Used</label>
            <input
              type="number"
              min="1"
              required
              value={reportForm.packagingUsed}
              onChange={e => setReportForm(f => ({ ...f, packagingUsed: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              placeholder="e.g. 50"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={reportForm.notes}
              onChange={e => setReportForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              placeholder="e.g. Busy weekend"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Reporting...' : 'Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
