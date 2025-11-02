import type React from 'react'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PriceChartProps {
  tokenPair: string
  timeframe?: '1H' | '24H' | '7D' | '30D' | '1Y'
}

interface ChartData {
  timestamp: string
  price: number
  volume: number
}

const PriceChart: React.FC<PriceChartProps> = ({ tokenPair, timeframe = '24H' }) => {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe)

  useEffect(() => {
    // Generate mock price data
    const generateMockData = () => {
      const points = selectedTimeframe === '1H' ? 60 :
                     selectedTimeframe === '24H' ? 24 :
                     selectedTimeframe === '7D' ? 7 :
                     selectedTimeframe === '30D' ? 30 : 365

      const basePrice = 2400
      const mockData: ChartData[] = []

      let currentPrice = basePrice

      for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * 50
        currentPrice = Math.max(currentPrice + change, basePrice * 0.9)

        const timestamp = selectedTimeframe === '1H' ? `${59 - i}m ago` :
                         selectedTimeframe === '24H' ? `${23 - i}h ago` :
                         selectedTimeframe === '7D' ? `${7 - i}d ago` :
                         selectedTimeframe === '30D' ? `${30 - i}d ago` :
                         `${365 - i}d ago`

        mockData.unshift({
          timestamp,
          price: Number(currentPrice.toFixed(2)),
          volume: Math.random() * 1000000
        })
      }

      setData(mockData)
      setLoading(false)
    }

    setLoading(true)
    setTimeout(generateMockData, 500)
  }, [selectedTimeframe])

  const timeframes: Array<'1H' | '24H' | '7D' | '30D' | '1Y'> = ['1H', '24H', '7D', '30D', '1Y']

  const currentPrice = data.length > 0 ? data[data.length - 1].price : 0
  const previousPrice = data.length > 1 ? data[0].price : currentPrice
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2)
  const isPositive = priceChange >= 0

  return (
    <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-yellow-500/20 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-1">{tokenPair}</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-yellow-400">
              ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              <span className="font-medium">
                {isPositive ? '+' : ''}{priceChangePercent}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTimeframe === tf
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
            <XAxis
              dataKey="timestamp"
              stroke="#71717a"
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickLine={{ stroke: '#3f3f46' }}
            />
            <YAxis
              stroke="#71717a"
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickLine={{ stroke: '#3f3f46' }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #eab308',
                borderRadius: '8px',
                padding: '12px'
              }}
              labelStyle={{ color: '#a1a1aa' }}
              itemStyle={{ color: '#eab308' }}
              formatter={(value: number) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#eab308"
              strokeWidth={2}
              fill="url(#priceGradient)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800">
        <div>
          <div className="text-xs text-zinc-400 mb-1">24h High</div>
          <div className="font-bold text-green-400">
            ${Math.max(...data.map(d => d.price)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-400 mb-1">24h Low</div>
          <div className="font-bold text-red-400">
            ${Math.min(...data.map(d => d.price)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-400 mb-1">24h Volume</div>
          <div className="font-bold">
            ${(data.reduce((sum, d) => sum + d.volume, 0) / 1000000).toFixed(2)}M
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-400 mb-1">24h Change</div>
          <div className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{priceChangePercent}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceChart
