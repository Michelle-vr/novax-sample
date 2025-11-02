import type React from 'react'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { useNotification } from './NotificationContext'

interface UserProfile {
  address: string
  username?: string
  email?: string
  avatar?: string
  bio?: string
  createdAt: number
  lastLogin: number
  preferences: {
    theme: 'dark' | 'light'
    language: 'en' | 'zh'
    notifications: boolean
    twoFactor: boolean
  }
  stats: {
    totalTrades: number
    totalVolume: number
    joinedPools: number
    stakedAmount: number
  }
}

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => void
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { success, error: showError } = useNotification()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Sign in with wallet
  const signIn = useCallback(async () => {
    if (!address) {
      showError('Wallet Not Connected', 'Please connect your wallet first')
      return
    }

    setIsLoading(true)

    try {
      // Create a message to sign for authentication
      const message = `Sign this message to authenticate with NovaX\n\nAddress: ${address}\nTimestamp: ${Date.now()}`

      // Request signature from wallet
      const signature = await signMessageAsync({ message })

      // In production, verify signature on backend
      // For now, simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Load or create user profile
      const existingProfile = localStorage.getItem(`profile_${address}`)

      let profile: UserProfile

      if (existingProfile) {
        profile = JSON.parse(existingProfile)
        profile.lastLogin = Date.now()
      } else {
        // Create new profile
        profile = {
          address,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          preferences: {
            theme: 'dark',
            language: 'en',
            notifications: true,
            twoFactor: false
          },
          stats: {
            totalTrades: 0,
            totalVolume: 0,
            joinedPools: 0,
            stakedAmount: 0
          }
        }
      }

      // Save profile
      localStorage.setItem(`profile_${address}`, JSON.stringify(profile))
      setUser(profile)

      success('Authentication Successful', `Welcome ${address.slice(0, 6)}...${address.slice(-4)}`)
    } catch (err) {
      showError('Authentication Failed', err instanceof Error ? err.message : 'Signature rejected')
    } finally {
      setIsLoading(false)
    }
  }, [address, signMessageAsync, success, showError])

  // Sign out
  const signOut = useCallback(() => {
    setUser(null)
    success('Signed Out', 'You have been signed out successfully')
  }, [success])

  // Update profile
  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user || !address) return

    setIsLoading(true)

    try {
      const updatedProfile = { ...user, ...data }

      // In production, save to backend
      localStorage.setItem(`profile_${address}`, JSON.stringify(updatedProfile))
      setUser(updatedProfile)

      success('Profile Updated', 'Your profile has been updated successfully')
    } catch (err) {
      showError('Update Failed', err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }, [user, address, success, showError])

  // Refresh profile from storage/backend
  const refreshProfile = useCallback(async () => {
    if (!address) return

    const savedProfile = localStorage.getItem(`profile_${address}`)
    if (savedProfile) {
      setUser(JSON.parse(savedProfile))
    }
  }, [address])

  // Auto-load profile when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      refreshProfile()
    } else {
      setUser(null)
    }
  }, [isConnected, address, refreshProfile])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
        updateProfile,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
