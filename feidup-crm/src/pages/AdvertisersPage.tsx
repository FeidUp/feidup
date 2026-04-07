import { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import type { Advertiser } from '../api';
import { Plus, Search, Building2, MapPin, Mail, Phone, Trash2, X, Target } from 'lucide-react';

const goalLabels: Record<string, string> = {
  brand_awareness: 'Brand Awareness',
  foot_traffic: 'Foot Traffic',
  local_reach: 'Local Reach',
  event_promotion: 'Event Promo',
  promo: 'Promotion',
  loyalty: 'Loyalty',
};

const goalColors: Record<string, string> = {
  brand_awareness: 'bg-blue-500/10 text-blue-400',
  foot_traffic: 'bg-purple-500/10 text-purple-400',
  local_reach: 'bg-teal-500/10 text-teal-400',
  event_promotion: 'bg-amber-500/10 text-amber-400',
  promo: 'bg-amber-500/10 text-amber-400',
  loyalty: 'bg-pink-500/10 text-pink-400',
};

export function AdvertisersPage() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadAdvertisers = async () => {
    try {
      const res = await api.advertisers.list();
      setAdvertisers(res.data);
    } catch (err) {
      console.error('Failed to load advertisers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdvertisers(); }, []);

  const industries = useMemo(() => {
    const set = new Set(advertisers.map(a => a.industry));
    return Array.from(set).sort();
  }, [advertisers]);

  const filtered = advertisers.filter(a => {
    const matchesSearch = !search || a.businessName.toLowerCase().includes(search.toLowerCase()) || a.industry.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = !industryFilter || a.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const handleDelete = async (id: string) => {
    try {
      await api.advertisers.delete(id);
      setAdvertisers(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete advertiser:', err);
    }
    setDeleteId(null);
  };

  const parseSuburbs = (suburbs: string | string[]): string[] => {
    if (Array.isArray(suburbs)) return suburbs;
    if (!suburbs) return [];
    try {
      const parsed = JSON.parse(suburbs);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return suburbs.split(',').map(s => s.trim()).filter(Boolean);
    }
  };

  const formatAudienceSummary = (adv: Advertiser): string[] => {
    const items: string[] = [];
    const audience = adv.targetAudience;

    if (audience?.ageRange) {
      items.push(`Age ${audience.ageRange.min}-${audience.ageRange.max}`);
    }
    if (audience?.incomeLevel) {
      items.push(`Income ${audience.incomeLevel}`);
    }
    if (audience?.interests?.length) {
      items.push(`${audience.interests.length} interests`);
    }

    return items;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Advertisers</h1>
          <p className="text-gray-500 text-sm mt-1">{advertisers.length} total advertisers</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500 transition-all duration-200 shadow-lg shadow-red-600/20">
          <Plus size={16} /> Add Advertiser
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search advertisers..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          />
        </div>
        <select
          value={industryFilter}
          onChange={e => setIndustryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-red-500/50 capitalize transition-all duration-200"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <option value="">All Industries</option>
          {industries.map(i => <option key={i} value={i} className="capitalize">{i}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="h-5 rounded w-32 mb-3 animate-shimmer" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-4 rounded w-24 mb-4 animate-shimmer" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="space-y-2">
                <div className="h-3 rounded animate-shimmer" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="h-3 rounded w-3/4 animate-shimmer" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(adv => {
            const suburbs = parseSuburbs(adv.targetSuburbs);
            const audienceSummary = formatAudienceSummary(adv);
            return (
              <div key={adv.id} className="glass-card rounded-2xl p-5 hover:bg-white/[0.02] transition-all duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-1.5">
                      <Building2 size={14} className="text-blue-400" />
                      {adv.businessName}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">{adv.industry}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${adv.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>
                      {adv.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => setDeleteId(adv.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-400 mb-3">
                  {adv.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-gray-400 shrink-0" />
                      <span className="truncate">{adv.contactEmail}</span>
                    </div>
                  )}
                  {adv.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-gray-400 shrink-0" />
                      <span>{adv.contactPhone}</span>
                    </div>
                  )}
                </div>

                {suburbs.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <MapPin size={10} /> Target Suburbs
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suburbs.slice(0, 4).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-xs">{s}</span>
                      ))}
                      {suburbs.length > 4 && (
                        <span className="px-2 py-0.5 bg-white/[0.04] text-gray-500 rounded-full text-xs">+{suburbs.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}

                {audienceSummary.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <Target size={10} /> Target Demographics
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {audienceSummary.map((item) => (
                        <span key={item} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs">{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1.5">
                    <Target size={10} className="text-gray-400" />
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${goalColors[adv.campaignGoal] || 'bg-gray-500/10 text-gray-400'}`}>
                      {goalLabels[adv.campaignGoal] || adv.campaignGoal}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Since {new Date(adv.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">No advertisers found</div>
          )}
        </div>
      )}

      {showCreate && <CreateAdvertiserModal onClose={() => setShowCreate(false)} onCreated={loadAdvertisers} />}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl w-full max-w-sm p-6" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete Advertiser</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure? This will also delete all associated campaigns and placements.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/[0.02] transition-colors" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateAdvertiserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    businessName: '', industry: '', contactEmail: '', contactPhone: '',
    targetSuburbs: '', targetPostcodes: '', targetRadiusKm: '5',
    campaignGoal: 'brand_awareness', city: 'Brisbane',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const brisbaneSuburbs = [
    'Brisbane CBD', 'South Bank', 'Fortitude Valley', 'West End', 'New Farm',
    'Paddington', 'Toowong', 'Indooroopilly', 'Chermside', 'Carindale',
    'Sunnybank', 'Mount Gravatt',
  ];

  const [selectedSuburbs, setSelectedSuburbs] = useState<string[]>([]);

  const toggleSuburb = (suburb: string) => {
    setSelectedSuburbs(prev =>
      prev.includes(suburb) ? prev.filter(s => s !== suburb) : [...prev, suburb]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.advertisers.create({
        ...form,
        targetSuburbs: JSON.stringify(selectedSuburbs),
        targetRadiusKm: parseFloat(form.targetRadiusKm) || 5,
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const industries = ['fitness', 'education', 'food', 'fintech', 'retail', 'health', 'arts', 'technology', 'real_estate', 'hospitality'];

  const inputClass = "w-full px-3 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200";
  const inputStyle = { background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-semibold text-white">Add Advertiser</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Business Name *</label>
              <input required value={form.businessName} onChange={e => setForm(f => ({...f, businessName: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Industry *</label>
              <select required value={form.industry} onChange={e => setForm(f => ({...f, industry: e.target.value}))} className={`${inputClass} capitalize`} style={inputStyle}>
                <option value="">Select industry</option>
                {industries.map(i => <option key={i} value={i} className="capitalize">{i}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Contact Email</label>
              <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({...f, contactEmail: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Contact Phone</label>
              <input value={form.contactPhone} onChange={e => setForm(f => ({...f, contactPhone: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Target Suburbs</label>
            <div className="flex flex-wrap gap-2">
              {brisbaneSuburbs.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSuburb(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedSuburbs.includes(s)
                      ? 'bg-red-600 text-white border border-red-600'
                      : 'text-gray-400 border hover:border-red-500/30'
                  }`}
                  style={!selectedSuburbs.includes(s) ? { borderColor: 'var(--color-border)' } : undefined}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Target Postcodes</label>
              <input value={form.targetPostcodes} onChange={e => setForm(f => ({...f, targetPostcodes: e.target.value}))} placeholder="4101, 4005" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Radius (km)</label>
              <input type="number" value={form.targetRadiusKm} onChange={e => setForm(f => ({...f, targetRadiusKm: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Campaign Goal</label>
              <select value={form.campaignGoal} onChange={e => setForm(f => ({...f, campaignGoal: e.target.value}))} className={inputClass} style={inputStyle}>
                <option value="brand_awareness">Brand Awareness</option>
                <option value="foot_traffic">Foot Traffic</option>
                <option value="local_reach">Local Reach</option>
                <option value="event_promotion">Event Promotion</option>
                <option value="promo">Promotion</option>
                <option value="loyalty">Loyalty</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/[0.02] transition-colors" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Add Advertiser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
