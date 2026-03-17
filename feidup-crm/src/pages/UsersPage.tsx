import { useState, useEffect } from 'react';
import { api } from '../api';
import type { User, CreateUserPayload } from '../api';
import { Plus, Shield, UserCog, Mail, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../AuthContext';

const roleBadge: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-400',
  sales: 'bg-blue-500/10 text-blue-400',
  operations: 'bg-yellow-500/10 text-yellow-400',
  advertiser: 'bg-purple-500/10 text-purple-400',
  restaurant: 'bg-orange-500/10 text-orange-400',
};

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await api.auth.listUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const toggleActive = async (user: User) => {
    try {
      await api.auth.updateUser(user.id, { isActive: !user.isActive });
      loadUsers();
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const internalUsers = users.filter(u => ['admin', 'sales', 'operations'].includes(u.role));
  const externalUsers = users.filter(u => ['advertiser', 'restaurant'].includes(u.role));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} total users</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          <Plus size={16} /> Add User
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 animate-shimmer">
              <div className="h-5 rounded w-40" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Internal Team */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield size={14} /> Internal Team ({internalUsers.length})
            </h2>
            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Last Login</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {internalUsers.map(user => (
                    <UserRow key={user.id} user={user} currentUserId={currentUser?.id} onToggle={toggleActive} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* External Users */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <UserCog size={14} /> Client Accounts ({externalUsers.length})
            </h2>
            {externalUsers.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center text-gray-400">
                No client accounts yet. Create one for an advertiser or restaurant.
              </div>
            ) : (
              <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Last Login</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {externalUsers.map(user => (
                      <UserRow key={user.id} user={user} currentUserId={currentUser?.id} onToggle={toggleActive} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={loadUsers} />}
    </div>
  );
}

function UserRow({ user, currentUserId, onToggle }: { user: User; currentUserId?: string; onToggle: (u: User) => void }) {
  return (
    <tr className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-gray-400" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <span className="font-medium text-white">{user.firstName} {user.lastName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-gray-400 flex items-center gap-1">
        <Mail size={12} className="text-gray-400" /> {user.email}
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadge[user.role] || 'bg-gray-500/10 text-gray-400'}`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-gray-400 flex items-center gap-1">
        <Clock size={10} /> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>
          {user.isActive ? 'Active' : 'Disabled'}
        </span>
      </td>
      <td className="px-4 py-3">
        {user.id !== currentUserId && (
          <button onClick={() => onToggle(user)} className="text-gray-400 hover:text-gray-300" title={user.isActive ? 'Disable' : 'Enable'}>
            {user.isActive ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} />}
          </button>
        )}
      </td>
    </tr>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<CreateUserPayload>({
    email: '', password: '', firstName: '', lastName: '', role: 'sales',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.auth.createUser(form);
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-md" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}>
        <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-semibold text-white">Add User</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 text-red-400 px-3 py-2 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name *</label>
              <input required value={form.firstName} onChange={e => setForm(f => ({...f, firstName: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name *</label>
              <input required value={form.lastName} onChange={e => setForm(f => ({...f, lastName: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password *</label>
            <input required type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500 outline-none" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }} placeholder="Min 8 characters" minLength={8} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Role *</label>
            <select value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-sm text-white" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <option value="admin">Admin</option>
              <option value="sales">Sales</option>
              <option value="operations">Operations</option>
              <option value="advertiser">Advertiser</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/[0.02] transition-colors" style={{ border: '1px solid var(--color-border)' }}>Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
              {saving ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
