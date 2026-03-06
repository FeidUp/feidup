import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Advertiser } from '../api';
import { Plus, Search, Building2, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export function AdvertisersPage() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

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

  const filtered = search
    ? advertisers.filter(a => a.businessName.toLowerCase().includes(search.toLowerCase()) || a.industry.toLowerCase().includes(search.toLowerCase()))
    : advertisers;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Advertisers</h1>
          <p className="text-gray-500 text-sm mt-1">{advertisers.length} total advertisers</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          <Plus size={16} /> Add Advertiser
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search advertisers..."
          className="w-full max-w-md pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-24 mb-4" />
              <div className="space-y-2"><div className="h-3 bg-gray-100 rounded" /><div className="h-3 bg-gray-100 rounded w-3/4" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(adv => (
            <div key={adv.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <Building2 size={14} className="text-blue-600" />
                    {adv.businessName}
                  </h3>
                  <p className="text-xs text-gray-500 capitalize mt-0.5">{adv.industry}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${adv.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {adv.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-gray-400 shrink-0" />
                  <span className="truncate">{adv.targetSuburbs || adv.city}</span>
                </div>
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

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">Goal: <span className="capitalize">{adv.campaignGoal}</span></p>
                <p className="text-xs text-gray-400">Since {new Date(adv.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">No advertisers found</div>
          )}
        </div>
      )}

      {showCreate && <CreateAdvertiserModal onClose={() => setShowCreate(false)} onCreated={loadAdvertisers} />}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.advertisers.create({
        ...form,
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Add Advertiser</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
              <input required value={form.businessName} onChange={e => setForm(f => ({...f, businessName: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry *</label>
              <input required value={form.industry} onChange={e => setForm(f => ({...f, industry: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" placeholder="e.g. food_delivery" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({...f, contactEmail: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input value={form.contactPhone} onChange={e => setForm(f => ({...f, contactPhone: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Suburbs</label>
            <input value={form.targetSuburbs} onChange={e => setForm(f => ({...f, targetSuburbs: e.target.value}))} placeholder="e.g. South Bank, West End, Fortitude Valley" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Postcodes</label>
              <input value={form.targetPostcodes} onChange={e => setForm(f => ({...f, targetPostcodes: e.target.value}))} placeholder="4101, 4005" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Radius (km)</label>
              <input type="number" value={form.targetRadiusKm} onChange={e => setForm(f => ({...f, targetRadiusKm: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Goal</label>
              <select value={form.campaignGoal} onChange={e => setForm(f => ({...f, campaignGoal: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="brand_awareness">Brand Awareness</option>
                <option value="foot_traffic">Foot Traffic</option>
                <option value="promo">Promotion</option>
                <option value="loyalty">Loyalty</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Add Advertiser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
