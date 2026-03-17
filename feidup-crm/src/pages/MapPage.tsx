import { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import type { Restaurant, DiscoveredBusiness } from '../api';
import { BrisbaneMap, CafeMarkers, MapLegend } from '../components/Map/BrisbaneMap';
import type { CafeMarkerData } from '../components/Map/BrisbaneMap';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Coffee, Building2, Search, Check, ExternalLink, Globe, Phone } from 'lucide-react';

function getLat(c: Restaurant): number | undefined { return c.lat || c.location?.lat; }
function getLng(c: Restaurant): number | undefined { return c.lng || c.location?.lng; }

function parseDemographics(d: string | undefined): { rating?: number; reviewCount?: number; websiteUrl?: string; googleMapsUrl?: string; phone?: string } {
  if (!d) return {};
  try {
    const parsed = typeof d === 'string' ? JSON.parse(d) : d;
    return { rating: parsed.rating, reviewCount: parsed.reviewCount, websiteUrl: parsed.websiteUrl, googleMapsUrl: parsed.googleMapsUrl, phone: parsed.phone };
  } catch { return {}; }
}

// Advertiser marker icon
function createAdvIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:${color};border:2px solid rgba(255,255,255,0.9);border-radius:3px;box-shadow:0 0 8px ${color}80;transform:rotate(45deg);cursor:pointer;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

const ADV_ICONS: Record<string, L.DivIcon> = {
  fitness: createAdvIcon('#22c55e'),
  health: createAdvIcon('#3b82f6'),
  real_estate: createAdvIcon('#f59e0b'),
  beauty: createAdvIcon('#ec4899'),
  education: createAdvIcon('#8b5cf6'),
  retail: createAdvIcon('#f97316'),
  professional_services: createAdvIcon('#6366f1'),
  automotive: createAdvIcon('#64748b'),
  other: createAdvIcon('#a855f7'),
};

type MapTab = 'venues' | 'advertisers';

export function MapPage() {
  const [tab, setTab] = useState<MapTab>('venues');
  // Venues state
  const [cafes, setCafes] = useState<Restaurant[]>([]);
  const [loadingCafes, setLoadingCafes] = useState(true);
  const [search, setSearch] = useState('');
  const [addedToLeads, setAddedToLeads] = useState<Set<string>>(new Set());
  // Advertisers state
  const [advSearch, setAdvSearch] = useState('');
  const [discoveredAdvs, setDiscoveredAdvs] = useState<DiscoveredBusiness[]>([]);
  const [searchingAdvs, setSearchingAdvs] = useState(false);
  const [advAddedToLeads, setAdvAddedToLeads] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.restaurants.list()
      .then(res => setCafes(res.data))
      .catch(err => console.error('Failed to load:', err))
      .finally(() => setLoadingCafes(false));
  }, []);

  const cafeMarkers: CafeMarkerData[] = useMemo(() =>
    cafes
      .filter(c => getLat(c) && getLng(c))
      .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.suburb.toLowerCase().includes(search.toLowerCase()))
      .map(c => {
        const demo = parseDemographics(c.demographics);
        return {
          id: c.id, name: c.name, lat: getLat(c)!, lng: getLng(c)!,
          suburb: c.suburb, postcode: c.postcode, address: c.address,
          avgDailyFootTraffic: c.avgDailyFootTraffic, packagingVolume: c.packagingVolume,
          isActive: c.isActive, cuisineType: c.cuisineType,
          rating: demo.rating, reviewCount: demo.reviewCount,
          websiteUrl: demo.websiteUrl, phone: demo.phone,
        };
      }),
    [cafes, search]
  );

  const activeCount = cafes.filter(c => c.isActive).length;
  const prospectCount = cafes.length - activeCount;
  const suburbs = useMemo(() => [...new Set(cafes.map(c => c.suburb))].sort(), [cafes]);

  const handleAddCafeToLeads = async (cafe: CafeMarkerData) => {
    if (addedToLeads.has(cafe.id)) return;
    try {
      await api.leads.create({
        companyName: cafe.name, contactName: `Manager at ${cafe.name}`, contactEmail: '',
        type: 'restaurant', source: 'manual', stage: 'lead',
        priority: cafe.avgDailyFootTraffic >= 400 ? 'high' : 'medium',
        suburb: cafe.suburb, city: 'Brisbane',
        notes: `Discovered via map. ${cafe.rating ? `Rating: ${cafe.rating}★` : ''} ${cafe.reviewCount ? `(${cafe.reviewCount} reviews)` : ''} Traffic: ${cafe.avgDailyFootTraffic}/day.`,
      });
      setAddedToLeads(prev => new Set([...prev, cafe.id]));
    } catch (err) { console.error('Failed to create lead:', err); }
  };

  const handleSearchAdvertisers = async () => {
    if (!advSearch.trim()) return;
    setSearchingAdvs(true);
    try {
      const res = await api.enrichment.searchAdvertisers(advSearch);
      setDiscoveredAdvs(res.data.businesses);
    } catch (err) { console.error('Search failed:', err); }
    finally { setSearchingAdvs(false); }
  };

  const handleAddAdvToLeads = async (biz: DiscoveredBusiness) => {
    if (advAddedToLeads.has(biz.googlePlaceId)) return;
    try {
      await api.leads.create({
        companyName: biz.name, contactName: `Owner at ${biz.name}`, contactEmail: '',
        contactPhone: biz.phone, type: 'advertiser', source: 'manual', stage: 'lead',
        priority: (biz.rating || 0) >= 4.5 ? 'high' : 'medium',
        suburb: biz.suburb, city: 'Brisbane',
        notes: `Potential advertiser (${biz.businessType}). ${biz.rating ? `Rating: ${biz.rating}★` : ''} ${biz.reviewCount ? `(${biz.reviewCount} reviews)` : ''} ${biz.websiteUrl ? `Website: ${biz.websiteUrl}` : ''}`,
      });
      setAdvAddedToLeads(prev => new Set([...prev, biz.googlePlaceId]));
    } catch (err) { console.error('Failed:', err); }
  };

  if (loadingCafes) {
    return <div className="p-8"><div className="h-[600px] rounded-2xl animate-shimmer" /></div>;
  }

  return (
    <div className="p-8">
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <MapPin size={22} className="text-red-500" /> Map View
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {tab === 'venues' ? `${cafes.length.toLocaleString()} cafes across ${suburbs.length} suburbs` : `Search for potential advertisers`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab toggle */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <button onClick={() => setTab('venues')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'venues' ? 'bg-red-600 text-white' : ''}`}
              style={tab !== 'venues' ? { color: 'var(--text-secondary)' } : {}}>
              <Coffee size={14} /> Venues
            </button>
            <button onClick={() => setTab('advertisers')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'advertisers' ? 'bg-red-600 text-white' : ''}`}
              style={tab !== 'advertisers' ? { color: 'var(--text-secondary)' } : {}}>
              <Building2 size={14} /> Advertisers
            </button>
          </div>

          {/* Search */}
          {tab === 'venues' && (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search cafes or suburbs..."
                className="pl-8 pr-4 py-2 rounded-xl text-sm outline-none w-56"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
            </div>
          )}
          {tab === 'advertisers' && (
            <form onSubmit={e => { e.preventDefault(); handleSearchAdvertisers(); }} className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={advSearch} onChange={e => setAdvSearch(e.target.value)}
                  placeholder="e.g. padel brisbane, dentist, gym..."
                  className="pl-8 pr-4 py-2 rounded-xl text-sm outline-none w-72"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
              </div>
              <button type="submit" disabled={searchingAdvs}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 disabled:opacity-50 transition-colors">
                {searchingAdvs ? 'Searching...' : 'Discover'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="relative animate-fade-in animate-fade-in-delay-1">
        <BrisbaneMap height="600px">
          {tab === 'venues' && (
            <CafeMarkers cafes={cafeMarkers} onAddToLeads={handleAddCafeToLeads} />
          )}

          {tab === 'advertisers' && discoveredAdvs.map(biz => (
            <Marker key={biz.googlePlaceId} position={[biz.lat, biz.lng]}
              icon={ADV_ICONS[biz.industry] || ADV_ICONS.other}>
              <Popup maxWidth={320} minWidth={260}>
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, margin: 0, color: '#111' }}>{biz.name}</h3>
                    {biz.rating && (
                      <span style={{ background: '#fbbf24', color: '#111', padding: '2px 6px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                        ★ {biz.rating}
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 4px' }}>{biz.address}</p>
                  <span style={{ display: 'inline-block', marginBottom: 8, padding: '2px 8px', background: '#eff6ff', borderRadius: 10, fontSize: 10, color: '#3b82f6', fontWeight: 600 }}>
                    {biz.businessType}
                  </span>

                  {biz.reviewCount && <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>{biz.reviewCount.toLocaleString()} reviews</p>}

                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    {biz.websiteUrl && (
                      <a href={biz.websiteUrl} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, color: '#3b82f6', textDecoration: 'none', padding: '3px 8px', background: '#eff6ff', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                        🌐 Website
                      </a>
                    )}
                    {biz.googleMapsUrl && (
                      <a href={biz.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, color: '#ef4444', textDecoration: 'none', padding: '3px 8px', background: '#fef2f2', borderRadius: 6 }}>
                        📍 Google Maps
                      </a>
                    )}
                    {biz.phone && (
                      <a href={`tel:${biz.phone}`}
                        style={{ fontSize: 11, color: '#22c55e', textDecoration: 'none', padding: '3px 8px', background: '#f0fdf4', borderRadius: 6 }}>
                        📞 {biz.phone}
                      </a>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 8 }}>
                    {advAddedToLeads.has(biz.googlePlaceId) ? (
                      <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>✓ Added to Leads</span>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleAddAdvToLeads(biz); }}
                        style={{ width: '100%', padding: '6px 0', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        + Add to Leads as Advertiser
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </BrisbaneMap>

        {/* Legend */}
        {tab === 'venues' && (
          <MapLegend items={[
            { color: '#dc2626', label: `High traffic (500+)` },
            { color: '#22c55e', label: `Partners (${activeCount})` },
            { color: '#f59e0b', label: `Prospects (${prospectCount})` },
          ]} />
        )}
        {tab === 'advertisers' && discoveredAdvs.length > 0 && (
          <MapLegend items={[
            ...Object.entries(
              discoveredAdvs.reduce<Record<string, number>>((acc, b) => { acc[b.businessType] = (acc[b.businessType] || 0) + 1; return acc; }, {})
            ).map(([type, count]) => ({
              color: ADV_ICONS[discoveredAdvs.find(b => b.businessType === type)?.industry || 'other']
                ? ({'fitness':'#22c55e','health':'#3b82f6','real_estate':'#f59e0b','beauty':'#ec4899','education':'#8b5cf6'}[discoveredAdvs.find(b => b.businessType === type)?.industry || ''] || '#a855f7')
                : '#a855f7',
              label: `${type} (${count})`,
            })),
          ]} />
        )}

        {/* Toast */}
        {(addedToLeads.size > 0 || advAddedToLeads.size > 0) && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] glass-card rounded-xl px-4 py-2 flex items-center gap-2 animate-fade-in">
            <Check size={14} className="text-green-500" />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {addedToLeads.size + advAddedToLeads.size} added to leads pipeline
            </span>
          </div>
        )}
      </div>

      {/* Stats row */}
      {tab === 'venues' && (
        <div className="grid grid-cols-5 gap-4 mt-6 animate-fade-in animate-fade-in-delay-2">
          <StatBox label="Total Cafes" value={cafes.length.toLocaleString()} />
          <StatBox label="Suburbs" value={String(suburbs.length)} />
          <StatBox label="Partners" value={String(activeCount)} className="text-green-500" />
          <StatBox label="Prospects" value={String(prospectCount)} className="text-amber-500" />
          <StatBox label="Daily Traffic" value={cafes.reduce((s, c) => s + c.avgDailyFootTraffic, 0).toLocaleString()} />
        </div>
      )}
      {tab === 'advertisers' && (
        <div className="mt-6">
          {discoveredAdvs.length > 0 ? (
            <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
              <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {discoveredAdvs.length} potential advertisers found for "{advSearch}"
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {discoveredAdvs.map(biz => (
                  <div key={biz.googlePlaceId} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: '1px solid var(--divider)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{biz.name}</p>
                        {biz.rating && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">★ {biz.rating}</span>}
                      </div>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{biz.address}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      {biz.websiteUrl && (
                        <a href={biz.websiteUrl} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Website">
                          <Globe size={14} className="text-blue-400" />
                        </a>
                      )}
                      {biz.googleMapsUrl && (
                        <a href={biz.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Google Maps">
                          <ExternalLink size={14} className="text-red-400" />
                        </a>
                      )}
                      {biz.phone && (
                        <a href={`tel:${biz.phone}`}
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title={biz.phone}>
                          <Phone size={14} className="text-green-400" />
                        </a>
                      )}
                      {advAddedToLeads.has(biz.googlePlaceId) ? (
                        <span className="text-xs text-green-500 font-medium px-2">Added</span>
                      ) : (
                        <button onClick={() => handleAddAdvToLeads(biz)}
                          className="text-xs bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500 transition-colors font-medium">
                          + Lead
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
              <Building2 size={32} className="mx-auto mb-3 text-gray-600" />
              <p style={{ color: 'var(--text-secondary)' }}>Search for potential advertisers</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Try "padel brisbane", "dentist gold coast", "gym sunshine coast", "real estate logan"
              </p>
            </div>
          )}
        </div>
      )}

      {search && tab === 'venues' && (
        <p className="text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
          Showing {cafeMarkers.length.toLocaleString()} of {cafes.length.toLocaleString()} matching "{search}"
        </p>
      )}
    </div>
  );
}

function StatBox({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className="glass-card rounded-2xl p-4 text-center">
      <p className={`text-2xl font-bold ${className}`} style={!className ? { color: 'var(--text-primary)' } : {}}>{value}</p>
      <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{label}</p>
    </div>
  );
}
