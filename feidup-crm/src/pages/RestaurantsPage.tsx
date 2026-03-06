import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Restaurant } from '../api';
import { Plus, Search, UtensilsCrossed, MapPin, Users, Package, TrendingUp } from 'lucide-react';

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

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

  const filtered = search
    ? restaurants.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.suburb.toLowerCase().includes(search.toLowerCase()))
    : restaurants;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Restaurants</h1>
          <p className="text-gray-500 text-sm mt-1">{restaurants.length} partner restaurants</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          <Plus size={16} /> Add Restaurant
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search restaurants..."
          className="w-full max-w-md pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
              <div className="space-y-2"><div className="h-3 bg-gray-100 rounded" /><div className="h-3 bg-gray-100 rounded w-3/4" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(rest => (
            <div key={rest.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <UtensilsCrossed size={14} className="text-orange-600" />
                    {rest.name}
                  </h3>
                  {rest.cuisineType && <p className="text-xs text-gray-500 capitalize mt-0.5">{rest.cuisineType}</p>}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rest.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {rest.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin size={12} className="text-gray-400" />
                <span className="truncate">{rest.address}, {rest.suburb} {rest.postcode}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-0.5">
                    <Users size={10} /> Traffic
                  </div>
                  <p className="text-sm font-semibold">{rest.avgDailyFootTraffic}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-0.5">
                    <TrendingUp size={10} /> Orders
                  </div>
                  <p className="text-sm font-semibold">{rest.avgDailyOrders}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-0.5">
                    <Package size={10} /> Volume
                  </div>
                  <p className="text-sm font-semibold">{rest.packagingVolume}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-400">
                <span>Partner since {new Date(rest.partnerSince).toLocaleDateString()}</span>
                {rest.tags && <span className="truncate ml-2">{rest.tags}</span>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">No restaurants found</div>
          )}
        </div>
      )}

      {showCreate && <CreateRestaurantModal onClose={() => setShowCreate(false)} onCreated={loadRestaurants} />}
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
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        avgDailyFootTraffic: parseInt(form.avgDailyFootTraffic),
        avgDailyOrders: parseInt(form.avgDailyOrders),
        packagingVolume: parseInt(form.packagingVolume),
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Add Restaurant</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input required value={form.name} onChange={set('name')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input required value={form.address} onChange={set('address')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Suburb *</label>
              <input required value={form.suburb} onChange={set('suburb')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postcode *</label>
              <input required value={form.postcode} onChange={set('postcode')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
              <input value={form.cuisineType} onChange={set('cuisineType')} placeholder="e.g. Italian" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Foot Traffic</label>
              <input type="number" value={form.avgDailyFootTraffic} onChange={set('avgDailyFootTraffic')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Orders</label>
              <input type="number" value={form.avgDailyOrders} onChange={set('avgDailyOrders')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Packaging Vol</label>
              <input type="number" value={form.packagingVolume} onChange={set('packagingVolume')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input value={form.lat} onChange={set('lat')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input value={form.lng} onChange={set('lng')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input value={form.tags} onChange={set('tags')} placeholder="brunch, organic, family" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Add Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
