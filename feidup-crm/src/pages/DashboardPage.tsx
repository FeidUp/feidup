import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import type { AnalyticsOverview, PipelineStage } from '../api';
import { Building2, UtensilsCrossed, Megaphone, Target, Eye, ArrowUpRight, TrendingUp } from 'lucide-react';
import { CafeDashboardPage } from './CafeDashboardPage';
import { AdvertiserDashboardPage } from './AdvertiserDashboardPage';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../components/Motion';

// Wrapper to avoid conditional hooks
function InternalDashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      const [overviewRes, pipelineRes] = await Promise.allSettled([
        api.analytics.overview(),
        api.leads.pipeline(),
      ]);

      if (!mounted) return;

      if (overviewRes.status === 'fulfilled') {
        setOverview(overviewRes.value.data);
      }

      if (pipelineRes.status === 'fulfilled') {
        setPipeline(pipelineRes.value.data);
      }

      if (overviewRes.status === 'rejected' && pipelineRes.status === 'rejected') {
        console.warn('Dashboard endpoints temporarily unavailable');
      }

      setLoading(false);
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-6">
          <div className="h-8 rounded w-48 animate-shimmer" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-28 rounded-2xl animate-shimmer" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="p-8">
      <FadeIn>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome back, {user?.firstName}</h1>
        <p className="text-sm mt-1 mb-8" style={{ color: 'var(--text-secondary)' }}>Here's what's happening across FeidUp today.</p>
      </FadeIn>

      {overview && (
        <>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StaggerItem><StatCard icon={Building2} label="Advertisers" value={overview.advertisers.total} sub={`${overview.advertisers.active} active`} color="blue" delay={0} /></StaggerItem>
            <StaggerItem><StatCard icon={UtensilsCrossed} label="Restaurants" value={overview.restaurants.total} sub={`${overview.restaurants.active} active`} color="green" delay={1} /></StaggerItem>
            <StaggerItem><StatCard icon={Megaphone} label="Campaigns" value={overview.campaigns.total} sub={`${overview.campaigns.active} active`} color="purple" delay={2} /></StaggerItem>
            <StaggerItem><StatCard icon={Target} label="Open Leads" value={overview.leads.open} sub={`${overview.leads.total} total`} color="orange" delay={3} /></StaggerItem>
            <StaggerItem><StatCard icon={Eye} label="Impressions" value={overview.totalImpressions} sub="all time" color="red" delay={4} /></StaggerItem>
          </StaggerContainer>

          <FadeIn delay={0.3} className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>Sales Pipeline</h2>
              <Link to="/pipeline" className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {pipeline.map(stage => (
                <div key={stage.stage} className="text-center p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stage.count}</p>
                  <p className="text-[11px] capitalize mt-1" style={{ color: 'var(--text-secondary)' }}>{stage.stage.replace('_', ' ')}</p>
                  {stage.totalValue > 0 && (
                    <p className="text-[11px] text-green-500 font-medium mt-1">${stage.totalValue.toLocaleString()}</p>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.4} className="glass-card rounded-2xl p-6">
            <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
            <StaggerContainer staggerDelay={0.06} className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'New Lead', to: '/leads', icon: Target, color: 'from-blue-600/10 to-blue-600/5 text-blue-400 hover:border-blue-500/20' },
                { label: 'Add Advertiser', to: '/advertisers', icon: Building2, color: 'from-green-600/10 to-green-600/5 text-green-400 hover:border-green-500/20' },
                { label: 'Add Restaurant', to: '/restaurants', icon: UtensilsCrossed, color: 'from-purple-600/10 to-purple-600/5 text-purple-400 hover:border-purple-500/20' },
                { label: 'View Analytics', to: '/analytics', icon: TrendingUp, color: 'from-red-600/10 to-red-600/5 text-red-400 hover:border-red-500/20' },
              ].map(action => (
                <StaggerItem key={action.label}>
                  <HoverCard>
                    <Link to={action.to}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium border border-transparent bg-gradient-to-br transition-all duration-200 ${action.color}`}>
                      <action.icon size={16} />
                      {action.label}
                    </Link>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>
        </>
      )}
    </PageTransition>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === 'restaurant') return <CafeDashboardPage />;
  if (user?.role === 'advertiser') return <AdvertiserDashboardPage />;
  return <InternalDashboard />;
}

function StatCard({ icon: Icon, label, value, sub, color, delay }: {
  icon: any; label: string; value: number; sub: string; color: string; delay: number;
}) {
  const iconColors: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
    red: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className={`glass-card rounded-2xl p-5 animate-fade-in animate-fade-in-delay-${delay}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <div className={`p-2 rounded-lg ${iconColors[color]}`}><Icon size={16} /></div>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value.toLocaleString()}</p>
      <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>
    </div>
  );
}
