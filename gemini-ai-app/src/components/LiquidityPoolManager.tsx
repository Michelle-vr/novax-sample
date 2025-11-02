import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Droplet, TrendingUp, Info, ArrowRight, Zap } from 'lucide-react'
import { useNotification } from '../context/NotificationContext'

interface Pool {
  id: string
  tokenA: string
  tokenB: string
  tvl: number
  apr: number
  myLiquidity: number
  poolShare: number
  fees24h: number
}

interface LiquidityPoolManagerProps {
  onClose: () => void
}

const LiquidityPoolManager: React.FC<LiquidityPoolManagerProps> = ({ onClose }) => {
  const { success, error: showError } = useNotification()
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add')
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [tokenAAmount, setTokenAAmount] = useState('')
  const [tokenBAmount, setTokenBAmount] = useState('')
  const [removePercentage, setRemovePercentage] = useState(50)
  const [isProcessing, setIsProcessing] = useState(false)

  const pools: Pool[] = [
    {
      id: '1',
      tokenA: 'ETH',
      tokenB: 'USDT',
      tvl: 12500000,
      apr: 28.5,
      myLiquidity: 2500,
      poolShare: 0.02,
      fees24h: 125.50
    },
    {
      id: '2',
      tokenA: 'BNB',
      tokenB: 'BUSD',
      tvl: 8900000,
      apr: 22.3,
      myLiquidity: 0,
      poolShare: 0,
      fees24h: 0
    },
    {
      id: '3',
      tokenA: 'NOVAX',
      tokenB: 'ETH',
      tvl: 3200000,
      apr: 45.8,
      myLiquidity: 1200,
      poolShare: 0.0375,
      fees24h: 45.60
    }
  ]

  const myPools = pools.filter(p => p.myLiquidity > 0)
  const availablePools = pools.filter(p => p.myLiquidity === 0)

  const handleAddLiquidity = async () => {
    if (!selectedPool || !tokenAAmount || !tokenBAmount) {
      showError('Invalid Input', 'Please enter amounts for both tokens')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      success(
        'Liquidity Added Successfully',
        `Added ${tokenAAmount} ${selectedPool.tokenA} and ${tokenBAmount} ${selectedPool.tokenB}`,
        '0x' + Math.random().toString(36).substring(2, 15)
      )

      setTokenAAmount('')
      setTokenBAmount('')
      setSelectedPool(null)
    } catch (err) {
      showError('Transaction Failed', 'Failed to add liquidity')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!selectedPool || removePercentage <= 0) {
      showError('Invalid Input', 'Please select an amount to remove')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      const removeAmount = (selectedPool.myLiquidity * removePercentage) / 100

      success(
        'Liquidity Removed Successfully',
        `Removed ${removePercentage}% of your liquidity ($${removeAmount.toFixed(2)})`,
        '0x' + Math.random().toString(36).substring(2, 15)
      )

      setRemovePercentage(50)
      setSelectedPool(null)
    } catch (err) {
      showError('Transaction Failed', 'Failed to remove liquidity')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-zinc-900 to-black border-b border-yellow-500/20 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Droplet className="text-yellow-400" size={28} />
              Liquidity Pool Manager
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('add')
                setSelectedPool(null)
              }}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'add'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
              }`}
            >
              <Plus size={18} className="inline mr-2" />
              Add Liquidity
            </button>
            <button
              onClick={() => {
                setActiveTab('remove')
                setSelectedPool(null)
              }}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'remove'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
              }`}
            >
              <Minus size={18} className="inline mr-2" />
              Remove Liquidity
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'add' ? (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-200">
                    <p className="font-medium mb-1">Adding Liquidity</p>
                    <p className="text-blue-300/80">
                      When you add liquidity, you'll receive LP tokens representing your share of the pool.
                      You'll earn trading fees proportional to your share.
                    </p>
                  </div>
                </div>
              </div>

              {selectedPool ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-zinc-800/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">
                        {selectedPool.tokenA}/{selectedPool.tokenB}
                      </h3>
                      <div className="text-right">
                        <div className="text-xs text-zinc-400">APR</div>
                        <div className="text-green-400 font-bold">{selectedPool.apr}%</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block">
                          {selectedPool.tokenA} Amount
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={tokenAAmount}
                            onChange={(e) => setTokenAAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-zinc-900/50 border border-yellow-500/30 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-yellow-500/50"
                          />
                          <button
                            onClick={() => setTokenAAmount('10')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded text-sm font-medium transition-all"
                          >
                            MAX
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <div className="p-2 bg-zinc-800 rounded-full">
                          <Plus size={20} className="text-yellow-400" />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block">
                          {selectedPool.tokenB} Amount
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={tokenBAmount}
                            onChange={(e) => setTokenBAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-zinc-900/50 border border-yellow-500/30 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-yellow-500/50"
                          />
                          <button
                            onClick={() => setTokenBAmount('24000')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded text-sm font-medium transition-all"
                          >
                            MAX
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Pool Share</span>
                        <span className="font-medium">~0.05%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Est. Fees (24h)</span>
                        <span className="font-medium text-green-400">~$12.50</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setSelectedPool(null)}
                        className="flex-1 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg font-medium transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleAddLiquidity}
                        disabled={isProcessing}
                        className="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            Processing...
                          </span>
                        ) : (
                          'Add Liquidity'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="grid gap-4">
                  {availablePools.map((pool) => (
                    <motion.div
                      key={pool.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedPool(pool)}
                      className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
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
                            <div className="font-bold text-lg">
                              {pool.tokenA}/{pool.tokenB}
                            </div>
                            <div className="text-sm text-zinc-400">
                              TVL: ${(pool.tvl / 1000000).toFixed(1)}M
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">{pool.apr}%</div>
                          <div className="text-xs text-zinc-400">APR</div>
                        </div>

                        <ArrowRight className="text-yellow-400" size={24} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-red-200">
                    <p className="font-medium mb-1">Removing Liquidity</p>
                    <p className="text-red-300/80">
                      You'll receive both tokens proportionally based on your pool share.
                      Unclaimed fees will be included in the withdrawal.
                    </p>
                  </div>
                </div>
              </div>

              {selectedPool ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-zinc-800/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg">
                        {selectedPool.tokenA}/{selectedPool.tokenB}
                      </h3>
                      <div className="text-right">
                        <div className="text-xs text-zinc-400">My Liquidity</div>
                        <div className="text-yellow-400 font-bold">
                          ${selectedPool.myLiquidity.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between mb-3">
                        <label className="text-sm text-zinc-400">Remove Amount</label>
                        <span className="text-yellow-400 font-bold">{removePercentage}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={removePercentage}
                        onChange={(e) => setRemovePercentage(Number(e.target.value))}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #eab308 0%, #eab308 ${removePercentage}%, #3f3f46 ${removePercentage}%, #3f3f46 100%)`
                        }}
                      />
                      <div className="flex justify-between mt-2">
                        {[25, 50, 75, 100].map((percent) => (
                          <button
                            key={percent}
                            onClick={() => setRemovePercentage(percent)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                              removePercentage === percent
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                            }`}
                          >
                            {percent}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-900/50 rounded-lg space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">You'll Receive</span>
                        <span className="font-medium">
                          ${((selectedPool.myLiquidity * removePercentage) / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Unclaimed Fees</span>
                        <span className="font-medium text-green-400">
                          ${selectedPool.fees24h.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Pool Share After</span>
                        <span className="font-medium">
                          {((selectedPool.poolShare * (100 - removePercentage)) / 100).toFixed(4)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedPool(null)}
                        className="flex-1 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg font-medium transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleRemoveLiquidity}
                        disabled={isProcessing}
                        className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            Processing...
                          </span>
                        ) : (
                          'Remove Liquidity'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : myPools.length > 0 ? (
                <div className="grid gap-4">
                  {myPools.map((pool) => (
                    <motion.div
                      key={pool.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedPool(pool)}
                      className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
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
                            <div className="font-bold text-lg">
                              {pool.tokenA}/{pool.tokenB}
                            </div>
                            <div className="text-sm text-zinc-400">
                              My Liquidity: ${pool.myLiquidity.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-400">
                            {pool.poolShare.toFixed(4)}%
                          </div>
                          <div className="text-xs text-zinc-400">Pool Share</div>
                        </div>

                        <ArrowRight className="text-yellow-400" size={24} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Droplet size={64} className="mx-auto mb-4 text-zinc-600" />
                  <h3 className="text-xl font-bold mb-2">No Liquidity Positions</h3>
                  <p className="text-zinc-400 mb-6">
                    You haven't added liquidity to any pools yet
                  </p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-lg font-medium transition-all"
                  >
                    Add Liquidity
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default LiquidityPoolManager
