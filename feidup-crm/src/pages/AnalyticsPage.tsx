import { useState, useEffect } from 'react';
import { api } from '../api';
import type { AnalyticsOverview, CampaignPerformance, RegionData, RevenueData } from '../api';
import { BarChart3, TrendingUp, MapPin, DollarSign, Eye, Building2, UtensilsCrossed, Megaphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#8b5cf6', '#ec4899'];

export function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [performance, setPerformance] = useState<CampaignPerformance[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-8 bg-gray-100 rounded w-16" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 h-80 animate-pulse" />
          <div className="bg-white rounded-xl border border-gray-200 p-5 h-80 animate-pulse" />
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Platform performance overview</p>
      </div>

      {/* Top Stats */}
      {overview && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatCard icon={Building2} iconColor="text-blue-600" label="Advertisers" value={overview.advertisers.total} sub={`${overview.advertisers.active} active`} />
          <StatCard icon={UtensilsCrossed} iconColor="text-orange-600" label="Restaurants" value={overview.restaurants.total} sub={`${overview.restaurants.active} active`} />
          <StatCard icon={Megaphone} iconColor="text-red-600" label="Campaigns" value={overview.campaigns.total} sub={`${overview.campaigns.active} active`} />
          <StatCard icon={Eye} iconColor="text-purple-600" label="Total Impressions" value={overview.totalImpressions} />
          {revenue && (
            <StatCard icon={DollarSign} iconColor="text-green-600" label="Revenue" value={`$${revenue.totalRevenue.toLocaleString()}`} sub={`${revenue.campaignCount} campaigns`} />
          )}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Region Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><MapPin size={14} /> Suburb Performance</h3>
          {regionChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={regionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="traffic" fill="#dc2626" name="Foot Traffic" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" fill="#2563eb" name="Orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No region data</div>
          )}
        </div>

        {/* Industry Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><BarChart3 size={14} /> Advertiser Industries</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="capitalize text-gray-600">{d.name.replace('_', ' ')}</span>
                    <span className="font-medium ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No industry data</div>
          )}
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-sm flex items-center gap-2"><TrendingUp size={14} /> Campaign Performance</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
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
          <tbody className="divide-y divide-gray-100">
            {performance.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No campaign data</td></tr>
            ) : (
              performance.map(p => {
                const pct = p.estimated > 0 ? Math.round((p.impressions / p.estimated) * 100) : 0;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.advertiser}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        p.status === 'active' ? 'bg-green-100 text-green-700' : p.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{p.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{p.estimated.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-500 w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{p.restaurants}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconColor, label, value, sub }: { icon: typeof BarChart3; iconColor: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
        <Icon size={12} className={iconColor} /> {label}
      </div>
      <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}
