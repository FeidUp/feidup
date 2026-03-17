import { useState, useEffect } from 'react';
import { api } from '../api';
import type { CafePortalData, QRCafeAnalytics } from '../api';
import { Coffee, QrCode, Megaphone, Package, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function CafeDashboardPage() {
  const [cafe, setCafe] = useState<CafePortalData | null>(null);
  const [qrData, setQrData] = useState<QRCafeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const cafeRes = await api.cafePortal.me();
        setCafe(cafeRes.data);
        if (cafeRes.data.id) {
          const qrRes = await api.cafePortal.qrAnalytics(cafeRes.data.id);
          setQrData(qrRes.data);
        }
      } catch (err) {
        console.error('Failed to load cafe dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-6">
          <div className="h-8 rounded w-48 animate-shimmer" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl animate-shimmer" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="p-8">
        <div className="glass-card rounded-2xl p-8 text-center glow-red">
          <AlertTriangle className="mx-auto mb-3 text-red-500" size={28} />
          <p className="text-white font-medium">No cafe linked to your account</p>
          <p className="text-gray-500 text-sm mt-1">Contact FeidUp admin to link your cafe.</p>
        </div>
      </div>
    );
  }

  const totalInventory = cafe.inventory?.reduce((sum, inv) => sum + inv.quantityRemaining, 0) || 0;
  const totalUsed = cafe.inventory?.reduce((sum, inv) => sum + inv.quantityUsed, 0) || 0;
  const activeCampaigns = cafe.placements?.filter(p => p.status === 'active').length || 0;
  const totalScans = qrData?.totalScans || 0;
  const lowStockItems = cafe.inventory?.filter(inv => inv.quantityRemaining < inv.quantityAllocated * 0.2) || [];

  return (
    <div className="p-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-white">{cafe.name}</h1>
        <p className="text-gray-500 mt-1 text-sm">{cafe.address}, {cafe.suburb} {cafe.postcode}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Coffee, label: 'Cups Used', value: totalUsed, sub: 'all time', color: 'text-orange-400 bg-orange-500/10' },
          { icon: QrCode, label: 'QR Scans', value: totalScans, sub: 'total scans', color: 'text-blue-400 bg-blue-500/10' },
          { icon: Megaphone, label: 'Active Campaigns', value: activeCampaigns, sub: 'running now', color: 'text-green-400 bg-green-500/10' },
          { icon: Package, label: 'Inventory Left', value: totalInventory, sub: 'cups remaining', color: 'text-purple-400 bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={stat.label} className={`glass-card rounded-2xl p-5 animate-fade-in animate-fade-in-delay-${i}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}><stat.icon size={16} /></div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
            <p className="text-[11px] text-gray-600 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Scan trend chart */}
      {qrData && qrData.dailyScans.length > 0 && (
        <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in animate-fade-in-delay-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-semibold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-red-500" /> Scan Trend
            </h2>
            <a href="/cafe/qr-analytics" className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors">
              Details <ArrowUpRight size={12} />
            </a>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={qrData.dailyScans.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={d => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="count" fill="#dc2626" name="Scans" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div className="rounded-2xl p-5 mb-8 border border-red-500/20 bg-red-500/5 animate-fade-in animate-fade-in-delay-3">
          <h3 className="font-semibold text-red-400 flex items-center gap-2 mb-2 text-sm">
            <AlertTriangle size={14} /> Low Stock Alert
          </h3>
          {lowStockItems.map(inv => (
            <p key={inv.id} className="text-red-300/80 text-sm">
              {inv.batch?.campaign?.name || 'Unknown campaign'}: {inv.quantityRemaining} remaining of {inv.quantityAllocated}
            </p>
          ))}
        </div>
      )}

      {/* Active campaigns */}
      {cafe.placements && cafe.placements.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in animate-fade-in-delay-3">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-[15px] font-semibold text-white">Active Campaigns</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {cafe.placements.map(p => (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="font-medium text-white text-sm">{p.campaign?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">by {p.campaign?.advertiser?.businessName}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${
                  p.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
