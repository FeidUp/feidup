import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAdvertisers, getRecommendations, type Advertiser, type RecommendationResponse } from '../api'

export default function Recommendations() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([])
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<string>(searchParams.get('advertiser') || '')
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingAdvertisers, setLoadingAdvertisers] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load advertisers on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await getAdvertisers()
        setAdvertisers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load advertisers')
      } finally {
        setLoadingAdvertisers(false)
      }
    }
    load()
  }, [])

  // Load recommendations when advertiser changes
  useEffect(() => {
    if (!selectedAdvertiser) {
      setRecommendations(null)
      return
    }

    async function loadRecs() {
      try {
        setLoading(true)
        setError(null)
        const data = await getRecommendations(selectedAdvertiser)
        setRecommendations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recommendations')
        setRecommendations(null)
      } finally {
        setLoading(false)
      }
    }
    loadRecs()
  }, [selectedAdvertiser])

  function handleAdvertiserChange(id: string) {
    setSelectedAdvertiser(id)
    if (id) {
      setSearchParams({ advertiser: id })
    } else {
      setSearchParams({})
    }
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-gray-500'
  }

  function getScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Low Match'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cafe Recommendations</h1>
        <p className="text-gray-600 mt-1">See which cafes are best matched for each advertiser</p>
      </div>

      {/* Advertiser Selector */}
      <div className="card">
        <div className="card-body">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select an Advertiser</label>
          {loadingAdvertisers ? (
            <div className="animate-pulse h-10 bg-gray-200 rounded-lg"></div>
          ) : (
            <select
              value={selectedAdvertiser}
              onChange={e => handleAdvertiserChange(e.target.value)}
              className="w-full max-w-md"
            >
              <option value="">Choose an advertiser...</option>
              {advertisers.map(adv => (
                <option key={adv.id} value={adv.id}>
                  {adv.businessName} ({adv.industry})
                </option>
              ))}
            </select>
          )}

          {advertisers.length === 0 && !loadingAdvertisers && (
            <p className="text-sm text-gray-500 mt-2">
              No advertisers found. <a href="/advertisers/new" className="text-primary-600 hover:underline">Add one first</a>.
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card">
          <div className="card-body py-12 text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Finding the best cafe matches...</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && !loading && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{recommendations.advertiserName}</h2>
                <p className="text-primary-100 mt-1">{recommendations.targetSummary}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{recommendations.recommendations.length}</p>
                <p className="text-primary-200 text-sm">matching cafes</p>
              </div>
            </div>
            <p className="text-sm text-primary-200 mt-4">
              Evaluated {recommendations.totalCafesEvaluated} total cafes • Generated {new Date(recommendations.generatedAt).toLocaleTimeString()}
            </p>
          </div>

          {/* Recommendations List */}
          {recommendations.recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.recommendations.map((rec, index) => (
                <div key={rec.cafeId} className="card hover:shadow-md transition-shadow">
                  <div className="card-body">
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-200 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        #{index + 1}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{rec.name}</h3>
                            <p className="text-sm text-gray-500">{rec.address}</p>
                            <p className="text-sm text-gray-500">{rec.suburb}, {rec.postcode}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-3xl font-bold ${getScoreColor(rec.matchScore)}`}>
                              {rec.matchScore}
                            </p>
                            <p className={`text-sm ${getScoreColor(rec.matchScore)}`}>
                              {getScoreLabel(rec.matchScore)}
                            </p>
                          </div>
                        </div>

                        {/* Match Reason */}
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <span className="font-medium">Why this cafe: </span>
                            {rec.matchReason}
                          </p>
                        </div>

                        {/* Score Breakdown */}
                        <div className="mt-4 grid grid-cols-4 gap-4">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500 uppercase">Location</p>
                            <p className="font-semibold text-gray-900">{rec.scoreBreakdown.locationScore}</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500 uppercase">Volume</p>
                            <p className="font-semibold text-gray-900">{rec.scoreBreakdown.volumeScore}</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500 uppercase">Demographics</p>
                            <p className="font-semibold text-gray-900">{rec.scoreBreakdown.demographicScore}</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500 uppercase">Relevance</p>
                            <p className="font-semibold text-gray-900">{rec.scoreBreakdown.relevanceScore}</p>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                          <span>
                            📍 {rec.distanceKm > 0 ? `${rec.distanceKm}km away` : 'In target area'}
                          </span>
                          <span>
                            ☕ {rec.estimatedDailyImpressions} impressions/day
                          </span>
                          {rec.tags.length > 0 && (
                            <span className="flex gap-1">
                              {rec.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-12">
                <p className="text-gray-600">No matching cafes found for this advertiser's targeting criteria.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedAdvertiser && !loading && (
        <div className="card">
          <div className="card-body text-center py-16">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select an Advertiser</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Choose an advertiser from the dropdown above to see which cafes in Brisbane are the best match for their targeting criteria.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
