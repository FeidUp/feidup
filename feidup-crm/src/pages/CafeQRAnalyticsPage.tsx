import { useState, useEffect } from 'react';
import { api } from '../api';
import type { QRCafeAnalytics } from '../api';
import { QrCode, Smartphone, MapPin, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#8b5cf6'];

export function CafeQRAnalyticsPage() {
  const [data, setData] = useState<QRCafeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const cafeRes = await api.cafePortal.me();
        if (cafeRes.data.id) {
          const qrRes = await api.cafePortal.qrAnalytics(cafeRes.data.id);
          setData(qrRes.data);
        }
      } catch (err) {
        console.error('Failed to load QR analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-8"><div className="animate-shimmer h-96 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} /></div>;
  }

  if (!data) {
    return <div className="p-8 text-gray-500">No QR analytics data available.</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">QR Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Track how customers engage with your QR codes</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><QrCode size={12} className="text-red-500" /> Total QR Codes</div>
          <p className="text-2xl font-bold text-white">{data.totalCodes}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><Smartphone size={12} className="text-red-500" /> Total Scans</div>
          <p className="text-2xl font-bold text-white">{data.totalScans}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><QrCode size={12} className="text-red-500" /> Scan Rate</div>
          <p className="text-2xl font-bold text-white">{data.totalCodes > 0 ? ((data.totalScans / data.totalCodes) * 100).toFixed(1) : 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Daily scan chart */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><Clock size={14} className="text-red-500" /> Daily Scans (30 Days)</h3>
          {data.dailyScans.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.dailyScans}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={d => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="count" fill="#dc2626" name="Scans" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-600 text-sm">No scan data yet</div>
          )}
        </div>

        {/* Peak hours */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><Clock size={14} className="text-red-500" /> Peak Hours</h3>
          {data.peakHours.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.peakHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={h => `${h}:00`} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} labelFormatter={h => `${h}:00`} />
                <Bar dataKey="count" fill="#2563eb" name="Scans" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-600 text-sm">No scan data yet</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Device breakdown */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><Smartphone size={14} className="text-red-500" /> Device Breakdown</h3>
          {data.deviceBreakdown.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={data.deviceBreakdown.map(d => ({ name: d.device, value: d.count }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {data.deviceBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {data.deviceBreakdown.map((d, i) => (
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

        {/* Where cups traveled */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><MapPin size={14} className="text-red-500" /> Where Cups Traveled</h3>
          {data.suburbDistribution.length > 0 ? (
            <div className="space-y-2">
              {data.suburbDistribution.slice(0, 10).map(s => {
                const maxCount = Math.max(...data.suburbDistribution.map(x => x.count));
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
    </div>
  );
}
