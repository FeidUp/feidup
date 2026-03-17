import { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import type { Restaurant } from '../api';
import { Plus, Search, UtensilsCrossed, MapPin, Users, Package, TrendingUp, Trash2, X } from 'lucide-react';

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [suburbFilter, setSuburbFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadRestaurants = async () => {
    try {
      const res = await api.restaurants.list();
      setRestaurants(res.data);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRestaurants(); }, []);

  const suburbs = useMemo(() => {
    const set = new Set(restaurants.map(r => r.suburb));
    return Array.from(set).sort();
  }, [restaurants]);

  const filtered = restaurants.filter(r => {
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.suburb.toLowerCase().includes(search.toLowerCase());
    const matchesSuburb = !suburbFilter || r.suburb === suburbFilter;
    return matchesSearch && matchesSuburb;
  });

  const handleDelete = async (id: string) => {
    try {
      await api.restaurants.delete(id);
      setRestaurants(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete restaurant:', err);
    }
    setDeleteId(null);
  };

  const parseTags = (tags: string | string[] | undefined): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return String(tags).split(',').map(t => t.trim()).filter(Boolean);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Restaurants</h1>
          <p className="text-gray-500 text-sm mt-1">{restaurants.length} partner restaurants</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500 transition-all duration-200 shadow-lg shadow-red-600/20">
          <Plus size={16} /> Add Restaurant
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          />
        </div>
        <select
          value={suburbFilter}
          onChange={e => setSuburbFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <option value="">All Suburbs</option>
          {suburbs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="h-5 rounded w-32 mb-3 animate-shimmer" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="space-y-2">
                <div className="h-3 rounded animate-shimmer" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="h-3 rounded w-3/4 animate-shimmer" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(rest => (
            <div key={rest.id} className="glass-card rounded-2xl p-5 hover:bg-white/[0.02] transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-1.5">
                    <UtensilsCrossed size={14} className="text-orange-400" />
                    {rest.name}
                  </h3>
                  {rest.cuisineType && <p className="text-xs text-gray-500 capitalize mt-0.5">{rest.cuisineType}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rest.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>
                    {rest.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => setDeleteId(rest.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <MapPin size={12} className="text-gray-400 shrink-0" />
                <span className="truncate">{rest.address}, {rest.suburb} {rest.postcode}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-0.5">
                    <Users size={10} /> Traffic
                  </div>
                  <p className="text-sm font-semibold text-white">{rest.avgDailyFootTraffic.toLocaleString()}</p>
                </div>
                <div className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-0.5">
                    <TrendingUp size={10} /> Orders
                  </div>
                  <p className="text-sm font-semibold text-white">{(rest.avgDailyOrders || 0).toLocaleString()}</p>
                </div>
                <div className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-0.5">
                    <Package size={10} /> Volume
                  </div>
                  <p className="text-sm font-semibold text-white">{rest.packagingVolume.toLocaleString()}</p>
                </div>
              </div>

              {parseTags(rest.tags).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {parseTags(rest.tags).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 text-xs text-gray-400" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                {rest.partnerSince ? `Partner since ${new Date(rest.partnerSince).toLocaleDateString()}` : `Added ${new Date(rest.createdAt).toLocaleDateString()}`}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">No restaurants found</div>
          )}
        </div>
      )}

      {showCreate && <CreateRestaurantModal onClose={() => setShowCreate(false)} onCreated={loadRestaurants} />}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl w-full max-w-sm p-6" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete Restaurant</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure? This action cannot be undone. All associated placements and inventory will also be removed.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/[0.02] transition-colors" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateRestaurantModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: '', address: '', suburb: '', postcode: '', city: 'Brisbane',
    lat: '-27.4698', lng: '153.0251', cuisineType: '', avgDailyFootTraffic: '200',
    avgDailyOrders: '80', packagingVolume: '120', demographics: '', tags: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.restaurants.create({
        name: form.name,
        address: form.address,
        suburb: form.suburb,
        postcode: form.postcode,
        city: form.city,
        location: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) },
        avgDailyFootTraffic: parseInt(form.avgDailyFootTraffic),
        packagingVolume: parseInt(form.packagingVolume),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        ...(form.cuisineType && { cuisineType: form.cuisineType }),
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  const brisbaneSuburbs = [
    'Brisbane CBD', 'South Bank', 'Fortitude Valley', 'West End', 'New Farm',
    'Paddington', 'Toowong', 'Indooroopilly', 'Chermside', 'Carindale',
    'Sunnybank', 'Mount Gravatt',
  ];

  const inputClass = "w-full px-3 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200";
  const inputStyle = { background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-semibold text-white">Add Restaurant</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Name *</label>
              <input required value={form.name} onChange={set('name')} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Cuisine Type</label>
              <select value={form.cuisineType} onChange={set('cuisineType')} className={inputClass} style={inputStyle}>
                <option value="">Select type</option>
                <option value="cafe">Cafe</option>
                <option value="restaurant">Restaurant</option>
                <option value="bakery">Bakery</option>
                <option value="juice_bar">Juice Bar</option>
                <option value="fast_food">Fast Food</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Address *</label>
            <input required value={form.address} onChange={set('address')} className={inputClass} style={inputStyle} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Suburb *</label>
              <select required value={form.suburb} onChange={set('suburb')} className={inputClass} style={inputStyle}>
                <option value="">Select suburb</option>
                {brisbaneSuburbs.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Postcode *</label>
              <input required value={form.postcode} onChange={set('postcode')} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">City</label>
              <input value={form.city} onChange={set('city')} className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Daily Foot Traffic</label>
              <input type="number" value={form.avgDailyFootTraffic} onChange={set('avgDailyFootTraffic')} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Daily Orders</label>
              <input type="number" value={form.avgDailyOrders} onChange={set('avgDailyOrders')} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Packaging Vol</label>
              <input type="number" value={form.packagingVolume} onChange={set('packagingVolume')} className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Latitude</label>
              <input value={form.lat} onChange={set('lat')} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Longitude</label>
              <input value={form.lng} onChange={set('lng')} className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Tags</label>
            <input value={form.tags} onChange={set('tags')} placeholder="brunch, organic, family-friendly" className={inputClass} style={inputStyle} />
            <p className="text-xs text-gray-500 mt-1">Comma-separated tags for matching</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/[0.02] transition-colors" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Add Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
