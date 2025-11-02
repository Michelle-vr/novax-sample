import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Unlock,
  Zap,
  AlertTriangle
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AdminDashboardProps {
  onBack: () => void
}

interface FarmPool {
  id: string
  name: string
  tokenA: string
  tokenB: string
  apy: number
  tvl: number
  totalStaked: number
  activeUsers: number
  status: 'active' | 'paused' | 'ended'
  multiplier: number
  lockPeriod: string
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pools' | 'users' | 'analytics'>('overview')
  const [showCreatePool, setShowCreatePool] = useState(false)

  // Mock data for farm pools
  const farmPools: FarmPool[] = [
    {
      id: '1',
      name: 'ETH-USDT LP',
      tokenA: 'ETH',
      tokenB: 'USDT',
      apy: 245.5,
      tvl: 12500000,
      totalStaked: 8900000,
      activeUsers: 1250,
      status: 'active',
      multiplier: 2.5,
      lockPeriod: '30 days'
    },
    {
      id: '2',
      name: 'BNB-BUSD LP',
      tokenA: 'BNB',
      tokenB: 'BUSD',
      apy: 180.3,
      tvl: 8900000,
      totalStaked: 6500000,
      activeUsers: 890,
      status: 'active',
      multiplier: 2.0,
      lockPeriod: '14 days'
    },
    {
      id: '3',
      name: 'NOVAX-ETH LP',
      tokenA: 'NOVAX',
      tokenB: 'ETH',
      apy: 420.8,
      tvl: 3200000,
      totalStaked: 2100000,
      activeUsers: 450,
      status: 'active',
      multiplier: 4.0,
      lockPeriod: '60 days'
    },
    {
      id: '4',
      name: 'USDC-DAI LP',
      tokenA: 'USDC',
      tokenB: 'DAI',
      apy: 85.2,
      tvl: 15000000,
      totalStaked: 12000000,
      activeUsers: 2100,
      status: 'paused',
      multiplier: 1.5,
      lockPeriod: '7 days'
    }
  ]

  const platformStats = [
    { label: 'Total TVL', value: '$44.6M', change: '+12.5%', icon: DollarSign, color: 'text-green-400' },
    { label: 'Active Users', value: '4,690', change: '+8.3%', icon: Users, color: 'text-blue-400' },
    { label: 'Total Pools', value: '12', change: '+2', icon: Activity, color: 'text-purple-400' },
    { label: 'Avg APY', value: '189%', change: '+15%', icon: TrendingUp, color: 'text-yellow-400' }
  ]

  // Mock data for charts
  const tvlChartData = [
    { date: '7d ago', tvl: 38 },
    { date: '6d ago', tvl: 39 },
    { date: '5d ago', tvl: 40 },
    { date: '4d ago', tvl: 41 },
    { date: '3d ago', tvl: 42 },
    { date: '2d ago', tvl: 43 },
    { date: 'Today', tvl: 44.6 }
  ]

  const userGrowthData = [
    { month: 'Jan', users: 1200 },
    { month: 'Feb', users: 1800 },
    { month: 'Mar', users: 2500 },
    { month: 'Apr', users: 3200 },
    { month: 'May', users: 3900 },
    { month: 'Jun', users: 4690 }
  ]

  const poolDistribution = [
    { name: 'ETH Pools', value: 35 },
    { name: 'BNB Pools', value: 25 },
    { name: 'Stablecoin Pools', value: 20 },
    { name: 'NOVAX Pools', value: 15 },
    { name: 'Others', value: 5 }
  ]

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444']

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border-b border-yellow-500/20 backdrop-blur-md p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-yellow-400 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
                <Shield size={32} />
                Admin Dashboard
              </h1>
              <p className="text-zinc-400">Manage farm pools and monitor platform performance</p>
            </div>

            <button
              onClick={() => setShowCreatePool(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Pool
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {['overview', 'pools', 'users', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap capitalize ${
                activeTab === tab
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={stat.color} size={24} />
                    <span className="text-sm text-green-400">{stat.change}</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* TVL Chart */}
              <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Total Value Locked (7 Days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={tvlChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                    <XAxis dataKey="date" stroke="#71717a" tick={{ fill: '#71717a' }} />
                    <YAxis stroke="#71717a" tick={{ fill: '#71717a' }} tickFormatter={(value) => `$${value}M`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #eab308', borderRadius: '8px' }}
                      formatter={(value: number) => [`$${value}M`, 'TVL']}
                    />
                    <Line type="monotone" dataKey="tvl" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* User Growth Chart */}
              <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">User Growth (6 Months)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                    <XAxis dataKey="month" stroke="#71717a" tick={{ fill: '#71717a' }} />
                    <YAxis stroke="#71717a" tick={{ fill: '#71717a' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #eab308', borderRadius: '8px' }}
                      formatter={(value: number) => [value.toLocaleString(), 'Users']}
                    />
                    <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Recent Pool Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'New stake', pool: 'ETH-USDT LP', amount: '$5,200', time: '2m ago', type: 'stake' },
                  { action: 'Liquidity added', pool: 'NOVAX-ETH LP', amount: '$12,500', time: '15m ago', type: 'add' },
                  { action: 'Rewards claimed', pool: 'BNB-BUSD LP', amount: '$850', time: '32m ago', type: 'claim' },
                  { action: 'Stake withdrawn', pool: 'USDC-DAI LP', amount: '$3,400', time: '1h ago', type: 'withdraw' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'stake' ? 'bg-green-400' :
                        activity.type === 'add' ? 'bg-blue-400' :
                        activity.type === 'claim' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                      <div>
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-zinc-400">{activity.pool}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{activity.amount}</div>
                      <div className="text-sm text-zinc-400">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Pools Tab */}
        {activeTab === 'pools' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {farmPools.map((pool, index) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-blue-600/40 rounded-full flex items-center justify-center text-xl border-2 border-yellow-500/30">
                        {pool.tokenA.charAt(0)}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600/20 to-green-600/40 rounded-full flex items-center justify-center text-xl border-2 border-yellow-500/30 absolute -right-3 -bottom-2">
                        {pool.tokenB.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{pool.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          pool.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          pool.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {pool.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Lock size={14} />
                        <span>{pool.lockPeriod}</span>
                        <span>•</span>
                        <Zap size={14} className="text-purple-400" />
                        <span className="text-purple-400">{pool.multiplier}x</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <div>
                      <div className="text-xs text-zinc-400 mb-1">APY</div>
                      <div className="text-lg font-bold text-green-400">{pool.apy.toFixed(1)}%</div>
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 mb-1">TVL</div>
                      <div className="text-lg font-bold">
                        ${(pool.tvl / 1000000).toFixed(1)}M
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 mb-1">Staked</div>
                      <div className="text-lg font-bold">
                        ${(pool.totalStaked / 1000000).toFixed(1)}M
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 mb-1">Users</div>
                      <div className="text-lg font-bold">{pool.activeUsers.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 bg-zinc-800/50 hover:bg-zinc-800 border border-yellow-500/30 rounded-lg transition-all">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 bg-zinc-800/50 hover:bg-zinc-800 border border-yellow-500/30 rounded-lg transition-all">
                      {pool.status === 'active' ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Pool Distribution by TVL</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={poolDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {poolDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Top Performing Pools</h3>
                <div className="space-y-3">
                  {farmPools.sort((a, b) => b.apy - a.apy).slice(0, 5).map((pool, index) => (
                    <div key={pool.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          index === 2 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-zinc-700/20 text-zinc-400'
                        }`}>
                          #{index + 1}
                        </div>
                        <span className="font-medium">{pool.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">{pool.apy.toFixed(1)}%</div>
                        <div className="text-xs text-zinc-400">APY</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-6">User Management</h3>
            <div className="text-center py-20">
              <Users size={64} className="mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl font-bold mb-2">User Management Coming Soon</h3>
              <p className="text-zinc-400">
                Detailed user analytics and management tools will be available here
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
