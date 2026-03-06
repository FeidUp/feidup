import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Campaign, Advertiser, Recommendation, Restaurant } from '../api';
import { Plus, Search, Megaphone, MapPin, Calendar, DollarSign, Eye, ChevronDown, ChevronUp, Target } from 'lucide-react';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadCampaigns = async () => {
    try {
      const res = await api.campaigns.list();
      setCampaigns(res.data);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCampaigns(); }, []);

  const filtered = search
    ? campaigns.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.advertiser?.businessName.toLowerCase().includes(search.toLowerCase()))
    : campaigns;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-gray-500 text-sm mt-1">{campaigns.length} total campaigns</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search campaigns..."
          className="w-full max-w-md pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === campaign.id ? null : campaign.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Megaphone size={18} className="text-red-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                      <p className="text-xs text-gray-500">{campaign.advertiser?.businessName || 'Unknown advertiser'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[campaign.status]}`}>
                      {campaign.status}
                    </span>
                    {expandedId === campaign.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                <div className="flex gap-6 mt-3 text-sm text-gray-500">
                  {campaign.startDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {new Date(campaign.startDate).toLocaleDateString()} {campaign.endDate ? `- ${new Date(campaign.endDate).toLocaleDateString()}` : ''}
                    </span>
                  )}
                  {campaign.budget != null && (
                    <span className="flex items-center gap-1">
                      <DollarSign size={12} /> {campaign.budget.toLocaleString()}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {campaign.totalImpressions.toLocaleString()} / {campaign.estimatedImpressions.toLocaleString()} impressions
                  </span>
                  {campaign.packagingType && (
                    <span className="flex items-center gap-1">
                      <Target size={12} /> {campaign.packagingQuantity.toLocaleString()} {campaign.packagingType}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === campaign.id && campaign.placements && campaign.placements.length > 0 && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Placements</h4>
                  <div className="space-y-2">
                    {campaign.placements.map(p => (
                      <div key={p.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-gray-200 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{p.cafe?.name || 'Unknown'}</span>
                          {p.cafe?.suburb && <span className="text-xs text-gray-400 flex items-center gap-0.5"><MapPin size={10} /> {p.cafe.suburb}</span>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Score: {p.matchScore}</span>
                          <span>{p.actualImpressions}/{p.estimatedDailyImpressions} daily</span>
                          <span className={`px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No campaigns found</div>
          )}
        </div>
      )}

      {showCreate && <CreateCampaignModal onClose={() => setShowCreate(false)} onCreated={loadCampaigns} />}
    </div>
  );
}

function CreateCampaignModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [form, setForm] = useState({
    advertiserId: '', name: '', packagingQuantity: '1000', packagingType: 'coffee_cup',
    adFormat: 'sleeve', budget: '', startDate: '', endDate: '',
  });
  const [selectedCafes, setSelectedCafes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    api.advertisers.list().then(res => setAdvertisers(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.advertiserId) {
      api.recommendations.get(form.advertiserId).then(res => setRecommendations(res.data)).catch(() => setRecommendations([]));
    }
  }, [form.advertiserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.campaigns.create({
        ...form,
        packagingQuantity: parseInt(form.packagingQuantity),
        budget: form.budget ? parseFloat(form.budget) : undefined,
        cafeIds: selectedCafes,
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
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Campaign</h2>
          <div className="flex gap-1">
            <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-red-500' : 'bg-gray-300'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-red-500' : 'bg-gray-300'}`} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}

          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advertiser *</label>
                <select required value={form.advertiserId} onChange={e => setForm(f => ({...f, advertiserId: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="">Select advertiser...</option>
                  {advertisers.map(a => <option key={a.id} value={a.id}>{a.businessName}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Packaging Type</label>
                  <select value={form.packagingType} onChange={e => setForm(f => ({...f, packagingType: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option value="coffee_cup">Coffee Cup</option>
                    <option value="takeaway_bag">Takeaway Bag</option>
                    <option value="napkin">Napkin</option>
                    <option value="tray_liner">Tray Liner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Format</label>
                  <select value={form.adFormat} onChange={e => setForm(f => ({...f, adFormat: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option value="sleeve">Sleeve</option>
                    <option value="print">Print</option>
                    <option value="sticker">Sticker</option>
                    <option value="qr_code">QR Code</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" value={form.packagingQuantity} onChange={e => setForm(f => ({...f, packagingQuantity: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                  <input type="number" value={form.budget} onChange={e => setForm(f => ({...f, budget: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({...f, startDate: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(f => ({...f, endDate: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="button" onClick={() => setStep(2)} disabled={!form.advertiserId || !form.name} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
                  Next: Select Restaurants
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-gray-600 mb-2">AI-matched restaurants for this campaign. Select the ones to include:</p>
              {recommendations.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {recommendations.map(rec => (
                    <label
                      key={rec.cafe.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedCafes.includes(rec.cafe.id) ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCafes.includes(rec.cafe.id)}
                          onChange={e => setSelectedCafes(prev => e.target.checked ? [...prev, rec.cafe.id] : prev.filter(id => id !== rec.cafe.id))}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <p className="font-medium text-sm">{rec.cafe.name}</p>
                          <p className="text-xs text-gray-500">{rec.cafe.suburb} · {rec.cafe.avgDailyOrders} daily orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-600">{rec.matchScore}%</p>
                        <p className="text-xs text-gray-400">{rec.matchReason}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-6 text-center">No recommendations available. You can still create the campaign.</p>
              )}

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">Back</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
                  {saving ? 'Creating...' : `Create Campaign${selectedCafes.length ? ` (${selectedCafes.length} restaurants)` : ''}`}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
