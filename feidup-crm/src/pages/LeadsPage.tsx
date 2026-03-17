import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Lead } from '../api';
import { Plus, Search, Filter, ArrowUpRight, Building2, UtensilsCrossed } from 'lucide-react';

const stageColors: Record<string, string> = {
  lead: 'bg-gray-500/10 text-gray-400',
  contacted: 'bg-blue-500/10 text-blue-400',
  negotiation: 'bg-yellow-500/10 text-yellow-400',
  signed: 'bg-green-500/10 text-green-400',
  active_client: 'bg-emerald-500/10 text-emerald-400',
  lost: 'bg-red-500/10 text-red-400',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500/10 text-gray-400',
  medium: 'bg-blue-500/10 text-blue-400',
  high: 'bg-red-500/10 text-red-400',
};

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const loadLeads = async () => {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (stageFilter) params.stage = stageFilter;
      if (typeFilter) params.type = typeFilter;
      const res = await api.leads.list(params);
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLeads(); }, [stageFilter, typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadLeads();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your sales pipeline</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
          <Plus size={16} /> New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          />
        </form>
        <select
          value={stageFilter}
          onChange={e => setStageFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm text-white"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <option value="">All Stages</option>
          <option value="lead">Lead</option>
          <option value="contacted">Contacted</option>
          <option value="negotiation">Negotiation</option>
          <option value="signed">Signed</option>
          <option value="active_client">Active Client</option>
          <option value="lost">Lost</option>
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm text-white"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <option value="">All Types</option>
          <option value="advertiser">Advertiser</option>
          <option value="restaurant">Restaurant</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Company</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Contact</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Stage</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Priority</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Value</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Assigned</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-4 rounded animate-shimmer" style={{ background: 'rgba(255,255,255,0.04)' }} /></td></tr>
              ))
            ) : leads.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-600">No leads found</td></tr>
            ) : (
              leads.map(lead => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/leads/${lead.id}`} className="font-medium text-white hover:text-red-500 flex items-center gap-1">
                      {lead.companyName} <ArrowUpRight size={12} />
                    </Link>
                    {lead.suburb && <p className="text-xs text-gray-600">{lead.suburb}, {lead.city}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-300">{lead.contactName}</p>
                    <p className="text-xs text-gray-600">{lead.contactEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      {lead.type === 'advertiser' ? <Building2 size={12} /> : <UtensilsCrossed size={12} />}
                      <span className="capitalize">{lead.type}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${stageColors[lead.stage] || ''}`}>
                      {lead.stage.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[lead.priority] || ''}`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {lead.estimatedValue ? `$${lead.estimatedValue.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {lead.assignedTo ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(lead.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreate && <CreateLeadModal onClose={() => setShowCreate(false)} onCreated={loadLeads} />}
    </div>
  );
}

function CreateLeadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    companyName: '', contactName: '', contactEmail: '', contactPhone: '',
    type: 'advertiser', source: 'manual', priority: 'medium',
    estimatedValue: '', suburb: '', city: 'Brisbane', notes: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.leads.create({
        ...form,
        estimatedValue: form.estimatedValue ? parseFloat(form.estimatedValue) : undefined,
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
      <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
        <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-semibold text-white">New Lead</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Company Name *</label>
              <input required value={form.companyName} onChange={e => setForm(f => ({...f, companyName: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Contact Name *</label>
              <input required value={form.contactName} onChange={e => setForm(f => ({...f, contactName: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
              <input required type="email" value={form.contactEmail} onChange={e => setForm(f => ({...f, contactEmail: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input value={form.contactPhone} onChange={e => setForm(f => ({...f, contactPhone: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} className={selectClass} style={selectStyle}>
                <option value="advertiser">Advertiser</option>
                <option value="restaurant">Restaurant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Source</label>
              <select value={form.source} onChange={e => setForm(f => ({...f, source: e.target.value}))} className={selectClass} style={selectStyle}>
                <option value="manual">Manual</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="cold_outreach">Cold Outreach</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value}))} className={selectClass} style={selectStyle}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Est. Value ($)</label>
              <input type="number" value={form.estimatedValue} onChange={e => setForm(f => ({...f, estimatedValue: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Suburb</label>
              <input value={form.suburb} onChange={e => setForm(f => ({...f, suburb: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
              <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
            <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} className={`${inputClass} resize-none`} style={inputStyle} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/[0.04] transition-colors" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
              {saving ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
