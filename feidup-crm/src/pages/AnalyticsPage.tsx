import { useState, useEffect } from 'react';
import { api } from '../api';
import type { AnalyticsOverview, CampaignPerformance, RegionData, RevenueData, QROverviewAnalytics, QRLiveScan, QRGeographyEntry, QRConversionFunnel } from '../api';
import { BarChart3, TrendingUp, MapPin, DollarSign, Eye, Building2, UtensilsCrossed, Megaphone, QrCode, Activity, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#8b5cf6', '#ec4899'];

export function AnalyticsPage() {
  const [tab, setTab] = useState<'overview' | 'qr'>('overview');
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [performance, setPerformance] = useState<CampaignPerformance[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  // QR tab state
  const [qrOverview, setQrOverview] = useState<QROverviewAnalytics | null>(null);
  const [qrLive, setQrLive] = useState<QRLiveScan[]>([]);
  const [qrGeo, setQrGeo] = useState<QRGeographyEntry[]>([]);
  const [qrFunnel, setQrFunnel] = useState<QRConversionFunnel | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [overviewRes, perfRes, regionRes, revRes] = await Promise.all([
          api.analytics.overview(),
          api.analytics.performance(),
          api.analytics.region(),
          api.analytics.revenue(),
        ]);
        setOverview(overviewRes.data);
        setPerformance(perfRes.data);
        setRegions(regionRes.data);
        setRevenue(revRes.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (tab !== 'qr') return;
    setQrLoading(true);
    Promise.all([
      api.analytics.qrOverview(),
      api.analytics.qrLive(),
      api.analytics.qrGeography(),
      api.analytics.conversions(),
    ])
      .then(([ov, live, geo, funnel]) => {
        setQrOverview(ov.data);
        setQrLive(live.data);
        setQrGeo(geo.data);
        setQrFunnel(funnel.data);
      })
      .catch(err => console.error('Failed to load QR analytics:', err))
      .finally(() => setQrLoading(false));
  }, [tab]);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 animate-shimmer">
              <div className="h-4 rounded w-20 mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-8 rounded w-16" style={{ background: 'rgba(255,255,255,0.04)' }} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-5 h-80 animate-shimmer" />
          <div className="glass-card rounded-2xl p-5 h-80 animate-shimmer" />
        </div>
      </div>
    );
  }

  const regionChartData = regions.slice(0, 8).map(r => ({
    name: r.suburb,
    cafes: r.cafeCount,
    traffic: r.totalFootTraffic,
    orders: r.totalOrders,
  }));

  const industryData = performance.reduce<Record<string, number>>((acc, p) => {
    acc[p.industry] = (acc[p.industry] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(industryData).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Platform performance overview</p>
        </div>
        <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <button onClick={() => setTab('overview')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'overview' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>
            Overview
          </button>
          <button onClick={() => setTab('qr')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${tab === 'qr' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>
            <QrCode size={14} /> QR Analytics
          </button>
        </div>
      </div>

      {tab === 'qr' && (
        qrLoading ? (
          <div className="animate-shimmer space-y-6">
            <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />)}</div>
            <div className="h-96 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
        ) : (
          <>
            {/* QR Overview Stats */}
            {qrOverview && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard icon={QrCode} iconColor="text-red-500" label="Total QR Codes" value={qrOverview.totalCodes} />
                <StatCard icon={Activity} iconColor="text-blue-500" label="Total Scans" value={qrOverview.totalScans} />
                <StatCard icon={QrCode} iconColor="text-green-500" label="Active Codes" value={qrOverview.activeCodes} />
                <StatCard icon={TrendingUp} iconColor="text-purple-500" label="Scan Rate" value={`${qrOverview.scanRate}%`} />
              </div>
            )}

            {/* Conversion Funnel */}
            {qrFunnel && (
              <div className="glass-card rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-red-500" /> Conversion Funnel</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-xl" style={{ background: 'var(--color-bg-secondary)' }}>
                    <p className="text-3xl font-bold text-white">{qrFunnel.codesGenerated}</p>
                    <p className="text-sm text-gray-500 mt-1">Codes Generated</p>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(37,99,235,0.1)' }}>
                    <p className="text-3xl font-bold text-blue-400">{qrFunnel.scanned}</p>
                    <p className="text-sm text-gray-500 mt-1">Scanned ({qrFunnel.scanRate}%)</p>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(22,163,74,0.1)' }}>
                    <p className="text-3xl font-bold text-green-400">{qrFunnel.redirected}</p>
                    <p className="text-sm text-gray-500 mt-1">Redirected ({qrFunnel.redirectRate}%)</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Geographic distribution */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><Globe size={14} className="text-red-500" /> Scans by Suburb</h3>
                {qrGeo.length > 0 ? (
                  <div className="space-y-2">
                    {qrGeo.slice(0, 12).map(g => {
                      const max = Math.max(...qrGeo.map(x => x.count));
                      return (
                        <div key={g.suburb} className="flex items-center gap-3">
                          <span className="text-sm text-gray-400 w-32 truncate">{g.suburb}</span>
                          <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${(g.count / max) * 100}%` }} />
                          </div>
                          <span className="text-sm font-medium text-white w-8 text-right">{g.count}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-600 text-sm">No geographic data</div>
                )}
              </div>

              {/* Live scan feed */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><Activity size={14} className="text-red-500" /> Recent Scans</h3>
                {qrLive.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {qrLive.slice(0, 20).map(scan => (
                      <div key={scan.id} className="flex items-center justify-between text-sm py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${scan.qrCode.type === 'cafe' ? 'bg-green-500' : 'bg-blue-500'}`} />
                          <span className="font-mono text-xs text-gray-500">{scan.qrCode.code}</span>
                          <span className="text-gray-600 capitalize text-xs">{scan.qrCode.type}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          {scan.scanSuburb && <span>{scan.scanSuburb}</span>}
                          <span>{scan.deviceType}</span>
                          <span>{new Date(scan.scannedAt).toLocaleString('en-AU', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-600 text-sm">No scan data yet</div>
                )}
              </div>
            </div>
          </>
        )
      )}

      {tab === 'overview' && <>
      {/* Top Stats */}
      {overview && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatCard icon={Building2} iconColor="text-blue-500" label="Advertisers" value={overview.advertisers.total} sub={`${overview.advertisers.active} active`} />
          <StatCard icon={UtensilsCrossed} iconColor="text-orange-500" label="Restaurants" value={overview.restaurants.total} sub={`${overview.restaurants.active} active`} />
          <StatCard icon={Megaphone} iconColor="text-red-500" label="Campaigns" value={overview.campaigns.total} sub={`${overview.campaigns.active} active`} />
          <StatCard icon={Eye} iconColor="text-purple-500" label="Total Impressions" value={overview.totalImpressions} />
          {revenue && (
            <StatCard icon={DollarSign} iconColor="text-green-500" label="Revenue" value={`$${revenue.totalRevenue.toLocaleString()}`} sub={`${revenue.campaignCount} campaigns`} />
          )}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Region Chart */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><MapPin size={14} className="text-red-500" /> Suburb Performance</h3>
          {regionChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={regionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="traffic" fill="#dc2626" name="Foot Traffic" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" fill="#2563eb" name="Orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-600 text-sm">No region data</div>
          )}
        </div>

        {/* Industry Breakdown */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><BarChart3 size={14} className="text-red-500" /> Advertiser Industries</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="capitalize text-gray-400">{d.name.replace('_', ' ')}</span>
                    <span className="font-medium text-white ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-600 text-sm">No industry data</div>
          )}
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold text-sm text-white flex items-center gap-2"><TrendingUp size={14} className="text-red-500" /> Campaign Performance</h3>
        </div>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Campaign</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Advertiser</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Impressions</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Target</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Completion</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Restaurants</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ '--tw-divide-opacity': 1, borderColor: 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
            {performance.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-600">No campaign data</td></tr>
            ) : (
              performance.map(p => {
                const pct = p.estimated > 0 ? Math.round((p.impressions / p.estimated) * 100) : 0;
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                    <td className="px-4 py-3 text-gray-400">{p.advertiser}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        p.status === 'active' ? 'bg-green-500/10 text-green-400' : p.status === 'completed' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-white">{p.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{p.estimated.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-500 w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-400">{p.restaurants}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      </>}
    </div>
  );
}

function StatCard({ icon: Icon, iconColor, label, value, sub }: { icon: typeof BarChart3; iconColor: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
        <Icon size={12} className={iconColor} /> {label}
      </div>
      <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}
