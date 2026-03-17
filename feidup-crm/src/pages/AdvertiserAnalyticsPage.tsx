import { useState, useEffect } from 'react';
import { api } from '../api';
import type { AdvertiserPortalData, QRCampaignAnalytics } from '../api';
import { QrCode, Smartphone, MapPin, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#8b5cf6'];

export function AdvertiserAnalyticsPage() {
  const [advertiser, setAdvertiser] = useState<AdvertiserPortalData | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [analytics, setAnalytics] = useState<QRCampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    api.advertiserPortal.me()
      .then(res => {
        setAdvertiser(res.data);
        if (res.data.campaigns?.length > 0) {
          setSelectedCampaign(res.data.campaigns[0].id);
        }
      })
      .catch(err => console.error('Failed to load:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCampaign) return;
    setAnalyticsLoading(true);
    api.advertiserPortal.campaignQRAnalytics(selectedCampaign)
      .then(res => setAnalytics(res.data))
      .catch(err => console.error('Failed to load analytics:', err))
      .finally(() => setAnalyticsLoading(false));
  }, [selectedCampaign]);

  if (loading) {
    return <div className="p-8"><div className="animate-shimmer h-96 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} /></div>;
  }

  if (!advertiser) {
    return <div className="p-8 text-gray-500">No advertiser linked to your account.</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">QR Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Track your campaign QR code performance</p>
        </div>

        {/* Campaign selector */}
        {advertiser.campaigns && advertiser.campaigns.length > 0 && (
          <select
            value={selectedCampaign}
            onChange={e => setSelectedCampaign(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            {advertiser.campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {analyticsLoading ? (
        <div className="animate-shimmer h-96 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
      ) : analytics ? (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><QrCode size={12} className="text-red-500" /> QR Codes</div>
              <p className="text-2xl font-bold text-white">{analytics.totalCodes}</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><Smartphone size={12} className="text-red-500" /> Total Scans</div>
              <p className="text-2xl font-bold text-white">{analytics.totalScans}</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><TrendingUp size={12} className="text-red-500" /> Scan Rate</div>
              <p className="text-2xl font-bold text-white">{analytics.scanRate}%</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><QrCode size={12} className="text-red-500" /> Advertiser Scans</div>
              <p className="text-2xl font-bold text-white">{analytics.advertiserScans}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Device breakdown */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><Smartphone size={14} className="text-red-500" /> Device Breakdown</h3>
              {analytics.deviceBreakdown.length > 0 ? (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                      <Pie data={analytics.deviceBreakdown.map(d => ({ name: d.device, value: d.count }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                        {analytics.deviceBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {analytics.deviceBreakdown.map((d, i) => (
                      <div key={d.device} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="capitalize text-gray-400">{d.device}</span>
                        <span className="font-medium text-white ml-auto">{d.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-600 text-sm">No device data</div>
              )}
            </div>

            {/* Suburb distribution */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><MapPin size={14} className="text-red-500" /> Suburb Distribution</h3>
              {analytics.suburbDistribution.length > 0 ? (
                <div className="space-y-2">
                  {analytics.suburbDistribution.slice(0, 10).map(s => {
                    const maxCount = Math.max(...analytics.suburbDistribution.map(x => x.count));
                    return (
                      <div key={s.suburb} className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 w-32 truncate">{s.suburb}</span>
                        <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${(s.count / maxCount) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium text-white w-8 text-right">{s.count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-600 text-sm">No location data</div>
              )}
            </div>
          </div>

          {/* Conversion metrics */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Conversion Funnel</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl" style={{ background: 'var(--color-bg-secondary)' }}>
                <p className="text-3xl font-bold text-white">{analytics.totalCodes}</p>
                <p className="text-sm text-gray-500 mt-1">Codes Generated</p>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(37,99,235,0.1)' }}>
                <p className="text-3xl font-bold text-blue-400">{analytics.totalScans}</p>
                <p className="text-sm text-gray-500 mt-1">Scanned</p>
                <p className="text-xs text-gray-600">{analytics.scanRate}% scan rate</p>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(22,163,74,0.1)' }}>
                <p className="text-3xl font-bold text-green-400">{analytics.advertiserScans}</p>
                <p className="text-sm text-gray-500 mt-1">Advertiser Redirects</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center text-gray-600">
          Select a campaign to view analytics
        </div>
      )}
    </div>
  );
}
