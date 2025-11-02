import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  BarChart3
} from 'lucide-react'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { useLanguage } from '../context/LanguageContext'

interface PortfolioPageProps {
  onBack: () => void
}

interface Asset {
  symbol: string
  name: string
  balance: string
  value: number
  change24h: number
  icon: string
}

interface Transaction {
  hash: string
  type: 'send' | 'receive' | 'swap'
  amount: string
  token: string
  timestamp: number
  status: 'confirmed' | 'pending'
  from: string
  to: string
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({ onBack }) => {
  const { t } = useLanguage()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ethBalance } = useBalance({
    address: address,
    chainId: mainnet.id,
  })

  const [copiedAddress, setCopiedAddress] = useState(false)
  const [activeTab, setActiveTab] = useState<'assets' | 'transactions' | 'analytics'>('assets')
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'send' | 'receive' | 'swap'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'amount'>('recent')

  // Mock data - Replace with real blockchain data
  const mockAssets: Asset[] = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: ethBalance ? Number(ethBalance.formatted).toFixed(4) : '0.0000',
      value: ethBalance ? Number(ethBalance.formatted) * 2400 : 0,
      change24h: 5.2,
      icon: '⟠'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      balance: '1,250.00',
      value: 1250,
      change24h: 0.01,
      icon: '₮'
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      balance: '2.5',
      value: 750,
      change24h: -2.3,
      icon: '◆'
    }
  ]

  const mockTransactions: Transaction[] = [
    {
      hash: '0x1234...5678',
      type: 'receive',
      amount: '0.5',
      token: 'ETH',
      timestamp: Date.now() - 3600000,
      status: 'confirmed',
      from: '0xabcd...efgh',
      to: address || '0x0000...0000'
    },
    {
      hash: '0x8765...4321',
      type: 'send',
      amount: '100',
      token: 'USDT',
      timestamp: Date.now() - 7200000,
      status: 'confirmed',
      from: address || '0x0000...0000',
      to: '0xijkl...mnop'
    },
    {
      hash: '0x9999...1111',
      type: 'swap',
      amount: '0.1',
      token: 'ETH',
      timestamp: Date.now() - 10800000,
      status: 'pending',
      from: address || '0x0000...0000',
      to: '0xDEX...SWAP'
    }
  ]

  const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0)
  const portfolioChange = ((totalValue - 3500) / 3500) * 100 // Mock calculation

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)

    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Wallet size={64} className="mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-zinc-400 mb-6">Please connect your wallet to view your portfolio</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-lg font-medium transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    )
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
              <h1 className="text-3xl font-bold text-yellow-400 mb-2">Portfolio</h1>
              <div className="flex items-center gap-3">
                <code className="text-sm text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </code>
                <button
                  onClick={copyAddress}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  {copiedAddress ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} className="text-zinc-400" />
                  )}
                </button>
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm transition-all"
                >
                  Disconnect
                </button>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-zinc-400 mb-1">Total Balance</div>
              <div className="text-3xl font-bold text-yellow-400">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center gap-1 justify-end text-sm ${
                portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{Math.abs(portfolioChange).toFixed(2)}% (24h)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'assets'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
            }`}
          >
            <PieChart size={18} className="inline mr-2" />
            Assets
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
            }`}
          >
            <Activity size={18} className="inline mr-2" />
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
            }`}
          >
            <BarChart3 size={18} className="inline mr-2" />
            Analytics
          </button>
        </div>

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-4">
              {mockAssets.map((asset, index) => (
                <motion.div
                  key={asset.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full flex items-center justify-center text-2xl">
                        {asset.icon}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{asset.symbol}</div>
                        <div className="text-sm text-zinc-400">{asset.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg">{asset.balance} {asset.symbol}</div>
                      <div className="text-sm text-zinc-400">
                        ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-sm flex items-center gap-1 justify-end ${
                        asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {asset.change24h >= 0 ? '▲' : '▼'}
                        {Math.abs(asset.change24h)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex gap-2 flex-wrap">
                {(['all', 'send', 'receive', 'swap'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTransactionFilter(filter)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      transactionFilter === filter
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    sortBy === 'recent'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setSortBy('amount')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    sortBy === 'amount'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
                  }`}
                >
                  Amount
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {mockTransactions
                .filter(tx => transactionFilter === 'all' || tx.type === transactionFilter)
                .sort((a, b) => {
                  if (sortBy === 'recent') {
                    return b.timestamp - a.timestamp
                  } else {
                    return Number.parseFloat(b.amount) - Number.parseFloat(a.amount)
                  }
                })
                .map((tx, index) => (
                <motion.div
                  key={tx.hash}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'receive' ? 'bg-green-500/20 text-green-400' :
                        tx.type === 'send' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {tx.type === 'receive' ? <ArrowDownLeft size={20} /> :
                         tx.type === 'send' ? <ArrowUpRight size={20} /> :
                         <RefreshCw size={20} />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                          <span>{tx.hash}</span>
                          <a
                            href={`https://etherscan.io/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-bold ${
                        tx.type === 'receive' ? 'text-green-400' : 'text-white'
                      }`}>
                        {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.token}
                      </div>
                      <div className="text-sm text-zinc-400 flex items-center gap-2 justify-end">
                        <Clock size={14} />
                        {formatTimestamp(tx.timestamp)}
                      </div>
                      <div className={`text-xs mt-1 ${
                        tx.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {tx.status === 'confirmed' ? '✓ Confirmed' : '⟳ Pending'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Portfolio Performance Chart */}
            <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-yellow-400" size={24} />
                Portfolio Performance
              </h3>

              {/* Mock Line Chart */}
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 600 200">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#eab308" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 50}
                      x2="600"
                      y2={i * 50}
                      stroke="#3f3f46"
                      strokeWidth="0.5"
                    />
                  ))}

                  {/* Chart area */}
                  <path
                    d="M 0 180 L 100 150 L 200 140 L 300 120 L 400 100 L 500 90 L 600 70 L 600 200 L 0 200 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Chart line */}
                  <path
                    d="M 0 180 L 100 150 L 200 140 L 300 120 L 400 100 L 500 90 L 600 70"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="2"
                  />

                  {/* Data points */}
                  {[[0, 180], [100, 150], [200, 140], [300, 120], [400, 100], [500, 90], [600, 70]].map((point, i) => (
                    <circle
                      key={i}
                      cx={point[0]}
                      cy={point[1]}
                      r="4"
                      fill="#eab308"
                      className="hover:r-6 transition-all cursor-pointer"
                    />
                  ))}
                </svg>

                {/* Time labels */}
                <div className="flex justify-between mt-4 text-xs text-zinc-400">
                  <span>7d ago</span>
                  <span>6d ago</span>
                  <span>5d ago</span>
                  <span>4d ago</span>
                  <span>3d ago</span>
                  <span>2d ago</span>
                  <span>Today</span>
                </div>
              </div>
            </div>

            {/* Asset Allocation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <PieChart className="text-yellow-400" size={24} />
                  Asset Allocation
                </h3>

                {/* Mock Pie Chart */}
                <div className="flex items-center justify-center mb-6">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="40" strokeDasharray="251.2 251.2" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" strokeWidth="40" strokeDasharray="125.6 377.6" strokeDashoffset="-251.2" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="40" strokeDasharray="62.8 440.4" strokeDashoffset="-376.8" transform="rotate(-90 100 100)" />
                  </svg>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                  {mockAssets.map((asset, index) => (
                    <div key={asset.symbol} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-sm">{asset.symbol}</span>
                      </div>
                      <span className="text-sm text-zinc-400">
                        {((asset.value / totalValue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Stats */}
              <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="text-yellow-400" size={24} />
                  Statistics
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                    <span className="text-zinc-400">Total Assets</span>
                    <span className="font-bold">{mockAssets.length}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                    <span className="text-zinc-400">Total Transactions</span>
                    <span className="font-bold">{mockTransactions.length}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                    <span className="text-zinc-400">Best Performer</span>
                    <span className="font-bold text-green-400">ETH +5.2%</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                    <span className="text-zinc-400">Worst Performer</span>
                    <span className="font-bold text-red-400">BNB -2.3%</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                    <span className="text-zinc-400">Avg. Transaction</span>
                    <span className="font-bold">$875</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                    <span className="text-zinc-400">Portfolio Age</span>
                    <span className="font-bold">3 months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="text-yellow-400" size={24} />
                Recent Activity Timeline
              </h3>

              <div className="space-y-4">
                {mockTransactions.slice(0, 5).map((tx, index) => (
                  <div key={tx.hash} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'receive' ? 'bg-green-500/20 text-green-400' :
                        tx.type === 'send' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {tx.type === 'receive' ? <ArrowDownLeft size={18} /> :
                         tx.type === 'send' ? <ArrowUpRight size={18} /> :
                         <RefreshCw size={18} />}
                      </div>
                      {index < mockTransactions.slice(0, 5).length - 1 && (
                        <div className="w-0.5 h-12 bg-zinc-700/50" />
                      )}
                    </div>

                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium capitalize">{tx.type} {tx.token}</span>
                        <span className={`font-bold ${
                          tx.type === 'receive' ? 'text-green-400' : 'text-white'
                        }`}>
                          {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.token}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Clock size={14} />
                        <span>{formatTimestamp(tx.timestamp)}</span>
                        <span>•</span>
                        <span className={tx.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'}>
                          {tx.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PortfolioPage
