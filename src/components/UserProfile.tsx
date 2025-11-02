import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Shield,
  Bell,
  Globe,
  Moon,
  Edit,
  Save,
  X,
  TrendingUp,
  DollarSign,
  Activity,
  Wallet
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAccount } from 'wagmi'
import TransactionHistory from './TransactionHistory'

interface UserProfileProps {
  onClose?: () => void
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, updateProfile, signIn, signOut, isAuthenticated } = useAuth()
  const { address } = useAccount()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'transactions' | 'settings'>('profile')

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  })

  const handleSave = async () => {
    await updateProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || ''
    })
    setIsEditing(false)
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-zinc-400 mb-6">
            Sign a message with your wallet to access your profile and personalized features
          </p>
          <button
            onClick={signIn}
            disabled={!address}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign In with Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl">
      {/* Header */}
      <div className="border-b border-yellow-500/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {user.username?.charAt(0).toUpperCase() || address?.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username || 'Anonymous User'}</h2>
              <code className="text-sm text-zinc-400">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </code>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all"
            >
              Sign Out
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-yellow-500/20 px-6">
        {(['profile', 'transactions', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium transition-all capitalize relative ${
              activeTab === tab
                ? 'text-yellow-400'
                : 'text-zinc-400 hover:text-zinc-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Trades', value: user.stats.totalTrades, icon: TrendingUp },
                { label: 'Total Volume', value: `$${user.stats.totalVolume.toLocaleString()}`, icon: DollarSign },
                { label: 'Pools Joined', value: user.stats.joinedPools, icon: Activity },
                { label: 'Staked', value: `$${user.stats.stakedAmount.toLocaleString()}`, icon: Wallet }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-zinc-800/30 rounded-xl p-4 border border-yellow-500/10"
                >
                  <div className="flex items-center gap-2 mb-2 text-zinc-400">
                    <stat.icon size={18} />
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Profile Info */}
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-yellow-500/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Profile Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                    >
                      <Save size={18} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-yellow-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500/50"
                      placeholder="Enter username"
                    />
                  ) : (
                    <div className="text-lg">{user.username || 'Not set'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-yellow-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500/50"
                      placeholder="Enter email"
                    />
                  ) : (
                    <div className="text-lg">{user.email || 'Not set'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-zinc-900/50 border border-yellow-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500/50 min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="text-lg">{user.bio || 'Not set'}</div>
                  )}
                </div>

                <div className="text-xs text-zinc-500 pt-4 border-t border-yellow-500/10">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TransactionHistory />
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-yellow-500/10">
              <h3 className="text-xl font-bold mb-6">Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-yellow-400" />
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-zinc-400">Receive transaction alerts</div>
                    </div>
                  </div>
                  <button
                    onClick={() => updateProfile({
                      preferences: { ...user.preferences, notifications: !user.preferences.notifications }
                    })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      user.preferences.notifications ? 'bg-yellow-500' : 'bg-zinc-700'
                    }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                      user.preferences.notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-yellow-400" />
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-zinc-400">Extra security for your account</div>
                    </div>
                  </div>
                  <button
                    onClick={() => updateProfile({
                      preferences: { ...user.preferences, twoFactor: !user.preferences.twoFactor }
                    })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      user.preferences.twoFactor ? 'bg-yellow-500' : 'bg-zinc-700'
                    }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                      user.preferences.twoFactor ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
