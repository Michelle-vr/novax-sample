import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Copy,
  Check,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { formatDistanceToNow } from 'date-fns'

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: number
  status: 'success' | 'failed' | 'pending'
  type: 'send' | 'receive' | 'swap' | 'approve' | 'stake' | 'unstake'
  tokenSymbol?: string
  gasUsed?: string
  gasPriceGwei?: string
  blockNumber?: number
  method?: string
}

interface TransactionHistoryProps {
  onClose?: () => void
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onClose }) => {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'swap'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  // Fetch transactions from Etherscan API
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return

      setLoading(true)

      try {
        // Using Etherscan API (requires API key in production)
        const ETHERSCAN_API_KEY = 'YourApiKeyToken' // Replace with actual API key
        const response = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${ETHERSCAN_API_KEY}`
        )

        const data = await response.json()

        if (data.status === '1' && data.result) {
          const formattedTxs: Transaction[] = data.result.map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: (Number(tx.value) / 1e18).toFixed(6),
            timestamp: Number(tx.timeStamp) * 1000,
            status: tx.isError === '0' ? 'success' : 'failed',
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'send' : 'receive',
            tokenSymbol: 'ETH',
            gasUsed: tx.gasUsed,
            gasPriceGwei: (Number(tx.gasPrice) / 1e9).toFixed(2),
            blockNumber: Number(tx.blockNumber),
            method: tx.functionName || 'Transfer'
          }))

          setTransactions(formattedTxs)
          setFilteredTransactions(formattedTxs)
        } else {
          // Use mock data if API fails
          useMockData()
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
        useMockData()
      } finally {
        setLoading(false)
      }
    }

    const useMockData = () => {
      // Mock data for demonstration
      const mockTxs: Transaction[] = [
        {
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          from: address || '0x0000000000000000000000000000000000000000',
          to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          value: '0.5',
          timestamp: Date.now() - 3600000,
          status: 'success',
          type: 'send',
          tokenSymbol: 'ETH',
          gasUsed: '21000',
          gasPriceGwei: '25.5',
          blockNumber: 12345678,
          method: 'Transfer'
        },
        {
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          from: '0x1234567890123456789012345678901234567890',
          to: address || '0x0000000000000000000000000000000000000000',
          value: '1.2',
          timestamp: Date.now() - 7200000,
          status: 'success',
          type: 'receive',
          tokenSymbol: 'ETH',
          gasUsed: '21000',
          gasPriceGwei: '30.2',
          blockNumber: 12345670,
          method: 'Transfer'
        },
        {
          hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
          from: address || '0x0000000000000000000000000000000000000000',
          to: '0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57',
          value: '100',
          timestamp: Date.now() - 10800000,
          status: 'success',
          type: 'swap',
          tokenSymbol: 'USDT',
          gasUsed: '45620',
          gasPriceGwei: '28.8',
          blockNumber: 12345665,
          method: 'swap'
        }
      ]

      setTransactions(mockTxs)
      setFilteredTransactions(mockTxs)
    }

    fetchTransactions()
  }, [address])

  // Filter transactions
  useEffect(() => {
    let filtered = transactions

    if (filter !== 'all') {
      filtered = filtered.filter(tx => tx.type === filter)
    }

    if (searchQuery) {
      filtered = filtered.filter(tx =>
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredTransactions(filtered)
  }, [filter, searchQuery, transactions])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedHash(text)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const exportTransactions = () => {
    const csv = [
      ['Hash', 'Type', 'From', 'To', 'Value', 'Status', 'Timestamp', 'Block'].join(','),
      ...filteredTransactions.map(tx => [
        tx.hash,
        tx.type,
        tx.from,
        tx.to,
        `${tx.value} ${tx.tokenSymbol}`,
        tx.status,
        new Date(tx.timestamp).toISOString(),
        tx.blockNumber?.toString() || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions-${address?.slice(0, 8)}.csv`
    link.click()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight size={20} className="text-red-400" />
      case 'receive':
        return <ArrowDownLeft size={20} className="text-green-400" />
      default:
        return <RefreshCw size={20} className="text-blue-400" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-400" />
      case 'failed':
        return <XCircle size={16} className="text-red-400" />
      default:
        return <Clock size={16} className="text-yellow-400" />
    }
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">Transaction History</h2>
        <div className="flex gap-2">
          <button
            onClick={exportTransactions}
            className="p-2 bg-zinc-800/50 hover:bg-zinc-800 border border-yellow-500/30 rounded-lg transition-all"
            title="Export as CSV"
          >
            <Download size={20} className="text-zinc-400" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-zinc-800/50 hover:bg-zinc-800 border border-yellow-500/30 rounded-lg transition-all"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hash or address..."
            className="w-full bg-zinc-800/50 border border-yellow-500/30 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'send', 'receive', 'swap'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent" />
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredTransactions.map((tx, index) => (
            <motion.div
              key={tx.hash}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-zinc-800/30 rounded-xl p-4 hover:bg-zinc-800/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-zinc-700/50 rounded-lg">
                    {getTypeIcon(tx.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold capitalize">{tx.type}</span>
                      {getStatusIcon(tx.status)}
                      <span className="text-xs text-zinc-500 capitalize">{tx.status}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs text-zinc-400 truncate">
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(tx.hash)}
                        className="p-1 hover:bg-zinc-700 rounded transition-colors"
                      >
                        {copiedHash === tx.hash ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-zinc-400" />
                        )}
                      </button>
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-zinc-700 rounded transition-colors"
                      >
                        <ExternalLink size={14} className="text-yellow-400" />
                      </a>
                    </div>

                    <div className="text-xs text-zinc-500">
                      {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                      {tx.blockNumber && ` • Block ${tx.blockNumber}`}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    tx.type === 'receive' ? 'text-green-400' : 'text-white'
                  }`}>
                    {tx.type === 'receive' ? '+' : '-'}{tx.value} {tx.tokenSymbol}
                  </div>
                  {tx.gasUsed && tx.gasPriceGwei && (
                    <div className="text-xs text-zinc-500">
                      Gas: {tx.gasPriceGwei} Gwei
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Clock size={64} className="mx-auto mb-4 text-zinc-600" />
          <h3 className="text-xl font-bold mb-2">No Transactions Found</h3>
          <p className="text-zinc-400">
            {searchQuery || filter !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Your transaction history will appear here'}
          </p>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory
