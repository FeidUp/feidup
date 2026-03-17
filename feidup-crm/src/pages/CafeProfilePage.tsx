import { useState, useEffect } from 'react';
import { api } from '../api';
import type { CafePortalData } from '../api';
import { MapPin, Clock, Users, Coffee } from 'lucide-react';

export function CafeProfilePage() {
  const [cafe, setCafe] = useState<CafePortalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.cafePortal.me()
      .then(res => setCafe(res.data))
      .catch(err => console.error('Failed to load cafe profile:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8"><div className="animate-shimmer h-96 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} /></div>;
  }

  if (!cafe) {
    return <div className="p-8 text-gray-500">No cafe linked to your account.</div>;
  }

  let demographics = null;
  let operatingHours = null;
  let tags: string[] = [];
  try { demographics = cafe.demographics ? JSON.parse(cafe.demographics) : null; } catch {}
  try { operatingHours = cafe.operatingHours ? JSON.parse(cafe.operatingHours) : null; } catch {}
  try { tags = cafe.tags ? JSON.parse(cafe.tags) : []; } catch {}

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Cafe</h1>
        <p className="text-gray-500 text-sm mt-1">Your cafe details and profile</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Basic info */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Coffee size={16} className="text-red-500" /> Cafe Details</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-white">{cafe.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Address</dt>
              <dd className="font-medium text-white">{cafe.address}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Suburb</dt>
              <dd className="font-medium text-white">{cafe.suburb}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Postcode</dt>
              <dd className="font-medium text-white">{cafe.postcode}</dd>
            </div>
            {cafe.cuisineType && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Type</dt>
                <dd className="font-medium text-white capitalize">{cafe.cuisineType}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Partner Since</dt>
              <dd className="font-medium text-white">{new Date(cafe.partnerSince).toLocaleDateString('en-AU')}</dd>
            </div>
          </dl>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag: string) => (
                <span key={tag} className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full text-xs">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Users size={16} className="text-red-500" /> Traffic & Metrics</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Avg Daily Foot Traffic</dt>
              <dd className="font-medium text-white">{cafe.avgDailyFootTraffic.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Avg Daily Orders</dt>
              <dd className="font-medium text-white">{cafe.avgDailyOrders.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Packaging Volume</dt>
              <dd className="font-medium text-white">{cafe.packagingVolume.toLocaleString()}/day</dd>
            </div>
          </dl>
          {demographics && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="text-xs text-gray-500 mb-2">Customer Demographics</p>
              <dl className="space-y-1 text-sm">
                {demographics.primaryAge && <div className="flex justify-between"><dt className="text-gray-500">Age Range</dt><dd className="font-medium text-white">{demographics.primaryAge}</dd></div>}
                {demographics.income && <div className="flex justify-between"><dt className="text-gray-500">Income Level</dt><dd className="font-medium text-white capitalize">{demographics.income}</dd></div>}
                {demographics.type && <div className="flex justify-between"><dt className="text-gray-500">Customer Type</dt><dd className="font-medium text-white capitalize">{demographics.type.replace(/_/g, ' ')}</dd></div>}
              </dl>
            </div>
          )}
        </div>

        {/* Operating hours */}
        {operatingHours && (
          <div className="glass-card rounded-2xl p-6 col-span-2">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Clock size={16} className="text-red-500" /> Operating Hours</h3>
            <div className="grid grid-cols-7 gap-3">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                const hours = operatingHours[day];
                return (
                  <div key={day} className="text-center p-3 rounded-xl" style={{ background: 'var(--color-bg-secondary)' }}>
                    <p className="text-xs font-medium text-gray-500 capitalize mb-1">{day.slice(0, 3)}</p>
                    {hours ? (
                      <>
                        <p className="text-sm font-medium text-white">{hours.open}</p>
                        <p className="text-xs text-gray-600">to</p>
                        <p className="text-sm font-medium text-white">{hours.close}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">Closed</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
