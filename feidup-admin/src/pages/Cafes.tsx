import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCafes, deleteCafe, type Cafe } from '../api'

export default function Cafes() {
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [filterSuburb, setFilterSuburb] = useState('')

  async function loadCafes() {
    try {
      setLoading(true)
      const data = await getCafes()
      setCafes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cafes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCafes()
  }, [])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return
    }

    try {
      setDeleting(id)
      await deleteCafe(id)
      setCafes(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  // Get unique suburbs for filter
  const suburbs = [...new Set(cafes.map(c => c.suburb))].sort()

  // Filter cafes
  const filteredCafes = filterSuburb
    ? cafes.filter(c => c.suburb === filterSuburb)
    : cafes

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
          <h1 className="text-3xl font-bold text-gray-900">Partner Cafes</h1>
          <p className="text-gray-600 mt-1">Manage cafe partners in the FeidUp network</p>
        </div>
        <Link to="/cafes/new" className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Cafe
        </Link>
      </div>

      {/* Filter */}
      {suburbs.length > 0 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by suburb:</label>
          <select
            value={filterSuburb}
            onChange={e => setFilterSuburb(e.target.value)}
            className="w-48"
          >
            <option value="">All suburbs</option>
            {suburbs.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {filterSuburb && (
            <button
              onClick={() => setFilterSuburb('')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Cafes Grid */}
      {filteredCafes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCafes.map(cafe => (
            <div key={cafe.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{cafe.name}</h3>
                    <p className="text-sm text-gray-500">{cafe.suburb}, {cafe.postcode}</p>
                  </div>
                  <span className={`badge ${cafe.isActive ? 'badge-green' : 'badge-gray'}`}>
                    {cafe.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-2">{cafe.address}</p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">Daily Traffic</p>
                    <p className="text-xl font-bold text-gray-900">{cafe.avgDailyFootTraffic}</p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-3">
                    <p className="text-xs text-primary-600 uppercase">Cups/Day</p>
                    <p className="text-xl font-bold text-primary-700">{cafe.packagingVolume}</p>
                  </div>
                </div>

                {cafe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {cafe.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDelete(cafe.id, cafe.name)}
                    disabled={deleting === cafe.id}
                    className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                  >
                    {deleting === cafe.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filterSuburb ? `No cafes in ${filterSuburb}` : 'No cafes yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterSuburb 
                ? 'Try a different filter or add a new cafe.'
                : 'Add your first cafe partner to start matching with advertisers.'}
            </p>
            <Link to="/cafes/new" className="btn btn-primary">
              Add Your First Cafe
            </Link>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {cafes.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredCafes.length} of {cafes.length} cafes
          </p>
          <p className="text-sm text-gray-600">
            Total daily impressions: <span className="font-semibold text-gray-900">
              {filteredCafes.reduce((sum, c) => sum + c.packagingVolume, 0).toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
