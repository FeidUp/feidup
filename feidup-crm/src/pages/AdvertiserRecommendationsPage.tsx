import { useState, useEffect } from 'react';
import { api } from '../api';
import type { AdvertiserPortalData, Recommendation } from '../api';
import { Sparkles, MapPin, Users, TrendingUp, Star } from 'lucide-react';

export function AdvertiserRecommendationsPage() {
  const [advertiser, setAdvertiser] = useState<AdvertiserPortalData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const advRes = await api.advertiserPortal.me();
        setAdvertiser(advRes.data);
        if (advRes.data.id) {
          const recRes = await api.recommendations.get(advRes.data.id);
          setRecommendations(recRes.data);
        }
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-8"><div className="animate-shimmer h-96 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} /></div>;
  }

  if (!advertiser) {
    return <div className="p-8 text-gray-500">No advertiser linked to your account.</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles size={24} className="text-yellow-500" /> Recommended Cafes
        </h1>
        <p className="text-gray-500 text-sm mt-1">AI-matched cafes based on your target audience and location preferences</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Sparkles className="mx-auto mb-3 text-gray-600" size={32} />
          <p className="text-gray-500">No recommendations available yet.</p>
          <p className="text-gray-600 text-sm mt-1">The matching engine needs more data to provide recommendations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, idx) => {
            const scoreColor = rec.matchScore >= 80 ? 'text-green-400 bg-green-500/10' :
                              rec.matchScore >= 60 ? 'text-yellow-400 bg-yellow-500/10' :
                              'text-gray-400 bg-gray-500/10';
            return (
              <div key={rec.cafe.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-gray-600 w-6">#{idx + 1}</span>
                      <h3 className="font-semibold text-lg text-white">{rec.cafe.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${scoreColor}`}>
                        {rec.matchScore}%
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm ml-9 mb-3 flex items-center gap-1">
                      <MapPin size={12} /> {rec.cafe.address}, {rec.cafe.suburb} {rec.cafe.postcode}
                    </p>
                    <p className="text-gray-500 text-sm ml-9 mb-3">{rec.matchReason}</p>

                    {/* Score breakdown */}
                    {rec.scoreBreakdown && (
                      <div className="ml-9 flex gap-4">
                        {Object.entries(rec.scoreBreakdown).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-1.5 text-xs">
                            <span className="text-gray-600 capitalize">{key}:</span>
                            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <div className="h-full bg-red-500 rounded-full" style={{ width: `${value}%` }} />
                            </div>
                            <span className="font-medium text-gray-400">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right text-sm space-y-1 ml-6">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Users size={12} /> {rec.cafe.avgDailyFootTraffic}/day traffic
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <TrendingUp size={12} /> {rec.cafe.packagingVolume} cups/day
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
