import { useState, useEffect, useRef, useCallback } from 'react'

interface PriceData {
  symbol: string
  price: number
  change24h: number
  volume: number
  timestamp: number
}

interface WebSocketMessage {
  type: 'price' | 'error' | 'connected'
  data?: PriceData
  message?: string
}

// Binance WebSocket for real-time prices
const WS_URL = 'wss://stream.binance.com:9443/ws'

export const useWebSocketPrice = (symbols: string[]) => {
  const [prices, setPrices] = useState<{ [key: string]: PriceData }>({})
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const convertSymbolToBinance = (symbol: string): string => {
    // Convert symbol to Binance format (e.g., ETH -> ethusdt)
    const symbolMap: { [key: string]: string } = {
      'ETH': 'ethusdt',
      'BTC': 'btcusdt',
      'BNB': 'bnbusdt',
      'LINK': 'linkusdt',
      'UNI': 'uniusdt',
      'MATIC': 'maticusdt',
      'SOL': 'solusdt',
      'AVAX': 'avaxusdt',
      'DOT': 'dotusdt',
      'ATOM': 'atomusdt'
    }
    return symbolMap[symbol.toUpperCase()] || symbol.toLowerCase() + 'usdt'
  }

  const connect = useCallback(() => {
    try {
      // Create streams for all symbols
      const streams = symbols.map(s => `${convertSymbolToBinance(s)}@ticker`).join('/')
      const wsUrl = `${WS_URL}/${streams}`

      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
        console.log('WebSocket connected')
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Binance ticker format
          if (data.e === '24hrTicker') {
            const symbol = data.s.replace('USDT', '').toUpperCase()

            setPrices(prev => ({
              ...prev,
              [symbol]: {
                symbol,
                price: Number.parseFloat(data.c), // Current price
                change24h: Number.parseFloat(data.P), // 24h price change percentage
                volume: Number.parseFloat(data.v), // 24h volume
                timestamp: Date.now()
              }
            }))
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      }

      wsRef.current.onerror = (event) => {
        console.error('WebSocket error:', event)
        setError('WebSocket connection error')
      }

      wsRef.current.onclose = () => {
        setIsConnected(false)

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * (2 ** reconnectAttempts.current), 30000)
          reconnectAttempts.current++

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`)
            connect()
          }, delay)
        } else {
          setError('Max reconnection attempts reached. Please refresh the page.')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to WebSocket')
    }
  }, [symbols])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setIsConnected(false)
  }, [])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [symbols.join(',')]) // Re-connect if symbols change

  return {
    prices,
    isConnected,
    error,
    reconnect: connect
  }
}

// Hook for single symbol
export const useWebSocketPriceSingle = (symbol: string) => {
  const { prices, isConnected, error, reconnect } = useWebSocketPrice([symbol])

  return {
    price: prices[symbol]?.price || null,
    change24h: prices[symbol]?.change24h || 0,
    volume: prices[symbol]?.volume || 0,
    isConnected,
    error,
    reconnect
  }
}

// Hook for streaming trade data
export const useWebSocketTrades = (symbol: string) => {
  const [trades, setTrades] = useState<Array<{
    price: number
    quantity: number
    time: number
    isBuyerMaker: boolean
  }>>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const binanceSymbol = symbol.toLowerCase() + 'usdt'
    const ws = new WebSocket(`${WS_URL}/${binanceSymbol}@trade`)

    ws.onopen = () => {
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        const newTrade = {
          price: Number.parseFloat(data.p),
          quantity: Number.parseFloat(data.q),
          time: data.T,
          isBuyerMaker: data.m
        }

        setTrades(prev => [newTrade, ...prev].slice(0, 50)) // Keep last 50 trades
      } catch (err) {
        console.error('Error parsing trade data:', err)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
    }

    wsRef.current = ws

    return () => {
      ws.close()
    }
  }, [symbol])

  return {
    trades,
    isConnected
  }
}
