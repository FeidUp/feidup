import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { Lead, Activity } from '../api';
import { ArrowLeft, Building2, UtensilsCrossed, Clock, Mail, Phone, MapPin, DollarSign, MessageSquare, FileText, PhoneCall, Send } from 'lucide-react';

const stageColors: Record<string, string> = {
  lead: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  negotiation: 'bg-yellow-100 text-yellow-700',
  signed: 'bg-green-100 text-green-700',
  active_client: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-700',
};

const stages = ['lead', 'contacted', 'negotiation', 'signed', 'active_client', 'lost'];

const activityIcons: Record<string, typeof MessageSquare> = {
  note: FileText,
  call: PhoneCall,
  email: Mail,
  meeting: Clock,
};

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead & { activities?: Activity[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityForm, setActivityForm] = useState({ type: 'note', title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadLead = async () => {
    try {
      const res = await api.leads.get(id!);
      setLead(res.data);
    } catch (err) {
      console.error('Failed to load lead:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLead(); }, [id]);

  const updateStage = async (stage: string) => {
    if (!lead || lead.stage === stage) return;
    setUpdating(true);
    try {
      const res = await api.leads.update(lead.id, { stage });
      setLead(res.data);
      await loadLead();
    } catch (err) {
      console.error('Failed to update stage:', err);
    } finally {
      setUpdating(false);
    }
  };

  const addActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title.trim()) return;
    setSubmitting(true);
    try {
      await api.leads.addActivity(id!, activityForm);
      setActivityForm({ type: 'note', title: '', content: '' });
      await loadLead();
    } catch (err) {
      console.error('Failed to add activity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="h-40 bg-gray-100 rounded" /></div></div>;
  if (!lead) return <div className="p-8 text-center text-gray-400">Lead not found</div>;

  return (
    <div className="p-8">
      <button onClick={() => navigate('/leads')} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-4">
        <ArrowLeft size={14} /> Back to Leads
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {lead.type === 'advertiser' ? <Building2 size={20} className="text-blue-600" /> : <UtensilsCrossed size={20} className="text-orange-600" />}
            <h1 className="text-2xl font-bold">{lead.companyName}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${stageColors[lead.stage]}`}>
              {lead.stage.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-500 capitalize">{lead.type} lead via {lead.source}</p>
        </div>
      </div>

      {/* Stage Pipeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <p className="text-xs font-medium text-gray-500 mb-3">Pipeline Stage</p>
        <div className="flex gap-1">
          {stages.map(stage => {
            const active = stage === lead.stage;
            const passed = stages.indexOf(stage) < stages.indexOf(lead.stage);
            return (
              <button
                key={stage}
                disabled={updating}
                onClick={() => updateStage(stage)}
                className={`flex-1 py-2 px-2 rounded text-xs font-medium capitalize transition-colors
                  ${active ? 'bg-red-600 text-white' : passed ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                  disabled:opacity-50`}
              >
                {stage.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={14} className="text-gray-400" />
                <a href={`mailto:${lead.contactEmail}`} className="hover:text-red-600">{lead.contactEmail}</a>
              </div>
              {lead.contactPhone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  {lead.contactPhone}
                </div>
              )}
              {(lead.suburb || lead.city) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={14} className="text-gray-400" />
                  {[lead.suburb, lead.city].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Priority</span>
                <span className="capitalize font-medium">{lead.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Est. Value</span>
                <span className="font-medium flex items-center gap-1">
                  <DollarSign size={12} />
                  {lead.estimatedValue ? lead.estimatedValue.toLocaleString() : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned To</span>
                <span className="font-medium">
                  {lead.assignedTo ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}` : 'Unassigned'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {lead.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold mb-2">Notes</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Activity Timeline */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold mb-4">Activity Timeline</h3>

            {/* Add Activity Form */}
            <form onSubmit={addActivity} className="mb-6 bg-gray-50 rounded-lg p-4">
              <div className="flex gap-3 mb-3">
                <select
                  value={activityForm.type}
                  onChange={e => setActivityForm(f => ({ ...f, type: e.target.value }))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="note">Note</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                </select>
                <input
                  placeholder="Activity title..."
                  value={activityForm.title}
                  onChange={e => setActivityForm(f => ({ ...f, title: e.target.value }))}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <textarea
                  placeholder="Details (optional)..."
                  rows={2}
                  value={activityForm.content}
                  onChange={e => setActivityForm(f => ({ ...f, content: e.target.value }))}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting || !activityForm.title.trim()}
                  className="self-end px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  <Send size={14} /> Add
                </button>
              </div>
            </form>

            {/* Timeline */}
            <div className="space-y-4">
              {lead.activities && lead.activities.length > 0 ? (
                lead.activities.map(act => {
                  const Icon = activityIcons[act.type] || MessageSquare;
                  return (
                    <div key={act.id} className="flex gap-3">
                      <div className="mt-0.5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{act.title}</span>
                          <span className="text-xs text-gray-400 capitalize px-1.5 py-0.5 bg-gray-50 rounded">{act.type}</span>
                        </div>
                        {act.content && <p className="text-sm text-gray-600 mt-0.5">{act.content}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                          {act.user && `${act.user.firstName} ${act.user.lastName} · `}
                          {new Date(act.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">No activity yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
