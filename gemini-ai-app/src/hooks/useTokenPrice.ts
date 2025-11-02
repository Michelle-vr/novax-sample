import { useState, useEffect } from 'react'

interface TokenPrice {
  usd: number
  usd_24h_change: number
}

interface TokenPriceData {
  [key: string]: TokenPrice
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price'

// Map token symbols to CoinGecko IDs
const TOKEN_ID_MAP: { [key: string]: string } = {
  'ETH': 'ethereum',
  'BTC': 'bitcoin',
  'BNB': 'binancecoin',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'DAI': 'dai',
  'BUSD': 'binance-usd',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'DOT': 'polkadot',
  'ATOM': 'cosmos',
  'SOL': 'solana'
}

export const useTokenPrice = (tokenSymbol: string) => {
  const [price, setPrice] = useState<number | null>(null)
  const [change24h, setChange24h] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrice = async () => {
      const tokenId = TOKEN_ID_MAP[tokenSymbol.toUpperCase()]

      if (!tokenId) {
        setPrice(null)
        setChange24h(0)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${COINGECKO_API}?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch price')
        }

        const data: TokenPriceData = await response.json()

        if (data[tokenId]) {
          setPrice(data[tokenId].usd)
          setChange24h(data[tokenId].usd_24h_change || 0)
        }

        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Use mock data as fallback
        setPrice(getMockPrice(tokenSymbol))
        setChange24h(Math.random() * 10 - 5)
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()

    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000)

    return () => clearInterval(interval)
  }, [tokenSymbol])

  return { price, change24h, loading, error }
}

export const useMultipleTokenPrices = (tokenSymbols: string[]) => {
  const [prices, setPrices] = useState<{ [key: string]: { price: number; change24h: number } }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      const tokenIds = tokenSymbols
        .map(symbol => TOKEN_ID_MAP[symbol.toUpperCase()])
        .filter(Boolean)
        .join(',')

      if (!tokenIds) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${COINGECKO_API}?ids=${tokenIds}&vs_currencies=usd&include_24hr_change=true`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch prices')
        }

        const data: TokenPriceData = await response.json()

        const priceMap: { [key: string]: { price: number; change24h: number } } = {}

        tokenSymbols.forEach(symbol => {
          const tokenId = TOKEN_ID_MAP[symbol.toUpperCase()]
          if (tokenId && data[tokenId]) {
            priceMap[symbol] = {
              price: data[tokenId].usd,
              change24h: data[tokenId].usd_24h_change || 0
            }
          }
        })

        setPrices(priceMap)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Use mock data as fallback
        const mockPrices: { [key: string]: { price: number; change24h: number } } = {}
        tokenSymbols.forEach(symbol => {
          mockPrices[symbol] = {
            price: getMockPrice(symbol),
            change24h: Math.random() * 10 - 5
          }
        })
        setPrices(mockPrices)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()

    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000)

    return () => clearInterval(interval)
  }, [tokenSymbols.join(',')])

  return { prices, loading, error }
}

// Mock price data as fallback
const getMockPrice = (tokenSymbol: string): number => {
  const mockPrices: { [key: string]: number } = {
    'ETH': 2400,
    'BTC': 45000,
    'BNB': 320,
    'USDT': 1,
    'USDC': 1,
    'DAI': 1,
    'BUSD': 1,
    'LINK': 15,
    'UNI': 8,
    'MATIC': 0.85,
    'AVAX': 28,
    'DOT': 6.5,
    'ATOM': 9.2,
    'SOL': 95
  }

  return mockPrices[tokenSymbol.toUpperCase()] || 1
}
