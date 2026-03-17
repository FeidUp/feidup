import { useState, useEffect } from 'react';
import { api } from '../api';
import type { AdvertiserPortalData } from '../api';
import { QrCode, Megaphone, UtensilsCrossed, Eye, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdvertiserDashboardPage() {
  const [data, setData] = useState<AdvertiserPortalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.advertiserPortal.me()
      .then(res => setData(res.data))
      .catch(err => console.error('Failed to load advertiser dashboard:', err))
      .finally(() => setLoading(false));
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

  if (!data) {
    return (
      <div className="p-8">
        <div className="glass-card rounded-2xl p-8 text-center glow-red">
          <AlertTriangle className="mx-auto mb-3 text-red-500" size={28} />
          <p className="text-white font-medium">No advertiser linked to your account</p>
          <p className="text-gray-500 text-sm mt-1">Contact FeidUp to link your business.</p>
        </div>
      </div>
    );
  }

  const activeCampaigns = data.campaigns?.filter(c => c.status === 'active') || [];
  const totalCafes = new Set(data.campaigns?.flatMap(c => c.placements?.map(p => p.cafeId) || []) || []).size;

  const campaignChartData = (data.campaigns || []).map(c => ({
    name: c.name.length > 18 ? c.name.slice(0, 18) + '...' : c.name,
    impressions: c.totalImpressions,
    estimated: c.estimatedImpressions,
  }));

  return (
    <div className="p-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-white">{data.businessName}</h1>
        <p className="text-gray-500 mt-1 text-sm capitalize">{data.industry} &middot; {data.city}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: QrCode, label: 'Total Scans', value: data.totalScans || 0, sub: 'QR code scans', color: 'text-blue-400 bg-blue-500/10' },
          { icon: Megaphone, label: 'Active Campaigns', value: activeCampaigns.length, sub: `${data.campaigns?.length || 0} total`, color: 'text-green-400 bg-green-500/10' },
          { icon: UtensilsCrossed, label: 'Cafes Reached', value: totalCafes, sub: 'partner locations', color: 'text-purple-400 bg-purple-500/10' },
          { icon: Eye, label: 'Impressions', value: data.totalImpressions || 0, sub: 'estimated reach', color: 'text-orange-400 bg-orange-500/10' },
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

      {/* Campaign performance chart */}
      {campaignChartData.length > 0 && (
        <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in animate-fade-in-delay-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-semibold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-red-500" /> Campaign Performance
            </h2>
            <a href="/advertiser/analytics" className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors">
              QR Details <ArrowUpRight size={12} />
            </a>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={campaignChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="impressions" fill="#dc2626" name="Actual" radius={[6, 6, 0, 0]} />
              <Bar dataKey="estimated" fill="rgba(255,255,255,0.08)" name="Estimated" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Campaign list */}
      {data.campaigns && data.campaigns.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in animate-fade-in-delay-3">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-[15px] font-semibold text-white">Your Campaigns</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {data.campaigns.map(c => (
              <div key={c.id} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-medium text-white text-sm">{c.name}</p>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${
                    c.status === 'active' ? 'bg-green-500/10 text-green-400' :
                    c.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>{c.status}</span>
                </div>
                <div className="flex gap-5 text-xs text-gray-500">
                  <span>{c.placements?.length || 0} cafes</span>
                  <span>{c.totalImpressions.toLocaleString()} impressions</span>
                  {c.budget && <span>${c.budget.toLocaleString()} budget</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
