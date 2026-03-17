import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Lead, PipelineStage } from '../api';
import { Building2, UtensilsCrossed, DollarSign, ArrowUpRight } from 'lucide-react';

const stageLabels: Record<string, string> = {
  lead: 'New Lead',
  contacted: 'Contacted',
  negotiation: 'Negotiation',
  signed: 'Signed',
  active_client: 'Active Client',
  lost: 'Lost',
};

const stageHeaderColors: Record<string, string> = {
  lead: 'border-t-gray-400',
  contacted: 'border-t-blue-500',
  negotiation: 'border-t-yellow-500',
  signed: 'border-t-green-500',
  active_client: 'border-t-emerald-500',
  lost: 'border-t-red-500',
};

const priorityDots: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-gray-400',
};

export function PipelinePage() {
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [leads, setLeads] = useState<Record<string, Lead[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pipeRes, leadsRes] = await Promise.all([
          api.leads.pipeline(),
          api.leads.list({}),
        ]);
        setPipeline(pipeRes.data);
        const grouped: Record<string, Lead[]> = {};
        for (const lead of leadsRes.data) {
          if (!grouped[lead.stage]) grouped[lead.stage] = [];
          grouped[lead.stage].push(lead);
        }
        setLeads(grouped);
      } catch (err) {
        console.error('Failed to load pipeline:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stageOrder = ['lead', 'contacted', 'negotiation', 'signed', 'active_client', 'lost'];

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Pipeline</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stageOrder.map(s => (
            <div key={s} className="w-72 shrink-0 rounded-2xl p-4 animate-shimmer" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-5 rounded w-24 mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="space-y-3">
                <div className="h-20 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-20 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pipeline</h1>
        <p className="text-gray-500 text-sm mt-1">Kanban view of your sales pipeline</p>
      </div>

      {/* Summary bar */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
        {pipeline.map(p => (
          <div key={p.stage} className="glass-card rounded-lg px-4 py-2 text-sm shrink-0">
            <span className="text-gray-500 capitalize">{stageLabels[p.stage] || p.stage}</span>
            <span className="ml-2 font-semibold text-white">{p.count}</span>
            <span className="ml-1 text-gray-400">·</span>
            <span className="ml-1 text-green-400 font-medium">${(p.totalValue / 1000).toFixed(0)}k</span>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stageOrder.map(stage => {
          const stageLeads = leads[stage] || [];
          const stageData = pipeline.find(p => p.stage === stage);
          return (
            <div key={stage} className={`w-72 shrink-0 rounded-2xl border-t-4 ${stageHeaderColors[stage]}`} style={{ background: 'var(--color-bg-secondary)' }}>
              {/* Column Header */}
              <div className="p-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm capitalize text-white">{stageLabels[stage]}</h3>
                  <span className="text-xs text-gray-400 rounded-full px-2 py-0.5" style={{ background: 'rgba(255,255,255,0.04)' }}>{stageLeads.length}</span>
                </div>
                {stageData && (
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-0.5">
                    <DollarSign size={10} /> {stageData.totalValue.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                {stageLeads.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No leads</p>
                ) : (
                  stageLeads.map(lead => (
                    <Link
                      key={lead.id}
                      to={`/leads/${lead.id}`}
                      className="block glass-card rounded-2xl p-3 hover:bg-white/[0.02] transition-shadow group"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors flex items-center gap-1">
                          {lead.companyName}
                          <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${priorityDots[lead.priority]}`} title={lead.priority} />
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{lead.contactName}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          {lead.type === 'advertiser' ? <Building2 size={10} /> : <UtensilsCrossed size={10} />}
                          <span className="capitalize">{lead.type}</span>
                        </span>
                        {lead.estimatedValue != null && (
                          <span className="text-green-400 font-medium">${lead.estimatedValue.toLocaleString()}</span>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
