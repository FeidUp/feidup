import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Eye, EyeOff, AlertCircle, Zap, BarChart3, Target, Coffee } from 'lucide-react';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden"
        style={{ background: 'var(--color-sidebar)' }}>
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/5 rounded-full blur-[120px]" />

        <div className="max-w-md text-center relative z-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-8 shadow-2xl shadow-red-600/30">F</div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">FeidUp</h1>
          <p className="text-gray-400 text-lg mb-10">
            Location-based advertising that connects brands with cafes through co-branded packaging.
          </p>
          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { icon: Target, label: 'Smart Matching', desc: 'AI-powered cafe recommendations' },
              { icon: Zap, label: 'QR Tracking', desc: 'Real-time scan analytics' },
              { icon: Coffee, label: 'Partner Portal', desc: 'Self-serve for cafes & brands' },
              { icon: BarChart3, label: 'Live Analytics', desc: 'Campaign performance insights' },
            ].map(f => (
              <div key={f.label} className="glass-card rounded-xl p-4 group">
                <f.icon size={16} className="text-red-500 mb-2" />
                <p className="font-medium text-sm text-white">{f.label}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-red-600/20">F</div>
            <span className="text-xl font-bold text-white">FeidUp</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8 text-sm">Sign in to your account</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@feidup.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 focus:ring-2 focus:ring-red-500/50"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-400">Password</label>
                <Link to="/forgot-password" className="text-xs text-red-500 hover:text-red-400 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 pr-10 focus:ring-2 focus:ring-red-500/50"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-[11px] text-gray-600 text-center mt-8">
            Accounts are created by FeidUp staff. Contact your admin for access.
          </p>
        </div>
      </div>
    </div>
  );
}
