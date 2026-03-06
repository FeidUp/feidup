import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import type { AnalyticsOverview, PipelineStage } from '../api';
import { Building2, UtensilsCrossed, Megaphone, Target, TrendingUp, Eye } from 'lucide-react';

export function DashboardPage() {
  const { user, isInternal } = useAuth();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (isInternal) {
          const [overviewRes, pipelineRes] = await Promise.all([
            api.analytics.overview(),
            api.leads.pipeline(),
          ]);
          setOverview(overviewRes.data);
          setPipeline(pipelineRes.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isInternal]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}</h1>
        <p className="text-gray-500 mt-1">Here's what's happening across FeidUp today.</p>
      </div>

      {isInternal && overview && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
            <StatCard icon={Building2} label="Advertisers" value={overview.advertisers.total} sub={`${overview.advertisers.active} active`} color="blue" />
            <StatCard icon={UtensilsCrossed} label="Restaurants" value={overview.restaurants.total} sub={`${overview.restaurants.active} active`} color="green" />
            <StatCard icon={Megaphone} label="Campaigns" value={overview.campaigns.total} sub={`${overview.campaigns.active} active`} color="purple" />
            <StatCard icon={Target} label="Open Leads" value={overview.leads.open} sub={`${overview.leads.total} total`} color="orange" />
            <StatCard icon={Eye} label="Impressions" value={overview.totalImpressions} sub="all time" color="red" />
          </div>

          {/* Pipeline overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Sales Pipeline</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {pipeline.map(stage => (
                <div key={stage.stage} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stage.count}</p>
                  <p className="text-sm text-gray-500 capitalize mt-1">{stage.stage.replace('_', ' ')}</p>
                  {stage.totalValue > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-1">${stage.totalValue.toLocaleString()}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'New Lead', href: '/leads', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { label: 'Add Advertiser', href: '/advertisers', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                { label: 'Add Restaurant', href: '/restaurants', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                { label: 'View Analytics', href: '/analytics', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              ].map(action => (
                <a key={action.label} href={action.href} className={`px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors ${action.color}`}>
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {!isInternal && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Welcome to FeidUp</h2>
          <p className="text-gray-500">Navigate using the sidebar to view your campaigns and analytics.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: number; sub: string; color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
