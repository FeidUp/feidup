import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAdvertiser } from '../api'

// Brisbane suburbs for dropdown
const BRISBANE_SUBURBS = [
  'Brisbane City', 'New Farm', 'Fortitude Valley', 'South Brisbane', 'West End',
  'Paddington', 'Toowong', 'St Lucia', 'Bulimba', 'Hawthorne', 'Teneriffe',
  'Woolloongabba', 'Kangaroo Point', 'Spring Hill', 'Milton', 'Auchenflower',
  'Indooroopilly', 'Taringa', 'Kelvin Grove', 'Red Hill', 'Ashgrove',
  'Bardon', 'Highgate Hill', 'Dutton Park', 'Annerley', 'Greenslopes',
]

const INDUSTRIES = [
  { value: 'fitness', label: 'Fitness & Wellness' },
  { value: 'education', label: 'Education & Training' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'fintech', label: 'Finance & FinTech' },
  { value: 'technology', label: 'Technology' },
  { value: 'health', label: 'Healthcare' },
  { value: 'retail', label: 'Retail & Shopping' },
  { value: 'arts_culture', label: 'Arts & Culture' },
  { value: 'beauty', label: 'Beauty & Fashion' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
]

const CAMPAIGN_GOALS = [
  { value: 'brand_awareness', label: 'Brand Awareness', desc: 'Get your name out there' },
  { value: 'local_reach', label: 'Local Reach', desc: 'Target specific neighbourhoods' },
  { value: 'event_promotion', label: 'Event Promotion', desc: 'Promote a specific event or offer' },
]

export default function AddAdvertiser() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')
  const [selectedSuburbs, setSelectedSuburbs] = useState<string[]>([])
  const [targetRadiusKm, setTargetRadiusKm] = useState('')
  const [campaignGoal, setCampaignGoal] = useState('brand_awareness')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  
  // Target audience
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [interests, setInterests] = useState('')
  const [incomeLevel, setIncomeLevel] = useState('')

  function toggleSuburb(suburb: string) {
    setSelectedSuburbs(prev =>
      prev.includes(suburb)
        ? prev.filter(s => s !== suburb)
        : [...prev, suburb]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validation
    if (!businessName.trim()) {
      setError('Business name is required')
      return
    }
    if (!industry) {
      setError('Please select an industry')
      return
    }

    try {
      setSaving(true)

      const targetAudience: Record<string, unknown> = {}
      if (ageMin && ageMax) {
        targetAudience.ageRange = { min: parseInt(ageMin), max: parseInt(ageMax) }
      }
      if (interests.trim()) {
        targetAudience.interests = interests.split(',').map(i => i.trim().toLowerCase())
      }
      if (incomeLevel) {
        targetAudience.incomeLevel = incomeLevel
      }

      await createAdvertiser({
        businessName: businessName.trim(),
        industry,
        targetSuburbs: selectedSuburbs,
        targetRadiusKm: targetRadiusKm ? parseFloat(targetRadiusKm) : undefined,
        campaignGoal,
        targetAudience: Object.keys(targetAudience).length > 0 ? targetAudience : undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
      } as never)

      navigate('/advertisers')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create advertiser')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/advertisers')} className="text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Advertisers
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Advertiser</h1>
        <p className="text-gray-600 mt-1">Fill in the details to add a new advertiser to FeidUp</p>
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
            <h2 className="font-semibold text-gray-900">Business Information</h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g., FitLife Gym Brisbane"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full"
              >
                <option value="">Select an industry...</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind.value} value={ind.value}>{ind.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="marketing@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="07 1234 5678"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Targeting */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Location Targeting</h2>
            <p className="text-sm text-gray-500 mt-1">Select which Brisbane suburbs to target</p>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Suburbs</label>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                {BRISBANE_SUBURBS.map(suburb => (
                  <button
                    key={suburb}
                    type="button"
                    onClick={() => toggleSuburb(suburb)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedSuburbs.includes(suburb)
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-500'
                    }`}
                  >
                    {suburb}
                  </button>
                ))}
              </div>
              {selectedSuburbs.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  {selectedSuburbs.length} suburb{selectedSuburbs.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Radius (optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={targetRadiusKm}
                  onChange={e => setTargetRadiusKm(e.target.value)}
                  placeholder="5"
                  min="1"
                  max="50"
                  className="w-24"
                />
                <span className="text-gray-600">km from Brisbane CBD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Target Audience</h2>
            <p className="text-sm text-gray-500 mt-1">Define who you want to reach (optional but recommended)</p>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Age</label>
                <input
                  type="number"
                  value={ageMin}
                  onChange={e => setAgeMin(e.target.value)}
                  placeholder="18"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Age</label>
                <input
                  type="number"
                  value={ageMax}
                  onChange={e => setAgeMax(e.target.value)}
                  placeholder="45"
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interests
              </label>
              <input
                type="text"
                value={interests}
                onChange={e => setInterests(e.target.value)}
                placeholder="fitness, health, coffee (comma separated)"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple interests with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Income Level</label>
              <select
                value={incomeLevel}
                onChange={e => setIncomeLevel(e.target.value)}
                className="w-full"
              >
                <option value="">Any income level</option>
                <option value="low">Low</option>
                <option value="low-medium">Low-Medium</option>
                <option value="medium">Medium</option>
                <option value="medium-high">Medium-High</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaign Goal */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Campaign Goal</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CAMPAIGN_GOALS.map(goal => (
                <label
                  key={goal.value}
                  className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    campaignGoal === goal.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="campaignGoal"
                    value={goal.value}
                    checked={campaignGoal === goal.value}
                    onChange={e => setCampaignGoal(e.target.value)}
                    className="sr-only"
                  />
                  <span className={`font-medium ${campaignGoal === goal.value ? 'text-primary-900' : 'text-gray-900'}`}>
                    {goal.label}
                  </span>
                  <span className={`text-sm mt-1 ${campaignGoal === goal.value ? 'text-primary-700' : 'text-gray-500'}`}>
                    {goal.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/advertisers')}
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
              'Create Advertiser'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
