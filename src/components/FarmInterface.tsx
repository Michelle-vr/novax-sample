import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Sprout,
  TrendingUp,
  DollarSign,
  Users,
  Lock,
  Unlock,
  Plus,
  Minus,
  Info,
  ExternalLink,
  Star,
  Zap,
  Shield,
  Clock,
  Activity,
  Target
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface FarmInterfaceProps {
  onBack: () => void
}

interface Pool {
  id: string
  name: string
  tokens: [string, string]
  apy: number
  tvl: number
  earned: number
  staked: number
  lockPeriod: string
  multiplier: number
  verified: boolean
  featured: boolean
}

const FarmInterface: React.FC<FarmInterfaceProps> = ({ onBack }) => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'active' | 'available' | 'finished'>('available')
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [actionType, setActionType] = useState<'stake' | 'unstake'>('stake')

  // Mock data for farming pools
  const pools: Pool[] = [
    {
      id: '1',
      name: 'ETH-USDT LP',
      tokens: ['ETH', 'USDT'],
      apy: 245.5,
      tvl: 12500000,
      earned: 125.50,
      staked: 1500,
      lockPeriod: '30 days',
      multiplier: 2.5,
      verified: true,
      featured: true
    },
    {
      id: '2',
      name: 'BNB-BUSD LP',
      tokens: ['BNB', 'BUSD'],
      apy: 180.3,
      tvl: 8900000,
      earned: 89.30,
      staked: 2300,
      lockPeriod: '14 days',
      multiplier: 2.0,
      verified: true,
      featured: true
    },
    {
      id: '3',
      name: 'NOVAX-ETH LP',
      tokens: ['NOVAX', 'ETH'],
      apy: 420.8,
      tvl: 3200000,
      earned: 0,
      staked: 0,
      lockPeriod: '60 days',
      multiplier: 4.0,
      verified: true,
      featured: true
    },
    {
      id: '4',
      name: 'USDC-DAI LP',
      tokens: ['USDC', 'DAI'],
      apy: 85.2,
      tvl: 15000000,
      earned: 42.10,
      staked: 5000,
      lockPeriod: '7 days',
      multiplier: 1.5,
      verified: true,
      featured: false
    },
    {
      id: '5',
      name: 'LINK-ETH LP',
      tokens: ['LINK', 'ETH'],
      apy: 195.7,
      tvl: 4500000,
      earned: 0,
      staked: 0,
      lockPeriod: '30 days',
      multiplier: 2.0,
      verified: true,
      featured: false
    }
  ]

  const activePools = pools.filter(p => p.staked > 0)
  const availablePools = pools.filter(p => p.staked === 0)

  const totalStaked = pools.reduce((sum, p) => sum + p.staked, 0)
  const totalEarned = pools.reduce((sum, p) => sum + p.earned, 0)

  const handleStake = () => {
    if (selectedPool && stakeAmount) {
      // Handle staking logic
      console.log(`Staking ${stakeAmount} in pool ${selectedPool.name}`)
      setSelectedPool(null)
      setStakeAmount('')
    }
  }

  const handleUnstake = () => {
    if (selectedPool && stakeAmount) {
      // Handle unstaking logic
      console.log(`Unstaking ${stakeAmount} from pool ${selectedPool.name}`)
      setSelectedPool(null)
      setStakeAmount('')
    }
  }

  const handleHarvest = (pool: Pool) => {
    console.log(`Harvesting rewards from pool ${pool.name}`)
  }

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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
                <Sprout size={32} />
                Yield Farming
              </h1>
              <p className="text-zinc-400">Stake LP tokens and earn high yields</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <div className="text-sm text-zinc-400 mb-1">Total Staked</div>
                <div className="text-2xl font-bold text-green-400">
                  ${totalStaked.toLocaleString()}
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                <div className="text-sm text-zinc-400 mb-1">Total Earned</div>
                <div className="text-2xl font-bold text-yellow-400">
                  ${totalEarned.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Pools', value: pools.length.toString(), icon: Activity },
            { label: 'Active Farms', value: activePools.length.toString(), icon: Sprout },
            { label: 'Avg APY', value: '189%', icon: TrendingUp },
            { label: 'Total TVL', value: '$44M', icon: DollarSign }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={18} className="text-yellow-400" />
                <span className="text-sm text-zinc-400">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'available'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
            }`}
          >
            Available Pools ({availablePools.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'active'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
            }`}
          >
            My Farms ({activePools.length})
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'finished'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
            }`}
          >
            Finished
          </button>
        </div>

        {/* Pool List */}
        <div className="grid gap-4">
          {(activeTab === 'active' ? activePools : activeTab === 'available' ? availablePools : []).map((pool, index) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Token Icons */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-blue-600/40 rounded-full flex items-center justify-center text-xl border-2 border-yellow-500/30">
                      {pool.tokens[0].charAt(0)}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600/20 to-green-600/40 rounded-full flex items-center justify-center text-xl border-2 border-yellow-500/30 absolute -right-3 -bottom-2">
                      {pool.tokens[1].charAt(0)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{pool.name}</span>
                      {pool.verified && <Shield size={16} className="text-green-400" />}
                      {pool.featured && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
                      {pool.multiplier > 2 && <Zap size={16} className="text-purple-400" />}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Lock size={14} />
                      <span>{pool.lockPeriod}</span>
                      <span>•</span>
                      <span className="text-purple-400">{pool.multiplier}x Multiplier</span>
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

                  {pool.staked > 0 && (
                    <>
                      <div>
                        <div className="text-xs text-zinc-400 mb-1">Staked</div>
                        <div className="text-lg font-bold">${pool.staked.toLocaleString()}</div>
                      </div>

                      <div>
                        <div className="text-xs text-zinc-400 mb-1">Earned</div>
                        <div className="text-lg font-bold text-yellow-400">${pool.earned.toFixed(2)}</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {pool.staked > 0 ? (
                    <>
                      <button
                        onClick={() => handleHarvest(pool)}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-lg font-medium transition-all"
                      >
                        Harvest
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPool(pool)
                          setActionType('unstake')
                        }}
                        className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-yellow-500/30 rounded-lg font-medium transition-all"
                      >
                        <Minus size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPool(pool)
                          setActionType('stake')
                        }}
                        className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-yellow-500/30 rounded-lg font-medium transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedPool(pool)
                        setActionType('stake')
                      }}
                      className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-lg font-medium transition-all"
                    >
                      <Plus size={18} className="inline mr-2" />
                      Stake
                    </button>
                  )}

                  <button className="p-2 bg-zinc-800/50 hover:bg-zinc-800 border border-yellow-500/30 rounded-lg transition-all">
                    <Info size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {activeTab === 'finished' && (
          <div className="text-center py-20">
            <Clock size={64} className="mx-auto mb-4 text-zinc-600" />
            <h3 className="text-xl font-bold mb-2">No Finished Farms</h3>
            <p className="text-zinc-400">Completed farming pools will appear here</p>
          </div>
        )}
      </div>

      {/* Stake/Unstake Modal */}
      {selectedPool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/30 rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {actionType === 'stake' ? 'Stake' : 'Unstake'} {selectedPool.name}
              </h3>
              <button
                onClick={() => {
                  setSelectedPool(null)
                  setStakeAmount('')
                }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-zinc-400">Amount</label>
                <span className="text-sm text-zinc-400">
                  Balance: {actionType === 'stake' ? '10,000' : selectedPool.staked.toLocaleString()}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-800/50 border border-yellow-500/30 rounded-lg px-4 py-3 pr-20 text-lg focus:outline-none focus:border-yellow-500/50"
                />
                <button
                  onClick={() => setStakeAmount(actionType === 'stake' ? '10000' : selectedPool.staked.toString())}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded text-sm font-medium transition-all"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6 p-4 bg-zinc-800/30 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">APY</span>
                <span className="text-green-400 font-bold">{selectedPool.apy.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Lock Period</span>
                <span className="font-medium">{selectedPool.lockPeriod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Multiplier</span>
                <span className="text-purple-400 font-medium">{selectedPool.multiplier}x</span>
              </div>
            </div>

            <button
              onClick={actionType === 'stake' ? handleStake : handleUnstake}
              className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-lg font-medium transition-all"
            >
              {actionType === 'stake' ? 'Stake' : 'Unstake'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default FarmInterface
