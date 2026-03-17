import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../api';
import type { Restaurant, DiscoveredBusiness } from '../api';
import { BrisbaneMap, CafeMarkers, MapLegend } from '../components/Map/BrisbaneMap';
import type { CafeMarkerData } from '../components/Map/BrisbaneMap';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Coffee, Building2, Search, Check, Globe, Phone, ExternalLink, Plus, X, Zap, Loader2 } from 'lucide-react';

function getLat(c: Restaurant): number | undefined { return c.lat || c.location?.lat; }
function getLng(c: Restaurant): number | undefined { return c.lng || c.location?.lng; }

function parseDemographics(d: string | undefined): { rating?: number; reviewCount?: number; websiteUrl?: string; phone?: string } {
  if (!d) return {};
  try {
    const parsed = typeof d === 'string' ? JSON.parse(d) : d;
    return { rating: parsed.rating, reviewCount: parsed.reviewCount, websiteUrl: parsed.websiteUrl, phone: parsed.phone };
  } catch { return {}; }
}

function createAdvIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:${color};border:2px solid rgba(255,255,255,0.9);border-radius:3px;box-shadow:0 0 8px ${color}80;transform:rotate(45deg);cursor:pointer;"></div>`,
    iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -10],
  });
}

// Pre-built category pills
const CATEGORIES = [
  { id: 'fitness', label: 'Gyms & Fitness', icon: '💪', color: '#22c55e' },
  { id: 'barbers', label: 'Barbers', icon: '💈', color: '#f97316' },
  { id: 'health_dental', label: 'Dentists', icon: '🦷', color: '#3b82f6' },
  { id: 'real_estate', label: 'Real Estate', icon: '🏠', color: '#f59e0b' },
  { id: 'beauty', label: 'Beauty & Hair', icon: '💇', color: '#ec4899' },
  { id: 'education', label: 'Schools', icon: '🎓', color: '#8b5cf6' },
  { id: 'sports', label: 'Sports', icon: '🏸', color: '#06b6d4' },
  { id: 'vets', label: 'Vets', icon: '🐾', color: '#84cc16' },
  { id: 'health', label: 'Health', icon: '⚕️', color: '#14b8a6' },
  { id: 'trades', label: 'Trades', icon: '🔧', color: '#64748b' },
  { id: 'professional_services', label: 'Professional', icon: '⚖️', color: '#6366f1' },
  { id: 'pharmacy', label: 'Pharmacies', icon: '💊', color: '#ef4444' },
  { id: 'automotive', label: 'Auto', icon: '🚗', color: '#78716c' },
  { id: 'pets', label: 'Pets', icon: '🐶', color: '#a3e635' },
  { id: 'childcare', label: 'Childcare', icon: '👶', color: '#fb923c' },
];

const ADV_ICON_DEFAULT = createAdvIcon('#a855f7');

type MapTab = 'venues' | 'advertisers';

interface PillState {
  id: string;
  label: string;
  icon: string;
  color: string;
  isCustom?: boolean;
  loading: boolean;
  active: boolean;
  results: DiscoveredBusiness[];
  count: number;
}

export function MapPage() {
  const [tab, setTab] = useState<MapTab>('venues');
  // Venues
  const [cafes, setCafes] = useState<Restaurant[]>([]);
  const [loadingCafes, setLoadingCafes] = useState(true);
  const [venueSearch, setVenueSearch] = useState('');
  const [addedToLeads, setAddedToLeads] = useState<Set<string>>(new Set());
  // Advertisers — pill system
  const [pills, setPills] = useState<PillState[]>(
    CATEGORIES.map(c => ({ ...c, loading: false, active: false, results: [], count: 0 }))
  );
  const [customInput, setCustomInput] = useState('');
  const [advAddedToLeads, setAdvAddedToLeads] = useState<Set<string>>(new Set());
  const [discoveringAll, setDiscoveringAll] = useState(false);

  useEffect(() => {
    api.restaurants.list()
      .then(res => setCafes(res.data))
      .catch(err => console.error('Failed to load:', err))
      .finally(() => setLoadingCafes(false));
  }, []);

  // All advertiser results across active pills
  const allAdvResults = useMemo(() =>
    pills.filter(p => p.active && p.results.length > 0).flatMap(p => p.results),
    [pills]
  );

  const cafeMarkers: CafeMarkerData[] = useMemo(() =>
    cafes
      .filter(c => getLat(c) && getLng(c))
      .filter(c => !venueSearch || c.name.toLowerCase().includes(venueSearch.toLowerCase()) || c.suburb.toLowerCase().includes(venueSearch.toLowerCase()))
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
    [cafes, venueSearch]
  );

  const activeCount = cafes.filter(c => c.isActive).length;
  const prospectCount = cafes.length - activeCount;
  const suburbs = useMemo(() => [...new Set(cafes.map(c => c.suburb))].sort(), [cafes]);

  // Toggle a pill — discover or deactivate
  const togglePill = useCallback(async (pillId: string) => {
    setPills(prev => prev.map(p => {
      if (p.id !== pillId) return p;
      if (p.active) return { ...p, active: false }; // deactivate
      if (p.results.length > 0) return { ...p, active: true }; // re-activate cached
      return { ...p, active: true, loading: true }; // need to fetch
    }));

    const pill = pills.find(p => p.id === pillId);
    if (!pill || pill.active || pill.results.length > 0) return;

    try {
      let results: DiscoveredBusiness[];
      if (pill.isCustom) {
        const res = await api.enrichment.searchAdvertisers(pill.label);
        results = res.data.businesses;
      } else {
        const res = await api.enrichment.discoverAdvertisersNear(-27.4698, 153.0251, [pill.id]);
        results = res.data.businesses;
      }
      setPills(prev => prev.map(p =>
        p.id === pillId ? { ...p, loading: false, results, count: results.length } : p
      ));
    } catch (err) {
      console.error('Discovery failed:', err);
      setPills(prev => prev.map(p =>
        p.id === pillId ? { ...p, loading: false } : p
      ));
    }
  }, [pills]);

  // Add custom pill
  const addCustomPill = () => {
    const label = customInput.trim();
    if (!label) return;
    const id = `custom_${label.toLowerCase().replace(/\s+/g, '_')}`;
    if (pills.find(p => p.id === id)) return;

    const newPill: PillState = {
      id, label, icon: '🔍', color: '#a855f7',
      isCustom: true, loading: false, active: false, results: [], count: 0,
    };
    setPills(prev => [...prev, newPill]);
    setCustomInput('');
    // Auto-discover
    setTimeout(() => togglePill(id), 100);
  };

  // Remove custom pill
  const removeCustomPill = (pillId: string) => {
    setPills(prev => prev.filter(p => p.id !== pillId));
  };

  // Discover all
  const discoverAll = async () => {
    setDiscoveringAll(true);
    const inactive = pills.filter(p => !p.active && !p.isCustom);
    for (const pill of inactive) {
      await togglePill(pill.id);
      await new Promise(r => setTimeout(r, 300));
    }
    setDiscoveringAll(false);
  };

  // Add to leads handlers
  const handleAddCafeToLeads = async (cafe: CafeMarkerData) => {
    if (addedToLeads.has(cafe.id)) return;
    try {
      await api.leads.create({
        companyName: cafe.name, contactName: `Manager at ${cafe.name}`, contactEmail: '',
        type: 'restaurant', source: 'manual', stage: 'lead',
        priority: cafe.avgDailyFootTraffic >= 400 ? 'high' : 'medium',
        suburb: cafe.suburb, city: 'Brisbane',
        notes: `Discovered via map. ${cafe.rating ? `Rating: ${cafe.rating}★` : ''} Traffic: ${cafe.avgDailyFootTraffic}/day.`,
      });
      setAddedToLeads(prev => new Set([...prev, cafe.id]));
    } catch (err) { console.error('Failed:', err); }
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

  const activePills = pills.filter(p => p.active);
  const totalAdvResults = allAdvResults.length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <MapPin size={22} className="text-red-500" /> Map View
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {tab === 'venues' ? `${cafes.length.toLocaleString()} cafes across ${suburbs.length} suburbs` : `${totalAdvResults} potential advertisers found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          {tab === 'venues' && (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={venueSearch} onChange={e => setVenueSearch(e.target.value)}
                placeholder="Search cafes..."
                className="pl-8 pr-4 py-2 rounded-xl text-sm outline-none w-56"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
            </div>
          )}
        </div>
      </div>

      {/* Advertiser Pills */}
      {tab === 'advertisers' && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {/* Discover All button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={discoverAll}
              disabled={discoveringAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 transition-colors shadow-lg shadow-red-600/20"
            >
              {discoveringAll ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              Discover All
            </motion.button>

            {/* Category pills */}
            {pills.map(pill => (
              <motion.button
                key={pill.id}
                layout
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => togglePill(pill.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  pill.active
                    ? 'text-white shadow-md'
                    : 'hover:border-white/20'
                }`}
                style={{
                  background: pill.active ? pill.color : 'var(--glass-bg)',
                  border: `1px solid ${pill.active ? pill.color : 'var(--glass-border)'}`,
                  color: pill.active ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {pill.loading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <span>{pill.icon}</span>
                )}
                {pill.label}
                {pill.count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: pill.active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    {pill.count}
                  </motion.span>
                )}
                {pill.isCustom && (
                  <span
                    onClick={e => { e.stopPropagation(); removeCustomPill(pill.id); }}
                    className="ml-0.5 hover:text-red-400 cursor-pointer"
                  >
                    <X size={10} />
                  </span>
                )}
              </motion.button>
            ))}

            {/* Custom pill input */}
            <form onSubmit={e => { e.preventDefault(); addCustomPill(); }} className="flex items-center gap-1">
              <input
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="Add custom..."
                className="px-3 py-1.5 rounded-full text-xs outline-none w-28"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
              />
              {customInput.trim() && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  type="submit"
                  className="p-1 rounded-full bg-red-600 text-white"
                >
                  <Plus size={12} />
                </motion.button>
              )}
            </form>
          </div>

          {/* Active pill summary */}
          {activePills.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {activePills.length} filter{activePills.length > 1 ? 's' : ''} active — {totalAdvResults} businesses on map
            </motion.p>
          )}
        </div>
      )}

      {/* Map */}
      <div className="relative">
        <BrisbaneMap height="550px">
          {tab === 'venues' && (
            <CafeMarkers cafes={cafeMarkers} onAddToLeads={handleAddCafeToLeads} />
          )}
          {tab === 'advertisers' && allAdvResults.map(biz => (
            <Marker key={biz.googlePlaceId} position={[biz.lat, biz.lng]}
              icon={ADV_ICON_DEFAULT}>
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
                    {biz.websiteUrl && <a href={biz.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#3b82f6', textDecoration: 'none', padding: '3px 8px', background: '#eff6ff', borderRadius: 6 }}>🌐 Website</a>}
                    {biz.googleMapsUrl && <a href={biz.googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#ef4444', textDecoration: 'none', padding: '3px 8px', background: '#fef2f2', borderRadius: 6 }}>📍 Maps</a>}
                    {biz.phone && <a href={`tel:${biz.phone}`} style={{ fontSize: 11, color: '#22c55e', textDecoration: 'none', padding: '3px 8px', background: '#f0fdf4', borderRadius: 6 }}>📞 {biz.phone}</a>}
                  </div>
                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 8 }}>
                    {advAddedToLeads.has(biz.googlePlaceId) ? (
                      <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>✓ Added to Leads</span>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleAddAdvToLeads(biz); }}
                        style={{ width: '100%', padding: '6px 0', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        + Add to Leads
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

        {/* Toast */}
        <AnimatePresence>
          {(addedToLeads.size > 0 || advAddedToLeads.size > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] glass-card rounded-xl px-4 py-2 flex items-center gap-2"
            >
              <Check size={14} className="text-green-500" />
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {addedToLeads.size + advAddedToLeads.size} added to leads
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats / Results below map */}
      {tab === 'venues' && (
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label: 'Total Cafes', value: cafes.length.toLocaleString() },
            { label: 'Suburbs', value: String(suburbs.length) },
            { label: 'Partners', value: String(activeCount), cls: 'text-green-500' },
            { label: 'Prospects', value: String(prospectCount), cls: 'text-amber-500' },
            { label: 'Daily Traffic', value: cafes.reduce((s, c) => s + c.avgDailyFootTraffic, 0).toLocaleString() },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.cls || ''}`} style={!s.cls ? { color: 'var(--text-primary)' } : {}}>{s.value}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'advertisers' && totalAdvResults > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden mt-6">
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {totalAdvResults} potential advertisers
            </span>
            <div className="flex gap-1">
              {activePills.map(p => (
                <span key={p.id} className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white" style={{ background: p.color }}>
                  {p.label} ({p.count})
                </span>
              ))}
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {allAdvResults.map(biz => (
              <div key={biz.googlePlaceId} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                style={{ borderBottom: '1px solid var(--divider)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{biz.name}</p>
                    {biz.rating && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">★ {biz.rating}</span>}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{biz.businessType}</span>
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{biz.address}</p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  {biz.websiteUrl && <a href={biz.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/5" title="Website"><Globe size={14} className="text-blue-400" /></a>}
                  {biz.googleMapsUrl && <a href={biz.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/5" title="Google Maps"><ExternalLink size={14} className="text-red-400" /></a>}
                  {biz.phone && <a href={`tel:${biz.phone}`} className="p-1.5 rounded-lg hover:bg-white/5" title={biz.phone}><Phone size={14} className="text-green-400" /></a>}
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
      )}

      {tab === 'advertisers' && totalAdvResults === 0 && activePills.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center mt-6">
          <Building2 size={32} className="mx-auto mb-3 text-gray-600" />
          <p style={{ color: 'var(--text-secondary)' }}>Click a category pill to discover businesses</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Or hit "Discover All" to find every type at once
          </p>
        </div>
      )}
    </div>
  );
}
