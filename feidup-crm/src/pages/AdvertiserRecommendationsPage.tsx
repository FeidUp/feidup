import { useState, useEffect } from 'react';
import { api } from '../api';
import type { AdvertiserPortalData, TargetAudience } from '../api';
import { Save, SlidersHorizontal, Users, CheckCircle2 } from 'lucide-react';

export function AdvertiserRecommendationsPage() {
  const [advertiser, setAdvertiser] = useState<AdvertiserPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<TargetAudience>({
    ageRange: { min: 22, max: 40 },
    incomeLevel: 'medium',
    interests: [],
  });
  const [interestInput, setInterestInput] = useState('');

  const incomeOptions: Array<NonNullable<TargetAudience['incomeLevel']>> = ['low', 'low-medium', 'medium', 'medium-high', 'high'];

  useEffect(() => {
    const load = async () => {
      try {
        const advRes = await api.advertiserPortal.me();
        setAdvertiser(advRes.data);
        if (advRes.data.targetAudience) {
          setForm({
            ageRange: {
              min: advRes.data.targetAudience.ageRange?.min ?? 22,
              max: advRes.data.targetAudience.ageRange?.max ?? 40,
            },
            incomeLevel: advRes.data.targetAudience.incomeLevel ?? 'medium',
            interests: advRes.data.targetAudience.interests ?? [],
          });
        }
      } catch (err) {
        console.error('Failed to load advertiser preferences:', err);
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

  const addInterest = () => {
    const value = interestInput.trim();
    if (!value) return;
    if ((form.interests || []).includes(value)) {
      setInterestInput('');
      return;
    }
    setForm((prev) => ({ ...prev, interests: [...(prev.interests || []), value] }));
    setInterestInput('');
  };

  const removeInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: (prev.interests || []).filter((item) => item !== interest),
    }));
  };

  const handleSave = async () => {
    setError('');
    setSaved(false);

    const min = form.ageRange?.min ?? 18;
    const max = form.ageRange?.max ?? 65;
    if (min < 16 || max > 85 || min >= max) {
      setError('Please choose a valid age range (min must be lower than max).');
      return;
    }

    try {
      setSaving(true);
      await api.advertiserPortal.updateTargetAudience({
        ageRange: { min, max },
        incomeLevel: form.incomeLevel,
        interests: form.interests || [],
      });
      setSaved(true);
      const latest = await api.advertiserPortal.me();
      setAdvertiser(latest.data);
    } catch (err: any) {
      setError(err.message || 'Failed to save demographics preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <SlidersHorizontal size={24} className="text-blue-400" /> Audience Preferences
          </h1>
          <p className="text-gray-500 text-sm mt-1">Choose your target demographics. FeidUp staff use this to pair your campaigns with the best cafes.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">
          <Users size={14} /> {advertiser.businessName}
        </div>

        {error && <div className="mb-4 rounded-xl bg-red-500/10 text-red-400 px-3 py-2 text-sm">{error}</div>}
        {saved && (
          <div className="mb-4 rounded-xl bg-emerald-500/10 text-emerald-400 px-3 py-2 text-sm flex items-center gap-2">
            <CheckCircle2 size={14} /> Saved. Your FeidUp admin team can now use these preferences for matching.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Target Age Min</label>
            <input
              type="number"
              min={16}
              max={85}
              value={form.ageRange?.min ?? 22}
              onChange={(e) => setForm((prev) => ({
                ...prev,
                ageRange: {
                  min: Number(e.target.value),
                  max: prev.ageRange?.max ?? 40,
                },
              }))}
              className="w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Target Age Max</label>
            <input
              type="number"
              min={16}
              max={85}
              value={form.ageRange?.max ?? 40}
              onChange={(e) => setForm((prev) => ({
                ...prev,
                ageRange: {
                  min: prev.ageRange?.min ?? 22,
                  max: Number(e.target.value),
                },
              }))}
              className="w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1">Target Income Level</label>
          <select
            value={form.incomeLevel || 'medium'}
            onChange={(e) => setForm((prev) => ({ ...prev, incomeLevel: e.target.value as TargetAudience['incomeLevel'] }))}
            className="w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            {incomeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-400 mb-1">Interests</label>
          <div className="flex gap-2 mb-2">
            <input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addInterest();
                }
              }}
              placeholder="e.g. fitness, healthy food, family"
              className="flex-1 px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            />
            <button
              type="button"
              onClick={addInterest}
              className="px-3 py-2 rounded-xl text-sm bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.interests || []).map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => removeInterest(interest)}
                className="px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                title="Remove interest"
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Demographics'}
          </button>
        </div>
      </div>
    </div>
  );
}
