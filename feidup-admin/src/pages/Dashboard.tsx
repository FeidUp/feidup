import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdvertisers, getCafes, getSuburbStats, checkHealth, type Advertiser, type Cafe, type SuburbStats } from '../api'

export default function Dashboard() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([])
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [suburbStats, setSuburbStats] = useState<SuburbStats[]>([])
  const [health, setHealth] = useState<{ status: string; database: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [advs, cfs, stats, hlth] = await Promise.all([
          getAdvertisers(),
          getCafes(),
          getSuburbStats(),
          checkHealth(),
        ])
        setAdvertisers(advs)
        setCafes(cfs)
        setSuburbStats(stats)
        setHealth(hlth)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalImpressions = cafes.reduce((sum, c) => sum + c.packagingVolume, 0)
  const activeAdvertisers = advertisers.filter(a => a.isActive).length
  const activeCafes = cafes.filter(c => c.isActive).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 font-semibold text-lg mb-2">Connection Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm text-red-500">
          Make sure the backend is running on <code className="bg-red-100 px-1 rounded">http://localhost:3001</code>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your FeidUp advertising network</p>
      </div>

      {/* Status Banner */}
      {health && (
        <div className={`rounded-lg p-4 ${health.database === 'connected' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${health.database === 'connected' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span className={health.database === 'connected' ? 'text-green-800' : 'text-yellow-800'}>
              Backend: {health.status} • Database: {health.database}
            </span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Active Advertisers</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{activeAdvertisers}</p>
            <Link to="/advertisers/new" className="text-primary-600 text-sm hover:underline mt-2 inline-block">
              + Add new
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Partner Cafes</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{activeCafes}</p>
            <Link to="/cafes/new" className="text-primary-600 text-sm hover:underline mt-2 inline-block">
              + Add new
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Daily Impressions</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{totalImpressions.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-2">Cups per day</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Brisbane Suburbs</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{suburbStats.length}</p>
            <p className="text-sm text-gray-400 mt-2">With active cafes</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Advertisers */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Recent Advertisers</h2>
            <Link to="/advertisers" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {advertisers.slice(0, 5).map(adv => (
              <div key={adv.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{adv.businessName}</p>
                  <p className="text-sm text-gray-500 capitalize">{adv.industry} • {adv.targetSuburbs.slice(0, 2).join(', ')}</p>
                </div>
                <span className={`badge ${adv.isActive ? 'badge-green' : 'badge-gray'}`}>
                  {adv.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
            {advertisers.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No advertisers yet.{' '}
                <Link to="/advertisers/new" className="text-primary-600 hover:underline">Add your first one</Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Suburbs */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Top Suburbs by Impressions</h2>
            <Link to="/cafes" className="text-sm text-primary-600 hover:underline">View cafes</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {suburbStats.slice(0, 5).map((stat, i) => (
              <div key={stat.suburb} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-medium flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{stat.suburb}</p>
                    <p className="text-sm text-gray-500">{stat.cafeCount} cafes • {stat.postcode}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{stat.totalDailyImpressions}</p>
                  <p className="text-xs text-gray-500">cups/day</p>
                </div>
              </div>
            ))}
            {suburbStats.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No cafe data yet.{' '}
                <Link to="/cafes/new" className="text-primary-600 hover:underline">Add your first cafe</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      {(advertisers.length === 0 || cafes.length === 0) && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Get Started with FeidUp</h2>
          <p className="text-primary-100 mb-6">
            Add advertisers and cafes to start generating intelligent placement recommendations.
          </p>
          <div className="flex gap-4">
            <Link to="/advertisers/new" className="btn bg-white text-primary-700 hover:bg-primary-50">
              Add Advertiser
            </Link>
            <Link to="/cafes/new" className="btn bg-primary-700 text-white hover:bg-primary-800">
              Add Cafe Partner
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
