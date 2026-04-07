import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Campaign, Advertiser, Recommendation, Restaurant } from '../api';
import { Plus, Search, Megaphone, MapPin, Calendar, DollarSign, Eye, ChevronDown, ChevronUp, Target, Pencil, CheckCircle2, Trash2, X, Link2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-400',
  active: 'bg-green-500/10 text-green-400',
  paused: 'bg-yellow-500/10 text-yellow-400',
  completed: 'bg-blue-500/10 text-blue-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'finished' | 'inactive'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [attachingCampaign, setAttachingCampaign] = useState<Campaign | null>(null);
  const [busyCampaignId, setBusyCampaignId] = useState<string | null>(null);
  const [busyPlacementId, setBusyPlacementId] = useState<string | null>(null);

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

  const filtered = campaigns.filter((campaign) => {
    const matchesSearch =
      !search ||
      campaign.name.toLowerCase().includes(search.toLowerCase()) ||
      campaign.advertiser?.businessName.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = campaign.status === 'active';
    } else if (statusFilter === 'finished') {
      matchesStatus = campaign.status === 'completed';
    } else if (statusFilter === 'inactive') {
      matchesStatus = !['active', 'completed'].includes(campaign.status);
    }

    return matchesSearch && matchesStatus;
  });

  const handleFinishCampaign = async (campaignId: string) => {
    if (!window.confirm('Mark this campaign as completed?')) return;

    setBusyCampaignId(campaignId);
    try {
      await api.campaigns.updateStatus(campaignId, 'completed');
      await loadCampaigns();
    } catch (err) {
      console.error('Failed to finish campaign:', err);
      alert('Failed to mark campaign as completed.');
    } finally {
      setBusyCampaignId(null);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!window.confirm('Delete this campaign? This cannot be undone.')) return;

    setBusyCampaignId(campaignId);
    try {
      await api.campaigns.delete(campaignId);
      await loadCampaigns();
    } catch (err) {
      console.error('Failed to delete campaign:', err);
      alert('Failed to delete campaign.');
    } finally {
      setBusyCampaignId(null);
    }
  };

  const handlePlacementStatusChange = async (placementId: string, status: string) => {
    setBusyPlacementId(placementId);
    try {
      await api.campaigns.updatePlacementStatus(placementId, status);
      await loadCampaigns();
    } catch (err) {
      console.error('Failed to update placement status:', err);
      alert('Failed to update cafe placement status.');
    } finally {
      setBusyPlacementId(null);
    }
  };

  const handleUnattachPlacement = async (placementId: string) => {
    if (!window.confirm('Unattach this cafe from the campaign?')) return;

    setBusyPlacementId(placementId);
    try {
      await api.campaigns.removePlacement(placementId);
      await loadCampaigns();
    } catch (err) {
      console.error('Failed to unattach placement:', err);
      alert('Failed to unattach cafe from campaign.');
    } finally {
      setBusyPlacementId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-500 text-sm mt-1">{campaigns.length} total campaigns</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          />
        </div>
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'finished', label: 'Finished' },
            { key: 'inactive', label: 'Inactive' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setStatusFilter(opt.key as 'all' | 'active' | 'finished' | 'inactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === opt.key
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
              style={statusFilter === opt.key ? undefined : { border: '1px solid var(--color-border)' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 animate-shimmer">
              <div className="h-5 rounded w-48 mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-4 rounded w-32" style={{ background: 'rgba(255,255,255,0.04)' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(campaign => (
            <div key={campaign.id} className="glass-card rounded-2xl overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedId(expandedId === campaign.id ? null : campaign.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Megaphone size={18} className="text-red-500" />
                    <div>
                      <h3 className="font-semibold text-white">{campaign.name}</h3>
                      <p className="text-xs text-gray-500">{campaign.advertiser?.businessName || 'Unknown advertiser'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[campaign.status]}`}>
                      {campaign.status}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAttachingCampaign(campaign);
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                      title="Attach cafes"
                      disabled={busyCampaignId === campaign.id}
                    >
                      <Link2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCampaign(campaign);
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title="Edit campaign"
                      disabled={busyCampaignId === campaign.id}
                    >
                      <Pencil size={14} />
                    </button>
                    {campaign.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleFinishCampaign(campaign.id);
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Finish campaign"
                        disabled={busyCampaignId === campaign.id}
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDeleteCampaign(campaign.id);
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete campaign"
                      disabled={busyCampaignId === campaign.id}
                    >
                      <Trash2 size={14} />
                    </button>
                    {expandedId === campaign.id ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
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
              {expandedId === campaign.id && (
                <div className="px-5 py-4" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Placements</h4>
                    <button
                      type="button"
                      onClick={() => setAttachingCampaign(campaign)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 hover:text-indigo-200 hover:bg-indigo-500/10 transition-colors"
                      style={{ border: '1px solid var(--color-border)' }}
                    >
                      Attach Cafes
                    </button>
                  </div>
                  {campaign.placements && campaign.placements.length > 0 ? (
                    <div className="space-y-2">
                      {campaign.placements.map(p => (
                        <div key={p.id} className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-white">{p.cafe?.name || 'Unknown'}</span>
                            {p.cafe?.suburb && <span className="text-xs text-gray-600 flex items-center gap-0.5"><MapPin size={10} /> {p.cafe.suburb}</span>}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Score: {p.matchScore}</span>
                            <span>{p.actualImpressions}/{p.estimatedDailyImpressions} daily</span>
                            <select
                              value={p.status}
                              disabled={busyPlacementId === p.id}
                              onChange={(e) => {
                                const next = e.target.value;
                                if (next !== p.status) {
                                  void handlePlacementStatusChange(p.id, next);
                                }
                              }}
                              className={`px-2 py-1 rounded-full font-medium capitalize bg-transparent ${statusColors[p.status] || 'bg-gray-500/10 text-gray-400'}`}
                              style={{ border: '1px solid var(--color-border)' }}
                            >
                              <option value="proposed">proposed</option>
                              <option value="accepted">accepted</option>
                              <option value="rejected">rejected</option>
                              <option value="active">active</option>
                              <option value="completed">completed</option>
                            </select>
                            <button
                              type="button"
                              disabled={busyPlacementId === p.id}
                              onClick={() => {
                                void handleUnattachPlacement(p.id);
                              }}
                              className="px-2 py-1 rounded-full font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                              style={{ border: '1px solid var(--color-border)' }}
                            >
                              Unattach
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No cafes attached yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-600">No campaigns found</div>
          )}
        </div>
      )}

      {showCreate && <CreateCampaignModal onClose={() => setShowCreate(false)} onCreated={loadCampaigns} />}
      {editingCampaign && (
        <EditCampaignModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSaved={async () => {
            setEditingCampaign(null);
            await loadCampaigns();
          }}
        />
      )}
      {attachingCampaign && (
        <AttachCafesModal
          campaign={attachingCampaign}
          onClose={() => setAttachingCampaign(null)}
          onAttached={async () => {
            setAttachingCampaign(null);
            await loadCampaigns();
          }}
        />
      )}
    </div>
  );
}

function AttachCafesModal({
  campaign,
  onClose,
  onAttached,
}: {
  campaign: Campaign;
  onClose: () => void;
  onAttached: () => Promise<void>;
}) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [allCafes, setAllCafes] = useState<Restaurant[]>([]);
  const [manualSearch, setManualSearch] = useState('');
  const [selectedCafeIds, setSelectedCafeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    Promise.all([
      api.recommendations.get(campaign.advertiserId),
      api.restaurants.list(),
    ])
      .then(([recRes, cafesRes]) => {
        if (!mounted) return;
        const alreadyAttached = new Set((campaign.placements || []).map((p) => p.cafeId));
        setRecommendations((recRes.data || []).filter((rec) => !alreadyAttached.has(rec.cafe.id)));
        setAllCafes((cafesRes.data || []).filter((cafe) => !alreadyAttached.has(cafe.id)));
      })
      .catch((err: any) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load cafes');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [campaign]);

  const toggleCafe = (cafeId: string, checked: boolean) => {
    setSelectedCafeIds((prev) => checked ? [...prev, cafeId] : prev.filter((id) => id !== cafeId));
  };

  const recommendedIds = new Set(recommendations.map((r) => r.cafe.id));
  const manualCandidates = allCafes
    .filter((cafe) => !recommendedIds.has(cafe.id))
    .filter((cafe) => {
      const q = manualSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        cafe.name.toLowerCase().includes(q) ||
        (cafe.suburb || '').toLowerCase().includes(q) ||
        (cafe.postcode || '').toLowerCase().includes(q)
      );
    });

  const handleAttach = async () => {
    if (selectedCafeIds.length === 0) {
      setError('Select at least one cafe to attach.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await Promise.all(selectedCafeIds.map((cafeId) => api.campaigns.addPlacement(campaign.id, cafeId)));
      await onAttached();
    } catch (err: any) {
      setError(err.message || 'Failed to attach selected cafes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="text-lg font-semibold text-white">Attach Cafes</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500">{campaign.name}</p>
          {error && <div className="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-sm">{error}</div>}

          {loading ? (
            <div className="h-32 rounded-xl animate-shimmer" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ) : (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Recommended Cafes</p>
                {recommendations.length === 0 ? (
                  <p className="text-sm text-gray-500">No additional recommended cafes available.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {recommendations.map((rec) => (
                      <label
                        key={rec.cafe.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                          selectedCafeIds.includes(rec.cafe.id) ? 'border-red-500 bg-red-500/10' : 'hover:bg-white/[0.02]'
                        }`}
                        style={selectedCafeIds.includes(rec.cafe.id) ? undefined : { borderColor: 'var(--color-border)' }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedCafeIds.includes(rec.cafe.id)}
                            onChange={(e) => toggleCafe(rec.cafe.id, e.target.checked)}
                            className="rounded border-gray-600 text-red-600 focus:ring-red-500 bg-transparent"
                          />
                          <div>
                            <p className="font-medium text-sm text-white">{rec.cafe.name}</p>
                            <p className="text-xs text-gray-500">{rec.cafe.suburb} · {rec.cafe.avgDailyOrders} daily orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-red-500">{rec.matchScore}%</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Manual Search (All Cafes)</p>
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={manualSearch}
                    onChange={(e) => setManualSearch(e.target.value)}
                    placeholder="Search by cafe name, suburb, or postcode"
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                {manualCandidates.length === 0 ? (
                  <p className="text-sm text-gray-500">No cafes match your search.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {manualCandidates.slice(0, 150).map((cafe) => (
                      <label
                        key={cafe.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                          selectedCafeIds.includes(cafe.id) ? 'border-red-500 bg-red-500/10' : 'hover:bg-white/[0.02]'
                        }`}
                        style={selectedCafeIds.includes(cafe.id) ? undefined : { borderColor: 'var(--color-border)' }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedCafeIds.includes(cafe.id)}
                            onChange={(e) => toggleCafe(cafe.id, e.target.checked)}
                            className="rounded border-gray-600 text-red-600 focus:ring-red-500 bg-transparent"
                          />
                          <div>
                            <p className="font-medium text-sm text-white">{cafe.name}</p>
                            <p className="text-xs text-gray-500">{cafe.suburb} {cafe.postcode ? `· ${cafe.postcode}` : ''}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{cafe.avgDailyOrders || 0} daily orders</div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/[0.04] transition-colors"
              style={{ border: '1px solid var(--color-border)' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAttach}
              disabled={saving || loading}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Attaching...' : `Attach ${selectedCafeIds.length || ''} Cafes`.trim()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditCampaignModal({
  campaign,
  onClose,
  onSaved,
}: {
  campaign: Campaign;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: campaign.name || '',
    startDate: campaign.startDate ? String(campaign.startDate).slice(0, 10) : '',
    endDate: campaign.endDate ? String(campaign.endDate).slice(0, 10) : '',
    budget: campaign.budget != null ? String(campaign.budget) : '',
    status: campaign.status || 'draft',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputClass = 'w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none';
  const inputStyle = { background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        status: form.status,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        budget: form.budget === '' ? null : Number(form.budget),
      };

      await api.campaigns.update(campaign.id, payload);
      await onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-lg" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="text-lg font-semibold text-white">Edit Campaign</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          {error && <div className="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Budget ($)</label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className={inputClass}
                style={inputStyle}
              >
                <option value="draft">draft</option>
                <option value="proposed">proposed</option>
                <option value="active">active</option>
                <option value="paused">paused</option>
                <option value="completed">completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/[0.04] transition-colors"
              style={{ border: '1px solid var(--color-border)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
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
    setError('');
    try {
      const payload: Record<string, unknown> = {
        advertiserId: form.advertiserId,
        name: form.name,
        packagingType: form.packagingType,
        adFormat: form.adFormat,
        packagingQuantity: parseInt(form.packagingQuantity),
        budget: form.budget ? parseFloat(form.budget) : undefined,
        cafeIds: selectedCafes,
      };

      if (form.startDate) payload.startDate = form.startDate;
      if (form.endDate) payload.endDate = form.endDate;

      await api.campaigns.create({
        ...payload,
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none";
  const inputStyle = { background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' };
  const selectClass = "w-full px-3 py-2 rounded-xl text-sm text-white";
  const selectStyle = { background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-semibold text-white">New Campaign</h2>
          <div className="flex gap-1">
            <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-red-500' : 'bg-gray-600'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-red-500' : 'bg-gray-600'}`} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-sm">{error}</div>}

          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Advertiser *</label>
                <select required value={form.advertiserId} onChange={e => setForm(f => ({...f, advertiserId: e.target.value}))} className={selectClass} style={selectStyle}>
                  <option value="">Select advertiser...</option>
                  {advertisers.map(a => <option key={a.id} value={a.id}>{a.businessName}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className={inputClass} style={inputStyle} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Packaging Type</label>
                  <select value={form.packagingType} onChange={e => setForm(f => ({...f, packagingType: e.target.value}))} className={selectClass} style={selectStyle}>
                    <option value="coffee_cup">Coffee Cup</option>
                    <option value="takeaway_bag">Takeaway Bag</option>
                    <option value="napkin">Napkin</option>
                    <option value="tray_liner">Tray Liner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Ad Format</label>
                  <select value={form.adFormat} onChange={e => setForm(f => ({...f, adFormat: e.target.value}))} className={selectClass} style={selectStyle}>
                    <option value="sleeve">Sleeve</option>
                    <option value="print">Print</option>
                    <option value="sticker">Sticker</option>
                    <option value="qr_code">QR Code</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                  <input type="number" value={form.packagingQuantity} onChange={e => setForm(f => ({...f, packagingQuantity: e.target.value}))} className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Budget ($)</label>
                  <input type="number" value={form.budget} onChange={e => setForm(f => ({...f, budget: e.target.value}))} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({...f, startDate: e.target.value}))} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(f => ({...f, endDate: e.target.value}))} className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/[0.04] transition-colors" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
                <button type="button" onClick={() => setStep(2)} disabled={!form.advertiserId || !form.name} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
                  Next: Select Restaurants
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-gray-400 mb-2">AI-matched restaurants for this campaign. Select any you want, or create the campaign without placements for now.</p>
              {recommendations.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {recommendations.map(rec => (
                    <label
                      key={rec.cafe.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedCafes.includes(rec.cafe.id) ? 'border-red-500 bg-red-500/10' : 'hover:bg-white/[0.02]'
                      }`}
                      style={selectedCafes.includes(rec.cafe.id) ? undefined : { borderColor: 'var(--color-border)' }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCafes.includes(rec.cafe.id)}
                          onChange={e => setSelectedCafes(prev => e.target.checked ? [...prev, rec.cafe.id] : prev.filter(id => id !== rec.cafe.id))}
                          className="rounded border-gray-600 text-red-600 focus:ring-red-500 bg-transparent"
                        />
                        <div>
                          <p className="font-medium text-sm text-white flex items-center gap-2">
                            {rec.cafe.name}
                            {rec.isMLEnhanced && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/10 text-purple-400">ML</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">{rec.cafe.suburb} · {rec.cafe.avgDailyOrders} daily orders</p>
                          {rec.mlScore !== null && rec.ruleBasedScore !== null && (
                            <p className="text-[11px] text-gray-500 mt-1">
                              ML {Math.round(rec.mlScore || 0)} | Rule {Math.round(rec.ruleBasedScore || 0)}
                            </p>
                          )}
                          {rec.mlScanRate !== null && rec.mlScanRate !== undefined && (
                            <p className="text-[11px] text-blue-400 mt-0.5">
                              Predicted {rec.mlScanRate.toFixed(1)} scans per 100 impressions
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-500">{rec.matchScore}%</p>
                        <p className="text-xs text-gray-600">{rec.matchReason}</p>
                        {rec.scoreBreakdown?.demographicScore != null && (
                          <p className="text-[11px] text-emerald-400 mt-0.5">Demo {Math.round(rec.scoreBreakdown.demographicScore)}%</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 py-6 text-center">No recommendations available. You can still create the campaign.</p>
              )}

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/[0.04] transition-colors" style={{ border: '1px solid var(--color-border)' }}>Back</button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setSelectedCafes([]);
                      void (async () => {
                        setSaving(true);
                        setError('');
                        try {
                          const payload: Record<string, unknown> = {
                            advertiserId: form.advertiserId,
                            name: form.name,
                            packagingType: form.packagingType,
                            adFormat: form.adFormat,
                            packagingQuantity: parseInt(form.packagingQuantity),
                            budget: form.budget ? parseFloat(form.budget) : undefined,
                            cafeIds: [],
                          };

                          if (form.startDate) payload.startDate = form.startDate;
                          if (form.endDate) payload.endDate = form.endDate;

                          await api.campaigns.create(payload);
                          onCreated();
                          onClose();
                        } catch (err: any) {
                          setError(err.message);
                        } finally {
                          setSaving(false);
                        }
                      })();
                    }}
                    className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/[0.04] disabled:opacity-50 transition-colors"
                    style={{ border: '1px solid var(--color-border)' }}
                  >
                    Create Without Cafes
                  </button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
                    {saving ? 'Creating...' : `Create Campaign${selectedCafes.length ? ` (${selectedCafes.length} restaurants)` : ''}`}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
