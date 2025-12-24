import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCafe } from '../api'

// Brisbane suburbs for dropdown
const BRISBANE_SUBURBS = [
  { suburb: 'Brisbane City', postcode: '4000' },
  { suburb: 'New Farm', postcode: '4005' },
  { suburb: 'Teneriffe', postcode: '4005' },
  { suburb: 'Fortitude Valley', postcode: '4006' },
  { suburb: 'South Brisbane', postcode: '4101' },
  { suburb: 'West End', postcode: '4101' },
  { suburb: 'Woolloongabba', postcode: '4102' },
  { suburb: 'Paddington', postcode: '4064' },
  { suburb: 'Toowong', postcode: '4066' },
  { suburb: 'St Lucia', postcode: '4067' },
  { suburb: 'Bulimba', postcode: '4171' },
  { suburb: 'Hawthorne', postcode: '4171' },
  { suburb: 'Kangaroo Point', postcode: '4169' },
  { suburb: 'Spring Hill', postcode: '4000' },
  { suburb: 'Milton', postcode: '4064' },
  { suburb: 'Auchenflower', postcode: '4066' },
  { suburb: 'Indooroopilly', postcode: '4068' },
  { suburb: 'Taringa', postcode: '4068' },
  { suburb: 'Kelvin Grove', postcode: '4059' },
  { suburb: 'Red Hill', postcode: '4059' },
]

const CAFE_TAGS = [
  'high-traffic', 'student', 'business', 'family', 'trendy', 'coworking-friendly',
  'brunch', 'premium', 'budget', 'organic', 'vegan-friendly', 'dogs-welcome',
  'riverside', 'cultural', 'nightlife-adjacent', 'boutique', 'quick-service',
  'study-friendly', 'weekend', 'hipster', 'specialty', 'modern',
]

const DEMOGRAPHIC_TYPES = [
  { value: 'students', label: 'Students' },
  { value: 'young_adults', label: 'Young Adults (18-30)' },
  { value: 'young_professionals', label: 'Young Professionals' },
  { value: 'professionals', label: 'Professionals' },
  { value: 'families', label: 'Families' },
  { value: 'affluent_families', label: 'Affluent Families' },
  { value: 'tourists_locals', label: 'Tourists & Locals Mix' },
  { value: 'creative_professionals', label: 'Creative Professionals' },
]

export default function AddCafe() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [selectedSuburb, setSelectedSuburb] = useState('')
  const [avgDailyFootTraffic, setAvgDailyFootTraffic] = useState('')
  const [packagingVolume, setPackagingVolume] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Demographics
  const [demographicType, setDemographicType] = useState('')
  const [incomeLevel, setIncomeLevel] = useState('')

  // Get postcode from selected suburb
  const suburbData = BRISBANE_SUBURBS.find(s => s.suburb === selectedSuburb)

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Simple geocoding approximation for Brisbane suburbs (mock)
  function getApproxCoordinates(suburb: string): { lat: number; lng: number } {
    const coords: Record<string, { lat: number; lng: number }> = {
      'Brisbane City': { lat: -27.4698, lng: 153.0251 },
      'New Farm': { lat: -27.4673, lng: 153.0505 },
      'Teneriffe': { lat: -27.4548, lng: 153.0463 },
      'Fortitude Valley': { lat: -27.4567, lng: 153.0359 },
      'South Brisbane': { lat: -27.4818, lng: 153.0205 },
      'West End': { lat: -27.4836, lng: 153.0077 },
      'Woolloongabba': { lat: -27.4920, lng: 153.0343 },
      'Paddington': { lat: -27.4597, lng: 152.9992 },
      'Toowong': { lat: -27.4847, lng: 152.9882 },
      'St Lucia': { lat: -27.4977, lng: 153.0013 },
      'Bulimba': { lat: -27.4531, lng: 153.0609 },
      'Hawthorne': { lat: -27.4609, lng: 153.0542 },
      'Kangaroo Point': { lat: -27.4795, lng: 153.0355 },
      'Spring Hill': { lat: -27.4594, lng: 153.0267 },
      'Milton': { lat: -27.4700, lng: 152.9990 },
      'Auchenflower': { lat: -27.4772, lng: 152.9888 },
      'Indooroopilly': { lat: -27.4988, lng: 152.9755 },
      'Taringa': { lat: -27.4890, lng: 152.9801 },
      'Kelvin Grove': { lat: -27.4492, lng: 153.0114 },
      'Red Hill': { lat: -27.4557, lng: 152.9994 },
    }
    return coords[suburb] || { lat: -27.4698, lng: 153.0251 }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validation
    if (!name.trim()) {
      setError('Cafe name is required')
      return
    }
    if (!address.trim()) {
      setError('Address is required')
      return
    }
    if (!selectedSuburb) {
      setError('Please select a suburb')
      return
    }

    try {
      setSaving(true)

      const demographics: Record<string, unknown> = {}
      if (demographicType) demographics.type = demographicType
      if (incomeLevel) demographics.income = incomeLevel

      const location = getApproxCoordinates(selectedSuburb)

      await createCafe({
        name: name.trim(),
        address: address.trim(),
        suburb: selectedSuburb,
        postcode: suburbData?.postcode || '4000',
        location,
        avgDailyFootTraffic: avgDailyFootTraffic ? parseInt(avgDailyFootTraffic) : 0,
        packagingVolume: packagingVolume ? parseInt(packagingVolume) : 0,
        tags: selectedTags,
        demographics: Object.keys(demographics).length > 0 ? demographics : undefined,
      } as never)

      navigate('/cafes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create cafe')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/cafes')} className="text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Cafes
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Cafe</h1>
        <p className="text-gray-600 mt-1">Add a new cafe partner to the FeidUp network</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Cafe Information</h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cafe Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Brunswick Street Beans"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g., 78 Brunswick Street"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suburb <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSuburb}
                  onChange={e => setSelectedSuburb(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select a suburb...</option>
                  {BRISBANE_SUBURBS.map(s => (
                    <option key={s.suburb} value={s.suburb}>
                      {s.suburb} ({s.postcode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                <input
                  type="text"
                  value={suburbData?.postcode || ''}
                  disabled
                  className="w-full bg-gray-100"
                  placeholder="Auto-filled"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Traffic & Volume */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Traffic & Impressions</h2>
            <p className="text-sm text-gray-500 mt-1">These numbers help us estimate advertising value</p>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Daily Foot Traffic
                </label>
                <input
                  type="number"
                  value={avgDailyFootTraffic}
                  onChange={e => setAvgDailyFootTraffic(e.target.value)}
                  placeholder="e.g., 400"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Estimated customers per day</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Packaging Volume
                </label>
                <input
                  type="number"
                  value={packagingVolume}
                  onChange={e => setPackagingVolume(e.target.value)}
                  placeholder="e.g., 250"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Cups/packages per day</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> If you're unsure, start with conservative estimates. 
                A typical busy cafe serves 200-400 cups per day.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Demographics */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Customer Demographics</h2>
            <p className="text-sm text-gray-500 mt-1">Helps match with the right advertisers</p>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Customer Type</label>
                <select
                  value={demographicType}
                  onChange={e => setDemographicType(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select type...</option>
                  {DEMOGRAPHIC_TYPES.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Income Level</label>
                <select
                  value={incomeLevel}
                  onChange={e => setIncomeLevel(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select level...</option>
                  <option value="low">Low</option>
                  <option value="low-medium">Low-Medium</option>
                  <option value="medium">Medium</option>
                  <option value="medium-high">Medium-High</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Cafe Characteristics</h2>
            <p className="text-sm text-gray-500 mt-1">Select all that apply to this cafe</p>
          </div>
          <div className="card-body">
            <div className="flex flex-wrap gap-2">
              {CAFE_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/cafes')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Add Cafe'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
