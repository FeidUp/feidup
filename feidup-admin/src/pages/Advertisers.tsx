import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdvertisers, deleteAdvertiser, type Advertiser } from '../api'

export default function Advertisers() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function loadAdvertisers() {
    try {
      setLoading(true)
      const data = await getAdvertisers()
      setAdvertisers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load advertisers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdvertisers()
  }, [])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return
    }

    try {
      setDeleting(id)
      await deleteAdvertiser(id)
      setAdvertisers(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advertisers</h1>
          <p className="text-gray-600 mt-1">Manage businesses that advertise through FeidUp</p>
        </div>
        <Link to="/advertisers/new" className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Advertiser
        </Link>
      </div>

      {/* Advertisers Table */}
      {advertisers.length > 0 ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Target Areas</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Goal</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {advertisers.map(adv => (
                  <tr key={adv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{adv.businessName}</p>
                      <p className="text-sm text-gray-500">{adv.city}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge badge-blue capitalize">{adv.industry}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {adv.targetSuburbs.length > 0 
                          ? adv.targetSuburbs.slice(0, 2).join(', ') + (adv.targetSuburbs.length > 2 ? ` +${adv.targetSuburbs.length - 2}` : '')
                          : 'Not specified'}
                      </p>
                      {adv.targetRadiusKm && (
                        <p className="text-xs text-gray-500">{adv.targetRadiusKm}km radius</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 capitalize">{adv.campaignGoal.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${adv.isActive ? 'badge-green' : 'badge-gray'}`}>
                        {adv.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/recommendations?advertiser=${adv.id}`}
                          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                        >
                          View Matches
                        </Link>
                        <button
                          onClick={() => handleDelete(adv.id, adv.businessName)}
                          disabled={deleting === adv.id}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                        >
                          {deleting === adv.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No advertisers yet</h3>
            <p className="text-gray-600 mb-6">Add your first advertiser to start matching them with cafes.</p>
            <Link to="/advertisers/new" className="btn btn-primary">
              Add Your First Advertiser
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
