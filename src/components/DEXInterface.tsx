import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpDown,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Info,
  Droplet,
  BarChart3
} from 'lucide-react'
import PriceChart from './PriceChart'
import LiquidityPoolManager from './LiquidityPoolManager'
import { useNotification } from '../context/NotificationContext'
import { useTokenPrice } from '../hooks/useTokenPrice'

interface DEXInterfaceProps {
  onBack: () => void
}

const DEXInterface: React.FC<DEXInterfaceProps> = ({ onBack }) => {
  const { success, error: showError } = useNotification()
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('USDT')
  const [slippage, setSlippage] = useState('0.5')
  const [showLiquidityManager, setShowLiquidityManager] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  // Get real token price
  const { price: fromTokenPrice, loading: fromPriceLoading } = useTokenPrice(fromToken)
  const { price: toTokenPrice, loading: toPriceLoading } = useTokenPrice(toToken)

  const popularPairs = [
    { pair: 'NOVA/USDT', price: '$12.45', change: '+5.23%', isUp: true },
    { pair: 'ETH/USDT', price: '$2,450.00', change: '+2.15%', isUp: true },
    { pair: 'BTC/USDT', price: '$43,250.00', change: '-1.05%', isUp: false },
    { pair: 'BNB/USDT', price: '$315.80', change: '+3.42%', isUp: true }
  ]

  const recentTrades = [
    { type: 'buy', pair: 'NOVA/USDT', amount: '125.50', price: '12.45', time: '2m ago' },
    { type: 'sell', pair: 'ETH/USDT', amount: '0.85', price: '2450.00', time: '5m ago' },
    { type: 'buy', pair: 'BTC/USDT', amount: '0.025', price: '43250.00', time: '8m ago' }
  ]

  const handleSwap = async () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      showError('Invalid Amount', 'Please enter a valid amount to swap')
      return
    }

    setIsSwapping(true)

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      success(
        'Swap Successful',
        `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
        '0x' + Math.random().toString(36).substring(2, 15)
      )

      setFromAmount('')
      setToAmount('')
    } catch (err) {
      showError('Swap Failed', 'Transaction was rejected or failed')
    } finally {
      setIsSwapping(false)
    }
  }

  // Update toAmount when fromAmount or prices change
  const updateToAmount = (value: string) => {
    setFromAmount(value)
    if (value && fromTokenPrice && toTokenPrice) {
      const fromValue = Number.parseFloat(value)
      const toValue = (fromValue * fromTokenPrice) / toTokenPrice
      setToAmount(toValue.toFixed(6))
    } else {
      setToAmount('')
    }
  }

  const reverseTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">
              DEX Trading
            </h1>
            <p className="text-zinc-400 mt-1">Swap tokens instantly with the best rates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Swap Interface */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-black/60 via-zinc-900/80 to-black/60 border border-yellow-500/20 rounded-xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-amber-100">Swap Tokens</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowChart(!showChart)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    title="View Chart"
                  >
                    <BarChart3 size={20} className={showChart ? 'text-yellow-400' : 'text-zinc-400'} />
                  </button>
                  <button
                    onClick={() => setShowLiquidityManager(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <Droplet size={18} />
                    Liquidity
                  </button>
                  <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                    <Settings size={20} className="text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* From Token */}
              <div className="bg-zinc-800/50 rounded-xl p-4 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">From</span>
                  <span className="text-sm text-zinc-400">Balance: 1,250.00</span>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => updateToAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-2xl font-bold text-white focus:outline-none"
                  />

                  <div className="flex items-center gap-2 bg-zinc-700/50 px-4 py-2 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full" />
                    <span className="font-bold">{fromToken}</span>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-3 relative z-10">
                <button
                  onClick={reverseTokens}
                  className="p-3 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all"
                >
                  <ArrowUpDown size={20} />
                </button>
              </div>

              {/* To Token */}
              <div className="bg-zinc-800/50 rounded-xl p-4 mt-2 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">To</span>
                  <span className="text-sm text-zinc-400">Balance: 5,420.50</span>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-2xl font-bold text-white focus:outline-none"
                  />

                  <div className="flex items-center gap-2 bg-zinc-700/50 px-4 py-2 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full" />
                    <span className="font-bold">{toToken}</span>
                  </div>
                </div>
              </div>

              {/* Swap Details */}
              <div className="bg-zinc-800/30 rounded-xl p-4 mb-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Rate</span>
                  <span className="text-white">1 {fromToken} = 12.45 {toToken}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Slippage</span>
                  <span className="text-white">{slippage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Network Fee</span>
                  <span className="text-white">~$0.50</span>
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                disabled={isSwapping || fromPriceLoading || toPriceLoading}
                className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: '0 10px 40px rgba(255,215,0,0.3)'
                }}
              >
                {isSwapping ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Swapping...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Swap Tokens
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Market Info */}
          <div className="space-y-6">
            {/* Popular Pairs */}
            <div className="bg-gradient-to-br from-black/60 via-zinc-900/80 to-black/60 border border-yellow-500/20 rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-bold text-amber-100 mb-4">Popular Pairs</h3>

              <div className="space-y-3">
                {popularPairs.map((pair, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-white">{pair.pair}</div>
                      <div className="text-sm text-zinc-400">{pair.price}</div>
                    </div>

                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      pair.isUp ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {pair.isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {pair.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-gradient-to-br from-black/60 via-zinc-900/80 to-black/60 border border-yellow-500/20 rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-bold text-amber-100 mb-4">Recent Trades</h3>

              <div className="space-y-3">
                {recentTrades.map((trade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-white">{trade.pair}</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">{trade.amount} @ ${trade.price}</div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Clock size={12} />
                      {trade.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        {showChart && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <PriceChart tokenPair={`${fromToken}/${toToken}`} />
          </motion.div>
        )}
      </motion.div>

      {/* Liquidity Pool Manager Modal */}
      {showLiquidityManager && (
        <LiquidityPoolManager onClose={() => setShowLiquidityManager(false)} />
      )}
    </div>
  )
}

export default DEXInterface
